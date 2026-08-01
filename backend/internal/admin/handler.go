package admin

import (
	"encoding/json"
	"net/http"
	"sync"
	"time"

	"e2ee-admin/internal/auth"

	"github.com/gorilla/websocket"
)

type AdminServer struct {
	hub      *AdminHub
	policy   ServerPolicy
	bans     []BanEntry
	audit    []AuditLogEntry
	upgrader websocket.Upgrader
	mu       sync.RWMutex
}

func NewAdminServer(hub *AdminHub) *AdminServer {
	return &AdminServer{
		hub: hub,
		policy: ServerPolicy{
			MaxRooms:              100,
			RoomCreationEnabled:   true,
			MaxUsersPerRoom:       50,
			MaxConnectionsPerIP:   5,
			ConnectionTimeoutSec:  30,
			HeartbeatIntervalSec:  10,
			MaxMessageLengthBytes: 4096,
			RateLimitPerSec:       20,
			SlowModeMs:            0,
			AutoSlowMode:          true,
		},
		bans:  make([]BanEntry, 0),
		audit: make([]AuditLogEntry, 0),
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool { return true },
		},
	}
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (s *AdminServer) HandleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	// نام کاربری و رمز پیش‌فرض برای تست
	if req.Username == "admin" && req.Password == "admin123" {
		token, err := auth.GenerateToken(req.Username)
		if err != nil {
			http.Error(w, "Internal error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"token": token})
		return
	}

	http.Error(w, "Invalid credentials", http.StatusUnauthorized)
}

func (s *AdminServer) HandleGetPolicy(w http.ResponseWriter, r *http.Request) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s.policy)
}

func (s *AdminServer) HandleUpdatePolicy(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var newPolicy ServerPolicy
	if err := json.NewDecoder(r.Body).Decode(&newPolicy); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	s.mu.Lock()
	s.policy = newPolicy
	s.mu.Unlock()

	// برودکست تغییر پالیسی به تمام کلاینت‌های متصل
	s.hub.Broadcast(EventPolicyUpdate, newPolicy)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "updated"})
}

func (s *AdminServer) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	tokenStr := r.URL.Query().Get("token")
	_, err := auth.ValidateToken(tokenStr)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	conn, err := s.upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	s.hub.Register(conn)

	// ارسال پالیسی فعلی بلافاصله پس از اتصال
	s.mu.RLock()
	_ = conn.WriteJSON(BroadcastFrame{
		Type:      EventPolicyUpdate,
		Payload:   s.policy,
		Timestamp: time.Now().UnixMilli(),
	})
	s.mu.RUnlock()

	go func() {
		defer s.hub.Unregister(conn)
		for {
			if _, _, err := conn.ReadMessage(); err != nil {
				break
			}
		}
	}()
}
