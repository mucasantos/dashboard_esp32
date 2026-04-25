import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  accentClass: string;
  description: string;
  iconClassName?: string;
}

const SensorCard: React.FC<SensorCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  accentClass,
  description,
  iconClassName,
}) => {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.28)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-60" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
            {title}
          </p>
          <div className="mt-3 flex items-end gap-1">
            <span className="text-2xl font-semibold leading-none text-white sm:text-3xl">{value}</span>
            <span className="pb-0.5 text-xs font-medium text-slate-400">{unit}</span>
          </div>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-current/15 bg-current/10 ${accentClass}`}
        >
          <Icon className={`h-5 w-5 shrink-0 ${iconClassName ?? ''}`} />
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-400">{description}</p>
    </article>
  );
};

export default SensorCard;
