import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { SensorReadings } from '../types';

interface ChartLineConfig {
  dataKey: keyof SensorReadings;
  label: string;
  stroke: string;
}

interface ChartPanelProps {
  data: SensorReadings[];
  lines: ChartLineConfig[];
  chartHeightClassName?: string;
  containerClassName?: string;
  title: string;
}

const ChartPanel: React.FC<ChartPanelProps> = ({
  data,
  lines,
  chartHeightClassName = 'h-[180px] sm:h-[220px]',
  containerClassName = 'min-h-[220px] sm:min-h-[260px]',
  title,
}) => {
  return (
    <section
      className={`flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-[0_28px_60px_rgba(15,23,42,0.28)] backdrop-blur-md ${containerClassName}`}
    >
      <h2 className="mb-4 text-base font-semibold text-white sm:text-lg">{title}</h2>
      <div className={`w-full flex-1 ${chartHeightClassName}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={11} minTickGap={28} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke}
                strokeWidth={2}
                dot={false}
                name={line.label}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default ChartPanel;
