"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useDiaryStore } from "@/store/useDiaryStore";
import { useThemeStore } from "@/store/useThemeStore";
import { Sidebar } from "@/components/layout";
import { Navbar } from "@/components/layout";
import { cn } from "@/lib/utils";

/**
 * Private Layout
 * 
 * This layout wraps all authenticated routes (dashboard, diary).
 * It checks for authentication and redirects to login if not authenticated.
 * Dark theme is only available for authenticated users.
 * 
 * When migrating to Clerk, you can use:
 * - <SignedIn> and <SignedOut> components for conditional rendering
 * - <RedirectToSignIn> for redirecting unauthenticated users
 * - <UserButton> for user profile dropdown
 */
export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useAuthStore();
  const { loadEntries } = useDiaryStore();
  const { resolvedTheme, initialize: initializeTheme } = useThemeStore();

  // Initialize theme
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      loadEntries(user.id);
    }
  }, [isLoaded, isSignedIn, user, loadEntries]);

  const isDark = resolvedTheme === "dark";

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center",
        isDark ? "bg-gray-950" : "bg-gray-50"
      )}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    return null;
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors",
      isDark ? "dark bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
    )}>
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Navbar */}
      <div className="lg:hidden">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="pt-16 lg:pt-0">{children}</div>
      </main>
    </div>
  );
}
