import type { Config } from "tailwindcss";
import forms from '@tailwindcss/forms';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Gymcats brand colors
        'pink-pastel': '#FADADD',
        'pink-burnt': '#E75480',
        'pink-medium': '#FF69B4',
        'pink-hot': '#FF1493',
        'gray-dark': 'var(--gray-dark)',      // Use CSS variable for consistency
        'gray-medium': 'var(--gray-medium)',  // Use CSS variable for consistency
        'gray-text': 'var(--gray-text)',     // Use CSS variable for consistency
        'gray-light': 'var(--gray-light)',
        'gray-border': 'var(--gray-border)',
      },
      fontFamily: {
        'cat': ['Comic Sans MS', 'cursive'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-pink': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    forms,
  ],
};

export default config;
