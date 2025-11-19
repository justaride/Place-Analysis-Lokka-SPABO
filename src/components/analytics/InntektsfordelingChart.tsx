'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InntektData {
  category: string;
  value: number;
}

interface Props {
  data: InntektData[];
}

export default function InntektsfordelingChart({ data }: Props) {
  // Sort by value descending
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="mb-1 font-semibold text-gray-900">{payload[0].payload.category}</p>
          <p className="text-sm text-green-600">
            {payload[0].value.toFixed(0)} personer
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
          data={sortedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="category"
            angle={-45}
            textAnchor="end"
            height={100}
            stroke="#6B7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis stroke="#6B7280" />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            fill="#10B981"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Total befolkning: {data.reduce((sum, d) => sum + d.value, 0).toFixed(0)} personer</p>
      </div>
    </div>
  );
}
