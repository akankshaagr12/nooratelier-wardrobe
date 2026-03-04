
export interface WardrobeItem {
  id: string;
  name: string;
  category: 'Tops' | 'Bottoms' | 'Dresses' | 'Shoes' | 'Jewelry' | 'Bags' | 'Outerwear';
  imageUrl: string;
  color: string;
  season: string[];
  occasion: string[];
}

export interface Outfit {
  id: string;
  name: string;
  items: WardrobeItem[];
  description?: string;
  aiLogic?: string;
  imageUrl: string;
}

export interface FeedPost {
  id: string;
  user: {
    name: string;
    location: string;
    avatarUrl: string;
  };
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  taggedItems?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  location: string;
  bio: string;
  tier: 'Free' | 'Pro' | 'Founder';
  measurements: {
    height: number;
    weight: number;
    bodyShape: string;
  };
  colorPreferences: {
    skinTone: string;
    avoidColors: string[];
  };
  repeatRules: {
    topRepeatDays: number;
    outfitRepeatDays: number;
    weeklyBlazerLimit: number;
  };
  createdAt: string;
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: '',
  name: '',
  email: '',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  location: '',
  bio: '',
  tier: 'Free',
  measurements: {
    height: 170,
    weight: 60,
    bodyShape: 'Pear',
  },
  colorPreferences: {
    skinTone: '#f9ebe0',
    avoidColors: [],
  },
  repeatRules: {
    topRepeatDays: 5,
    outfitRepeatDays: 14,
    weeklyBlazerLimit: 3,
  },
  createdAt: new Date().toISOString(),
};
