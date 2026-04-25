import React from 'react';
import { Gauge, Lightbulb, Settings2, ToggleRight } from 'lucide-react';

import { ControlState, OutgoingMessage } from '../types';
import ActuatorRangeCard from './ActuatorRangeCard';
import ActuatorToggleCard from './ActuatorToggleCard';

interface ControlPanelProps {
  controls: ControlState;
  onControlChange: (cmd: OutgoingMessage) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ controls, onControlChange }) => {
  const toggleLed = (ledName: 'led1' | 'led2', currentValue: boolean) => {
    onControlChange({
      action: 'SET_LED',
      componentId: ledName,
      value: !currentValue,
    });
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-[0_28px_60px_rgba(15,23,42,0.28)] backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-sky-400" />
            <h2 className="text-base font-semibold text-white sm:text-lg">Control Surface</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Tune lighting and motion outputs in real time from the dashboard.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Live
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ActuatorToggleCard
          title="Status Light"
          description="Primary device indicator"
          icon={Lightbulb}
          isActive={controls.led1}
          onClick={() => toggleLed('led1', controls.led1)}
          toneClassName="text-emerald-400"
        />
        <ActuatorToggleCard
          title="Aux Beacon"
          description="Secondary visual signal"
          icon={ToggleRight}
          isActive={controls.led2}
          onClick={() => toggleLed('led2', controls.led2)}
          toneClassName="text-amber-400"
        />
      </div>

      <div className="mt-4 space-y-3">
        <ActuatorRangeCard
          label="Motor Output"
          icon={Gauge}
          min={0}
          max={100}
          value={controls.motorSpeed}
          suffix="%"
          colorClassName="text-fuchsia-400"
          onChange={(value) =>
            onControlChange({
              action: 'SET_MOTOR',
              value,
            })
          }
        />

        <ActuatorRangeCard
          label="Servo Position"
          icon={Settings2}
          min={0}
          max={180}
          value={controls.servoAngle}
          suffix="°"
          colorClassName="text-sky-400"
          onChange={(value) =>
            onControlChange({
              action: 'SET_SERVO',
              value,
            })
          }
        />
      </div>
    </section>
  );
};

export default ControlPanel;
