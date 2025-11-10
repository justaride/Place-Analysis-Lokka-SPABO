import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Place Analysis Løkka',
    template: '%s | Place Analysis Løkka',
  },
  description: 'Placeanalyser og eiendomsinformasjon for Løkka-området',
  keywords: ['Løkka', 'eiendom', 'placeanalyse', 'Oslo', 'gårdeierforening'],
  authors: [{ name: 'Løkka Gårdeierforening' }],
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    siteName: 'Place Analysis Løkka',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-lokka-light text-lokka-neutral antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
