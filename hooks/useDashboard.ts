import { useCallback, useEffect, useRef, useState } from 'react';

import {
  appendHistoryPoint,
  createInitialControlState,
  createInitialSensorReadings,
  normalizeTelemetry,
} from '../domain/dashboard';
import { startSensorSimulation } from '../infrastructure/simulation/sensorSimulator';
import { DeviceWebSocket } from '../infrastructure/ws/deviceWebSocket';
import {
  ConnectionStatus,
  ControlState,
  OutgoingMessage,
  SensorReadings,
  TelemetryPayload,
} from '../types';

const DEFAULT_DEVICE_URL = 'ws://192.168.15.3/ws';

const applyControlChange = (
  current: ControlState,
  command: OutgoingMessage,
): ControlState => {
  switch (command.action) {
    case 'SET_LED':
      return { ...current, [command.componentId]: command.value };
    case 'SET_MOTOR':
      return { ...current, motorSpeed: command.value };
    case 'SET_SERVO':
      return { ...current, servoAngle: command.value };
    default:
      return current;
  }
};

export const useDashboard = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.DISCONNECTED,
  );
  const [sensorData, setSensorData] = useState<SensorReadings>(createInitialSensorReadings);
  const [history, setHistory] = useState<SensorReadings[]>([]);
  const [controls, setControls] = useState<ControlState>(createInitialControlState);
  const [isSimulated, setIsSimulated] = useState(true);
  const [deviceUrl, setDeviceUrl] = useState(DEFAULT_DEVICE_URL);

  const socketRef = useRef<DeviceWebSocket | null>(null);
  const simulationRef = useRef<{ stop: () => void } | null>(null);

  const handleIncomingTelemetry = useCallback((payload: TelemetryPayload) => {
    const reading = normalizeTelemetry(payload);

    setSensorData(reading);
    setHistory((current) => appendHistoryPoint(current, reading));
    setControls((current) => ({
      ...current,
      led1: payload.led1 ?? current.led1,
      led2: payload.led2 ?? current.led2,
      motorSpeed: payload.motorSpeed ?? current.motorSpeed,
      servoAngle: payload.servoAngle ?? current.servoAngle,
    }));
  }, []);

  const stopSimulation = useCallback(() => {
    simulationRef.current?.stop();
    simulationRef.current = null;
  }, []);

  const disconnectDevice = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setConnectionStatus(ConnectionStatus.DISCONNECTED);
  }, []);

  const connectDevice = useCallback(() => {
    stopSimulation();
    setConnectionStatus(ConnectionStatus.CONNECTING);

    const socket = new DeviceWebSocket();
    socket.connect(deviceUrl, {
      onOpen: () => {
        setConnectionStatus(ConnectionStatus.CONNECTED);
      },
      onClose: () => {
        setConnectionStatus(ConnectionStatus.DISCONNECTED);
      },
      onError: (error) => {
        console.error('WebSocket error', error);
        setConnectionStatus(ConnectionStatus.ERROR);
      },
      onTelemetry: (message) => {
        if (message.type === 'UPDATE' && message.payload) {
          handleIncomingTelemetry(message.payload);
        }
      },
    });

    socketRef.current = socket;
  }, [deviceUrl, handleIncomingTelemetry, stopSimulation]);

  const startSimulation = useCallback(() => {
    disconnectDevice();
    setConnectionStatus(ConnectionStatus.CONNECTED);
    simulationRef.current = startSensorSimulation(handleIncomingTelemetry);
  }, [disconnectDevice, handleIncomingTelemetry]);

  useEffect(() => {
    if (isSimulated) {
      startSimulation();
    } else {
      connectDevice();
    }

    return () => {
      stopSimulation();
      disconnectDevice();
    };
  }, [connectDevice, disconnectDevice, isSimulated, startSimulation, stopSimulation]);

  const sendCommand = useCallback(
    (command: OutgoingMessage) => {
      setControls((current) => applyControlChange(current, command));

      if (!isSimulated && socketRef.current?.isOpen()) {
        socketRef.current.send(JSON.stringify(command));
      }
    },
    [isSimulated],
  );

  return {
    connectionStatus,
    controls,
    deviceUrl,
    history,
    isSimulated,
    sensorData,
    sendCommand,
    setDeviceUrl,
    setIsSimulated,
  };
};
