'use client';

import { TrendingUp, TrendingDown, Users, ShoppingBag, Activity, Globe } from 'lucide-react';

interface SummaryData {
  befolkning: number;
  dagligOmsetning: string;
  dagligBesøk: number;
  konseptTetthet: number;
  internasjonaleProsent?: number;
  trendKorthandel: number;
  trendKonsepter: number;
}

interface Props {
  data: SummaryData;
}

export default function ExecutiveSummary({ data }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200/50 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 p-6 shadow-xl md:p-8">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="relative">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full bg-blue-600 p-2">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Nøkkeltall
            </h2>
            <p className="text-sm text-gray-600">
              1 minutts gangeavstand • ~80 meter radius
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Befolkning */}
          <div className="group rounded-2xl border border-gray-200/50 bg-white/80 p-5 backdrop-blur-sm transition-all hover:shadow-lg hover:scale-[1.02]">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-lg bg-blue-100 p-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {data.befolkning.toLocaleString()}
            </div>
            <div className="mt-1 text-sm font-medium text-gray-600">
              Innbyggere
            </div>
            <div className="mt-2 text-xs text-gray-500">
              25,500 per km²
            </div>
          </div>

          {/* Daglig omsetning */}
          <div className="group rounded-2xl border border-gray-200/50 bg-white/80 p-5 backdrop-blur-sm transition-all hover:shadow-lg hover:scale-[1.02]">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-lg bg-green-100 p-2">
                <ShoppingBag className="h-5 w-5 text-green-600" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${data.trendKorthandel < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {data.trendKorthandel < 0 ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <TrendingUp className="h-3 w-3" />
                )}
                {Math.abs(data.trendKorthandel)}%
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              NOK {data.dagligOmsetning}M
            </div>
            <div className="mt-1 text-sm font-medium text-gray-600">
              Daglig omsetning
            </div>
            <div className="mt-2 text-xs text-gray-500">
              30 dagers trend
            </div>
          </div>

          {/* Daglige besøk */}
          <div className="group rounded-2xl border border-gray-200/50 bg-white/80 p-5 backdrop-blur-sm transition-all hover:shadow-lg hover:scale-[1.02]">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-lg bg-orange-100 p-2">
                <Activity className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {data.dagligBesøk.toLocaleString()}
            </div>
            <div className="mt-1 text-sm font-medium text-gray-600">
              Besøk per dag
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Gjennomsnitt 2023-2025
            </div>
          </div>

          {/* Konsepttetthet */}
          <div className="group rounded-2xl border border-gray-200/50 bg-white/80 p-5 backdrop-blur-sm transition-all hover:shadow-lg hover:scale-[1.02]">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-lg bg-purple-100 p-2">
                <ShoppingBag className="h-5 w-5 text-purple-600" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${data.trendKonsepter < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {data.trendKonsepter < 0 ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <TrendingUp className="h-3 w-3" />
                )}
                {Math.abs(data.trendKonsepter)}%
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {data.konseptTetthet}
            </div>
            <div className="mt-1 text-sm font-medium text-gray-600">
              Konsepter per km²
            </div>
            <div className="mt-2 text-xs text-gray-500">
              19 totalt i området
            </div>
          </div>

          {/* Internasjonale besøkende */}
          {data.internasjonaleProsent && (
            <div className="group rounded-2xl border border-gray-200/50 bg-white/80 p-5 backdrop-blur-sm transition-all hover:shadow-lg hover:scale-[1.02] sm:col-span-2 lg:col-span-1">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-indigo-100 p-2">
                  <Globe className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {data.internasjonaleProsent.toFixed(1)}%
              </div>
              <div className="mt-1 text-sm font-medium text-gray-600">
                Internasjonale besøk
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Topp 3: Danmark, Sverige, Tyskland
              </div>
            </div>
          )}
        </div>

        {/* Bottom insight bar */}
        <div className="mt-6 rounded-xl bg-blue-50/50 border border-blue-100 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-100 p-2 mt-0.5">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Nøkkelinnsikt
              </h3>
              <p className="mt-1 text-sm text-gray-700">
                Området har ekstremt høy tetthet med <strong>770 konsepter/km²</strong> og
                <strong> NOK 7.6 mrd/km²</strong> i omsetning. Lørdag er travleste dag med
                <strong> 18% av ukens besøk</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
