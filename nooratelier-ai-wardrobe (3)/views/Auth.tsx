
import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase';
import { Theme } from '../App';

interface AuthProps {
  onLogin: (email: string, name?: string, photoUrl?: string) => void;
  isLoading: boolean;
  theme: Theme;
  toggleTheme: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, isLoading, theme, toggleTheme }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onLogin(email);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured()) {
      setError('Google Sign-In requires Firebase configuration. Add your Firebase credentials to .env.local');
      return;
    }

    setGoogleLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onLogin(
        user.email || '',
        user.displayName || undefined,
        user.photoURL || undefined
      );
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Google Sign-In. Add localhost to Firebase authorized domains.');
      } else {
        setError('Google Sign-In failed. Please try again or use email.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden font-sans bg-background-light dark:bg-background-dark transition-colors duration-300">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-8 right-8 z-50 size-12 rounded-full glass-effect flex items-center justify-center text-deep-text dark:text-white hover:scale-110 transition-all border border-soft-pink dark:border-white/10"
      >
        <span className="material-symbols-outlined">
          {theme === 'light' ? 'dark_mode' : 'light_mode'}
        </span>
      </button>

      {/* Left Side: Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
          alt="Branding"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-deep-text/50 dark:bg-black/70 backdrop-blur-[1px]"></div>
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="bg-primary size-12 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/40">
              <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            </div>
            <h1 className="text-white text-2xl font-black uppercase tracking-tighter">NoorAtelier</h1>
          </div>

          <div className="max-w-md">
            <h2 className="text-6xl font-black text-white leading-[1.1] mb-6 drop-shadow-2xl">
              Try On Clothes <br />
              <span className="text-primary italic">Virtually</span> with AI
            </h2>
            <p className="text-white/80 text-lg font-medium leading-relaxed">
              Upload your photo, pick your outfits, and see how they look on you instantly!
            </p>
          </div>

          <div className="flex gap-8 text-white/40 text-[10px] font-black uppercase tracking-widest">
            <span>Privacy</span>
            <span>Terms</span>
            <span>© 2025 NoorAtelier AI</span>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-center lg:text-left">
            <h3 className="text-4xl font-black text-deep-text dark:text-white mb-3">
              {isSignUp ? 'Join NoorAtelier' : 'Welcome Back'}
            </h3>
            <p className="text-muted-text dark:text-white/50 font-medium">
              {isSignUp ? 'Create your AI styling account' : 'Sign in to your virtual wardrobe'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-white dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-2xl font-bold text-sm text-deep-text dark:text-white hover:bg-soft-pink/30 dark:hover:bg-white/10 transition-all disabled:opacity-50"
            >
              {googleLoading ? (
                <>
                  <div className="size-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  Connecting to Google...
                </>
              ) : (
                <>
                  <img src="https://www.svgrepo.com/show/355037/google.svg" className="size-6" alt="Google" />
                  Continue with Google
                </>
              )}
            </button>

            {/* Apple Sign-In (placeholder) */}
            <button className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-deep-text dark:bg-white text-white dark:text-deep-text rounded-2xl font-bold text-sm hover:opacity-90 transition-all">
              <img src="https://www.svgrepo.com/show/448206/apple.svg" className="size-6 invert dark:invert-0" alt="Apple" />
              Continue with Apple
            </button>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-soft-pink dark:border-white/10"></div>
            <span className="flex-shrink mx-6 text-muted-text/40 dark:text-white/20 text-[9px] font-black uppercase tracking-[0.2em]">Or use email</span>
            <div className="flex-grow border-t border-soft-pink dark:border-white/10"></div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-text dark:text-white/40 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-2xl px-6 py-4 text-sm text-deep-text dark:text-white focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-text/20 dark:placeholder:text-white/10"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-text dark:text-white/40 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-2xl px-6 py-4 text-sm text-deep-text dark:text-white focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-text/20 dark:placeholder:text-white/10"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-5 rounded-full font-black text-sm shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>{isSignUp ? 'Create Account' : 'Sign In with Email'}</>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-xs text-muted-text dark:text-white/40 font-bold uppercase tracking-widest">
              {isSignUp ? 'Already have an account?' : 'New here?'}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-3 text-primary font-black hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
