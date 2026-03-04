
import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useWardrobe } from '../contexts/WardrobeContext';

const Profile: React.FC = () => {
    const { user, updateProfile } = useUser();
    const { items } = useWardrobe();
    const [isEditing, setIsEditing] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        location: user.location,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
    });

    const handleSave = () => {
        updateProfile(formData);
        setIsEditing(false);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 3000);
    };

    const handleCancel = () => {
        setFormData({
            name: user.name,
            email: user.email,
            location: user.location,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
        });
        setIsEditing(false);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto w-full space-y-10 pb-20 animate-in fade-in duration-500">
            {/* Success Toast */}
            {showSaved && (
                <div className="fixed top-24 right-8 z-50 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right duration-300">
                    <span className="material-symbols-outlined">check_circle</span>
                    <span className="font-bold text-sm">Profile saved successfully!</span>
                </div>
            )}

            {/* Profile Header */}
            <div className="relative">
                <div className="h-48 rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/80 to-primary/60 overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1920')] bg-cover bg-center opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white/10 text-[12rem]">auto_awesome</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 px-8">
                    <div className="relative group">
                        <div
                            className="size-32 rounded-full bg-cover bg-center border-4 border-white shadow-2xl"
                            style={{ backgroundImage: `url('${user.avatarUrl}')` }}
                        ></div>
                        {isEditing && (
                            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left pb-2">
                        <h1 className="text-3xl font-black text-deep-text dark:text-white">{user.name || 'Your Name'}</h1>
                        <p className="text-muted-text dark:text-white/50 font-medium">{user.email}</p>
                    </div>

                    <div className="flex gap-3 pb-2">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-8 py-3 bg-deep-text dark:bg-primary text-white rounded-full font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-lg"
                            >
                                <span className="material-symbols-outlined text-base">edit</span>
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-3 bg-white border border-soft-pink text-muted-text rounded-full font-bold text-sm hover:bg-soft-pink/30 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-8 py-3 bg-primary text-white rounded-full font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-lg"
                                >
                                    <span className="material-symbols-outlined text-base">save</span>
                                    Save Changes
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Wardrobe Items', value: items.length, icon: 'checkroom', color: 'text-primary' },
                    { label: 'Outfits Created', value: 12, icon: 'dry_cleaning', color: 'text-blue-500' },
                    { label: 'Style Score', value: '94%', icon: 'insights', color: 'text-emerald-500' },
                    { label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), icon: 'calendar_month', color: 'text-amber-500' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-2xl p-5 text-center">
                        <span className={`material-symbols-outlined text-2xl ${stat.color} mb-2`}>{stat.icon}</span>
                        <p className="text-2xl font-black text-deep-text dark:text-white">{stat.value}</p>
                        <p className="text-[10px] font-bold text-muted-text dark:text-white/40 uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Profile Details */}
            <div className="bg-white dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-[2rem] p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-soft-pink dark:border-white/10 pb-4">
                    <span className="material-symbols-outlined text-primary">person</span>
                    <h3 className="text-lg font-bold text-deep-text dark:text-white">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-text dark:text-white/40 uppercase tracking-widest">Full Name</label>
                        {isEditing ? (
                            <input
                                className="w-full bg-soft-pink/30 dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-2xl px-4 py-3 text-deep-text dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter your name"
                            />
                        ) : (
                            <p className="text-deep-text dark:text-white font-medium py-3">{user.name || 'Not set'}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-text dark:text-white/40 uppercase tracking-widest">Email</label>
                        <p className="text-deep-text dark:text-white font-medium py-3">{user.email}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-text dark:text-white/40 uppercase tracking-widest">Location</label>
                        {isEditing ? (
                            <input
                                className="w-full bg-soft-pink/30 dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-2xl px-4 py-3 text-deep-text dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={formData.location}
                                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="e.g., Milan, Italy"
                            />
                        ) : (
                            <p className="text-deep-text dark:text-white font-medium py-3">{user.location || 'Not set'}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-text dark:text-white/40 uppercase tracking-widest">Membership Tier</label>
                        <div className="flex items-center gap-2 py-3">
                            <span className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs font-black uppercase tracking-wider">{user.tier}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-text dark:text-white/40 uppercase tracking-widest">Bio</label>
                    {isEditing ? (
                        <textarea
                            className="w-full bg-soft-pink/30 dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-2xl px-4 py-3 text-deep-text dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none h-24"
                            value={formData.bio}
                            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell us about your style..."
                        />
                    ) : (
                        <p className="text-deep-text dark:text-white font-medium py-3">{user.bio || 'No bio yet. Click Edit Profile to add one!'}</p>
                    )}
                </div>

                {isEditing && (
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-text dark:text-white/40 uppercase tracking-widest">Profile Photo URL</label>
                        <input
                            className="w-full bg-soft-pink/30 dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-2xl px-4 py-3 text-deep-text dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={formData.avatarUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                            placeholder="https://example.com/your-photo.jpg"
                        />
                    </div>
                )}
            </div>

            {/* Style Summary */}
            <div className="bg-white dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-[2rem] p-8">
                <div className="flex items-center justify-between border-b border-soft-pink dark:border-white/10 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">palette</span>
                        <h3 className="text-lg font-bold text-deep-text dark:text-white">Style Profile Summary</h3>
                    </div>
                    <a href="#" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                        Edit in Settings <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-muted-text dark:text-white/40 uppercase tracking-widest">Body Measurements</p>
                        <p className="text-deep-text dark:text-white font-medium">
                            {user.measurements.height}cm • {user.measurements.weight}kg • {user.measurements.bodyShape}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-muted-text dark:text-white/40 uppercase tracking-widest">Skin Tone</p>
                        <div className="flex items-center gap-2">
                            <div className="size-6 rounded-full border border-soft-pink" style={{ backgroundColor: user.colorPreferences.skinTone }}></div>
                            <span className="text-deep-text dark:text-white font-medium">Warm Fair</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-muted-text dark:text-white/40 uppercase tracking-widest">Avoid Colors</p>
                        <p className="text-deep-text dark:text-white font-medium">
                            {user.colorPreferences.avoidColors.length > 0 ? user.colorPreferences.avoidColors.join(', ') : 'None set'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
