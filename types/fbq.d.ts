// Global type declaration for the Meta (Facebook) Pixel fbq function.
// The pixel script is loaded via next/script in app/layout.tsx; this
// declaration prevents TypeScript errors when calling window.fbq in
// client components that fire conversion events.
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

// Required to make this file a module (global augmentation must live in a module)
export {};
