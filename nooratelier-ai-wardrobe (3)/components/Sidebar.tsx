
import React, { useState } from 'react';
import { View, Theme } from '../App';

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, theme, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'tryon', label: 'Virtual Try-On', icon: 'person_celebrate' },
    { id: 'wardrobe', label: 'Wardrobe', icon: 'checkroom' },
    { id: 'planner', label: 'Weekly Stylist', icon: 'calendar_view_week' },
    { id: 'social', label: 'Social Feed', icon: 'groups' },
    { id: 'profile', label: 'My Profile', icon: 'person' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  // Bottom nav items for mobile (show top 5)
  const mobileNavItems = [
    { id: 'dashboard', label: 'Home', icon: 'grid_view' },
    { id: 'wardrobe', label: 'Wardrobe', icon: 'checkroom' },
    { id: 'tryon', label: 'Try On', icon: 'person_celebrate' },
    { id: 'planner', label: 'Planner', icon: 'calendar_view_week' },
  ];

  return (
    <>
      {/* Desktop Sidebar - hidden on mobile */}
      <aside className="hidden md:flex w-64 border-r border-soft-pink dark:border-white/5 flex-col justify-between p-6 bg-white dark:bg-background-dark shrink-0 transition-colors duration-300">
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-primary size-10 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-deep-text dark:text-white text-lg font-black leading-tight uppercase tracking-tight">NoorAtelier</h1>
              <p className="text-muted-text dark:text-white/30 text-[9px] font-black uppercase tracking-widest">AI Fashion Engine</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as View)}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all ${activeView === item.id
                  ? 'bg-deep-text dark:bg-white text-white dark:text-deep-text shadow-xl'
                  : 'hover:bg-soft-pink dark:hover:bg-white/5 text-deep-text/70 dark:text-white/50'
                  }`}
              >
                <span className={`material-symbols-outlined text-xl ${activeView === item.id ? 'text-primary' : 'text-muted-text dark:text-white/30'}`}>
                  {item.icon}
                </span>
                <span className={`text-sm ${activeView === item.id ? 'font-black' : 'font-bold'}`}>
                  {item.label}
                </span>
                {item.id === 'tryon' && (
                  <span className="ml-auto px-2 py-0.5 bg-primary/20 text-primary text-[9px] font-black rounded-full uppercase">New</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          {/* Theme Switcher Widget */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between p-4 rounded-[1.5rem] bg-soft-pink/40 dark:bg-white/5 border border-soft-pink dark:border-white/10 hover:border-primary/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary group-hover:rotate-12 transition-transform">
                {theme === 'light' ? 'light_mode' : 'dark_mode'}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-deep-text dark:text-white/60">
                {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </div>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-muted-text/20'}`}>
              <div className={`absolute top-0.5 size-3 rounded-full bg-white shadow-sm transition-all ${theme === 'dark' ? 'left-[18px]' : 'left-0.5'}`}></div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('tryon')}
            className="w-full bg-primary text-white py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            Try On Clothes
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-background-dark border-t border-soft-pink dark:border-white/10" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-center justify-around px-2 py-1">
          {mobileNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as View)}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all min-w-[60px] ${activeView === item.id
                ? 'text-primary'
                : 'text-muted-text dark:text-white/40'
                }`}
            >
              <span className={`material-symbols-outlined text-xl ${activeView === item.id ? 'text-primary' : ''}`}>
                {item.icon}
              </span>
              <span className={`text-[9px] ${activeView === item.id ? 'font-black' : 'font-bold'}`}>
                {item.label}
              </span>
            </button>
          ))}
          {/* More menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all min-w-[60px] ${mobileMenuOpen ? 'text-primary' : 'text-muted-text dark:text-white/40'
              }`}
          >
            <span className="material-symbols-outlined text-xl">more_horiz</span>
            <span className="text-[9px] font-bold">More</span>
          </button>
        </div>
      </div>

      {/* Mobile "More" menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="absolute bottom-16 left-3 right-3 bg-white dark:bg-background-dark rounded-[2rem] shadow-2xl border border-soft-pink dark:border-white/10 p-4 animate-in slide-in-from-bottom duration-300">
            <div className="grid grid-cols-4 gap-3 mb-4">
              {navItems.filter(i => !mobileNavItems.find(m => m.id === i.id)).map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id as View); setMobileMenuOpen(false); }}
                  className={`flex flex-col items-center gap-2 py-3 rounded-2xl transition-all ${activeView === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-deep-text/70 dark:text-white/50 hover:bg-soft-pink/30'
                    }`}
                >
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  <span className="text-[10px] font-bold">{item.label}</span>
                </button>
              ))}
              {/* Theme toggle in mobile menu */}
              <button
                onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                className="flex flex-col items-center gap-2 py-3 rounded-2xl text-deep-text/70 dark:text-white/50 hover:bg-soft-pink/30 transition-all"
              >
                <span className="material-symbols-outlined text-2xl">
                  {theme === 'light' ? 'dark_mode' : 'light_mode'}
                </span>
                <span className="text-[10px] font-bold">
                  {theme === 'light' ? 'Dark' : 'Light'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
