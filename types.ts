export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface SensorReadings {
  temperature: number;
  humidity: number;
  lux: number;
  noiseLevel: number;
  decibels: number;
  timestamp: string;
}

export interface ControlState {
  led1: boolean;
  led2: boolean;
  motorSpeed: number;
  servoAngle: number;
}

export interface TelemetryPayload extends Partial<ControlState> {
  temperature: number;
  humidity: number;
  lux: number;
  noiseLevel: number;
  decibels: number;
  timestamp?: string | number;
}

export interface WebSocketMessage {
  type: 'UPDATE' | 'ALERT';
  payload: TelemetryPayload;
}

export type OutgoingMessage =
  | {
      action: 'SET_LED';
      componentId: 'led1' | 'led2';
      value: boolean;
    }
  | {
      action: 'SET_MOTOR';
      value: number;
    }
  | {
      action: 'SET_SERVO';
      value: number;
    };

export enum ConnectionStatus {
  DISCONNECTED = 'Disconnected',
  CONNECTING = 'Connecting',
  CONNECTED = 'Connected',
  ERROR = 'Error',
}

export interface AiAnalysisResult {
  analysis: string;
  riskLevel: RiskLevel;
  recommendations: string[];
}

export interface DashboardState {
  connectionStatus: ConnectionStatus;
  sensorData: SensorReadings;
  history: SensorReadings[];
  controls: ControlState;
}
