import React from 'react';
import { Droplets, Flame, Lightbulb, Volume2 } from 'lucide-react';

import { SensorReadings } from '../types';
import SensorCard from './SensorCard';

interface SensorOverviewProps {
  sensorData: SensorReadings;
}

const SensorOverview: React.FC<SensorOverviewProps> = ({ sensorData }) => {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <SensorCard
        title="Temperature"
        value={sensorData.temperature.toFixed(1)}
        unit="°C"
        icon={Flame}
        accentClass="text-rose-400"
        description="Live ambient temperature from the DHT sensor."
        iconClassName="translate-y-px"
      />
      <SensorCard
        title="Humidity"
        value={sensorData.humidity.toFixed(1)}
        unit="%"
        icon={Droplets}
        accentClass="text-cyan-400"
        description="Relative humidity for room condition tracking."
      />
      <SensorCard
        title="Light"
        value={sensorData.lux.toFixed(0)}
        unit="lx"
        icon={Lightbulb}
        accentClass="text-amber-400"
        description="Estimated illumination derived from the LDR signal."
      />
      <SensorCard
        title="Noise"
        value={sensorData.decibels.toFixed(1)}
        unit="dB"
        icon={Volume2}
        accentClass="text-violet-400"
        description="Sound activity mapped from peak-to-peak sensor input."
      />
    </section>
  );
};

export default SensorOverview;
