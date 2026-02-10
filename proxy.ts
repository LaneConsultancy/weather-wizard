import { NextRequest, NextResponse } from "next/server";

/**
 * Captures ad platform click IDs from URL parameters and persists them
 * as server-set cookies. Server-set cookies survive Safari ITP and Firefox
 * ETP restrictions that limit client-set cookies to 7 days.
 *
 * Captured parameters:
 * - gclid:   Google Ads click ID
 * - gbraid:  Google Ads iOS privacy-safe click ID
 * - wbraid:  Google Ads cross-device web click ID
 * - msclkid: Microsoft Advertising (Bing) click ID
 *
 * Cookies are set with:
 * - httpOnly: varies (see COOKIE_CONFIG)
 * - secure: true (HTTPS only)
 * - sameSite: lax (sent on top-level navigations, required for ad click redirects)
 * - maxAge: 90 days (matches Google's maximum conversion window)
 */

const CLICK_ID_PARAMS = ["gclid", "gbraid", "wbraid", "msclkid"] as const;

const COOKIE_PREFIX = "ww_";
const COOKIE_MAX_AGE = 90 * 24 * 60 * 60; // 90 days in seconds

/**
 * Cookie configuration.
 *
 * For each click ID parameter, we set TWO cookies:
 *
 * 1. `ww_gclid` (httpOnly: true)
 *    - Cannot be read by client-side JavaScript
 *    - Used by server-side scripts (Phase 4 offline conversion upload)
 *    - Immune to XSS attacks
 *
 * 2. `ww_gclid_js` (httpOnly: false)
 *    - Readable by client-side JavaScript via document.cookie
 *    - Used by the Tally form embed to pass gclid as a hidden field
 *    - Required because Tally iframe integration needs client-side access
 *
 * Why two cookies instead of one?
 * - httpOnly cookies are more secure and should be the default for server-side use
 * - But the Tally form embed is a client component that needs to read the gclid
 *   to append it to the Tally iframe URL as a hidden field parameter
 * - A single non-httpOnly cookie would work but reduces security posture
 * - Two cookies give us both security (server-side) and functionality (client-side)
 */

export function proxy(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const response = NextResponse.next();

  let hasClickId = false;

  for (const param of CLICK_ID_PARAMS) {
    const value = searchParams.get(param);
    if (value && value.length > 0 && value.length <= 500) {
      hasClickId = true;

      // Server-side cookie (httpOnly -- secure, for offline conversion scripts)
      response.cookies.set(`${COOKIE_PREFIX}${param}`, value, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      });

      // Client-side cookie (NOT httpOnly -- for Tally embed integration)
      response.cookies.set(`${COOKIE_PREFIX}${param}_js`, value, {
        httpOnly: false,
        secure: true,
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      });
    }
  }

  // Also store the landing page URL for attribution context
  if (hasClickId) {
    response.cookies.set(
      `${COOKIE_PREFIX}landing_page`,
      request.nextUrl.pathname,
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      }
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - images/ (public images directory)
     * - api/ (API routes, if any are added later)
     *
     * This ensures middleware runs on all page navigations (where click IDs
     * appear in the URL) but not on static asset requests (where they never do).
     */
    "/((?!_next/static|_next/image|favicon\\.ico|images/|api/).*)",
  ],
};
