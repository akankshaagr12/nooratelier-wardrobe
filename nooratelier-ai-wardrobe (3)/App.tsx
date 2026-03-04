
import React, { useState, useEffect } from 'react';
import { UserProvider, useUser } from './contexts/UserContext';
import { WardrobeProvider } from './contexts/WardrobeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AIAssistant from './components/AIAssistant';
import Auth from './views/Auth';
import Dashboard from './views/Dashboard';
import Wardrobe from './views/Wardrobe';
import WeeklyPlanner from './views/WeeklyPlanner';
import SocialFeed from './views/SocialFeed';
import Settings from './views/Settings';
import Profile from './views/Profile';
import VirtualTryOn from './views/VirtualTryOn';

export type View = 'dashboard' | 'wardrobe' | 'planner' | 'social' | 'settings' | 'profile' | 'tryon';
export type Theme = 'light' | 'dark';

const AppContent: React.FC = () => {
  const { user, isLoggedIn, login, logout, updateProfile } = useUser();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogin = (email: string, name?: string, photoUrl?: string) => {
    setIsLoggingIn(true);
    setTimeout(() => {
      login(email, name);
      // If Google sign-in provides a photo, update the profile
      if (photoUrl) {
        updateProfile({ avatarUrl: photoUrl });
      }
      setIsLoggingIn(false);
    }, 1000);
  };

  const handleLogout = () => {
    logout();
    setCurrentView('dashboard');
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} isLoading={isLoggingIn} theme={theme} toggleTheme={toggleTheme} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onNavigate={handleNavigate} />;
      case 'wardrobe': return <Wardrobe />;
      case 'planner': return <WeeklyPlanner />;
      case 'social': return <SocialFeed />;
      case 'settings': return <Settings />;
      case 'profile': return <Profile />;
      case 'tryon': return <VirtualTryOn />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
      <Sidebar activeView={currentView} onNavigate={handleNavigate} theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header currentView={currentView} onLogout={handleLogout} onNavigate={handleNavigate} />
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 md:pb-0">
          {renderView()}
        </div>
      </main>
      <AIAssistant />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <WardrobeProvider>
        <AppContent />
      </WardrobeProvider>
    </UserProvider>
  );
};

export default App;
