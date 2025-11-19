'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface OpprinnelseData {
  område: string;
  prosent: number;
}

interface Props {
  data: OpprinnelseData[];
  limit?: number;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16'];

export default function OpprinnelseChart({ data, limit = 10 }: Props) {
  // Take top N areas
  const topAreas = [...data]
    .sort((a, b) => b.prosent - a.prosent)
    .slice(0, limit);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="mb-1 font-semibold text-gray-900">{payload[0].payload.område}</p>
          <p className="text-sm text-blue-600">
            {payload[0].value.toFixed(2)}% av besøkende
          </p>
        </div>
      );
    }
    return null;
  };

  const topThree = topAreas.slice(0, 3);
  const total = topThree.reduce((sum, area) => sum + area.prosent, 0);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={topAreas}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            type="number"
            stroke="#6B7280"
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis
            type="category"
            dataKey="område"
            stroke="#6B7280"
            width={110}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="prosent" radius={[0, 4, 4, 0]}>
            {topAreas.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-center text-sm text-gray-600">
        <p className="mb-3 font-medium">Topp 3 områder</p>
        <div className="grid grid-cols-3 gap-3">
          {topThree.map((area, index) => (
            <div key={area.område} className="rounded-lg bg-gray-50 p-3">
              <div className="mb-1 flex items-center justify-center gap-2">
                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
              </div>
              <p className="text-xs font-medium text-gray-700">{area.område}</p>
              <p className="text-xl font-bold text-gray-900">{area.prosent.toFixed(1)}%</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Topp 3 utgjør {total.toFixed(1)}% av alle besøk
        </p>
      </div>
    </div>
  );
}
