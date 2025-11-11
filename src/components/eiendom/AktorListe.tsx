'use client';

import { useState } from 'react';

interface Aktor {
  rank: string;
  navn: string;
  type: string;
  adresse: string;
  kommune: string;
  omsetning: number | null;
  kjedeProsent: string | null;
  yoyVekst: number | null;
  ansatteLokalt: number | null;
  ansatteKjede: number | null;
  kjedeLokasjoner: number | null;
  markedsandel: number | null;
}

interface CategoryStats {
  count: number;
  totalRevenue: number;
  avgRevenue: number;
}

interface AktorListeProps {
  actors: Aktor[];
  categoryStats: Record<string, CategoryStats>;
  metadata: {
    totalActors: number;
    totalCategories: number;
    generatedAt: string;
  };
}

export default function AktorListe({ actors, categoryStats, metadata }: AktorListeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter actors by category
  const filteredActors = selectedCategory === 'all'
    ? actors
    : actors.filter(a => a.type === selectedCategory);

  // Top 3 categories by count
  const topCategories = Object.entries(categoryStats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 3);

  // Calculate total revenue
  const totalRevenue = actors.reduce((sum, a) => sum + (a.omsetning || 0), 0);

  return (
    <section className="border-t border-gray-200/30 bg-white py-16">
      <div className="mx-auto max-w-[1900px] px-[4vw]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-lokka-primary">Aktører i området</h2>
            <p className="text-sm text-lokka-secondary">
              Oversikt over {metadata.totalActors} bedrifter fordelt på {metadata.totalCategories} kategorier
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-lokka-primary transition-all hover:border-lokka-primary hover:bg-lokka-light"
            aria-expanded={isExpanded}
            aria-controls="aktor-liste"
          >
            {isExpanded ? 'Skjul liste' : 'Vis alle aktører'}
            <svg
              className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mb-12 grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white to-lokka-light p-6">
            <div className="mb-2 text-sm font-medium uppercase tracking-wider text-lokka-secondary">
              Totalt antall
            </div>
            <div className="text-4xl font-bold text-lokka-primary">{metadata.totalActors}</div>
            <div className="mt-2 text-sm text-lokka-accent">registrerte aktører</div>
          </div>

          <div className="rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white to-lokka-light p-6">
            <div className="mb-2 text-sm font-medium uppercase tracking-wider text-lokka-secondary">
              Total omsetning
            </div>
            <div className="text-4xl font-bold text-lokka-primary">{totalRevenue}</div>
            <div className="mt-2 text-sm text-lokka-accent">NOK millioner</div>
          </div>

          <div className="rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white to-lokka-light p-6">
            <div className="mb-2 text-sm font-medium uppercase tracking-wider text-lokka-secondary">
              Kategorier
            </div>
            <div className="text-4xl font-bold text-lokka-primary">{metadata.totalCategories}</div>
            <div className="mt-2 text-sm text-lokka-accent">ulike bransjer</div>
          </div>

          <div className="rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white to-lokka-light p-6">
            <div className="mb-2 text-sm font-medium uppercase tracking-wider text-lokka-secondary">
              Største aktør
            </div>
            <div className="text-lg font-bold text-lokka-primary">{actors[0]?.navn}</div>
            <div className="mt-2 text-sm text-lokka-accent">NOK {actors[0]?.omsetning} mill.</div>
          </div>
        </div>

        {/* Top 3 Categories */}
        <div className="mb-12">
          <h3 className="mb-6 text-xl font-bold text-lokka-primary">Største kategorier</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {topCategories.map(([category, stats], index) => (
              <div
                key={category}
                className="rounded-xl border border-gray-200/50 bg-white p-6 shadow-soft"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xl font-bold text-lokka-primary">#{index + 1}</span>
                  <span className="rounded-full bg-lokka-light px-3 py-1 text-sm font-medium text-lokka-secondary">
                    {stats.count} bedrifter
                  </span>
                </div>
                <div className="mb-2 text-base font-semibold text-lokka-primary">{category}</div>
                <div className="text-sm text-lokka-accent">
                  Snitt omsetning: NOK {Math.round(stats.avgRevenue)} mill.
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label htmlFor="category-filter" className="mb-3 block text-sm font-medium text-lokka-secondary">
            Filtrer etter kategori:
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-lokka-primary transition-colors hover:border-lokka-primary focus:border-lokka-primary focus:outline-none focus:ring-2 focus:ring-lokka-primary/20 md:w-auto"
          >
            <option value="all">Alle kategorier ({metadata.totalActors})</option>
            {Object.entries(categoryStats)
              .sort((a, b) => b[1].count - a[1].count)
              .map(([category, stats]) => (
                <option key={category} value={category}>
                  {category} ({stats.count})
                </option>
              ))}
          </select>
          {selectedCategory !== 'all' && (
            <span className="ml-4 text-sm text-lokka-secondary">
              Viser {filteredActors.length} av {metadata.totalActors} aktører
            </span>
          )}
        </div>

        {/* Collapsible Table */}
        <div
          id="aktor-liste"
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="overflow-x-auto rounded-2xl border border-gray-200/50 bg-white shadow-soft">
            <table className="w-full">
              <thead className="border-b border-gray-200/50 bg-lokka-light">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-lokka-secondary">
                    Rang
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-lokka-secondary">
                    Navn
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-lokka-secondary">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-lokka-secondary">
                    Adresse
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-lokka-secondary">
                    Omsetning
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-lokka-secondary">
                    Vekst
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-lokka-secondary">
                    Ansatte
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-lokka-secondary">
                    Markedsandel
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/30">
                {filteredActors.map((aktor, index) => (
                  <tr
                    key={index}
                    className="transition-colors hover:bg-lokka-light/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-lokka-primary">
                      {aktor.rank}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-lokka-primary">
                      {aktor.navn}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-lokka-secondary">
                      {aktor.type}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-lokka-secondary">
                      {aktor.adresse}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="font-medium text-lokka-primary">
                        {aktor.omsetning ? `${aktor.omsetning} mill.` : '-'}
                      </div>
                      {aktor.kjedeProsent && (
                        <div className="text-xs text-lokka-accent">
                          {aktor.kjedeProsent} av kjede
                        </div>
                      )}
                    </td>
                    <td
                      className={`whitespace-nowrap px-6 py-4 text-right text-sm font-semibold ${
                        aktor.yoyVekst === null
                          ? 'text-lokka-secondary'
                          : aktor.yoyVekst < 0
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {aktor.yoyVekst !== null ? `${aktor.yoyVekst > 0 ? '+' : ''}${aktor.yoyVekst}%` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="font-medium text-lokka-primary">
                        {aktor.ansatteLokalt !== null ? aktor.ansatteLokalt : '-'}
                      </div>
                      {aktor.ansatteKjede && aktor.kjedeLokasjoner && (
                        <div className="text-xs text-lokka-accent">
                          {aktor.ansatteKjede} i {aktor.kjedeLokasjoner} lok.
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-lokka-primary">
                      {aktor.markedsandel !== null ? `${aktor.markedsandel.toFixed(2)}%` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Distribution (always visible) */}
        <div className="mt-12">
          <h3 className="mb-6 text-xl font-bold text-lokka-primary">Fordeling per kategori</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(categoryStats)
              .sort((a, b) => b[1].count - a[1].count)
              .map(([category, stats]) => {
                const percentage = (stats.count / metadata.totalActors) * 100;
                return (
                  <div
                    key={category}
                    className="group cursor-pointer rounded-lg border border-gray-200/50 bg-white p-4 transition-all hover:border-lokka-primary hover:shadow-medium"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-lokka-primary">{category}</span>
                      <span className="text-xs text-lokka-accent">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="mb-2 h-2 overflow-hidden rounded-full bg-lokka-light">
                      <div
                        className="h-full rounded-full bg-lokka-primary transition-all group-hover:bg-lokka-secondary"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-lokka-secondary">
                      <span>{stats.count} bedrifter</span>
                      <span>Ø {Math.round(stats.avgRevenue)} mill.</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}
