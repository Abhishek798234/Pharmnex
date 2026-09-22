import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "PharmnEx — Pharmaceutical Supply Chain Intelligence",
    template: "%s | PharmnEx",
  },
  description:
    "Blockchain-secured, ML-powered pharmaceutical supply chain platform with fraud detection, counterfeit risk scoring, and demand forecasting. Built on Algorand.",
  keywords: [
    "pharmaceutical", "supply chain", "blockchain", "Algorand", "machine learning",
    "fraud detection", "counterfeit", "drug traceability", "PharmnEx",
  ],
  authors: [{ name: "PharmnEx" }],
  openGraph: {
    title: "PharmnEx — Pharmaceutical Supply Chain Intelligence",
    description: "Blockchain + ML pharmaceutical supply chain platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
