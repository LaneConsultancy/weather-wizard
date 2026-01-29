import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeKeyword(keyword: string | null): string | null {
  if (!keyword) return null;

  // Strip HTML tags
  let sanitized = keyword.replace(/<[^>]*>/g, '');

  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>'"&]/g, '');

  // Limit to 50 characters
  sanitized = sanitized.substring(0, 50);

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized || null;
}

export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
