import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2e42',
          50: '#f4f7f9',
          100: '#e8eef3',
          200: '#c5d5e1',
          300: '#a2bccf',
          400: '#5c8aab',
          500: '#1a2e42',
          600: '#17293b',
          700: '#132231',
          800: '#0f1b27',
          900: '#0c1620',
        },
        teal: {
          DEFAULT: '#5ba8a0',
          50: '#f0f9f8',
          100: '#d9f0ee',
          200: '#b3e1dd',
          300: '#8dd2cc',
          400: '#74bdb6',
          500: '#5ba8a0',
          600: '#4a8680',
          700: '#3a6660',
          800: '#2a4740',
          900: '#1a2820',
        },
        gold: {
          DEFAULT: '#d4af37',
          50: '#fdfbf5',
          100: '#faf7eb',
          200: '#f3ebcc',
          300: '#ecdfad',
          400: '#ddc76f',
          500: '#d4af37',
          600: '#bf9e32',
          700: '#9f842a',
          800: '#7f6921',
          900: '#67561b',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
