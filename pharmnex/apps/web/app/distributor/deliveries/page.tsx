"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Truck, MapPin, Thermometer, Activity, CheckCircle2, AlertTriangle, Navigation } from "lucide-react";

interface Delivery {
  id: string;
  shipmentId: string;
  batchNumber: string;
  drugName: string;
  driver: string;
  vehicle: string;
  route: string;
  currentTemp: number;
  tempRange: string;
  humidity: number;
  anomalyScore: number;
  status: "OPTIMAL" | "TEMP_EXCURSION" | "DELIVERED";
  eta: string;
  lastUpdate: string;
  distancePct: number;
}

const MOCK_DELIVERIES: Delivery[] = [
  { id: "d1", shipmentId: "SHP-2026-104", batchNumber: "BN-2026-8891", drugName: "Amoxicillin 500mg Capsule", driver: "Marcus Vance", vehicle: "Volvo FH Cold-Van #4", route: "Boston Hub → New York Depot", currentTemp: 4.2, tempRange: "2-8°C", humidity: 45, anomalyScore: 0.02, status: "OPTIMAL", eta: "Sep 22 · 14:30", lastUpdate: "2 min ago", distancePct: 65 },
  { id: "d2", shipmentId: "SHP-2026-109", batchNumber: "BN-2026-9012", drugName: "Insulin Glargine 300U/mL", driver: "Sarah Jenkins", vehicle: "Mercedes Sprinter Reefer #12", route: "Chicago Hub → Detroit Pharmacy", currentTemp: 9.1, tempRange: "2-8°C", humidity: 62, anomalyScore: 0.78, status: "TEMP_EXCURSION", eta: "Sep 22 · 16:00 (Delayed)", lastUpdate: "5 min ago", distancePct: 40 },
  { id: "d3", shipmentId: "SHP-2026-098", batchNumber: "BN-2026-7789", drugName: "Metformin 850mg Tablet", driver: "Carlos Mendez", vehicle: "MAN TGX Dry-Van #7", route: "Dallas Hub → Houston Hospital", currentTemp: 22.1, tempRange: "15-25°C", humidity: 48, anomalyScore: 0.03, status: "DELIVERED", eta: "Delivered Sep 21", lastUpdate: "Completed", distancePct: 100 },
];

export default function DistributorDeliveriesPage() {
  const [deliveries, setDeliveries] = useState(MOCK_DELIVERIES);

  const resolveExcursion = (id: string) => {
    setDeliveries(prev => prev.map(d =>
      d.id === id ? { ...d, currentTemp: 5.0, anomalyScore: 0.04, status: "OPTIMAL" as const } : d
    ));
  };

  return (
    <DashboardLayout
      title="Active Deliveries"
      subtitle="Real-time GPS + cold-chain IoT telemetry streams"
      role="distributor"
    >
      {/* Live Banner */}
      <div className="flex items-center gap-3 mb-6 p-4 rounded-xl"
        style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.15)" }}>
        <div className="pulse-dot" />
        <span className="text-sm" style={{ color: "#34d399" }}>
          Live IoT Telemetry Active — {deliveries.filter(d => d.status !== "DELIVERED").length} active shipments
        </span>
        <span className="text-xs ml-auto font-mono" style={{ color: "#475569" }}>
          Updates every 30s
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Deliveries", value: deliveries.filter(d => d.status !== "DELIVERED").length, color: "#fb923c", icon: Truck },
          { label: "Excursions", value: deliveries.filter(d => d.status === "TEMP_EXCURSION").length, color: "#ef4444", icon: AlertTriangle },
          { label: "Optimal Routes", value: deliveries.filter(d => d.status === "OPTIMAL").length, color: "#34d399", icon: CheckCircle2 },
          { label: "Delivered Today", value: deliveries.filter(d => d.status === "DELIVERED").length, color: "#a78bfa", icon: MapPin },
        ].map((k) => (
          <div key={k.label} className="kpi-card">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${k.color}15`, border: `1px solid ${k.color}25` }}>
              <k.icon className="w-5 h-5" style={{ color: k.color }} />
            </div>
            <p className="text-2xl font-bold font-display" style={{ color: "#f1f5f9" }}>{k.value}</p>
            <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Delivery Cards */}
      <div className="space-y-4">
        {deliveries.map((delivery) => {
          const isExcursion = delivery.status === "TEMP_EXCURSION";
          const isDelivered = delivery.status === "DELIVERED";
          const tempColor = isExcursion ? "#ef4444" : "#34d399";
          const borderColor = isExcursion ? "rgba(239,68,68,0.25)" : isDelivered ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.06)";

          return (
            <div key={delivery.id} className="glass-card-static p-6"
              style={{ border: `1px solid ${borderColor}`, background: isExcursion ? "rgba(239,68,68,0.03)" : undefined }}>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Main info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="font-mono text-sm font-bold" style={{ color: "#fb923c" }}>
                      {delivery.shipmentId}
                    </span>
                    <span className="font-mono text-xs" style={{ color: "#475569" }}>
                      {delivery.batchNumber}
                    </span>
                    {isExcursion && (
                      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg"
                        style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }}>
                        <AlertTriangle className="w-3 h-3" /> TEMP EXCURSION
                      </span>
                    )}
                    {isDelivered && (
                      <span className="badge-success">Delivered</span>
                    )}
                  </div>

                  <p className="font-semibold mb-1" style={{ color: "#f1f5f9" }}>{delivery.drugName}</p>
                  <p className="text-xs mb-3" style={{ color: "#64748b" }}>
                    {delivery.driver} · {delivery.vehicle}
                  </p>

                  {/* Route with progress */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Navigation className="w-3.5 h-3.5" style={{ color: "#fb923c" }} />
                      <span className="text-xs" style={{ color: "#94a3b8" }}>{delivery.route}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${delivery.distancePct}%`, background: isExcursion ? "#ef4444" : "#34d399" }} />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span style={{ color: "#475569" }}>Origin</span>
                      <span style={{ color: "#475569" }}>{delivery.distancePct}% complete</span>
                      <span style={{ color: "#475569" }}>Destination</span>
                    </div>
                  </div>

                  <p className="text-xs" style={{ color: "#475569" }}>
                    ETA: <span style={{ color: "#94a3b8" }}>{delivery.eta}</span>
                    &nbsp;· Last update: <span style={{ color: "#64748b" }}>{delivery.lastUpdate}</span>
                  </p>
                </div>

                {/* Telemetry panel */}
                <div className="flex flex-col gap-3 min-w-48">
                  <div className="p-4 rounded-xl text-center"
                    style={{ background: `${tempColor}10`, border: `1px solid ${tempColor}25` }}>
                    <Thermometer className="w-6 h-6 mx-auto mb-1" style={{ color: tempColor }} />
                    <p className="text-3xl font-bold font-mono" style={{ color: tempColor }}>
                      {delivery.currentTemp}°C
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#64748b" }}>Range: {delivery.tempRange}</p>
                  </div>

                  <div className="p-3 rounded-xl flex justify-between items-center"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-xs" style={{ color: "#475569" }}>Humidity</span>
                    <span className="font-mono text-sm font-semibold" style={{ color: "#94a3b8" }}>
                      {delivery.humidity}%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl flex justify-between items-center"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-xs" style={{ color: "#475569" }}>Anomaly Score</span>
                    <span className="font-mono text-sm font-semibold"
                      style={{ color: delivery.anomalyScore > 0.6 ? "#ef4444" : delivery.anomalyScore > 0.3 ? "#f59e0b" : "#34d399" }}>
                      {delivery.anomalyScore.toFixed(2)}
                    </span>
                  </div>

                  {isExcursion && (
                    <button onClick={() => resolveExcursion(delivery.id)}
                      className="btn-danger w-full text-xs py-2">
                      Mark Excursion Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
