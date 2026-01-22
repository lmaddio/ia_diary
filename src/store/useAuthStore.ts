"use client";

import { create } from "zustand";
import { User, SignInCredentials, SignUpCredentials } from "@/types";
import { clerkMock } from "@/lib/clerk-mock";

interface AuthStore {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => void;
  signIn: (credentials: SignInCredentials) => Promise<boolean>;
  signUp: (credentials: SignUpCredentials) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoaded: false,
  isSignedIn: false,
  user: null,
  isLoading: false,
  error: null,

  initialize: () => {
    // Subscribe to auth changes
    clerkMock.subscribe(() => {
      const auth = clerkMock.getAuth();
      set({
        isSignedIn: auth.isSignedIn,
        user: auth.user,
        isLoaded: true,
      });
    });

    // Get initial auth state
    const auth = clerkMock.getAuth();
    set({
      isSignedIn: auth.isSignedIn,
      user: auth.user,
      isLoaded: true,
    });
  },

  signIn: async (credentials: SignInCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const result = await clerkMock.signIn(credentials);
      if (result.success) {
        set({ isLoading: false });
        return true;
      } else {
        set({ isLoading: false, error: result.error || "Sign in failed" });
        return false;
      }
    } catch {
      set({ isLoading: false, error: "An unexpected error occurred" });
      return false;
    }
  },

  signUp: async (credentials: SignUpCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const result = await clerkMock.signUp(credentials);
      if (result.success) {
        set({ isLoading: false });
        return true;
      } else {
        set({ isLoading: false, error: result.error || "Sign up failed" });
        return false;
      }
    } catch {
      set({ isLoading: false, error: "An unexpected error occurred" });
      return false;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    await clerkMock.signOut();
    set({ isLoading: false });
  },

  clearError: () => set({ error: null }),
}));
