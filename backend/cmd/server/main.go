package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	"e2ee-admin/internal/admin"
)

func main() {
	hub := admin.NewAdminHub()
	go hub.Run()

	server := admin.NewAdminServer(hub)

	// روتیشن شبیه‌سازی متریگ‌های زنده سرور (هر ۱ ثانیه یک‌بار)
	go func() {
		ticker := time.NewTicker(1 * time.Second)
		for range ticker.C {
			metrics := admin.OperationalMetrics{
				Timestamp:            time.Now(),
				CPUUsagePct:          15.0 + rand.Float64()*10.0,
				RAMUsageMB:           240.0 + rand.Float64()*20.0,
				NetworkTxBps:         uint64(50000 + rand.Intn(10000)),
				NetworkRxBps:         uint64(45000 + rand.Intn(8000)),
				EventLoopDelayMs:     0.4 + rand.Float64()*0.3,
				QueueSize:            rand.Intn(5),
				ConnectedUsers:       120 + rand.Intn(10),
				ActiveRooms:          18,
				MessagesPerSec:       45 + rand.Intn(25),
				PacketsPerSec:        110 + rand.Intn(30),
				InvalidPacketsPerSec: rand.Intn(2),
				RateLimitHits:        rand.Intn(3),
				FailedJoins:          0,
				BanEventsTotal:       4,
			}
			hub.Broadcast(admin.EventMetricsTick, metrics)
		}
	}()

	// روت‌ها
	http.HandleFunc("/api/v1/admin/login", server.HandleLogin)
	http.HandleFunc("/api/v1/admin/policy", server.HandleGetPolicy)
	http.HandleFunc("/api/v1/admin/policy/update", server.HandleUpdatePolicy)
	http.HandleFunc("/api/v1/admin/stream", server.HandleWebSocket)

	fmt.Println("🚀 Admin API Server listening on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
