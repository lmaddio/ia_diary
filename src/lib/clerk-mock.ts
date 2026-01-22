/**
 * Mocked Clerk Authentication Service
 * This mock simulates Clerk's functionality for development and testing.
 * Replace this with actual Clerk integration when ready:
 * 
 * 1. Install @clerk/nextjs: npm install @clerk/nextjs
 * 2. Add environment variables:
 *    - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
 *    - CLERK_SECRET_KEY
 * 3. Wrap your app with <ClerkProvider>
 * 4. Replace mock hooks with Clerk hooks:
 *    - useAuth() from @clerk/nextjs
 *    - useUser() from @clerk/nextjs
 *    - SignIn, SignUp components
 * 5. Use Clerk's middleware for route protection
 */

import { User, SignInCredentials, SignUpCredentials } from "@/types";
import { generateId, delay } from "./utils";

// Simulated user storage (in production, this would be Clerk's backend)
const STORAGE_KEY = "moodtrack_auth";
const USERS_KEY = "moodtrack_users";

interface StoredAuth {
  user: User | null;
  isSignedIn: boolean;
}

interface StoredUser extends User {
  passwordHash: string;
}

/**
 * Get stored users from localStorage
 */
function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Save users to localStorage
 */
function saveUsers(users: StoredUser[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Get auth state from localStorage
 */
function getStoredAuth(): StoredAuth {
  if (typeof window === "undefined") {
    return { user: null, isSignedIn: false };
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return { user: null, isSignedIn: false };
  try {
    return JSON.parse(stored);
  } catch {
    return { user: null, isSignedIn: false };
  }
}

/**
 * Save auth state to localStorage
 */
function saveAuth(auth: StoredAuth): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

/**
 * Simple hash function for demo purposes
 * In production, Clerk handles password security
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

/**
 * Mock Clerk Auth class
 * Simulates Clerk's authentication flow
 */
export class ClerkMock {
  private listeners: Set<() => void> = new Set();

  /**
   * Subscribe to auth state changes
   */
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach((callback) => callback());
  }

  /**
   * Get current auth state
   */
  getAuth(): StoredAuth {
    return getStoredAuth();
  }

  /**
   * Sign in with email and password
   * Simulates Clerk's signIn.create() method
   */
  async signIn(credentials: SignInCredentials): Promise<{ success: boolean; error?: string }> {
    await delay(800); // Simulate network latency

    const users = getStoredUsers();
    const user = users.find((u) => u.email === credentials.email);

    if (!user) {
      return { success: false, error: "No account found with this email" };
    }

    if (user.passwordHash !== simpleHash(credentials.password)) {
      return { success: false, error: "Incorrect password" };
    }

    const authUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
    };

    saveAuth({ user: authUser, isSignedIn: true });
    this.notifyListeners();

    return { success: true };
  }

  /**
   * Sign up with email and password
   * Simulates Clerk's signUp.create() method
   */
  async signUp(credentials: SignUpCredentials): Promise<{ success: boolean; error?: string }> {
    await delay(800); // Simulate network latency

    const users = getStoredUsers();

    if (users.some((u) => u.email === credentials.email)) {
      return { success: false, error: "An account with this email already exists" };
    }

    const newUser: StoredUser = {
      id: generateId(),
      email: credentials.email,
      name: credentials.name,
      passwordHash: simpleHash(credentials.password),
      createdAt: new Date(),
    };

    users.push(newUser);
    saveUsers(users);

    const authUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
    };

    saveAuth({ user: authUser, isSignedIn: true });
    this.notifyListeners();

    return { success: true };
  }

  /**
   * Sign out
   * Simulates Clerk's signOut() method
   */
  async signOut(): Promise<void> {
    await delay(300);
    saveAuth({ user: null, isSignedIn: false });
    this.notifyListeners();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return getStoredAuth().isSignedIn;
  }

  /**
   * Get current user
   */
  getUser(): User | null {
    return getStoredAuth().user;
  }
}

// Singleton instance
export const clerkMock = new ClerkMock();

/**
 * Instructions for replacing with real Clerk:
 * 
 * 1. In your layout.tsx:
 *    - Import { ClerkProvider } from '@clerk/nextjs'
 *    - Wrap your app with <ClerkProvider>
 * 
 * 2. For sign-in/sign-up pages:
 *    - Use <SignIn /> and <SignUp /> components from @clerk/nextjs
 *    - Or use useSignIn() and useSignUp() hooks for custom UI
 * 
 * 3. For protecting routes:
 *    - Use middleware.ts with authMiddleware() or clerkMiddleware()
 *    - Use <SignedIn>, <SignedOut> components for conditional rendering
 * 
 * 4. For accessing user data:
 *    - Use useUser() hook to get current user
 *    - Use useAuth() hook for auth state
 *    - Use auth() in server components
 * 
 * Example middleware.ts for real Clerk:
 * ```
 * import { authMiddleware } from "@clerk/nextjs";
 * 
 * export default authMiddleware({
 *   publicRoutes: ["/", "/login", "/register"],
 * });
 * 
 * export const config = {
 *   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
 * };
 * ```
 */
