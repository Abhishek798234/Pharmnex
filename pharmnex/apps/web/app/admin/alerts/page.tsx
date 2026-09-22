"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AlertTriangle, ShieldAlert, Cpu, CheckCircle2, RefreshCw, Activity, Terminal } from "lucide-react";

interface AnomalyAlert {
  id: string;
  type: "COLD_EXCURSION" | "COUNTERFEIT_FLAG" | "UNAUTHORIZED_CUSTODY_ATTEMPT" | "SCAN_SPIKE";
  severity: "HIGH" | "CRITICAL" | "MEDIUM";
  batchNumber: string;
  location: string;
  timestamp: string;
  details: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
}

const MOCK_ALERTS: AnomalyAlert[] = [
  {
    id: "alt-101",
    type: "COLD_EXCURSION",
    severity: "HIGH",
    batchNumber: "BN-2026-9012",
    location: "Reefer Truck #12 (Chicago Route)",
    timestamp: "2026-09-21 17:42:10",
    details: "Temperature reading exceeded 8.0°C upper boundary (logged 9.1°C for 24 min). Isolation Forest anomaly index 0.78.",
    status: "OPEN",
  },
  {
    id: "alt-102",
    type: "SCAN_SPIKE",
    severity: "CRITICAL",
    batchNumber: "BN-2026-9140",
    location: "GPS Geofence: Node #442 (Miami)",
    timestamp: "2026-09-21 16:15:00",
    details: "Unusual surge of 1,400 verification queries in 10 minutes from duplicate IP blocks. Potential counterfeit barcode duplication.",
    status: "INVESTIGATING",
  },
];

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(MOCK_ALERTS);

  const resolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "RESOLVED" } : a))
    );
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        {/* Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-rose-900/40 via-amber-900/30 to-purple-900/30 border border-rose-500/20 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold shadow-lg shadow-rose-500/10">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-heading text-slate-100">AI Anomaly & Security Intelligence</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Isolation Forest + XGBoost Active
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Real-time security telemetry monitoring cold-chain sensor breaches, counterfeit QR cloning, and suspicious custody transfers.
              </p>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-400" /> Active Security Alerts ({alerts.filter((a) => a.status !== "RESOLVED").length})
          </h2>

          <div className="space-y-4">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className={`bg-slate-900/70 border rounded-2xl p-6 backdrop-blur-xl transition-all ${
                  alt.status === "RESOLVED"
                    ? "border-slate-800 opacity-60"
                    : alt.severity === "CRITICAL"
                    ? "border-rose-500/50 bg-rose-950/20"
                    : "border-amber-500/40 bg-amber-950/20"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                        alt.severity === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      }`}
                    >
                      {alt.severity} RISK
                    </span>
                    <span className="text-xs font-mono text-cyan-400">Batch: {alt.batchNumber}</span>
                    <span className="text-xs text-slate-500 font-mono">{alt.timestamp}</span>
                  </div>

                  {alt.status !== "RESOLVED" ? (
                    <button
                      onClick={() => resolveAlert(alt.id)}
                      className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-all self-start md:self-auto"
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Incident Resolved
                    </span>
                  )}
                </div>

                <p className="text-slate-200 text-sm font-medium mb-2">{alt.details}</p>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono flex items-center justify-between">
                  <span>Location Flag: {alt.location}</span>
                  <span className="text-cyan-400">Algorand State Auto-Frozen</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
