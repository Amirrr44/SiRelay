package admin

import (
	"encoding/json"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type EventType string

const (
	EventPolicyUpdate EventType = "POLICY_UPDATE"
	EventMetricsTick  EventType = "METRICS_TICK"
	EventAuditLog     EventType = "AUDIT_LOG"
	EventServerEvent  EventType = "SERVER_EVENT"
)

type BroadcastFrame struct {
	Type      EventType   `json:"type"`
	Payload   interface{} `json:"payload"`
	Timestamp int64       `json:"timestamp"`
}

type AdminHub struct {
	clients    map[*websocket.Conn]bool
	broadcast  chan BroadcastFrame
	register   chan *websocket.Conn
	unregister chan *websocket.Conn
	mu         sync.RWMutex
}

func NewAdminHub() *AdminHub {
	return &AdminHub{
		clients:    make(map[*websocket.Conn]bool),
		broadcast:  make(chan BroadcastFrame, 256),
		register:   make(chan *websocket.Conn),
		unregister: make(chan *websocket.Conn),
	}
}

func (h *AdminHub) Run() {
	for {
		select {
		case conn := <-h.register:
			h.mu.Lock()
			h.clients[conn] = true
			h.mu.Unlock()
		case conn := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[conn]; ok {
				delete(h.clients, conn)
				conn.Close()
			}
			h.mu.Unlock()
		case frame := <-h.broadcast:
			h.mu.RLock()
			data, err := json.Marshal(frame)
			if err == nil {
				for conn := range h.clients {
					_ = conn.WriteMessage(websocket.TextMessage, data)
				}
			}
			h.mu.RUnlock()
		}
	}
}

func (h *AdminHub) Register(conn *websocket.Conn) {
	h.register <- conn
}

func (h *AdminHub) Unregister(conn *websocket.Conn) {
	h.unregister <- conn
}

func (h *AdminHub) Broadcast(evt EventType, payload interface{}) {
	h.broadcast <- BroadcastFrame{
		Type:      evt,
		Payload:   payload,
		Timestamp: time.Now().UnixMilli(),
	}
}
