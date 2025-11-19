'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface KjederData {
  year: string;
  uavhengig: number;
  kjeder: number;
}

interface Props {
  data: KjederData[];
}

export default function KjederVsUavhengigeChart({ data }: Props) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload[0].value + payload[1].value;
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="mb-2 font-semibold text-gray-900">{label}</p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            Kjeder: {payload[0].value.toFixed(1)}%
          </p>
          <p className="text-sm" style={{ color: payload[1].color }}>
            Uavhengig: {payload[1].value.toFixed(1)}%
          </p>
          <p className="mt-1 border-t pt-1 text-sm font-semibold text-gray-900">
            Total: {total.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate trend
  const firstYear = data[0]!;
  const lastYear = data[data.length - 1]!;
  const uavhengigTrend = lastYear.uavhengig - firstYear.uavhengig;

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorKjeder" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorUavhengig" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="year"
            stroke="#6B7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke="#6B7280"
            label={{ value: 'Andel (%)', angle: -90, position: 'insideLeft' }}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => {
              if (value === 'kjeder') return 'Kjeder';
              if (value === 'uavhengig') return 'Uavhengige';
              return value;
            }}
          />
          <Area
            type="monotone"
            dataKey="kjeder"
            stackId="1"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorKjeder)"
            name="kjeder"
          />
          <Area
            type="monotone"
            dataKey="uavhengig"
            stackId="1"
            stroke="#10B981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorUavhengig)"
            name="uavhengig"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-blue-700">
            Kjeder ({lastYear.year})
          </p>
          <p className="mt-1 text-2xl font-bold text-blue-900">
            {lastYear.kjeder.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-green-700">
            Uavhengige ({lastYear.year})
          </p>
          <p className="mt-1 text-2xl font-bold text-green-900">
            {lastYear.uavhengig.toFixed(1)}%
          </p>
        </div>
        <div className={`rounded-lg p-4 text-center ${uavhengigTrend > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className={`text-sm font-medium uppercase tracking-wider ${uavhengigTrend > 0 ? 'text-green-700' : 'text-red-700'}`}>
            Trend (uavhengige)
          </p>
          <p className={`mt-1 text-2xl font-bold ${uavhengigTrend > 0 ? 'text-green-900' : 'text-red-900'}`}>
            {uavhengigTrend > 0 ? '+' : ''}{uavhengigTrend.toFixed(1)}%
          </p>
          <p className={`text-xs ${uavhengigTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {firstYear.year} - {lastYear.year}
          </p>
        </div>
      </div>
    </div>
  );
}
