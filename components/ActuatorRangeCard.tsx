import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActuatorRangeCardProps {
  colorClassName: string;
  icon: LucideIcon;
  label: string;
  max: number;
  min: number;
  suffix: string;
  value: number;
  onChange: (value: number) => void;
}

const ActuatorRangeCard: React.FC<ActuatorRangeCardProps> = ({
  colorClassName,
  icon: Icon,
  label,
  max,
  min,
  suffix,
  value,
  onChange,
}) => {
  const midpoint = Math.round((min + max) / 2);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-current/15 bg-current/10 ${colorClassName}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{label}</p>
            <p className="text-xs text-slate-400">
              Control range {min}
              {suffix} to {max}
              {suffix}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-right">
          <span className={`text-lg font-semibold ${colorClassName}`}>{value}</span>
          <span className="ml-1 text-xs font-medium text-slate-400">{suffix}</span>
        </div>
      </div>

      <div className="mt-4">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(parseInt(event.target.value, 10))}
          className={`h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-current ${colorClassName}`}
        />

        <div className="mt-2 flex items-center justify-between text-[0.65rem] font-medium uppercase tracking-[0.16em] text-slate-500">
          <span>
            {min}
            {suffix}
          </span>
          <span>
            {midpoint}
            {suffix}
          </span>
          <span>
            {max}
            {suffix}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActuatorRangeCard;
