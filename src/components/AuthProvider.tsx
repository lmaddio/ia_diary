"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider Component
 * 
 * Initializes the authentication state on mount.
 * When migrating to real Clerk, this component can be replaced with:
 * 
 * import { ClerkProvider } from '@clerk/nextjs';
 * 
 * export default function AuthProvider({ children }: AuthProviderProps) {
 *   return <ClerkProvider>{children}</ClerkProvider>;
 * }
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
