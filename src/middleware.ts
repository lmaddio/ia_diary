import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for Route Protection
 * 
 * This middleware protects private routes by checking authentication status.
 * Currently works with the mocked Clerk service using localStorage.
 * 
 * When migrating to real Clerk, replace this with:
 * 
 * import { authMiddleware } from "@clerk/nextjs";
 * 
 * export default authMiddleware({
 *   publicRoutes: ["/", "/login", "/register", "/api/(.*)"],
 * });
 * 
 * export const config = {
 *   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
 * };
 */

/**
 * Route Configuration
 * These arrays define which routes require authentication
 * and which are for unauthenticated users only.
 * 
 * protectedRoutes: Routes that require the user to be logged in
 * authRoutes: Routes for login/register (redirect to dashboard if authenticated)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _protectedRoutes = ["/dashboard", "/diary"];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _authRoutes = ["/login", "/register"];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(_request: NextRequest) {
  /**
   * Note: In a real application, we would check the auth session here.
   * Since we're using localStorage for the mock (which isn't accessible in middleware),
   * the actual authentication check is done client-side in the page components.
   * 
   * With real Clerk, the authMiddleware handles this automatically:
   * - It reads the session from cookies
   * - Redirects unauthenticated users to sign-in
   * - Handles session refresh
   * 
   * Example with real Clerk:
   * const { pathname } = request.nextUrl;
   * const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
   * // Then check auth and redirect accordingly
   */

  // For now, just continue - client-side will handle auth redirects
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
