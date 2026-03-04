
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, DEFAULT_USER_PROFILE } from '../types';
import { auth, saveUserProfile, loadUserProfile, onAuthChange } from '../services/firebase';

interface UserContextType {
    user: UserProfile;
    isLoggedIn: boolean;
    firebaseUid: string | null;
    updateProfile: (updates: Partial<UserProfile>) => void;
    login: (email: string, name?: string) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'nooratelier_user';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return DEFAULT_USER_PROFILE;
            }
        }
        return DEFAULT_USER_PROFILE;
    });

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.email && parsed.email !== '';
            }
            return false;
        } catch {
            return false;
        }
    });

    const [firebaseUid, setFirebaseUid] = useState<string | null>(null);

    // Listen for Firebase Auth state changes
    useEffect(() => {
        const unsubscribe = onAuthChange(async (firebaseUser) => {
            if (firebaseUser) {
                setFirebaseUid(firebaseUser.uid);
                // Try to load profile from Firestore
                const cloudProfile = await loadUserProfile(firebaseUser.uid);
                if (cloudProfile) {
                    setUser(cloudProfile);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudProfile));
                    setIsLoggedIn(true);
                }
            } else {
                setFirebaseUid(null);
            }
        });
        return () => unsubscribe();
    }, []);

    // Save to localStorage whenever user changes
    useEffect(() => {
        if (user.email) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        }
    }, [user]);

    const updateProfile = (updates: Partial<UserProfile>) => {
        setUser(prev => {
            const updated = { ...prev, ...updates };
            // Handle nested objects
            if (updates.measurements) {
                updated.measurements = { ...prev.measurements, ...updates.measurements };
            }
            if (updates.colorPreferences) {
                updated.colorPreferences = { ...prev.colorPreferences, ...updates.colorPreferences };
            }
            if (updates.repeatRules) {
                updated.repeatRules = { ...prev.repeatRules, ...updates.repeatRules };
            }

            // Save to Firestore
            if (firebaseUid) {
                saveUserProfile(firebaseUid, updated);
            }

            return updated;
        });
    };

    const login = (email: string, name?: string) => {
        const existingData = localStorage.getItem(STORAGE_KEY);
        if (existingData) {
            try {
                const parsed = JSON.parse(existingData);
                if (parsed.email === email) {
                    setUser(parsed);
                    setIsLoggedIn(true);
                    // Sync to Firestore if we have a uid
                    if (firebaseUid) {
                        saveUserProfile(firebaseUid, parsed);
                    }
                    return;
                }
            } catch { /* ignore */ }
        }

        // New user
        const newUser: UserProfile = {
            ...DEFAULT_USER_PROFILE,
            id: firebaseUid || `user_${Date.now()}`,
            email,
            name: name || email.split('@')[0],
            createdAt: new Date().toISOString(),
        };
        setUser(newUser);
        setIsLoggedIn(true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));

        // Save to Firestore
        if (firebaseUid) {
            saveUserProfile(firebaseUid, newUser);
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        setFirebaseUid(null);
    };

    return (
        <UserContext.Provider value={{ user, isLoggedIn, firebaseUid, updateProfile, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
