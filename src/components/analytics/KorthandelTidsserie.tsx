'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TidsserieData {
  date: string;
  mat_opplevelser: number;
  handel: number;
  tjenester: number;
}

interface Props {
  data: TidsserieData[];
}

export default function KorthandelTidsserie({ data }: Props) {
  const [aggregation, setAggregation] = useState<'daily' | 'monthly' | 'yearly'>('monthly');

  // Aggregate data
  const aggregatedData = useMemo(() => {
    if (aggregation === 'daily') {
      return data;
    }

    const grouped: Record<string, {date: string; mat_opplevelser: number; handel: number; tjenester: number; count: number}> = {};

    data.forEach(d => {
      const date = new Date(d.date);
      let key: string;

      if (aggregation === 'monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else { // yearly
        key = `${date.getFullYear()}`;
      }

      if (!grouped[key]) {
        grouped[key] = {
          date: key,
          mat_opplevelser: 0,
          handel: 0,
          tjenester: 0,
          count: 0
        };
      }

      const group = grouped[key];
      if (group) {
        group.mat_opplevelser += d.mat_opplevelser;
        group.handel += d.handel;
        group.tjenester += d.tjenester;
        group.count += 1;
      }
    });

    return Object.values(grouped).map(g => ({
      date: g.date,
      mat_opplevelser: parseFloat((g.mat_opplevelser / g.count).toFixed(2)),
      handel: parseFloat((g.handel / g.count).toFixed(2)),
      tjenester: parseFloat((g.tjenester / g.count).toFixed(2))
    })).sort((a, b) => a.date.localeCompare(b.date));
  }, [data, aggregation]);

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
          <p className="mt-1 border-t pt-1 text-sm font-semibold text-gray-900">
            Total: NOK {payload.reduce((sum: number, p: any) => sum + p.value, 0).toFixed(2)}M
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* Aggregation controls */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setAggregation('daily')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
            aggregation === 'daily'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow'
          }`}
        >
          Daglig
        </button>
        <button
          onClick={() => setAggregation('monthly')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
            aggregation === 'monthly'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow'
          }`}
        >
          Månedlig
        </button>
        <button
          onClick={() => setAggregation('yearly')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
            aggregation === 'yearly'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow'
          }`}
        >
          Årlig
        </button>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={aggregatedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{ value: 'Omsetning (mill NOK)', angle: -90, position: 'insideLeft' }}
            stroke="#6B7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => {
              if (value === 'mat_opplevelser') return 'Mat & Opplevelser';
              if (value === 'handel') return 'Handel';
              if (value === 'tjenester') return 'Tjenester';
              return value;
            }}
          />
          <Line
            type="monotone"
            dataKey="mat_opplevelser"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: '#10B981', r: 3 }}
            activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
            name="mat_opplevelser"
          />
          <Line
            type="monotone"
            dataKey="handel"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', r: 3 }}
            activeDot={{ r: 6, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
            name="handel"
          />
          <Line
            type="monotone"
            dataKey="tjenester"
            stroke="#F59E0B"
            strokeWidth={3}
            dot={{ fill: '#F59E0B', r: 3 }}
            activeDot={{ r: 6, fill: '#F59E0B', stroke: '#fff', strokeWidth: 2 }}
            name="tjenester"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Periode: 2019-2025 ({aggregatedData.length} datapunkter)</p>
      </div>
    </div>
  );
}
