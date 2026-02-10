/**
 * Phone Number Normalisation Utilities
 *
 * Normalises UK phone numbers to E.164 format (+44XXXXXXXXXX).
 * Both Twilio and WhatConverts may return numbers in different formats:
 *   - Twilio: usually E.164 already ("+447700900123")
 *   - WhatConverts: may use national format ("07700 900123") or E.164
 *
 * All phone numbers MUST be normalised before comparison.
 */

/**
 * Normalise a UK phone number to E.164 format.
 *
 * Handles these input formats:
 *   "+447700900123"   -> "+447700900123"  (already E.164)
 *   "447700900123"    -> "+447700900123"  (missing +)
 *   "07700900123"     -> "+447700900123"  (national format)
 *   "07700 900 123"   -> "+447700900123"  (national with spaces)
 *   "0800 316 2922"   -> "+448003162922"  (0800 number)
 *   "+44 7700 900123" -> "+447700900123"  (E.164 with spaces)
 *
 * For non-UK numbers (international callers), the number is returned
 * with a leading "+" if it starts with a country code, or as-is if
 * the format cannot be determined.
 *
 * @param phone - Phone number in any common UK format
 * @returns Phone number in E.164 format, or the cleaned input if format is unrecognised
 */
export function normaliseToE164(phone: string): string {
  if (!phone) return '';

  // Strip all non-digit characters except leading +
  let cleaned = phone.replace(/[^\d+]/g, '');

  // If it starts with +, keep it
  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  // UK national format: starts with 0 (e.g., "07700900123", "08003162922")
  if (cleaned.startsWith('0') && cleaned.length >= 10 && cleaned.length <= 11) {
    return '+44' + cleaned.substring(1);
  }

  // Starts with 44 (UK country code without +)
  if (cleaned.startsWith('44') && cleaned.length >= 11 && cleaned.length <= 13) {
    return '+' + cleaned;
  }

  // Unknown format -- return with + prefix if it looks like a full number
  if (cleaned.length >= 10) {
    return '+' + cleaned;
  }

  // Short or unrecognisable -- return as-is (will not match anything)
  return cleaned;
}

/**
 * Check if two E.164 phone numbers are the same caller.
 * Both inputs should already be normalised via normaliseToE164().
 */
export function phoneNumbersMatch(a: string, b: string): boolean {
  return a === b && a !== '' && b !== '';
}
