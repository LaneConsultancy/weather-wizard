import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeKeyword(keyword: string | null): string | null {
  if (!keyword) return null;

  // Reject if input contains HTML tags (potential XSS)
  if (/<[^>]*>/.test(keyword)) {
    return null;
  }

  // Reject if input contains suspicious patterns
  const suspiciousPatterns = /[(){}\[\]]|javascript:|data:|on\w+=/i;
  if (suspiciousPatterns.test(keyword)) {
    return null;
  }

  // Remove any remaining potentially dangerous characters
  let sanitized = keyword.replace(/[<>'"&]/g, '');

  // Limit to 50 characters
  sanitized = sanitized.substring(0, 50);

  // Trim whitespace
  sanitized = sanitized.trim();

  // Reject if too short (likely garbage after sanitization)
  if (sanitized.length < 3) {
    return null;
  }

  return sanitized;
}

export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
