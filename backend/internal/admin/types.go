package admin

import (
	"time"
)

// ServerPolicy پالیسی‌های شبکه و محدودیت‌های dynamic سرور را تعریف می‌کند
type ServerPolicy struct {
	MaxRooms              int  `json:"maxRooms"`
	RoomCreationEnabled   bool `json:"roomCreationEnabled"`
	MaxUsersPerRoom       int  `json:"maxUsersPerRoom"`
	MaxConnectionsPerIP   int  `json:"maxConnectionsPerIP"`
	ConnectionTimeoutSec  int  `json:"connectionTimeoutSec"`
	HeartbeatIntervalSec  int  `json:"heartbeatIntervalSec"`
	MaxMessageLengthBytes int  `json:"maxMessageLengthBytes"`
	RateLimitPerSec       int  `json:"rateLimitPerSec"`
	SlowModeMs            int  `json:"slowModeMs"` // 0, 300, 500, 1000, 2000, 3000
	AutoSlowMode          bool `json:"autoSlowMode"`
}

// OperationalMetrics متریگ‌های عملیاتی را بدون دسترسی به متن پیام‌ها ارائه می‌دهد
type OperationalMetrics struct {
	Timestamp            time.Time `json:"timestamp"`
	CPUUsagePct          float64   `json:"cpuUsagePct"`
	RAMUsageMB           float64   `json:"ramUsageMb"`
	NetworkTxBps         uint64    `json:"networkTxBps"`
	NetworkRxBps         uint64    `json:"networkRxBps"`
	EventLoopDelayMs     float64   `json:"eventLoopDelayMs"`
	QueueSize            int       `json:"queueSize"`
	ConnectedUsers       int       `json:"connectedUsers"`
	ActiveRooms          int       `json:"activeRooms"`
	MessagesPerSec       int       `json:"messagesPerSec"`
	PacketsPerSec        int       `json:"packetsPerSec"`
	InvalidPacketsPerSec int       `json:"invalidPacketsPerSec"`
	RateLimitHits        int       `json:"rateLimitHits"`
	FailedJoins          int       `json:"failedJoins"`
	BanEventsTotal       int       `json:"banEventsTotal"`
}

type BanType string

const (
	BanIP          BanType = "IP"
	BanFingerprint BanType = "FINGERPRINT"
)

type BanEntry struct {
	ID        string     `json:"id"`
	Type      BanType    `json:"type"`
	Target    string     `json:"target"` // آدرس IP یا هش هش Fingerprint
	Reason    string     `json:"reason"`
	IsShadow  bool       `json:"isShadow"` // Shadowban: پیام‌ها تحویل داده نمی‌شوند
	CreatedAt time.Time  `json:"createdAt"`
	ExpiresAt *time.Time `json:"expiresAt,omitempty"` // nil = دائمی
}

type AuditLogEntry struct {
	ID        string    `json:"id"`
	AdminUser string    `json:"adminUser"`
	Action    string    `json:"action"`
	Target    string    `json:"target"`
	PrevVal   string    `json:"prevVal"`
	NewVal    string    `json:"newVal"`
	Timestamp time.Time `json:"timestamp"`
	IPAddress string    `json:"ipAddress"`
}

type ServerEvent struct {
	ID        string    `json:"id"`
	Type      string    `json:"type"`
	Severity  string    `json:"severity"` // info, warning, critical
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}
