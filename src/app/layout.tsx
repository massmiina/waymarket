import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MarketProvider } from "@/contexts/MarketContext";

import { ClerkProvider } from '@clerk/nextjs'
import { frFR } from '@clerk/localizations'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Way Market",
  description: "Marketplace d'annonces locales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={frFR}>
      <html
        lang="fr"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
          <MarketProvider>
            {children}
          </MarketProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
