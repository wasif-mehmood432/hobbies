// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '@/firebase';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch
} from 'firebase/firestore';

// ====== User Types ======
interface User {
  id: string;
  name: string | null;
  email: string | null;
  planName?: 'none' | 'Basic' | 'Premium' | 'Enterprise';
  phone?: string;
  description?: string;
  imageUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  googleLogin: () => Promise<boolean>;
  facebookLogin: () => Promise<boolean>;
  appleLogin: () => Promise<boolean>;
  phoneLogin: (phoneNumber: string, appVerifier: RecaptchaVerifier) => Promise<any>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  updateSubscription: (planName: 'none' | 'Basic' | 'Premium' | 'Enterprise') => Promise<void>;
  updateUserProfile: (data: { name: string; phone: string; description: string; imageUrl?: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUser({ id: firebaseUser.uid, ...userDocSnap.data() } as User);
        } else {
          const newUser = {
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            planName: 'none',
          };
          await setDoc(userDocRef, newUser);
          setUser({ id: firebaseUser.uid, ...newUser } as User);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateSubscription = async (planName: 'none' | 'Basic' | 'Premium' | 'Enterprise') => {
    if (user) {
      const userDocRef = doc(db, "users", user.id);
      await updateDoc(userDocRef, { planName });
      setUser({ ...user, planName });
    }
  };

  const updateUserProfile = async (data: { name: string; phone: string; description: string; imageUrl?: string }) => {
    if (!user) return;

    const batch = writeBatch(db);
    const userDocRef = doc(db, "users", user.id);

    const updateData: { [key: string]: any } = {
      name: data.name,
      phone: data.phone,
      description: data.description,
    };

    if (data.imageUrl !== undefined) {
      updateData.imageUrl = data.imageUrl;
    }

    batch.update(userDocRef, updateData);

    if (data.name !== user.name || data.phone !== user.phone || data.imageUrl !== user.imageUrl) {
      const servicesCollection = collection(db, "services");
      const q = query(servicesCollection, where("providerId", "==", user.id));
      const querySnapshot = await getDocs(q);

      const serviceUpdateData: { name: string; contactPhone: string; providerImageUrl?: string } = {
        name: data.name,
        contactPhone: data.phone,
      };

      if (data.imageUrl !== undefined) {
        serviceUpdateData.providerImageUrl = data.imageUrl;
      }

      querySnapshot.forEach(doc => {
        batch.update(doc.ref, serviceUpdateData);
      });
    }

    await batch.commit();
    setUser({ ...user, ...updateData });
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return true;
    } catch (error) {
      console.error("Google login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const facebookLogin = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      return true;
    } catch (error) {
      console.error("Facebook login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const appleLogin = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const provider = new OAuthProvider('apple.com');
      await signInWithPopup(auth, provider);
      return true;
    } catch (error) {
      console.error("Apple login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const phoneLogin = async (phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<any> => {
    setIsLoading(true);
    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      return result;
    } catch (error) {
      console.error("Phone login error:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      await setDoc(doc(db, "users", firebaseUser.uid), {
        name,
        email,
        planName: 'none',
      });
      await signOut(auth);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        googleLogin,
        facebookLogin,
        appleLogin,
        phoneLogin,
        signup,
        logout,
        isLoading,
        updateSubscription,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
