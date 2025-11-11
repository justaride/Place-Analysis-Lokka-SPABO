import Link from 'next/link';
import Image from 'next/image';
import type { Eiendom } from '@/types/eiendom';

interface EiendomCardProps {
  eiendom: Eiendom;
}

export default function EiendomCard({ eiendom }: EiendomCardProps) {
  return (
    <Link href={`/eiendommer/${eiendom.id}`} className="group">
      <div className="h-full rounded-2xl border border-gray-200/50 bg-white overflow-hidden shadow-soft transition-all duration-300 hover:shadow-large hover:-translate-y-1">
        {/* Hero Image */}
        {eiendom.heroImage && (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
            <Image
              src={eiendom.heroImage}
              alt={eiendom.adresse}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-lokka-primary mb-3 group-hover:text-lokka-secondary transition-colors">
              {eiendom.adresse}
            </h3>
            <div className="flex gap-3 text-xs">
              <span className="rounded-full bg-lokka-secondary/10 px-3 py-1.5 font-medium text-lokka-secondary">
                Gnr: {eiendom.gnr}
              </span>
              <span className="rounded-full bg-lokka-secondary/10 px-3 py-1.5 font-medium text-lokka-secondary">
                Bnr: {eiendom.bnr}
              </span>
            </div>
          </div>

          {/* Description */}
          {eiendom.beskrivelse && (
            <p className="mb-6 line-clamp-5 text-sm leading-relaxed text-lokka-neutral">
              {eiendom.beskrivelse}
            </p>
          )}

          {/* CTA */}
          <div className="mt-8 flex items-center gap-2 text-sm font-medium text-lokka-primary group-hover:gap-3 transition-all">
            <span>Se detaljer</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
