import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from '@/components/providers'
import { MainNav } from '@/components/main-nav'

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Gymcats - PWA Gamificada de Saúde",
  description: "Aplicativo gamificado para hábitos saudáveis com pontuação e desafios",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#E75480",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <MainNav />
          <main className="pb-20 md:pb-0">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
