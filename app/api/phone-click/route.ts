/**
 * Phone Click Event Endpoint
 *
 * Receives a fire-and-forget beacon from PhoneLink when a user clicks a
 * phone number on the site. If a gclid or msclkid is present in the
 * current browser session (captured at ad-click time) we persist it here
 * so it can later be matched against Twilio inbound call logs and uploaded
 * to Google Ads as an offline click conversion.
 *
 * POST /api/phone-click
 * Body: { gclid?, msclkid?, timestamp, page }
 *
 * Response: 200 OK (always, even for bad input — the beacon pattern means
 * we can't surface errors to the user anyway, and we don't want to lose
 * the record over a validation edge case).
 *
 * Storage: data/phone-clicks.json — a JSON array of PhoneClickRecord objects.
 * The file is append-only; the import-call-conversions.ts script reads it.
 *
 * Security: No auth required — this endpoint records nothing sensitive.
 * The worst-case abuse is noise in phone-clicks.json, which the matching
 * script filters out (clicks without valid gclids are skipped entirely).
 */

import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PhoneClickRequestBody {
  gclid?: string;
  msclkid?: string;
  /** ISO 8601 timestamp from the browser at click time */
  timestamp?: string;
  /** The page URL or pathname where the click occurred */
  page?: string;
}

export interface PhoneClickRecord {
  /** Unique ID for deduplication — generated server-side */
  id: string;
  gclid?: string;
  msclkid?: string;
  /** ISO timestamp from the client (browser clock) */
  timestamp: string;
  /** Server-side ISO timestamp for auditing */
  createdAt: string;
  /** Page pathname where the click occurred */
  page: string;
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

const DATA_DIR = path.resolve(process.cwd(), 'data');
const PHONE_CLICKS_FILE = path.join(DATA_DIR, 'phone-clicks.json');

/**
 * Append a single click record to phone-clicks.json.
 * Creates the file (and data/ directory) if they don't already exist.
 * Reads the existing array, pushes, and re-writes atomically enough
 * for our low-volume use case.
 */
function appendPhoneClick(record: PhoneClickRecord): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  let records: PhoneClickRecord[] = [];
  try {
    const raw = fs.readFileSync(PHONE_CLICKS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      records = parsed;
    }
  } catch {
    // File missing or corrupt — start with an empty array
  }

  records.push(record);
  fs.writeFileSync(PHONE_CLICKS_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

/**
 * Validate a gclid string.
 * Accepts the common "CjABC..." prefix as well as numeric / base64-style IDs.
 * Minimum length guards against single-character junk; the alphanumeric
 * pattern guards against injection attempts.
 */
function isValidGclid(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length < 20 || trimmed.length > 512) return false;
  return /^[A-Za-z0-9\-_]+$/.test(trimmed);
}

/**
 * Validate a msclkid string.
 * Microsoft click IDs are hex-like alphanumeric strings with no hyphens.
 */
function isValidMsclkid(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length < 20 || trimmed.length > 512) return false;
  return /^[A-Za-z0-9]+$/.test(trimmed);
}

/**
 * Validate an ISO 8601 timestamp string from the client.
 * We accept it if Date.parse succeeds; we fall back to server time otherwise.
 */
function parseClientTimestamp(value: unknown): string {
  if (typeof value === 'string') {
    const ms = Date.parse(value);
    if (!isNaN(ms)) return new Date(ms).toISOString();
  }
  return new Date().toISOString();
}

/**
 * Sanitise the page value.
 * We accept up to 512 characters; anything else gets truncated.
 */
function sanitisePage(value: unknown): string {
  if (typeof value !== 'string' || value.trim() === '') return '/';
  return value.trim().slice(0, 512);
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: PhoneClickRequestBody;

  try {
    body = await request.json();
  } catch {
    // Malformed JSON — return 200 anyway so the beacon doesn't retry
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const gclid = isValidGclid(body.gclid) ? body.gclid!.trim() : undefined;
  const msclkid = isValidMsclkid(body.msclkid) ? body.msclkid!.trim() : undefined;

  // If neither click ID is present there is nothing worth storing.
  // Organic clicks won't have gclid/msclkid so this is the common path.
  if (!gclid && !msclkid) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const record: PhoneClickRecord = {
    id: crypto.randomUUID(),
    ...(gclid ? { gclid } : {}),
    ...(msclkid ? { msclkid } : {}),
    timestamp: parseClientTimestamp(body.timestamp),
    createdAt: new Date().toISOString(),
    page: sanitisePage(body.page),
  };

  try {
    appendPhoneClick(record);
  } catch (error) {
    // Log for debugging but still return 200 — the beacon cannot be retried
    console.error('[phone-click] Failed to write record:', error, record);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
