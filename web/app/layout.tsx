import './globals.css';
import { Metadata } from 'next';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'Predinex',
  description: 'Decentralized Prediction Markets on Stacks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        {children}
        <Footer />
      </body>
    </html>
  );
}
