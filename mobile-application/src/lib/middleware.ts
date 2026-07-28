// src/lib/middleware.ts
/**
 * Authentication middleware for the O.G. Agency Customer PWA.
 * Provides route protection, role-based access control, and
 * token refresh logic for the portal routes.
 *
 * Used by:
 * - Portal layout (AuthGuard)
 * - API route handlers
 * - Client-side navigation guards
 */

import { auth } from "@/lib/firebase/config";
import type { User } from "firebase/auth";
import { verifyTokenFromRequest } from "@/lib/firebase/verifyIdToken";
import type { DecodedToken } from "@/lib/firebase/verifyIdToken";

// ─── Route Configuration ─────────────────────────────────────────────────────

export interface RouteConfig {
  path: string;
  requiresAuth: boolean;
  requiredRole?: "candidate" | "admin" | "super_user";
  redirectTo?: string;
}

/**
 * Route definitions for the PWA.
 * Public routes (auth pages) don't require authentication.
 * Protected routes (portal pages) require a valid Firebase session.
 */
export const ROUTES: RouteConfig[] = [
  // Public routes
  { path: "/", requiresAuth: false, redirectTo: "/dashboard" },
  { path: "/login", requiresAuth: false, redirectTo: "/dashboard" },
  { path: "/register", requiresAuth: false, redirectTo: "/dashboard" },
  { path: "/forgot-password", requiresAuth: false, redirectTo: "/dashboard" },

  // Protected portal routes
  { path: "/dashboard", requiresAuth: true, redirectTo: "/login" },
  { path: "/documents", requiresAuth: true, redirectTo: "/login" },
  { path: "/profile", requiresAuth: true, redirectTo: "/login" },
  { path: "/applications", requiresAuth: true, redirectTo: "/login" },
  { path: "/notifications", requiresAuth: true, redirectTo: "/login" },
];

// ─── Client-Side Auth Guard ──────────────────────────────────────────────────

/**
 * Checks if a path requires authentication.
 */
export function requiresAuthentication(pathname: string): boolean {
  const route = ROUTES.find(
    (r) => pathname === r.path || pathname.startsWith(r.path + "/")
  );
  return route?.requiresAuth ?? false;
}

/**
 * Gets the redirect destination for a given path.
 */
export function getRedirectPath(pathname: string): string | null {
  const route = ROUTES.find(
    (r) => pathname === r.path || pathname.startsWith(r.path + "/")
  );
  return route?.redirectTo ?? null;
}

/**
 * Determines if a user should be redirected based on their auth state
 * and the current path.
 *
 * @returns { shouldRedirect, to } or { shouldRedirect: false }
 */
export function shouldRedirect(
  pathname: string,
  user: User | null,
  loading: boolean
): { shouldRedirect: boolean; to?: string } {
  if (loading) {
    return { shouldRedirect: false };
  }

  const route = ROUTES.find(
    (r) => pathname === r.path || pathname.startsWith(r.path + "/")
  );

  if (!route) {
    // Unknown route — let Next.js handle 404
    return { shouldRedirect: false };
  }

  // If route requires auth and user is not logged in
  if (route.requiresAuth && !user) {
    return { shouldRedirect: true, to: route.redirectTo || "/login" };
  }

  // If route is public (auth pages) and user is already logged in
  if (!route.requiresAuth && user) {
    return { shouldRedirect: true, to: route.redirectTo || "/dashboard" };
  }

  return { shouldRedirect: false };
}

// ─── Server-Side Token Verification ──────────────────────────────────────────

/**
 * Middleware function for Next.js API routes.
 * Verifies the Firebase ID token from the Authorization header.
 *
 * Usage in API route:
 * ```ts
 * export async function GET(request: Request) {
 *   const { user } = await withAuth(request);
 *   if (!user) return new Response("Unauthorized", { status: 401 });
 *   // ... your handler
 * }
 * ```
 */
export async function withAuth(
  request: Request
): Promise<{ user: DecodedToken | null; error?: string }> {
  try {
    const decoded = await verifyTokenFromRequest(request);
    return { user: decoded };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : "Authentication failed",
    };
  }
}

/**
 * Higher-order function that wraps an API route handler with auth.
 * Throws a 401 response if the token is invalid.
 */
export function requireAuth<T extends any[]>(
  handler: (
    request: Request,
    user: DecodedToken,
    ...args: T
  ) => Promise<Response>
) {
  return async (request: Request, ...args: T): Promise<Response> => {
    const { user, error } = await withAuth(request);

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error || "Unauthorized",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    return handler(request, user, ...args);
  };
}

// ─── Token Refresh ───────────────────────────────────────────────────────────

/**
 * Forces a token refresh and returns the new token.
 * Call this when the backend returns a 401 to refresh the session.
 */
export async function refreshToken(): Promise<string | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  try {
    return await currentUser.getIdToken(true);
  } catch (error) {
    console.error("[middleware] Token refresh failed:", error);
    return null;
  }
}

// ─── Session Management ──────────────────────────────────────────────────────

const SESSION_KEY = "og_pwa_session_expires";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Sets the session expiry timestamp.
 */
export function setSessionExpiry(): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(
      SESSION_KEY,
      String(Date.now() + SESSION_TIMEOUT_MS)
    );
  }
}

/**
 * Checks if the session has expired.
 */
export function isSessionExpired(): boolean {
  if (typeof window === "undefined") return false;
  const expiresAt = Number(sessionStorage.getItem(SESSION_KEY) || 0);
  return expiresAt > 0 && expiresAt <= Date.now();
}

/**
 * Clears the session.
 */
export function clearSession(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

// ─── Export ──────────────────────────────────────────────────────────────────

export { auth };
