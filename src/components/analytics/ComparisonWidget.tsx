'use client';

import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Link from 'next/link';

interface ComparisonData {
  metric: string;
  oneMin: number | string;
  fiveMin: number | string;
  unit?: string;
  format?: 'number' | 'percent' | 'currency';
}

interface Props {
  propertyId: string;
  comparisons: ComparisonData[];
}

export default function ComparisonWidget({ propertyId, comparisons }: Props) {
  const formatValue = (value: number | string, format?: string) => {
    if (typeof value === 'string') return value;

    switch (format) {
      case 'number':
        return value.toLocaleString();
      case 'percent':
        return `${value}%`;
      case 'currency':
        return `NOK ${value.toLocaleString()}M`;
      default:
        return value.toLocaleString();
    }
  };

  const getChange = (oneMin: number | string, fiveMin: number | string) => {
    if (typeof oneMin === 'string' || typeof fiveMin === 'string') return null;

    const diff = ((oneMin - fiveMin) / fiveMin) * 100;
    return diff;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow-medium">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Sammenligning: 1min vs 5min gangeavstand
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Se hvordan området endrer seg med større radius
          </p>
        </div>
        <Link
          href={`/eiendommer/${propertyId}/5min-gange`}
          className="group flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg"
        >
          Se 5min analyse
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="pb-3 pr-4 text-left text-sm font-semibold text-gray-700">
                Nøkkeltall
              </th>
              <th className="px-4 pb-3 text-right text-sm font-semibold text-blue-600">
                1 minutt
              </th>
              <th className="px-4 pb-3 text-right text-sm font-semibold text-purple-600">
                5 minutter
              </th>
              <th className="pl-4 pb-3 text-right text-sm font-semibold text-gray-700">
                Endring
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {comparisons.map((comp, index) => {
              const change = getChange(comp.oneMin, comp.fiveMin);

              return (
                <tr key={index} className="transition-colors hover:bg-white/50">
                  <td className="py-3 pr-4 text-sm font-medium text-gray-700">
                    {comp.metric}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-blue-600">
                    {formatValue(comp.oneMin, comp.format)}
                    {comp.unit && ` ${comp.unit}`}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-purple-600">
                    {formatValue(comp.fiveMin, comp.format)}
                    {comp.unit && ` ${comp.unit}`}
                  </td>
                  <td className="pl-4 py-3 text-right">
                    {change !== null ? (
                      <div className={`flex items-center justify-end gap-1 text-sm font-medium ${
                        Math.abs(change) < 1 ? 'text-gray-500' :
                        change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.abs(change) < 1 ? (
                          <Minus className="h-3 w-3" />
                        ) : change > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(change) < 1 ? '~0' : `${change > 0 ? '+' : ''}${change.toFixed(0)}`}%
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-lg bg-blue-50/50 p-3">
        <p className="text-xs text-gray-600">
          <strong>Tips:</strong> 1-minutters radius gir mer presis lokal analyse,
          mens 5-minutters radius viser bredere områdekarakteristikk og handelsmønster.
        </p>
      </div>
    </div>
  );
}
