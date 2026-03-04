
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WardrobeItem } from '../types';
import { useUser } from './UserContext';
import { saveWardrobeItem, loadWardrobeItems, removeWardrobeItem as removeWardrobeItemFromDB, saveAllWardrobeItems } from '../services/firebase';

interface WardrobeContextType {
    items: WardrobeItem[];
    isLoading: boolean;
    addItem: (item: Omit<WardrobeItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateItem: (id: string, updates: Partial<WardrobeItem>) => void;
    getItemsByCategory: (category: string) => WardrobeItem[];
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

const STORAGE_KEY = 'nooratelier_wardrobe';
const VERSION_KEY = 'nooratelier_wardrobe_version';
const CURRENT_VERSION = '2'; // Bump this when starter items change

// Sample starter items
const STARTER_ITEMS: WardrobeItem[] = [
    {
        id: 'item_1',
        name: 'Silk Blouse',
        category: 'Tops',
        imageUrl: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=400&auto=format&fit=crop',
        color: '#f3e8eb',
        season: ['Spring', 'Summer'],
        occasion: ['Work', 'Casual'],
    },
    {
        id: 'item_2',
        name: 'Floral Midi Dress',
        category: 'Dresses',
        imageUrl: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=400&auto=format&fit=crop',
        color: '#e74078',
        season: ['Spring', 'Summer'],
        occasion: ['Date Night', 'Brunch'],
    },
    {
        id: 'item_3',
        name: 'Leather Loafers',
        category: 'Shoes',
        imageUrl: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=400&auto=format&fit=crop',
        color: '#4a2b15',
        season: ['Fall', 'Winter', 'Spring'],
        occasion: ['Work', 'Smart Casual'],
    },
    {
        id: 'item_4',
        name: 'Cashmere Sweater',
        category: 'Tops',
        imageUrl: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=400&auto=format&fit=crop',
        color: '#eec8a3',
        season: ['Fall', 'Winter'],
        occasion: ['Casual', 'Work'],
    },
    {
        id: 'item_5',
        name: 'Tailored Trousers',
        category: 'Bottoms',
        imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=400&auto=format&fit=crop',
        color: '#1b0e12',
        season: ['All Season'],
        occasion: ['Work', 'Formal'],
    },
    {
        id: 'item_6',
        name: 'Gold Pendant Necklace',
        category: 'Jewelry',
        imageUrl: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6e5?q=80&w=400&auto=format&fit=crop',
        color: '#d4af37',
        season: ['All Season'],
        occasion: ['Any'],
    },
];

export const WardrobeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { firebaseUid } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    // Ref so the async Firestore effect always reads the latest items (avoids stale closure)
    const itemsRef = React.useRef<WardrobeItem[]>([]);

    const [items, setItems] = useState<WardrobeItem[]>(() => {
        const storedVersion = localStorage.getItem(VERSION_KEY);

        // If version doesn't match, refresh starter items
        if (storedVersion !== CURRENT_VERSION) {
            localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    const oldItems = JSON.parse(saved) as WardrobeItem[];
                    // Keep user-added items (not starter items), replace starter items with fresh ones
                    const starterIds = STARTER_ITEMS.map(s => s.id);
                    const userItems = oldItems.filter(item => !starterIds.includes(item.id));
                    const freshItems = [...STARTER_ITEMS, ...userItems];
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(freshItems));
                    return freshItems;
                } catch {
                    return STARTER_ITEMS;
                }
            }
            return STARTER_ITEMS;
        }

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return STARTER_ITEMS;
            }
        }
        return STARTER_ITEMS;
    });

    // Keep ref in sync with latest items
    useEffect(() => { itemsRef.current = items; }, [items]);

    // Load wardrobe from Firestore when user logs in
    useEffect(() => {
        if (firebaseUid) {
            setIsLoading(true);
            loadWardrobeItems(firebaseUid).then(cloudItems => {
                if (cloudItems.length > 0) {
                    setItems(cloudItems);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudItems));
                } else {
                    // First time user — seed Firestore from local items.
                    // Use ref to avoid stale closure; never overwrite local with empty.
                    const current = itemsRef.current;
                    if (current.length > 0) {
                        saveAllWardrobeItems(firebaseUid, current);
                    }
                }
                setIsLoading(false);
            }).catch(() => setIsLoading(false));
        }
    }, [firebaseUid]);

    // Save to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = (item: Omit<WardrobeItem, 'id'>) => {
        const newItem: WardrobeItem = {
            ...item,
            id: `item_${Date.now()}`,
        };
        setItems(prev => [...prev, newItem]);

        // Save to Firestore
        if (firebaseUid) {
            saveWardrobeItem(firebaseUid, newItem);
        }
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));

        // Remove from Firestore
        if (firebaseUid) {
            removeWardrobeItemFromDB(firebaseUid, id);
        }
    };

    const updateItem = (id: string, updates: Partial<WardrobeItem>) => {
        setItems(prev => {
            const updated = prev.map(item =>
                item.id === id ? { ...item, ...updates } : item
            );
            // Save updated item to Firestore
            const updatedItem = updated.find(item => item.id === id);
            if (firebaseUid && updatedItem) {
                saveWardrobeItem(firebaseUid, updatedItem);
            }
            return updated;
        });
    };

    const getItemsByCategory = (category: string) => {
        if (category === 'All Items') return items;
        return items.filter(item => item.category === category);
    };

    return (
        <WardrobeContext.Provider value={{ items, isLoading, addItem, removeItem, updateItem, getItemsByCategory }}>
            {children}
        </WardrobeContext.Provider>
    );
};

export const useWardrobe = () => {
    const context = useContext(WardrobeContext);
    if (!context) {
        throw new Error('useWardrobe must be used within a WardrobeProvider');
    }
    return context;
};
