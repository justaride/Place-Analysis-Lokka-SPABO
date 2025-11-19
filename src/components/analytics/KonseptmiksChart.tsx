'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface KonseptData {
  kategori1: string;
  kategori2: string;
  antall: number;
}

interface Props {
  data: KonseptData[];
}

const COLORS: Record<string, string> = {
  'Mat og opplevelser': '#10B981',
  'Handel': '#3B82F6',
  'Tjenester': '#F59E0B'
};

export default function KonseptmiksChart({ data }: Props) {
  // Group by kategori1 and calculate totals
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.kategori1]) {
      acc[item.kategori1] = {
        kategori: item.kategori1,
        antall: 0,
        subkategorier: []
      };
    }
    const group = acc[item.kategori1];
    if (group) {
      group.antall += item.antall;
      group.subkategorier.push({
        navn: item.kategori2,
        antall: item.antall
      });
    }
    return acc;
  }, {} as Record<string, { kategori: string; antall: number; subkategorier: Array<{ navn: string; antall: number }> }>);

  const chartData = Object.values(groupedData).sort((a, b) => b.antall - a.antall);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const subkategorier = groupedData[data.kategori]?.subkategorier || [];

      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="mb-2 font-semibold text-gray-900">{data.kategori}</p>
          <p className="mb-2 text-sm font-medium text-gray-700">
            Total: {data.antall} konsepter
          </p>
          <div className="border-t pt-2">
            {subkategorier.map((sub: any, i: number) => (
              <p key={i} className="text-xs text-gray-600">
                • {sub.navn}: {sub.antall}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const total = chartData.reduce((sum, item) => sum + item.antall, 0);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="kategori"
            stroke="#6B7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke="#6B7280"
            label={{ value: 'Antall konsepter', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="antall" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.kategori] || '#9CA3AF'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        {chartData.map((item) => {
          const percentage = ((item.antall / total) * 100).toFixed(0);
          return (
            <div key={item.kategori} className="rounded-lg bg-gray-50 p-3">
              <div className="mb-1 flex items-center justify-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[item.kategori] }}
                />
                <p className="text-xs font-medium text-gray-600">{item.kategori}</p>
              </div>
              <p className="text-xl font-bold text-gray-900">{item.antall}</p>
              <p className="text-xs text-gray-500">{percentage}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
