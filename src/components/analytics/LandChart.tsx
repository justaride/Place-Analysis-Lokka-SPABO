'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface LandData {
  land: string;
  prosent: number;
}

interface Props {
  data: LandData[];
  limit?: number;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16'];

export default function LandChart({ data, limit = 10 }: Props) {
  // Take top N countries
  const topCountries = [...data]
    .sort((a, b) => b.prosent - a.prosent)
    .slice(0, limit);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="mb-1 font-semibold text-gray-900">{payload[0].payload.land}</p>
          <p className="text-sm text-blue-600">
            {payload[0].value.toFixed(2)}% av internasjonale besøkende
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={topCountries}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            type="number"
            stroke="#6B7280"
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis
            type="category"
            dataKey="land"
            stroke="#6B7280"
            width={90}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="prosent" radius={[0, 4, 4, 0]}>
            {topCountries.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
        {topCountries.slice(0, 5).map((country, index) => (
          <div key={country.land} className="rounded-lg bg-gray-50 p-2">
            <div
              className="mx-auto mb-1 h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            />
            <p className="font-medium text-gray-700">{country.land}</p>
            <p className="text-lg font-bold text-gray-900">{country.prosent.toFixed(1)}%</p>
          </div>
        ))}
      </div>

      <div className="mt-3 text-center text-xs text-gray-500">
        <p>Internasjonale besøkende (Q2 2024)</p>
      </div>
    </div>
  );
}
