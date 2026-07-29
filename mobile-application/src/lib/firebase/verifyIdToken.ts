// src/lib/firebase/verifyIdToken.ts
/**
 * Server-side Firebase ID token verification utility.
 * Used by Next.js API routes and middleware to authenticate
 * requests from the PWA to the backend.
 *
 * In production, this calls the backend's token verification endpoint
 * or uses firebase-admin directly. In development, it accepts the
 * dev-mock-token for local testing.
 */

import { auth } from "./config";
import type { User } from "firebase/auth";

/**
 * Decoded Firebase ID token payload (mirrors firebase-admin's DecodedIdToken).
 */
export interface DecodedToken {
  uid: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  role?: string;
  iat: number;
  exp: number;
  auth_time: number;
}

/**
 * Verifies a Firebase ID token on the server side.
 * Uses firebase-admin if available; otherwise falls back to
 * a lightweight verification via the backend API.
 *
 * @param idToken - The Firebase ID token from the Authorization header
 * @returns The decoded token payload if valid
 * @throws Error if the token is invalid or expired
 */
export async function verifyIdToken(
  idToken: string
): Promise<DecodedToken> {
  if (!idToken) {
    throw new Error("No ID token provided");
  }

  // Development mode: accept the dev-mock-token used by the backend
  if (process.env.NODE_ENV === "development" && idToken === "dev-mock-token") {
    return {
      uid: "dev-mock-uid",
      email: "dev@example.com",
      email_verified: true,
      role: "candidate",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      auth_time: Math.floor(Date.now() / 1000),
    };
  }

  // Try firebase-admin verification first (server-side only)
  try {
    // Only import firebase-admin on the server side
    if (typeof window === "undefined") {
      const admin = await import("firebase-admin");
      if (admin.apps.length > 0) {
        const decoded = await admin.auth().verifyIdToken(idToken);
        return decoded as unknown as DecodedToken;
      }
    }
  } catch (adminError) {
    console.warn(
      "[verifyIdToken] firebase-admin verification failed, falling back to backend:",
      adminError
    );
  }

  // Fallback: verify via the backend API
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/api/v1/pwa/verify-token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!response.ok) {
      throw new Error(`Backend verification failed: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success || !data.decodedToken) {
      throw new Error(data.message || "Token verification failed");
    }

    return data.decodedToken as DecodedToken;
  } catch (fallbackError) {
    console.error("[verifyIdToken] All verification methods failed:", fallbackError);
    throw new Error("Unable to verify authentication token");
  }
}

/**
 * Extracts the Bearer token from an Authorization header.
 *
 * @param authHeader - The raw Authorization header value
 * @returns The token string, or null if not found
 */
export function extractBearerToken(authHeader: string | null | undefined): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Middleware helper: verifies the token from a request's Authorization header.
 * Returns the decoded token or throws an error.
 *
 * @param request - The Next.js Request object
 * @returns The decoded token payload
 */
export async function verifyTokenFromRequest(
  request: Request
): Promise<DecodedToken> {
  const authHeader = request.headers.get("authorization");
  const token = extractBearerToken(authHeader);

  if (!token) {
    throw new Error("Missing or invalid Authorization header");
  }

  return verifyIdToken(token);
}

/**
 * Type guard: checks if a user object has the required fields.
 */
export function isVerifiedUser(user: unknown): user is User {
  return (
    typeof user === "object" &&
    user !== null &&
    "uid" in user &&
    typeof (user as User).uid === "string"
  );
}
