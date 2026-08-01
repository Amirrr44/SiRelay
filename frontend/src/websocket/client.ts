import { useMetricsStore } from '../store/useMetricsStore';
import { useAuthStore } from '../store/useAuthStore';

class AdminWebSocket {
  private ws: WebSocket | null = null;

  public connect() {
    const token = useAuthStore.getState().token;
    if (!token) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/v1/admin/stream?token=${encodeURIComponent(token)}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      useMetricsStore.getState().setWsConnected(true);
    };

    this.ws.onmessage = (event) => {
      try {
        const frame = JSON.parse(event.data);
        if (frame.type === 'METRICS_TICK') {
          useMetricsStore.getState().updateMetrics(frame.payload);
        } else if (frame.type === 'POLICY_UPDATE') {
          useMetricsStore.getState().setPolicy(frame.payload);
        }
      } catch (err) {
        console.error('WebSocket Error:', err);
      }
    };

    this.ws.onclose = () => {
      useMetricsStore.getState().setWsConnected(false);
      setTimeout(() => this.connect(), 3000);
    };
  }

  public disconnect() {
    this.ws?.close();
  }
}

export const adminWs = new AdminWebSocket();
