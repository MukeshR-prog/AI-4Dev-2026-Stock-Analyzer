"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import {
  onAuthChange,
  signInWithGoogle as firebaseGoogleSignIn,
  logout as firebaseLogout,
  getUserProfile,
  saveUserProfile,
  clearUserProfile,
} from "@/lib/auth";
import type { UserProfile } from "@/types";

interface AuthContextType {
  firebaseUser: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  completeSetup: (company: string, branch: string, role: string) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setFirebaseUser(user);
      if (user) {
        // Try to load existing profile from localStorage
        const saved = getUserProfile();
        if (saved && saved.uid === user.uid) {
          setProfile(saved);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const user = await firebaseGoogleSignIn();
    return user;
  };

  const logout = async () => {
    await firebaseLogout();
    clearUserProfile();
    setProfile(null);
  };

  const completeSetup = (company: string, branch: string, role: string) => {
    if (!firebaseUser) return;
    const newProfile: UserProfile = {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || "",
      email: firebaseUser.email || "",
      photoURL: firebaseUser.photoURL || "",
      company,
      branch,
      role,
    };
    saveUserProfile(newProfile);
    setProfile(newProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        loading,
        signInWithGoogle,
        logout,
        completeSetup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
