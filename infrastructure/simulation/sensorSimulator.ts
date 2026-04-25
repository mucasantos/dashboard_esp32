import { TelemetryPayload } from '../../types';

export interface SimulationController {
  stop: () => void;
}

export const startSensorSimulation = (
  onData: (payload: TelemetryPayload) => void,
): SimulationController => {
  let temperature = 25;
  let humidity = 60;
  let lux = 500;
  let noiseLevel = 200;
  let decibels = 55;
  let time = 0;

  const intervalId = window.setInterval(() => {
    time += 0.1;

    temperature = 25 + Math.sin(time) * 2 + (Math.random() - 0.5);
    humidity = 60 + Math.cos(time * 0.5) * 5 + (Math.random() - 0.5) * 2;
    lux = 500 + Math.sin(time * 2) * 200 + Math.random() * 50;
    noiseLevel = 200 + Math.sin(time * 1.5) * 100 + Math.random() * 30;
    decibels = 50 + Math.sin(time * 1.2) * 15 + Math.random() * 5;

    onData({
      temperature,
      humidity,
      lux: Math.max(0, lux),
      noiseLevel: Math.max(0, noiseLevel),
      decibels: Math.max(40, Math.min(100, decibels)),
      timestamp: new Date().toLocaleTimeString(),
    });
  }, 1000);

  return {
    stop: () => {
      window.clearInterval(intervalId);
    },
  };
};
