'use client';

import Link from 'next/link';
import { PlaaceAnalyse } from '@/types/eiendom';
import FadeIn from '@/components/ui/FadeIn';

interface AnalyseNavigationProps {
  propertyId: string;
  analyses: PlaaceAnalyse[];
  currentAnalyseId: string;
}

export default function AnalyseNavigation({
  propertyId,
  analyses,
  currentAnalyseId
}: AnalyseNavigationProps) {
  // Only show navigation if there are multiple analyses
  if (!analyses || analyses.length <= 1) {
    return null;
  }

  return (
    <section className="border-b border-gray-200/30 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 py-6 md:py-8">
      <div className="mx-auto max-w-[1900px] px-4 md:px-[4vw]">
        <FadeIn direction="up">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-lokka-primary md:text-xl">
              Velg analyse
            </h2>
            <p className="mt-1 text-xs text-lokka-secondary md:text-sm">
              Ulike analyser basert på gangeavstand
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {analyses.map((analyse) => {
              const isActive = analyse.id === currentAnalyseId;

              return (
                <Link
                  key={analyse.id}
                  href={`/eiendommer/${propertyId}/${analyse.id}`}
                  className={`group relative overflow-hidden rounded-xl px-6 py-4 text-sm font-medium transition-all md:px-8 md:py-5 md:text-base ${
                    isActive
                      ? 'bg-lokka-primary text-white shadow-medium'
                      : 'bg-white text-lokka-secondary shadow-soft hover:bg-gray-50 hover:shadow-medium'
                  }`}
                >
                  <div className="relative z-10">
                    <div className="font-semibold">{analyse.tittel}</div>
                    {analyse.parametere?.gangeavstand && (
                      <div className={`text-xs opacity-90 ${isActive ? 'text-white/90' : 'text-lokka-accent'}`}>
                        {analyse.parametere.gangeavstand}
                      </div>
                    )}
                  </div>

                  {/* Hover effect */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Optional description of current analysis */}
          {analyses.find(a => a.id === currentAnalyseId)?.beskrivelse && (
            <div className="mt-4 rounded-lg bg-white/60 p-4 backdrop-blur">
              <p className="text-sm text-lokka-secondary">
                {analyses.find(a => a.id === currentAnalyseId)?.beskrivelse}
              </p>
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
