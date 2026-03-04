
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useWardrobe } from '../contexts/WardrobeContext';
import { getOutfitRecommendation } from '../services/geminiService';
import { View } from '../App';

interface DashboardProps {
  onNavigate?: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useUser();
  const { items } = useWardrobe();
  const [aiRecommendation, setAiRecommendation] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Rotating hero images for "Today's Look"
  const heroImages = [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1920&auto=format&fit=crop',
  ];
  const [heroImageIndex, setHeroImageIndex] = useState(() => Math.floor(Math.random() * heroImages.length));

  const firstName = user.name ? user.name.split(' ')[0] : 'Fashionista';

  useEffect(() => {
    loadAIRecommendation();
  }, []);

  const loadAIRecommendation = async () => {
    setIsLoadingAI(true);
    // Rotate hero image each time
    setHeroImageIndex(prev => (prev + 1) % heroImages.length);
    const wardrobeList = items.slice(0, 8).map(i => i.name).join(', ');
    const userProfile = `${user.measurements.bodyShape} frame, prefers avoiding ${user.colorPreferences.avoidColors.join(', ') || 'no specific colors'}`;
    const recommendation = await getOutfitRecommendation('Evening Event', 'Clear skies, 22°C', userProfile, wardrobeList);
    setAiRecommendation(recommendation);
    setIsLoadingAI(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-12 pb-24 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-deep-text dark:text-white mb-2">
            Welcome, {firstName}! ✨
          </h2>
          <p className="text-muted-text dark:text-white/40 font-bold text-lg uppercase tracking-tight">
            Your AI Style Dashboard • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-5 bg-white dark:bg-white/5 p-4 rounded-[2rem] border border-soft-pink dark:border-white/10 shadow-sm">
          <div className="size-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">sunny</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-muted-text dark:text-white/30 tracking-widest mb-0.5">Weather Sync</p>
            <p className="text-base font-black text-deep-text dark:text-white">22°C Clear Skies</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* AI Recommendation Card */}
        <div className="lg:col-span-8 relative group rounded-[3rem] overflow-hidden shadow-2xl bg-white dark:bg-black border border-soft-pink dark:border-white/5">
          <img
            src={heroImages[heroImageIndex]}
            alt="Hero Recommendation"
            className="w-full h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-text dark:from-black via-deep-text/20 dark:via-black/20 to-transparent p-12 flex flex-col justify-end">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-primary px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg">AI Styled</span>
              <span className="bg-white/20 dark:bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">For You</span>
            </div>
            <h3 className="text-5xl font-black text-white mb-4 leading-none tracking-tighter">Today's Look</h3>
            <p className="text-white/80 text-lg max-w-xl font-medium mb-6 leading-relaxed">
              {isLoadingAI ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Generating your personalized recommendation...
                </span>
              ) : (
                aiRecommendation || 'Click below to get your AI-powered outfit suggestion!'
              )}
            </p>
            <div className="flex gap-4">
              <button
                onClick={loadAIRecommendation}
                className="bg-white text-deep-text px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95"
              >
                {isLoadingAI ? 'Thinking...' : 'Get New Suggestion'}
              </button>
              <button
                onClick={() => onNavigate?.('wardrobe')}
                className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95"
              >
                View Wardrobe
              </button>
            </div>
          </div>
        </div>

        {/* Intelligence Widgets */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-primary dark:bg-primary/90 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-primary/30 relative overflow-hidden group transition-all hover:scale-[1.02]">
            <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-white/10 text-[10rem] group-hover:rotate-12 transition-transform duration-700">insights</span>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-3 opacity-70">Wardrobe Stats</p>
            <h4 className="text-3xl font-black mb-4 leading-none">{items.length} Items Cataloged</h4>
            <p className="text-base font-medium text-white/80 mb-8 leading-relaxed">
              Your digital closet is growing! Add more items to get better AI recommendations.
            </p>
            <button
              onClick={() => onNavigate?.('wardrobe')}
              className="w-full bg-white text-primary py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-inner transition-all"
            >
              Wardrobe Insights
            </button>
          </div>

          <div className="bg-white dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-[11px] font-black text-muted-text dark:text-white/30 uppercase tracking-[0.2em]">Quick Actions</h5>
              <span className="material-symbols-outlined text-primary/40">more_horiz</span>
            </div>
            {[
              { label: 'Add New Item', detail: 'Upload to your wardrobe', icon: 'add_circle', color: 'text-primary', view: 'wardrobe' as View },
              { label: 'My Profile', detail: 'Update your style preferences', icon: 'person', color: 'text-blue-500', view: 'profile' as View },
              { label: 'AI Assistant', detail: 'Get fashion advice', icon: 'auto_awesome', color: 'text-emerald-500', view: 'settings' as View }
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate?.(item.view)}
                className="flex items-center gap-5 p-4 hover:bg-soft-pink/30 dark:hover:bg-white/5 rounded-[1.5rem] transition-all cursor-pointer group active:scale-95"
              >
                <div className="size-12 rounded-2xl bg-soft-pink dark:bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <span className={`material-symbols-outlined text-2xl ${item.color}`}>{item.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-black text-deep-text dark:text-white">{item.label}</p>
                  <p className="text-[11px] text-muted-text dark:text-white/40 font-bold uppercase tracking-tight">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
