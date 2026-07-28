/**
 * src/lib/localAuth.ts
 * Local authentication service for PIN and Biometric auth.
 * Stores encrypted PIN in localStorage and uses WebAuthn API for biometrics.
 *
 * Flow:
 * 1. User registers/logs in with email/password (Firebase)
 * 2. User is prompted to set a 4-6 digit PIN
 * 3. Optionally, user can enable biometric unlock in Settings
 * 4. On subsequent app opens, user unlocks with PIN or biometrics
 */

const STORAGE_KEYS = {
  PIN_HASH: "og_pin_hash",
  PIN_SALT: "og_pin_salt",
  BIOMETRIC_ENABLED: "og_biometric_enabled",
  PIN_SETUP_COMPLETE: "og_pin_setup_complete",
  PIN_SETUP_SKIPPED: "og_pin_setup_skipped",
  LOCKED_UID: "og_locked_uid",
} as const;

// Simple hash function for PIN (not cryptographic - just obfuscation).
// In production, use bcrypt or a proper KDF.
function simpleHash(input: string, salt: string): string {
  let hash = 0;
  const combined = input + salt;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

function generateSalt(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

// ─── PIN Management ──────────────────────────────────────────────────────────

export function isPinSet(): boolean {
  if (typeof window === "undefined") return false;
  // PIN is set if user completed setup OR explicitly skipped it
  const completed = localStorage.getItem(STORAGE_KEYS.PIN_SETUP_COMPLETE) === "true";
  const skipped = localStorage.getItem(STORAGE_KEYS.PIN_SETUP_SKIPPED) === "true";
  return completed || skipped;
}

export function setPinSetupSkipped(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PIN_SETUP_SKIPPED, "true");
}

export function setPin(pin: string): boolean {
  if (typeof window === "undefined") return false;
  if (!/^\d{4,6}$/.test(pin)) return false;

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    console.warn("[localAuth] Offline — localStorage may be unavailable");
  }

  const salt = generateSalt();
  const hash = simpleHash(pin, salt);

  try {
    localStorage.setItem(STORAGE_KEYS.PIN_HASH, hash);
    localStorage.setItem(STORAGE_KEYS.PIN_SALT, salt);
    localStorage.setItem(STORAGE_KEYS.PIN_SETUP_COMPLETE, "true");
    return true;
  } catch (err) {
    console.error("[localAuth] setPin failed:", err);
    return false;
  }
}

export function verifyPin(pin: string): boolean {
  if (typeof window === "undefined") return false;

  const storedHash = localStorage.getItem(STORAGE_KEYS.PIN_HASH);
  const storedSalt = localStorage.getItem(STORAGE_KEYS.PIN_SALT);
  if (!storedHash || !storedSalt) return false;

  const computedHash = simpleHash(pin, storedSalt);
  return computedHash === storedHash;
}

export function changePin(oldPin: string, newPin: string): boolean {
  if (!verifyPin(oldPin)) return false;
  return setPin(newPin);
}

export function clearPin(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.PIN_HASH);
  localStorage.removeItem(STORAGE_KEYS.PIN_SALT);
  localStorage.removeItem(STORAGE_KEYS.PIN_SETUP_COMPLETE);
  localStorage.removeItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
  localStorage.removeItem(STORAGE_KEYS.LOCKED_UID);
}

export function storeLockedUid(uid: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.LOCKED_UID, uid);
}

export function getLockedUid(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.LOCKED_UID);
}

// ─── Biometric Support Detection ─────────────────────────────────────────────

export interface BiometricSupport {
  available: boolean;
  type: "fingerprint" | "face" | "iris" | "unknown" | null;
  error?: string;
}

/**
 * Checks if the device supports WebAuthn / platform biometric authentication.
 */
export async function checkBiometricSupport(): Promise<BiometricSupport> {
  if (typeof window === "undefined") {
    return { available: false, type: null, error: "Not in browser" };
  }

  // Check WebAuthn support
  if (!window.PublicKeyCredential) {
    return { available: false, type: null, error: "WebAuthn not supported" };
  }

  try {
    // Check if platform authenticator (fingerprint/face) is available
    const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    if (!isAvailable) {
      return { available: false, type: null, error: "No platform biometric authenticator found" };
    }

    // Try to determine biometric type from user agent
    const ua = navigator.userAgent.toLowerCase();
    let type: BiometricSupport["type"] = "unknown";

    if (ua.includes("touchid") || ua.includes("iphone") || ua.includes("ipad")) {
      type = "fingerprint"; // iOS Touch ID / Face ID
    } else if (ua.includes("android")) {
      type = "fingerprint"; // Android fingerprint / face unlock
    } else if (ua.includes("facetime") || ua.includes("face id")) {
      type = "face";
    } else if (ua.includes("windows.hello") || ua.includes("windows hello")) {
      type = "face"; // Windows Hello
    }

    return { available: true, type };
  } catch (error) {
    return { available: false, type: null, error: String(error) };
  }
}

export function isBiometricEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED) === "true";
}

export function setBiometricEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  if (enabled) {
    localStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, "true");
  } else {
    localStorage.removeItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
  }
}

// ─── Biometric Authentication via WebAuthn ────────────────────────────────────

/**
 * Creates a WebAuthn credential for biometric verification.
 * This stores a credential ID that can be used to verify the user's identity.
 */
export async function createBiometricCredential(userId: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userIdBuffer = new TextEncoder().encode(userId);

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: "OG Agency" },
        user: {
          id: userIdBuffer,
          name: userId,
          displayName: "OG Agency User",
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" }, // ES256
          { alg: -257, type: "public-key" }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          requireResidentKey: true,
        },
        timeout: 60000,
      },
    });

    if (!credential) return false;

    // Store credential ID for later verification
    const credId = (credential as PublicKeyCredential).id;
    try {
      localStorage.setItem("og_biometric_credential_id", credId);
    } catch {
      // May fail in some environments, that's okay
    }

    return true;
  } catch (error) {
    console.error("Biometric credential creation failed:", error);
    return false;
  }
}

/**
 * Authenticates using the stored WebAuthn credential (biometric prompt).
 */
export async function authenticateWithBiometric(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const storedCredentialId = localStorage.getItem("og_biometric_credential_id");
    if (!storedCredentialId) {
      // No stored credential - try discovery (platform will prompt anyway)
      const challenge = crypto.getRandomValues(new Uint8Array(32));

      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          rpId: window.location.hostname || "localhost",
          userVerification: "required",
          timeout: 60000,
        },
      });

      return assertion !== null;
    }

    // Use stored credential
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const credentialId = Uint8Array.from(atob(storedCredentialId), c => c.charCodeAt(0));

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [{
          id: credentialId,
          type: "public-key",
          transports: ["internal"],
        }],
        userVerification: "required",
        timeout: 60000,
      },
    });

    return assertion !== null;
  } catch (error) {
    console.error("Biometric authentication failed:", error);
    return false;
  }
}

/**
 * Simple biometric check that works across platforms.
 * Falls back gracefully if WebAuthn isn't available.
 */
export async function promptBiometric(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const support = await checkBiometricSupport();
  if (!support.available) return false;

  // Check if we have a stored credential already
  const storedCredId = localStorage.getItem("og_biometric_credential_id");
  if (storedCredId) {
    return authenticateWithBiometric();
  }

  // First time - create credential then verify
  const uid = getLockedUid() || "anonymous";
  const created = await createBiometricCredential(uid);
  if (!created) return false;

  return authenticateWithBiometric();
}