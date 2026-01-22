"use client";

import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface ThemeStore {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  isInitialized: boolean;
  setTheme: (theme: Theme) => void;
  initialize: () => void;
}

const STORAGE_KEY = "moodtrack_theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: "light",
  resolvedTheme: "light",
  isInitialized: false,

  initialize: () => {
    if (typeof window === "undefined") return;
    
    // Prevent re-initialization
    if (get().isInitialized) return;

    // Load saved theme
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const theme = saved || "light";
    const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

    set({ theme, resolvedTheme, isInitialized: true });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const { theme } = get();
      if (theme === "system") {
        const newResolved = getSystemTheme();
        set({ resolvedTheme: newResolved });
      }
    };

    mediaQuery.addEventListener("change", handleChange);
  },

  setTheme: (theme: Theme) => {
    if (typeof window === "undefined") return;

    localStorage.setItem(STORAGE_KEY, theme);
    const resolvedTheme = theme === "system" ? getSystemTheme() : theme;
    set({ theme, resolvedTheme });
  },
}));
