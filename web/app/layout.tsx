import type { Metadata } from "next";
import "./globals.css";
import { StacksProvider } from "./components/StacksProvider";
import { WalletConnectProvider } from "./context/WalletConnectContext";
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
          <WalletConnectProvider>
            <StacksProvider>
              {children}
            </StacksProvider>
          </WalletConnectProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
