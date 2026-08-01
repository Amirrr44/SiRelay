export interface ServerPolicy {
  maxRooms: number;
  roomCreationEnabled: boolean;
  maxUsersPerRoom: number;
  maxConnectionsPerIP: number;
  connectionTimeoutSec: number;
  heartbeatIntervalSec: number;
  maxMessageLengthBytes: number;
  rateLimitPerSec: number;
  slowModeMs: number;
  autoSlowMode: boolean;
}

export interface OperationalMetrics {
  timestamp: string;
  cpuUsagePct: number;
  ramUsageMb: number;
  networkTxBps: number;
  networkRxBps: number;
  eventLoopDelayMs: number;
  queueSize: number;
  connectedUsers: number;
  activeRooms: number;
  messagesPerSec: number;
  packetsPerSec: number;
  invalidPacketsPerSec: number;
  rateLimitHits: number;
  failedJoins: number;
  banEventsTotal: number;
}

export interface RoomInfo {
  id: string;
  name: string;
  currentUsers: number;
  maxUsers: number;
  messagesPerSec: number;
  status: 'Normal' | 'Busy' | 'Overloaded';
}

export interface UserSession {
  id: string;
  nickname: string;
  ipAddress: string;
  fingerprint: string;
  connectedAt: string;
  currentRoom: string;
  reputationScore: number;
  trustStatus: 'Trusted' | 'Neutral' | 'Suspicious';
  activeConnections: number;
}

export interface BanEntry {
  id: string;
  type: 'IP' | 'FINGERPRINT';
  target: string;
  reason: string;
  isShadow: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface AuditLogEntry {
  id: string;
  adminUser: string;
  action: string;
  target: string;
  prevVal: string;
  newVal: string;
  timestamp: string;
  ipAddress: string;
}
