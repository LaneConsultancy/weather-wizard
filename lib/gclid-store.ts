/**
 * Client-side GCLID / MSCLKID capture and storage.
 *
 * Google and Microsoft write click IDs to the URL when a user arrives from
 * an ad click:
 *   https://example.com/?gclid=CjABC...
 *   https://example.com/?msclkid=EAI...
 *
 * We capture those IDs and store them in sessionStorage so they survive
 * single-page navigations within the same browser tab. When the user later
 * clicks a phone number we can read the stored ID and POST it to our API.
 *
 * Lookup priority (highest to lowest):
 *   1. URL query string (fresh ad click on this page load)
 *   2. sessionStorage (navigated from a previous page in the same session)
 *   3. _gcl_aw cookie (written by Google when ad_storage=granted)
 *   4. ww_* cookies written by Next.js middleware (see lib/click-ids.ts)
 *
 * This module is intentionally browser-only — all functions are no-ops on
 * the server and return null safely.
 */

const SESSION_KEY_GCLID = 'ww_session_gclid';
const SESSION_KEY_MSCLKID = 'ww_session_msclkid';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Read a named query-string parameter from the current URL. */
function getUrlParam(name: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch {
    return null;
  }
}

/**
 * Read a cookie value by name.
 * Returns null if running server-side or the cookie does not exist.
 */
function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Extract the gclid from the _gcl_aw cookie.
 *
 * Google stores the gclid in _gcl_aw as a compound value like:
 *   GCL.1700000000.CjABCDEF...
 * The gclid is the last dot-separated segment.
 */
function getGclidFromGclAwCookie(): string | null {
  const raw = getCookieValue('_gcl_aw');
  if (!raw) return null;
  const parts = raw.split('.');
  const gclid = parts[parts.length - 1];
  return gclid && gclid.length > 8 ? gclid : null;
}

/**
 * Read a gclid from the ww_gclid_js cookie written by middleware.
 * This cookie is NOT httpOnly so it's readable client-side.
 */
function getGclidFromMiddlewareCookie(): string | null {
  return getCookieValue('ww_gclid_js');
}

/** Read an msclkid from the ww_msclkid_js cookie written by middleware. */
function getMsclkidFromMiddlewareCookie(): string | null {
  return getCookieValue('ww_msclkid_js');
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Validate a gclid. Real gclids are long base64-ish strings.
 * Google gclids typically start with "Cj" or "EAI". We accept anything
 * that is at least 20 characters and doesn't look like a test value.
 */
function isValidGclid(value: string | null): value is string {
  if (!value || typeof value !== 'string') return false;
  if (value.trim().length < 20) return false;
  if (value.toLowerCase().startsWith('test_') || value === 'test') return false;
  // Must be alphanumeric with hyphens/underscores (URL-safe characters)
  return /^[A-Za-z0-9\-_]+$/.test(value.trim());
}

/**
 * Validate an msclkid. Microsoft click IDs are hex-like alphanumeric strings.
 */
function isValidMsclkid(value: string | null): value is string {
  if (!value || typeof value !== 'string') return false;
  if (value.trim().length < 20) return false;
  if (value.toLowerCase().startsWith('test_') || value === 'test') return false;
  return /^[A-Za-z0-9]+$/.test(value.trim());
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Initialise gclid/msclkid capture on page load.
 *
 * Call this once when the page mounts (e.g., from a useEffect in a
 * top-level component such as GoogleAds). It reads click IDs from the
 * URL and/or fallback sources and writes them to sessionStorage so they
 * are available when the user later clicks a phone number.
 *
 * Safe to call multiple times — subsequent calls are no-ops if IDs
 * are already stored for this session.
 */
export function initGclidCapture(): void {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return;

  // --- GCLID ---
  // Only store a new value; don't overwrite an existing session gclid.
  if (!sessionStorage.getItem(SESSION_KEY_GCLID)) {
    const fromUrl = getUrlParam('gclid');
    const fromGclAw = getGclidFromGclAwCookie();
    const fromMiddleware = getGclidFromMiddlewareCookie();
    const candidate = fromUrl ?? fromGclAw ?? fromMiddleware;

    if (isValidGclid(candidate)) {
      sessionStorage.setItem(SESSION_KEY_GCLID, candidate.trim());
    }
  }

  // --- MSCLKID ---
  if (!sessionStorage.getItem(SESSION_KEY_MSCLKID)) {
    const fromUrl = getUrlParam('msclkid');
    const fromMiddleware = getMsclkidFromMiddlewareCookie();
    const candidate = fromUrl ?? fromMiddleware;

    if (isValidMsclkid(candidate)) {
      sessionStorage.setItem(SESSION_KEY_MSCLKID, candidate.trim());
    }
  }
}

/**
 * Return the stored gclid for the current browser session.
 * Returns null if no valid gclid has been captured.
 */
export function getStoredGclid(): string | null {
  if (typeof sessionStorage === 'undefined') return null;
  return sessionStorage.getItem(SESSION_KEY_GCLID);
}

/**
 * Return the stored msclkid for the current browser session.
 * Returns null if no valid msclkid has been captured.
 */
export function getStoredMsclkid(): string | null {
  if (typeof sessionStorage === 'undefined') return null;
  return sessionStorage.getItem(SESSION_KEY_MSCLKID);
}
