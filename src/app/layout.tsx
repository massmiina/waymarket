import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MarketProvider } from "@/contexts/MarketContext";
import MobileNavbar from "@/components/MobileNavbar";

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
  title: "Way Market | Le Prestige du Commerce Caucasien",
  description: "Découvrez Way Market, la marketplace d'élite pour l'achat et la vente de biens d'exception. Véhicules, immobilier, luxe et produits locaux au cœur du terroir.",
  keywords: ["marketplace", "caucase", "annonces", "véhicules", "immobilier", "Way Market"],
  openGraph: {
    title: "Way Market | Le Prestige du Commerce Caucasien",
    description: "La marketplace d'exception pour vos annonces locales.",
    images: ["/images/tower-logo-v7.png"],
  }
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
        <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 pb-20 sm:pb-0">
          <MarketProvider>
            {children}
            <MobileNavbar />
          </MarketProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
