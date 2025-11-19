'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BesøkData {
  dag: string;
  besøkende: number;
  påJobb: number;
  hjemme: number;
}

interface Props {
  data: BesøkData[];
}

const norwegianDays: Record<string, string> = {
  'man.': 'Mandag',
  'tir.': 'Tirsdag',
  'ons.': 'Onsdag',
  'tor.': 'Torsdag',
  'fre.': 'Fredag',
  'lør.': 'Lørdag',
  'søn.': 'Søndag'
};

export default function BesoksmønsterUkedag({ data }: Props) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const fullDay = norwegianDays[label] || label;
      const total = payload.reduce((sum: number, p: any) => sum + p.value, 0);

      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="mb-2 font-semibold text-gray-900">{fullDay}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-sm" style={{ color: p.color }}>
              {p.name}: {p.value.toLocaleString()} ({((p.value / total) * 100).toFixed(0)}%)
            </p>
          ))}
          <p className="mt-1 border-t pt-1 text-sm font-semibold text-gray-900">
            Total: {total.toLocaleString()} besøk
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
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="dag"
            stroke="#6B7280"
            tickFormatter={(value) => norwegianDays[value] || value}
          />
          <YAxis
            stroke="#6B7280"
            label={{ value: 'Antall besøk', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => {
              if (value === 'besøkende') return 'Besøkende';
              if (value === 'påJobb') return 'På jobb';
              if (value === 'hjemme') return 'Hjemme';
              return value;
            }}
          />
          <Bar
            dataKey="besøkende"
            stackId="a"
            fill="#10B981"
            name="besøkende"
          />
          <Bar
            dataKey="påJobb"
            stackId="a"
            fill="#3B82F6"
            name="påJobb"
          />
          <Bar
            dataKey="hjemme"
            stackId="a"
            fill="#F59E0B"
            name="hjemme"
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Gjennomsnittlig daglig besøk per ukedag (01.01.2023 - 30.09.2025)</p>
      </div>
    </div>
  );
}
