import type { Config } from "tailwindcss";

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
        'gray-dark': '#000000',      // Preto total para máximo contraste
        'gray-medium': '#333333',    // Cinza bem escuro
        'gray-text': '#1a1a1a',     // Quase preto
        'gray-light': '#F7FAFC',
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
    require('@tailwindcss/forms'),
  ],
};

export default config;
