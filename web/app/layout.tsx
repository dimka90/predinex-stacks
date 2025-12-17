import type { Metadata } from "next";
import "./globals.css";
import { StacksProvider } from "./components/StacksProvider";
import ErrorBoundary from "./components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Predinex - Prediction Market",
  description: "Decentralized Prediction Market on Stacks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundary>
          <StacksProvider>
            {children}
          </StacksProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
