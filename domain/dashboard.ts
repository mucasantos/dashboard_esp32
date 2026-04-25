import { ControlState, SensorReadings, TelemetryPayload } from '../types';

export const MAX_HISTORY_POINTS = 30;

export const createInitialSensorReadings = (): SensorReadings => ({
  temperature: 0,
  humidity: 0,
  lux: 0,
  noiseLevel: 0,
  decibels: 0,
  timestamp: new Date().toISOString(),
});

export const createInitialControlState = (): ControlState => ({
  led1: false,
  led2: false,
  motorSpeed: 0,
  servoAngle: 90,
});

export const normalizeTelemetry = (payload: TelemetryPayload): SensorReadings => ({
  temperature: payload.temperature ?? 0,
  humidity: payload.humidity ?? 0,
  lux: payload.lux ?? 0,
  noiseLevel: payload.noiseLevel ?? 0,
  decibels: payload.decibels ?? 0,
  timestamp:
    typeof payload.timestamp === 'string'
      ? payload.timestamp
      : new Date().toLocaleTimeString(),
});

export const appendHistoryPoint = (
  history: SensorReadings[],
  nextReading: SensorReadings,
): SensorReadings[] => {
  const nextHistory = [...history, nextReading];
  return nextHistory.slice(-MAX_HISTORY_POINTS);
};
