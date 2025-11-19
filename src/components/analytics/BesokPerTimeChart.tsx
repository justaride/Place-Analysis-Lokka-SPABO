'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TimeData {
  time: string;
  besøk: number;
}

interface Props {
  data: TimeData[];
}

export default function BesokPerTimeChart({ data }: Props) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="mb-1 font-semibold text-gray-900">Kl. {label}</p>
          <p className="text-sm text-blue-600">
            {payload[0].value.toLocaleString()} besøk
          </p>
        </div>
      );
    }
    return null;
  };

  // Find peak hour
  const peakHour = data.length > 0
    ? data.reduce((max, item) => item.besøk > max.besøk ? item : max, data[0]!)
    : { time: '00:00', besøk: 0 };
  const totalVisits = data.reduce((sum, item) => sum + item.besøk, 0);
  const avgVisits = data.length > 0 ? Math.round(totalVisits / data.length) : 0;

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorBesok" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="time"
            stroke="#6B7280"
            tick={{ fontSize: 11 }}
            interval={2}
          />
          <YAxis
            stroke="#6B7280"
            label={{ value: 'Antall besøk', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="besøk"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBesok)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-blue-700">
            Topptime
          </p>
          <p className="mt-1 text-2xl font-bold text-blue-900">
            {peakHour.time}
          </p>
          <p className="text-xs text-blue-600">{peakHour.besøk.toLocaleString()} besøk</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-gray-700">
            Gjennomsnitt
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {avgVisits.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600">besøk/time</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-green-700">
            Total
          </p>
          <p className="mt-1 text-2xl font-bold text-green-900">
            {totalVisits.toLocaleString()}
          </p>
          <p className="text-xs text-green-600">besøk/dag</p>
        </div>
      </div>
    </div>
  );
}
