
import React, { useState, useRef } from 'react';
import { WardrobeItem } from '../types';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (item: Omit<WardrobeItem, 'id'>) => void;
}

const CATEGORIES: WardrobeItem['category'][] = ['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Jewelry', 'Bags', 'Outerwear'];
const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter', 'All Season'];
const OCCASIONS = ['Work', 'Casual', 'Formal', 'Date Night', 'Brunch', 'Party', 'Sports', 'Any'];

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Tops' as WardrobeItem['category'],
        imageUrl: '',
        color: '#e74078',
        season: [] as string[],
        occasion: [] as string[],
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
    const [isCompressing, setIsCompressing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const toggleArrayItem = (arr: string[], item: string) => {
        if (arr.includes(item)) {
            return arr.filter(i => i !== item);
        }
        return [...arr, item];
    };

    // Compress image to reduce size for localStorage storage
    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_SIZE = 800; // Max width/height
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height = Math.round((height * MAX_SIZE) / width);
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width = Math.round((width * MAX_SIZE) / height);
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) { reject('Canvas error'); return; }
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to JPEG at 70% quality for smaller size
                    const compressed = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressed);
                };
                img.onerror = () => reject('Failed to load image');
                img.src = reader.result as string;
            };
            reader.onerror = () => reject('Failed to read file');
            reader.readAsDataURL(file);
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setErrors(['Image must be under 10MB']);
                return;
            }
            setIsCompressing(true);
            setErrors([]);
            try {
                const compressed = await compressImage(file);
                setFormData(prev => ({ ...prev, imageUrl: compressed }));
            } catch (err) {
                setErrors(['Failed to process image. Please try another photo.']);
            } finally {
                setIsCompressing(false);
            }
        }
    };

    const handleSubmit = () => {
        const newErrors: string[] = [];
        if (!formData.name.trim()) newErrors.push('Name is required');
        if (formData.season.length === 0) newErrors.push('Select at least one season');
        if (formData.occasion.length === 0) newErrors.push('Select at least one occasion');

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        onAdd(formData);
        setFormData({
            name: '',
            category: 'Tops',
            imageUrl: '',
            color: '#e74078',
            season: [],
            occasion: [],
        });
        setErrors([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white dark:bg-background-dark rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-background-dark z-10 px-8 pt-8 pb-4 border-b border-soft-pink dark:border-white/10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-deep-text dark:text-white">Add New Item</h2>
                        <button
                            onClick={onClose}
                            className="size-10 rounded-full bg-soft-pink dark:bg-white/10 flex items-center justify-center hover:bg-soft-pink/80 transition-all"
                        >
                            <span className="material-symbols-outlined text-muted-text dark:text-white/60">close</span>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="p-8 space-y-6">
                    {errors.length > 0 && (
                        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4">
                            {errors.map((error, i) => (
                                <p key={i} className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                            ))}
                        </div>
                    )}

                    {/* Image Upload/URL Toggle */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-muted-text dark:text-white/40 uppercase tracking-widest">Item Photo</label>
                            <div className="flex bg-soft-pink/30 dark:bg-white/5 rounded-full p-1">
                                <button
                                    type="button"
                                    onClick={() => setImageMode('upload')}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${imageMode === 'upload' ? 'bg-primary text-white' : 'text-muted-text dark:text-white/40'}`}
                                >
                                    Upload Photo
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageMode('url')}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${imageMode === 'url' ? 'bg-primary text-white' : 'text-muted-text dark:text-white/40'}`}
                                >
                                    Paste URL
                                </button>
                            </div>
                        </div>

                        {imageMode === 'upload' ? (
                            <div className="flex flex-col items-center gap-4">
                                {isCompressing ? (
                                    <div className="w-full h-40 border-2 border-dashed border-primary rounded-2xl flex flex-col items-center justify-center gap-3 bg-primary/5">
                                        <div className="size-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                        <p className="text-sm font-bold text-primary">Processing photo...</p>
                                    </div>
                                ) : formData.imageUrl && formData.imageUrl.startsWith('data:') ? (
                                    <div className="relative w-40 h-48 rounded-2xl overflow-hidden bg-soft-pink/20 group">
                                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, imageUrl: '' }));
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                                if (cameraInputRef.current) cameraInputRef.current.value = '';
                                            }}
                                            className="absolute top-2 right-2 size-8 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <span className="material-symbols-outlined text-white text-sm">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full grid grid-cols-2 gap-3">
                                        {/* Take Photo Button */}
                                        <button
                                            type="button"
                                            onClick={() => cameraInputRef.current?.click()}
                                            className="h-36 border-2 border-dashed border-soft-pink dark:border-white/20 hover:border-primary rounded-2xl flex flex-col items-center justify-center gap-3 transition-all bg-soft-pink/10 dark:bg-white/5 group cursor-pointer"
                                        >
                                            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-primary text-xl">photo_camera</span>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-bold text-deep-text dark:text-white">Take Photo</p>
                                                <p className="text-[9px] text-muted-text dark:text-white/40">Open camera</p>
                                            </div>
                                        </button>
                                        {/* Upload from Gallery Button */}
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="h-36 border-2 border-dashed border-soft-pink dark:border-white/20 hover:border-primary rounded-2xl flex flex-col items-center justify-center gap-3 transition-all bg-soft-pink/10 dark:bg-white/5 group cursor-pointer"
                                        >
                                            <div className="size-12 rounded-full bg-soft-pink dark:bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-primary text-xl">photo_library</span>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-bold text-deep-text dark:text-white">From Gallery</p>
                                                <p className="text-[9px] text-muted-text dark:text-white/40">Choose photo</p>
                                            </div>
                                        </button>
                                    </div>
                                )}
                                {/* Hidden file input for gallery */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                {/* Hidden file input for camera */}
                                <input
                                    ref={cameraInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <input
                                    className="w-full bg-soft-pink/30 dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-2xl px-4 py-3 text-deep-text dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                    value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                    placeholder="https://example.com/item-image.jpg"
                                />
                                {formData.imageUrl && !formData.imageUrl.startsWith('data:') && (
                                    <div className="mt-3 aspect-square w-32 rounded-2xl overflow-hidden bg-soft-pink/20">
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Invalid+URL'}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Name & Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-text dark:text-white/40 uppercase tracking-widest">Item Name</label>
                            <input
                                className="w-full bg-soft-pink/30 dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-2xl px-4 py-3 text-deep-text dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g., Silk Blouse"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-text dark:text-white/40 uppercase tracking-widest">Category</label>
                            <select
                                className="w-full bg-soft-pink/30 dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-2xl px-4 py-3 text-deep-text dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as WardrobeItem['category'] }))}
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Color */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-text dark:text-white/40 uppercase tracking-widest">Primary Color</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                className="size-12 rounded-xl cursor-pointer border-2 border-soft-pink"
                                value={formData.color}
                                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                            />
                            <span className="text-muted-text dark:text-white/60 font-mono text-sm">{formData.color}</span>
                        </div>
                    </div>

                    {/* Seasons */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-text dark:text-white/40 uppercase tracking-widest">Seasons</label>
                        <div className="flex flex-wrap gap-2">
                            {SEASONS.map(season => (
                                <button
                                    key={season}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, season: toggleArrayItem(prev.season, season) }))}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${formData.season.includes(season)
                                        ? 'bg-primary text-white'
                                        : 'bg-soft-pink/30 dark:bg-white/5 text-muted-text dark:text-white/60 hover:bg-soft-pink'
                                        }`}
                                >
                                    {season}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Occasions */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-text dark:text-white/40 uppercase tracking-widest">Occasions</label>
                        <div className="flex flex-wrap gap-2">
                            {OCCASIONS.map(occasion => (
                                <button
                                    key={occasion}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, occasion: toggleArrayItem(prev.occasion, occasion) }))}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${formData.occasion.includes(occasion)
                                        ? 'bg-primary text-white'
                                        : 'bg-soft-pink/30 dark:bg-white/5 text-muted-text dark:text-white/60 hover:bg-soft-pink'
                                        }`}
                                >
                                    {occasion}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white dark:bg-background-dark border-t border-soft-pink dark:border-white/10 px-8 py-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-full text-sm font-bold text-muted-text hover:bg-soft-pink transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-primary text-white rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-base">add</span>
                        Add to Wardrobe
                    </button>
                </div>
            </div>
        </div >
    );
};

export default AddItemModal;
