'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AldersData {
  mann: Array<{category: string; value: number}>;
  kvinne: Array<{category: string; value: number}>;
}

interface Props {
  data: AldersData;
}

export default function AldersfordelingPyramid({ data }: Props) {
  // Transform data for pyramid chart (negative values for left side)
  const pyramidData = data.mann.map((m, i) => ({
    category: m.category,
    mann: -m.value,  // Negative for left side of pyramid
    kvinne: data.kvinne[i]?.value || 0
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="mb-1 font-semibold text-gray-900">{payload[0].payload.category} år</p>
          <p className="text-sm text-blue-600">
            Mann: {Math.abs(payload[0].value)}
          </p>
          <p className="text-sm text-pink-600">
            Kvinne: {payload[1]?.value || 0}
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
          data={pyramidData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            type="number"
            tickFormatter={(value) => Math.abs(value).toString()}
            stroke="#6B7280"
          />
          <YAxis
            type="category"
            dataKey="category"
            stroke="#6B7280"
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => value === 'mann' ? 'Mann' : 'Kvinne'}
          />
          <Bar
            dataKey="mann"
            fill="#3B82F6"
            name="mann"
            radius={[4, 0, 0, 4]}
          />
          <Bar
            dataKey="kvinne"
            fill="#EC4899"
            name="kvinne"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Total: {data.mann.reduce((sum, a) => sum + a.value, 0)} menn, {data.kvinne.reduce((sum, a) => sum + a.value, 0)} kvinner</p>
      </div>
    </div>
  );
}
