'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface HusholdningData {
  type: string;
  value: number;
}

interface Props {
  data: HusholdningData[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function HusholdningerChart({ data }: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const chartData = data.map((item, index) => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1),
    color: COLORS[index % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="mb-1 font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-blue-600">
            {data.value.toLocaleString()} husholdninger
          </p>
          <p className="text-xs text-gray-500">
            {data.payload.percentage}% av total
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    if (percent < 0.05) return null; // Don't show label if less than 5%

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={120}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            nameKey="type"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => {
              const item = chartData.find(d => d.type === value);
              return `${value} (${item?.percentage}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        {chartData.map((item) => (
          <div key={item.type} className="rounded-lg bg-gray-50 p-3 text-center">
            <div
              className="mx-auto mb-1 h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <p className="text-xs font-medium text-gray-600">{item.type}</p>
            <p className="text-lg font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Total: {total.toLocaleString()} husholdninger</p>
      </div>
    </div>
  );
}
