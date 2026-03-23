import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StacksProvider } from "./components/StacksProvider";
import { ToastProvider } from "../providers/ToastProvider";
import Footer from "./components/Footer";
import ErrorBoundary from "../components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Predinex | Next-Gen Prediction Markets on Stacks",
  description: "The decentralized prediction market built for the Bitcoin economy. Predict, bet, and win on Stacks.",
  openGraph: {
    title: "Predinex | Next-Gen Prediction Markets on Stacks",
    description: "The decentralized prediction market built for the Bitcoin economy. Predict, bet, and win on Stacks.",
    url: "https://predinex.io",
    siteName: "Predinex",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Predinex - Prediction Markets on Stacks",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Predinex | Next-Gen Prediction Markets on Stacks",
    description: "Predict the future. Win on Bitcoin.",
    images: ["/og-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  category: "finance",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  keywords: ["Stacks", "Bitcoin", "Prediction Market", "DeFi", "Clarity", "Crypto", "Betting"],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary/30 selection:text-white`}
      >
        {/* Subtle noise texture */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

        <ErrorBoundary>
          <StacksProvider>
            <ToastProvider>
              {children}
              <Footer />
            </ToastProvider>
          </StacksProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
