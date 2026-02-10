/**
 * Utilities for reading ad platform click IDs stored by middleware.
 *
 * Click IDs are captured by middleware.ts and stored in cookies with
 * the prefix "ww_". Server-side cookies are httpOnly; client-side
 * cookies have the "_js" suffix and are readable via document.cookie.
 *
 * @see middleware.ts for cookie-setting logic
 */

// ---- Server-side (use in Server Components, Route Handlers, API routes) ----

import { cookies } from "next/headers";

export interface ClickIds {
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  msclkid: string | null;
  landingPage: string | null;
}

/**
 * Read captured click IDs from server-set httpOnly cookies.
 * Only works in Server Components, Route Handlers, and Middleware.
 */
export async function getServerClickIds(): Promise<ClickIds> {
  const cookieStore = await cookies();
  return {
    gclid: cookieStore.get("ww_gclid")?.value || null,
    gbraid: cookieStore.get("ww_gbraid")?.value || null,
    wbraid: cookieStore.get("ww_wbraid")?.value || null,
    msclkid: cookieStore.get("ww_msclkid")?.value || null,
    landingPage: cookieStore.get("ww_landing_page")?.value || null,
  };
}

// ---- Client-side (use in Client Components) ----

/**
 * Read a single click ID from client-accessible cookies.
 * Returns null if the cookie does not exist.
 */
export function getClientClickId(
  param: "gclid" | "gbraid" | "wbraid" | "msclkid"
): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )ww_${param}_js=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Read all click IDs from client-accessible cookies.
 */
export function getClientClickIds(): Omit<ClickIds, "landingPage"> {
  return {
    gclid: getClientClickId("gclid"),
    gbraid: getClientClickId("gbraid"),
    wbraid: getClientClickId("wbraid"),
    msclkid: getClientClickId("msclkid"),
  };
}
