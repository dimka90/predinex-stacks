import type { Metadata } from "next";
import "./globals.css";
import { StacksProvider } from "./components/StacksProvider";
import { WalletConnectProvider } from "./context/WalletConnectContext";
import { ThemeProvider } from "./context/ThemeContext";
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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ErrorBoundary>
          <ThemeProvider>
            <WalletConnectProvider>
              <StacksProvider>
                {children}
              </StacksProvider>
            </WalletConnectProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
// Layout integration improvement 1
// Layout integration improvement 2
// Layout integration improvement 3
