import { WebSocketMessage } from '../../types';

interface DeviceWebSocketHandlers {
  onOpen: () => void;
  onClose: () => void;
  onError: (error: Event) => void;
  onTelemetry: (message: WebSocketMessage) => void;
}

export class DeviceWebSocket {
  private socket: WebSocket | null = null;

  connect(url: string, handlers: DeviceWebSocketHandlers) {
    this.disconnect();

    const socket = new WebSocket(url);

    socket.onopen = handlers.onOpen;
    socket.onclose = handlers.onClose;
    socket.onerror = handlers.onError;
    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as WebSocketMessage;
        handlers.onTelemetry(parsed);
      } catch (error) {
        console.error('Failed to parse WS message', error);
      }
    };

    this.socket = socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  send(payload: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(payload);
    }
  }

  isOpen() {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}
