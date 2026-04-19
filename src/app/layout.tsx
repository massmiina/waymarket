import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit, Cinzel, Tenor_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { MarketProvider } from "@/contexts/MarketContext";
import MobileNavbar from "@/components/Navbar"; // Keep for mobile logic if separate
import Navbar from "@/components/Navbar";
import "@uploadthing/react/styles.css";

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

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const tenorSans = Tenor_Sans({
  variable: "--font-tenor-sans",
  weight: "400",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${cinzel.variable} ${tenorSans.variable} ${playfair.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col antialiased">
          <MarketProvider>
            <Navbar />
            {children}
            <div className="sm:hidden">
              <MobileNavbar />
            </div>
          </MarketProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
