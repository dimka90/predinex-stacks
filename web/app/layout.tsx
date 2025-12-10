import type { Metadata } from "next";
import "./globals.css";
import { StacksProvider } from "./components/StacksProvider";

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
        <StacksProvider>
          {children}
        </StacksProvider>
      </body>
    </html>
  );
}
