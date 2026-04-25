import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActuatorToggleCardProps {
  description: string;
  icon: LucideIcon;
  isActive: boolean;
  title: string;
  onClick: () => void;
  toneClassName: string;
}

const ActuatorToggleCard: React.FC<ActuatorToggleCardProps> = ({
  description,
  icon: Icon,
  isActive,
  title,
  onClick,
  toneClassName,
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
        isActive
          ? `border-current/20 bg-current/10 shadow-[0_18px_40px_rgba(15,23,42,0.18)] ${toneClassName}`
          : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${
                isActive ? 'border-current/20 bg-current/10' : 'border-slate-800 bg-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-xs text-slate-400">{description}</p>
            </div>
          </div>
        </div>

        <span
          className={`rounded-full px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] ${
            isActive ? 'bg-current/15 text-current' : 'bg-slate-800 text-slate-500'
          }`}
        >
          {isActive ? 'On' : 'Off'}
        </span>
      </div>
    </button>
  );
};

export default ActuatorToggleCard;
