"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Boxes, Package, Thermometer, ShieldCheck, Search, AlertTriangle } from "lucide-react";

interface DistributorInventory {
  id: string;
  shipmentId: string;
  batchNumber: string;
  drugName: string;
  dosage: string;
  quantity: number;
  warehouse: string;
  currentTemp: number;
  tempRange: string;
  humidity: number;
  anomalyScore: number;
  receivedDate: string;
  algoTxHash: string;
  status: "OPTIMAL" | "TEMP_EXCURSION" | "DELIVERED" | "HOLDING";
}

const MOCK_INVENTORY: DistributorInventory[] = [
  { id: "d1", shipmentId: "SHP-2026-104", batchNumber: "BN-2026-8891", drugName: "Amoxicillin Trihydrate", dosage: "500mg Capsule", quantity: 15000, warehouse: "Boston Cold Hub", currentTemp: 4.2, tempRange: "2-8°C", humidity: 45, anomalyScore: 0.02, receivedDate: "2026-09-19", algoTxHash: "7X9K2P...M8Q1", status: "OPTIMAL" },
  { id: "d2", shipmentId: "SHP-2026-109", batchNumber: "BN-2026-9012", drugName: "Insulin Glargine", dosage: "300U/mL Vial", quantity: 5000, warehouse: "Chicago Reefer #12", currentTemp: 9.1, tempRange: "2-8°C", humidity: 62, anomalyScore: 0.78, receivedDate: "2026-09-20", algoTxHash: "3B8W1L...P9X4", status: "TEMP_EXCURSION" },
  { id: "d3", shipmentId: "SHP-2026-112", batchNumber: "BN-2026-9140", drugName: "Atorvastatin Calcium", dosage: "20mg Tablet", quantity: 20000, warehouse: "Dallas Dry Store", currentTemp: 21.5, tempRange: "15-25°C", humidity: 50, anomalyScore: 0.04, receivedDate: "2026-09-21", algoTxHash: "9A2B3C...Z7Y6", status: "HOLDING" },
];

const STATUS_CFG: Record<DistributorInventory["status"], { color: string; bg: string; label: string }> = {
  OPTIMAL: { color: "#34d399", bg: "rgba(52,211,153,0.1)", label: "Optimal" },
  TEMP_EXCURSION: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", label: "Temp Excursion" },
  DELIVERED: { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", label: "Delivered" },
  HOLDING: { color: "#00D4FF", bg: "rgba(0,212,255,0.08)", label: "Holding" },
};

export default function DistributorInventoryPage() {
  const [inventory] = useState(MOCK_INVENTORY);
  const [search, setSearch] = useState("");

  const filtered = inventory.filter(item =>
    item.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
    item.drugName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Distribution Inventory"
      subtitle="Cold-chain stock with live IoT telemetry"
      role="distributor"
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total SKUs", value: inventory.length, color: "#fb923c", icon: Boxes },
          { label: "Temp Excursions", value: inventory.filter(i => i.status === "TEMP_EXCURSION").length, color: "#ef4444", icon: AlertTriangle },
          { label: "Total Units", value: inventory.reduce((s, i) => s + i.quantity, 0).toLocaleString(), color: "#34d399", icon: Package },
          { label: "Optimal Batches", value: inventory.filter(i => i.status === "OPTIMAL").length, color: "#00D4FF", icon: ShieldCheck },
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

      <div className="glass-card-static p-6">
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
          <input className="input-field pl-10" placeholder="Search batches..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="space-y-4">
          {filtered.map((item) => {
            const sc = STATUS_CFG[item.status];
            const tempOk = item.currentTemp >= 2 && item.currentTemp <= (item.tempRange.includes("25") ? 25 : 8);
            return (
              <div key={item.id} className="p-5 rounded-xl"
                style={{
                  background: item.status === "TEMP_EXCURSION" ? "rgba(239,68,68,0.03)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${item.status === "TEMP_EXCURSION" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)"}`,
                }}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold" style={{ color: "#fb923c" }}>
                        {item.batchNumber}
                      </span>
                      <span className="text-xs font-mono" style={{ color: "#475569" }}>{item.shipmentId}</span>
                    </div>
                    <p className="font-semibold" style={{ color: "#f1f5f9" }}>{item.drugName}</p>
                    <p className="text-xs" style={{ color: "#64748b" }}>{item.dosage} · {item.warehouse}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-lg font-semibold self-start flex-shrink-0"
                    style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}30` }}>
                    {sc.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div>
                    <p style={{ color: "#475569" }}>Current Temp</p>
                    <p className="font-mono font-bold text-base mt-0.5"
                      style={{ color: tempOk ? "#34d399" : "#ef4444" }}>
                      {item.currentTemp}°C
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "#475569" }}>Valid Range</p>
                    <p className="font-mono mt-0.5" style={{ color: "#94a3b8" }}>{item.tempRange}</p>
                  </div>
                  <div>
                    <p style={{ color: "#475569" }}>Humidity</p>
                    <p className="font-mono mt-0.5" style={{ color: "#94a3b8" }}>{item.humidity}%</p>
                  </div>
                  <div>
                    <p style={{ color: "#475569" }}>Quantity</p>
                    <p className="font-mono font-semibold mt-0.5" style={{ color: "#f1f5f9" }}>
                      {item.quantity.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "#475569" }}>Anomaly Score</p>
                    <p className="font-mono font-bold mt-0.5"
                      style={{ color: item.anomalyScore > 0.6 ? "#ef4444" : item.anomalyScore > 0.3 ? "#f59e0b" : "#34d399" }}>
                      {item.anomalyScore.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
