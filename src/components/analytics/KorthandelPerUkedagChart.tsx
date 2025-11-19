'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UkedagData {
  [key: string]: {
    [year: string]: number;
  };
}

interface Props {
  data: UkedagData;
}

const YEAR_COLORS: Record<string, string> = {
  '2019': '#EF4444',
  '2020': '#F97316',
  '2021': '#F59E0B',
  '2022': '#10B981',
  '2023': '#3B82F6',
  '2024': '#6366F1',
  '2025': '#8B5CF6'
};

const norwegianDays: Record<string, string> = {
  'Monday': 'Mandag',
  'Tuesday': 'Tirsdag',
  'Wednesday': 'Onsdag',
  'Thursday': 'Torsdag',
  'Friday': 'Fredag',
  'Saturday': 'Lørdag',
  'Sunday': 'Søndag'
};

export default function KorthandelPerUkedagChart({ data }: Props) {
  // Transform data for recharts
  const chartData = Object.entries(data).map(([day, years]) => ({
    dag: norwegianDays[day] || day,
    ...years
  }));

  const firstDay = Object.keys(data)[0];
  const years = firstDay && data[firstDay] ? Object.keys(data[firstDay]) : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="mb-2 font-semibold text-gray-900">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-sm" style={{ color: p.color }}>
              {p.name}: NOK {p.value.toFixed(2)}M
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="dag"
            stroke="#6B7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{ value: 'Omsetning (mill NOK)', angle: -90, position: 'insideLeft' }}
            stroke="#6B7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {years.map((year) => (
            <Line
              key={year}
              type="monotone"
              dataKey={year}
              stroke={YEAR_COLORS[year] || '#9CA3AF'}
              strokeWidth={2}
              dot={{ r: 3 }}
              name={year}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Gjennomsnittlig daglig korthandel per ukedag (2019-2025)</p>
        <p className="mt-1 text-xs text-gray-500">
          Viser utviklingstrender over flere år
        </p>
      </div>
    </div>
  );
}
