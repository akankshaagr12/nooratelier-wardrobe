
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import { useWardrobe } from '../contexts/WardrobeContext';
import { getAIStyleAdvice } from '../services/geminiService';

// ── IndexedDB helpers for large photo storage ─────────────────────────────────
const DB_NAME = 'nooratelier_db';
const DB_STORE = 'photos';
const PHOTO_KEY = 'tryon_photo';

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(DB_STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function savePhotoToDB(dataUrl: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(DB_STORE, 'readwrite');
        const store = tx.objectStore(DB_STORE);
        const req = store.put(dataUrl, PHOTO_KEY);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

async function loadPhotoFromDB(): Promise<string> {
    try {
        const db = await openDB();
        return new Promise((resolve) => {
            const tx = db.transaction(DB_STORE, 'readonly');
            const req = tx.objectStore(DB_STORE).get(PHOTO_KEY);
            req.onsuccess = () => resolve((req.result as string) || '');
            req.onerror = () => resolve('');
        });
    } catch { return ''; }
}
// ─────────────────────────────────────────────────────────────────────────────

const VirtualTryOn: React.FC = () => {
    const { user } = useUser();
    const { items } = useWardrobe();
    const [userPhoto, setUserPhoto] = useState<string>('');

    // Load persisted photo from IndexedDB on mount
    useEffect(() => {
        loadPhotoFromDB().then(photo => { if (photo) setUserPhoto(photo); });
    }, []);

    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [stylingDescription, setStylingDescription] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const dataUrl = reader.result as string;
                setUserPhoto(dataUrl);
                setStylingDescription('');
                setSelectedItems([]);
                await savePhotoToDB(dataUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleItemSelection = (itemId: string) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    // Auto-generate text description when photo + selected items change
    const generateTextPreview = useCallback(async (photoPresent: boolean, selIds: string[]) => {
        if (!photoPresent || selIds.length === 0) {
            setStylingDescription('');
            return;
        }
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setIsGenerating(true);
            setError('');
            try {
                const selectedClothes = items.filter(item => selIds.includes(item.id));
                const clothingList = selectedClothes.map(i => `${i.name} (${i.category})`).join(', ');
                const bodyType = user.measurements?.bodyShape || 'balanced';

                const advice = await getAIStyleAdvice(
                    `How would these clothes look on me? Be specific about the fit, style, and overall vibe: ${clothingList}`,
                    `Body type: ${bodyType}`,
                    clothingList
                );
                setStylingDescription(advice);
            } catch {
                setStylingDescription("✨ This combination looks stunning! The selected pieces work beautifully together.");
            } finally {
                setIsGenerating(false);
            }
        }, 800);
    }, [items, user]);

    useEffect(() => {
        generateTextPreview(!!userPhoto, selectedItems);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [selectedItems, userPhoto, generateTextPreview]);

    return (
        <div className="p-8 max-w-7xl mx-auto w-full pb-20">
            <div className="mb-10">
                <h2 className="text-4xl font-black tracking-tight text-deep-text dark:text-white mb-2">Virtual Try-On</h2>
                <p className="text-muted-text dark:text-white/50 font-medium">Upload your photo, select outfits, and get instant AI styling notes</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Panel - Photo Upload & Item Selection */}
                <div className="space-y-8">
                    {/* Photo Upload */}
                    <div className="bg-white dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-lg font-bold text-deep-text dark:text-white mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">photo_camera</span>
                            Your Photo
                        </h3>

                        <div className="flex flex-col items-center gap-6">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative w-48 h-64 rounded-2xl overflow-hidden bg-soft-pink/30 dark:bg-white/10 border-2 border-dashed border-soft-pink dark:border-white/20 hover:border-primary cursor-pointer transition-all group"
                            >
                                {userPhoto ? (
                                    <>
                                        <img src={userPhoto} alt="Your photo" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white text-3xl">edit</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-text dark:text-white/40">
                                        <span className="material-symbols-outlined text-4xl mb-2">add_a_photo</span>
                                        <span className="text-sm font-bold">Upload Photo</span>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                            />
                            {userPhoto ? (
                                <p className="text-xs font-semibold text-primary text-center flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    Photo uploaded! Now select outfits below ↓
                                </p>
                            ) : (
                                <p className="text-xs text-muted-text dark:text-white/40 text-center">
                                    Upload a full-body photo for best results
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Clothing Selection */}
                    <div className="bg-white dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-[2rem] p-8">
                        <h3 className="text-lg font-bold text-deep-text dark:text-white mb-2 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">checkroom</span>
                            Select Clothes ({selectedItems.length} selected)
                        </h3>
                        {userPhoto && (
                            <p className="text-xs text-primary/80 font-medium mb-5 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                Tap any outfit to get an instant AI style preview
                            </p>
                        )}
                        {!userPhoto && (
                            <p className="text-xs text-muted-text dark:text-white/40 mb-5">
                                Upload your photo first to get styling previews
                            </p>
                        )}

                        {items.length === 0 ? (
                            <div className="text-center py-8 text-muted-text dark:text-white/30">
                                <span className="material-symbols-outlined text-4xl mb-2 block">checkroom</span>
                                <p className="text-sm font-medium">No items in your wardrobe yet.</p>
                                <p className="text-xs mt-1">Add clothes in the Wardrobe section first.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto custom-scrollbar">
                                {items.map(item => {
                                    const isSelected = selectedItems.includes(item.id);
                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => toggleItemSelection(item.id)}
                                            className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all ${isSelected
                                                ? 'ring-4 ring-primary scale-95'
                                                : userPhoto ? 'hover:scale-105 hover:ring-2 hover:ring-primary/40' : 'hover:scale-105 opacity-60'
                                                }`}
                                        >
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const el = e.target as HTMLImageElement;
                                                        el.style.display = 'none';
                                                        el.parentElement?.querySelector('.tryon-fallback')?.classList.remove('hidden');
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`tryon-fallback absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-soft-pink/40 dark:from-primary/10 dark:to-white/5 ${item.imageUrl ? 'hidden' : ''}`}>
                                                <span className="material-symbols-outlined text-2xl text-primary/40 mb-1">checkroom</span>
                                                <p className="text-[9px] font-bold text-deep-text/50 dark:text-white/30 text-center px-1 line-clamp-2">{item.name}</p>
                                            </div>

                                            {/* "Try On" hint badge when photo is uploaded but item not selected */}
                                            {userPhoto && !isSelected && (
                                                <div className="absolute top-1.5 right-1.5">
                                                    <span className="bg-primary/90 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">✨</span>
                                                </div>
                                            )}

                                            {isSelected && (
                                                <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-white text-2xl">check_circle</span>
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                                <p className="text-white text-[10px] font-bold truncate">{item.name}</p>
                                                {userPhoto && !isSelected && (
                                                    <p className="text-white/70 text-[8px]">Tap to preview</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm font-medium">
                            {error}
                        </div>
                    )}
                </div>

                {/* Right Panel - Preview */}
                <div className="bg-white dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-[2rem] p-8 min-h-[600px] flex flex-col">
                    <h3 className="text-lg font-bold text-deep-text dark:text-white mb-6 flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">auto_awesome</span>
                        Style Preview
                    </h3>

                    <div className="flex-1 flex flex-col gap-6">
                        {/* User photo always visible once uploaded */}
                        {userPhoto ? (
                            <>
                                <div className="w-full max-w-xs mx-auto">
                                    <div className="w-full rounded-2xl overflow-hidden bg-soft-pink/20 dark:bg-white/10 shadow-lg relative">
                                        <img src={userPhoto} alt="Your photo" className="w-full h-auto object-contain max-h-72" />
                                        {selectedItems.length > 0 && (
                                            <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">checkroom</span>
                                                {selectedItems.length} outfit{selectedItems.length > 1 ? 's' : ''} selected
                                            </div>
                                        )}
                                    </div>
                                    {/* Selected items tags */}
                                    {selectedItems.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2 justify-center">
                                            {items.filter(i => selectedItems.includes(i.id)).map(item => (
                                                <span key={item.id} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider rounded-full">
                                                    {item.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* AI Styling Notes — shown after items selected */}
                                {selectedItems.length === 0 && (
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="text-center text-muted-text dark:text-white/40">
                                            <span className="material-symbols-outlined text-4xl mb-3 block">touch_app</span>
                                            <p className="text-sm font-semibold">Select outfits from the left</p>
                                            <p className="text-xs mt-1">Tap any ✨ item to get an instant AI style preview</p>
                                        </div>
                                    </div>
                                )}

                                {selectedItems.length > 0 && (
                                    <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
                                            <p className="text-xs font-black text-primary uppercase tracking-widest">Noor's Styling Preview</p>
                                            {isGenerating && (
                                                <div className="ml-auto size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                            )}
                                        </div>
                                        {isGenerating ? (
                                            <div className="space-y-2">
                                                <div className="h-3 bg-primary/10 rounded-full w-full animate-pulse" />
                                                <div className="h-3 bg-primary/10 rounded-full w-4/5 animate-pulse" />
                                                <div className="h-3 bg-primary/10 rounded-full w-3/5 animate-pulse" />
                                            </div>
                                        ) : (
                                            <p className="text-sm text-deep-text dark:text-white/80 leading-relaxed whitespace-pre-wrap">
                                                {stylingDescription}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            /* No photo yet */
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center text-muted-text dark:text-white/40">
                                    <div className="size-32 mx-auto rounded-full bg-soft-pink/30 dark:bg-white/10 flex items-center justify-center mb-6">
                                        <span className="material-symbols-outlined text-5xl">add_a_photo</span>
                                    </div>
                                    <h4 className="text-xl font-bold mb-2">Upload Your Photo</h4>
                                    <p className="text-sm max-w-xs mx-auto">
                                        Upload your photo on the left, then tap any outfit to instantly see Noor's styling preview!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VirtualTryOn;
