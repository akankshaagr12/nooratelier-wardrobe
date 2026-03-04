// Firebase configuration for NoorAtelier
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { UserProfile, WardrobeItem, DEFAULT_USER_PROFILE } from '../types';

const firebaseConfig = {
    apiKey: "AIzaSyBgGfjvzWUfYaCowKthE-C1suKbOPvYLic",
    authDomain: "nooratelier-e0570.firebaseapp.com",
    projectId: "nooratelier-e0570",
    storageBucket: "nooratelier-e0570.firebasestorage.app",
    messagingSenderId: "249409052007",
    appId: "1:249409052007:web:9b41a2abf7538165a8a3c2",
    measurementId: "G-TTSJHNWBEF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export const isFirebaseConfigured = () => true;

// ============ USER PROFILE FUNCTIONS ============

export const saveUserProfile = async (userId: string, profile: UserProfile): Promise<void> => {
    try {
        // Don't save base64 avatar to Firestore (too large), use URL only
        const profileToSave = { ...profile };
        if (profileToSave.avatarUrl && profileToSave.avatarUrl.startsWith('data:')) {
            profileToSave.avatarUrl = DEFAULT_USER_PROFILE.avatarUrl;
        }
        await setDoc(doc(db, 'users', userId, 'data', 'profile'), profileToSave);
    } catch (error) {
        console.error('Error saving user profile to Firestore:', error);
    }
};

export const loadUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        const docSnap = await getDoc(doc(db, 'users', userId, 'data', 'profile'));
        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Error loading user profile from Firestore:', error);
        return null;
    }
};

// ============ WARDROBE FUNCTIONS ============

export const saveWardrobeItem = async (userId: string, item: WardrobeItem): Promise<void> => {
    try {
        // Don't save base64 images to Firestore (too large for docs)
        const itemToSave = { ...item };
        if (itemToSave.imageUrl && itemToSave.imageUrl.startsWith('data:')) {
            itemToSave.imageUrl = ''; // Will use placeholder in UI
        }
        await setDoc(doc(db, 'users', userId, 'wardrobe', item.id), itemToSave);
    } catch (error) {
        console.error('Error saving wardrobe item to Firestore:', error);
    }
};

export const loadWardrobeItems = async (userId: string): Promise<WardrobeItem[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'users', userId, 'wardrobe'));
        const items: WardrobeItem[] = [];
        querySnapshot.forEach((doc) => {
            items.push(doc.data() as WardrobeItem);
        });
        return items;
    } catch (error) {
        console.error('Error loading wardrobe items from Firestore:', error);
        return [];
    }
};

export const removeWardrobeItem = async (userId: string, itemId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, 'users', userId, 'wardrobe', itemId));
    } catch (error) {
        console.error('Error removing wardrobe item from Firestore:', error);
    }
};

export const saveAllWardrobeItems = async (userId: string, items: WardrobeItem[]): Promise<void> => {
    try {
        const batch = writeBatch(db);
        items.forEach(item => {
            const itemToSave = { ...item };
            if (itemToSave.imageUrl && itemToSave.imageUrl.startsWith('data:')) {
                itemToSave.imageUrl = '';
            }
            const ref = doc(db, 'users', userId, 'wardrobe', item.id);
            batch.set(ref, itemToSave);
        });
        await batch.commit();
    } catch (error) {
        console.error('Error saving wardrobe items to Firestore:', error);
    }
};

// ============ AUTH STATE LISTENER ============

export const onAuthChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};
