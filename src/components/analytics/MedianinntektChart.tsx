'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MedianData {
  type: string;
  median: number;
}

interface Props {
  data: MedianData[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function MedianinntektChart({ data }: Props) {
  // Sort by median income descending
  const sortedData = [...data].sort((a, b) => b.median - a.median);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="mb-1 font-semibold text-gray-900">{payload[0].payload.type}</p>
          <p className="text-sm text-blue-600">
            NOK {payload[0].value.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">median årsinntekt</p>
        </div>
      );
    }
    return null;
  };

  const avgIncome = Math.round(data.reduce((sum, d) => sum + d.median, 0) / data.length);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            type="number"
            stroke="#6B7280"
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="type"
            stroke="#6B7280"
            width={140}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="median" radius={[0, 4, 4, 0]}>
            {sortedData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 rounded-lg bg-gray-50 p-4 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-gray-700">
          Gjennomsnittlig medianinntekt
        </p>
        <p className="mt-1 text-2xl font-bold text-gray-900">
          NOK {avgIncome.toLocaleString()}
        </p>
        <p className="text-xs text-gray-600">per husholdning per år</p>
      </div>
    </div>
  );
}
