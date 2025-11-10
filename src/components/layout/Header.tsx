import Link from 'next/link';
import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-3 text-xl font-bold text-lokka-primary transition-colors hover:text-lokka-secondary"
          >
            <span>Place Analysis Løkka</span>
          </Link>
          <Navigation />
        </div>
      </div>
    </header>
  );
}
