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
  completeSetup: (company: string, branch: string, role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

async function fetchUserFromDB(uid: string) {
  try {
    const res = await fetch(`/api/auth/user?uid=${uid}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}

async function upsertUserToDB(payload: Record<string, string>) {
  try {
    const res = await fetch("/api/auth/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setFirebaseUser(user);
      if (user) {
        // Try localStorage first for fast load
        const saved = getUserProfile();
        if (saved && saved.uid === user.uid) {
          setProfile(saved);
        }

        // Then sync from DB
        const dbUser = await fetchUserFromDB(user.uid);
        if (dbUser && dbUser.isSetupComplete) {
          const p: UserProfile = {
            uid: dbUser.firebaseUid,
            name: dbUser.displayName,
            email: dbUser.email,
            photoURL: dbUser.photoURL,
            company: dbUser.company,
            branch: dbUser.branch,
            role: dbUser.role,
          };
          saveUserProfile(p);
          setProfile(p);
        } else if (!dbUser) {
          // Create basic user record in DB on first sign-in
          await upsertUserToDB({
            firebaseUid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
          });
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

  const completeSetup = async (company: string, branch: string, role: string) => {
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

    // Save to localStorage for fast access
    saveUserProfile(newProfile);
    setProfile(newProfile);

    // Persist to MongoDB
    await upsertUserToDB({
      firebaseUid: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || "",
      photoURL: firebaseUser.photoURL || "",
      company,
      branch,
      role,
    });
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
