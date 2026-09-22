"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Truck, Thermometer, Droplets, Navigation, AlertTriangle, CheckCircle2, RefreshCw,
  MapPin, Shield, Activity, Radio, Cpu
} from "lucide-react";

interface TelemetryShipment {
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
  status: "OPTIMAL" | "TEMP_EXCURSION" | "DELIVERED";
  algoTxHash: string;
  anomalyScore: number;
}

const INITIAL_SHIPMENTS: TelemetryShipment[] = [
  {
    id: "s1",
    shipmentId: "SHP-2026-104",
    batchNumber: "BN-2026-8891",
    drugName: "Amoxicillin Trihydrate 500mg",
    driver: "Marcus Vance",
    vehicle: "Volvo FH Cold-Van #4",
    route: "Boston Hub ➔ New York Depot",
    currentTemp: 4.2,
    tempRange: "2.0°C - 8.0°C",
    humidity: 45,
    status: "OPTIMAL",
    algoTxHash: "7X9K2P...M8Q1",
    anomalyScore: 0.02,
  },
  {
    id: "s2",
    shipmentId: "SHP-2026-109",
    batchNumber: "BN-2026-9012",
    drugName: "Insulin Glargine Cold Vials",
    driver: "Sarah Jenkins",
    vehicle: "Mercedes Sprinter Reefer #12",
    route: "Chicago Hub ➔ Detroit Pharmacy",
    currentTemp: 9.1,
    tempRange: "2.0°C - 8.0°C",
    humidity: 62,
    status: "TEMP_EXCURSION",
    algoTxHash: "3B8W1L...P9X4",
    anomalyScore: 0.78,
  },
];

export default function DistributorPage() {
  const [shipments, setShipments] = useState<TelemetryShipment[]>(INITIAL_SHIPMENTS);

  const resolveAlert = (id: string) => {
    setShipments((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, currentTemp: 5.0, status: "OPTIMAL", anomalyScore: 0.05 } : s
      )
    );
  };

  return (
    <DashboardLayout role="DISTRIBUTOR">
      <div className="space-y-8">
        {/* Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-cyan-900/30 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shadow-lg shadow-emerald-500/10">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-heading text-slate-100">Cold-Chain Logistics & Telemetry</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live IoT Feed Active
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Real-time temperature and humidity stream linked to Algorand state updates and ML anomaly detection.
              </p>
            </div>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
            <div className="text-xs text-slate-400 font-medium mb-1">ACTIVE REEFER FLEET</div>
            <div className="text-2xl font-bold text-slate-100 font-mono">14 Vehicles</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" /> 100% GPS connected
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
            <div className="text-xs text-slate-400 font-medium mb-1 font-mono">COLD TEMP COMPLIANCE</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">98.2%</div>
            <div className="text-xs text-slate-500 mt-1">Range 2.0°C - 8.0°C</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
            <div className="text-xs text-slate-400 font-medium mb-1">TEMPERATURE EXCURSIONS</div>
            <div className="text-2xl font-bold text-amber-400 font-mono">1 Active Flag</div>
            <div className="text-xs text-amber-400 mt-1">Insulin shipment #SHP-2026-109</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
            <div className="text-xs text-slate-400 font-medium mb-1">BLOCKCHAIN EVENT PUSHES</div>
            <div className="text-2xl font-bold text-cyan-400 font-mono">4,120 Tx</div>
            <div className="text-xs text-slate-500 mt-1">Algorand telemetry commits</div>
          </div>
        </div>

        {/* Live Shipments Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" /> Active Shipments Telemetry Monitor
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shipments.map((s) => (
              <div
                key={s.id}
                className={`bg-slate-900/70 border rounded-2xl p-6 backdrop-blur-xl transition-all ${
                  s.status === "TEMP_EXCURSION"
                    ? "border-rose-500/50 shadow-xl shadow-rose-950/20"
                    : "border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                      {s.shipmentId}
                    </span>
                    <h3 className="text-lg font-bold text-slate-100 mt-1">{s.drugName}</h3>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">Batch: {s.batchNumber}</div>
                  </div>

                  {s.status === "OPTIMAL" ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Optimal State
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5" /> Temperature Excursion!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800/60 mb-4 font-mono">
                  <div className="text-center border-r border-slate-800">
                    <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                      <Thermometer className="w-3 h-3 text-cyan-400" /> TEMP
                    </div>
                    <div className={`text-lg font-bold ${s.currentTemp > 8.0 ? "text-rose-400" : "text-emerald-400"}`}>
                      {s.currentTemp}°C
                    </div>
                    <div className="text-[10px] text-slate-500">Target: {s.tempRange}</div>
                  </div>

                  <div className="text-center border-r border-slate-800">
                    <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                      <Droplets className="w-3 h-3 text-cyan-400" /> HUMIDITY
                    </div>
                    <div className="text-lg font-bold text-slate-200">{s.humidity}%</div>
                    <div className="text-[10px] text-slate-500">Target: 40-65%</div>
                  </div>

                  <div className="text-center">
                    <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                      <Cpu className="w-3 h-3 text-purple-400" /> RISK SCORE
                    </div>
                    <div className={`text-lg font-bold ${s.anomalyScore > 0.5 ? "text-rose-400" : "text-emerald-400"}`}>
                      {(s.anomalyScore * 100).toFixed(0)}%
                    </div>
                    <div className="text-[10px] text-slate-500">Isolation Forest</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Route: <strong className="text-slate-200">{s.route}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-slate-500" />
                    <span>Vehicle: <strong className="text-slate-200">{s.vehicle}</strong> ({s.driver})</span>
                  </div>
                </div>

                {s.status === "TEMP_EXCURSION" && (
                  <div className="mt-4 pt-3 border-t border-rose-900/30 flex items-center justify-between">
                    <span className="text-xs text-rose-300">Cooling system recalibrated</span>
                    <button
                      onClick={() => resolveAlert(s.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-all"
                    >
                      Acknowledge & Adjust Temp
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
