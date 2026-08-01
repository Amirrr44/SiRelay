import { create } from 'zustand';
import { OperationalMetrics, ServerPolicy } from '../types';

interface MetricsState {
  currentMetrics: OperationalMetrics | null;
  metricsHistory: OperationalMetrics[];
  policy: ServerPolicy | null;
  wsConnected: boolean;
  updateMetrics: (metrics: OperationalMetrics) => void;
  setPolicy: (policy: ServerPolicy) => void;
  setWsConnected: (connected: boolean) => void;
}

export const useMetricsStore = create<MetricsState>((set) => ({
  currentMetrics: null,
  metricsHistory: [],
  policy: null,
  wsConnected: false,

  updateMetrics: (metrics) =>
    set((state) => ({
      currentMetrics: metrics,
      metricsHistory: [...state.metricsHistory.slice(-30), metrics],
    })),

  setPolicy: (policy) => set({ policy }),
  setWsConnected: (connected) => set({ wsConnected: connected }),
}));
