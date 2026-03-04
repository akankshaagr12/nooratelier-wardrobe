
import React, { useState, useRef, useEffect } from 'react';
import { View } from '../App';
import { useUser } from '../contexts/UserContext';
import { useWardrobe } from '../contexts/WardrobeContext';

interface HeaderProps {
  currentView: View;
  onLogout: () => void;
  onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onLogout, onNavigate }) => {
  const { user } = useUser();
  const { items } = useWardrobe();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = searchQuery.trim()
    ? items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.season.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.occasion.some(o => o.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : [];

  const handleSearchSelect = () => {
    onNavigate('wardrobe');
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <header className="sticky top-0 z-20 glass-effect dark:bg-black/40 px-4 md:px-8 py-3 md:py-5 flex items-center justify-between border-b border-soft-pink dark:border-white/5 shrink-0 transition-colors duration-300">
      {/* Mobile: Logo | Desktop: Status Badge */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2">
          <div className="bg-primary size-8 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
          </div>
          <h1 className="text-deep-text dark:text-white text-sm font-black uppercase tracking-tight">Noor</h1>
        </div>
        <div className="hidden md:block px-4 py-1.5 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/40 rounded-full">
          <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">System Status: Operational</span>
        </div>
      </div>

      {/* Search Bar - responsive */}
      <div className="flex items-center gap-3 md:gap-6 flex-1 max-w-xl mx-3 md:mx-12" ref={searchRef}>
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-muted-text dark:text-white/20 text-lg md:text-xl">search</span>
          <input
            className="w-full bg-soft-pink/50 dark:bg-white/5 border-none rounded-full pl-10 md:pl-12 pr-4 md:pr-6 py-2.5 md:py-3.5 text-xs md:text-sm text-deep-text dark:text-white focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-text/40 dark:placeholder:text-white/10"
            placeholder="Search wardrobe..."
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => searchQuery.trim() && setShowResults(true)}
          />

          {/* Search Results Dropdown */}
          {showResults && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-background-dark border border-soft-pink dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              {filteredItems.length > 0 ? (
                <>
                  <div className="px-4 py-2 border-b border-soft-pink dark:border-white/5">
                    <p className="text-[10px] font-black text-muted-text dark:text-white/30 uppercase tracking-widest">
                      {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                  {filteredItems.map(item => (
                    <div
                      key={item.id}
                      onClick={handleSearchSelect}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-soft-pink/30 dark:hover:bg-white/5 cursor-pointer transition-all"
                    >
                      <div className="size-10 rounded-xl overflow-hidden bg-soft-pink/20 dark:bg-white/5 flex-shrink-0">
                        {item.imageUrl && !item.imageUrl.startsWith('data:') ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : item.imageUrl && item.imageUrl.startsWith('data:') ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary/40 text-sm">checkroom</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-deep-text dark:text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-muted-text dark:text-white/40 font-bold uppercase tracking-wider">{item.category} • {item.season.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="px-6 py-8 text-center">
                  <span className="material-symbols-outlined text-3xl text-muted-text/30 dark:text-white/10 mb-2 block">search_off</span>
                  <p className="text-sm text-muted-text dark:text-white/40 font-bold">No items found for "{searchQuery}"</p>
                  <p className="text-[10px] text-muted-text/60 dark:text-white/20 mt-1">Try searching by name, category, or season</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Side - responsive */}
      <div className="flex items-center gap-2 md:gap-4">
        <button className="size-9 md:size-11 rounded-full bg-soft-pink dark:bg-white/5 flex items-center justify-center text-deep-text dark:text-white hover:bg-soft-pink/80 dark:hover:bg-white/10 transition-all border border-soft-pink dark:border-white/5">
          <span className="material-symbols-outlined text-lg md:text-[22px]">notifications</span>
        </button>
        <div className="hidden md:block h-8 w-px bg-soft-pink dark:bg-white/10 mx-2"></div>
        <div className="flex items-center gap-2 md:gap-4 group relative">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-black text-deep-text dark:text-white leading-none">{user.name || 'Welcome!'}</span>
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest mt-1.5">{user.tier} Tier</span>
          </div>
          <div className="relative cursor-pointer">
            <div
              className="size-9 md:size-11 rounded-full bg-cover bg-center ring-2 ring-primary/20 dark:ring-primary/40 transition-all group-hover:ring-primary shadow-lg"
              style={{ backgroundImage: `url('${user.avatarUrl}')` }}
            ></div>
            <div className="absolute right-0 top-12 md:top-14 w-56 bg-white dark:bg-background-dark border border-soft-pink dark:border-white/10 rounded-[1.5rem] shadow-2xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 p-2 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-soft-pink dark:border-white/5 mb-1">
                <p className="text-[9px] font-black text-muted-text dark:text-white/30 uppercase tracking-widest mb-0.5">Account</p>
                <p className="text-[10px] font-bold text-deep-text dark:text-white/60 truncate">{user.email}</p>
              </div>
              <button
                onClick={() => onNavigate('profile')}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-deep-text dark:text-white hover:bg-soft-pink dark:hover:bg-white/5 rounded-xl transition-all"
              >
                <span className="material-symbols-outlined text-base">person</span>
                My Profile
              </button>
              <button
                onClick={() => onNavigate('settings')}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-deep-text dark:text-white hover:bg-soft-pink dark:hover:bg-white/5 rounded-xl transition-all"
              >
                <span className="material-symbols-outlined text-base">settings</span>
                Settings
              </button>
              <hr className="my-1.5 border-soft-pink dark:border-white/5" />
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
              >
                <span className="material-symbols-outlined text-base">power_settings_new</span>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
