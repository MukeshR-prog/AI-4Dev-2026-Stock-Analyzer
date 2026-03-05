import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import type { UserProfile } from "@/types";

// ── Firebase auth helpers ──

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logout() {
  await signOut(auth);
}

// ── Local-storage user profile helpers ──

const PROFILE_KEY = "rip_user_profile";

export function saveUserProfile(profile: UserProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }
}

export function getUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function clearUserProfile() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PROFILE_KEY);
  }
}

export function isSetupComplete(): boolean {
  const profile = getUserProfile();
  return !!profile?.company && !!profile?.branch;
}
