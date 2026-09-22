"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Boxes, Search, Package, Cpu, ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface AdminBatch {
  id: string;
  batchNumber: string;
  drugName: string;
  dosage: string;
  manufacturer: string;
  quantity: number;
  status: string;
  algoAssetId?: number;
  counterfeitRiskScore: number;
  manufacturingDate: string;
  currentHolder: string;
}

const MOCK_BATCHES: AdminBatch[] = [
  { id: "b1", batchNumber: "BN-2026-8891", drugName: "Amoxicillin Trihydrate", dosage: "500mg Capsule", manufacturer: "Apex BioPharma Inc.", quantity: 50000, status: "MINTED_ON_CHAIN", algoAssetId: 98124012, counterfeitRiskScore: 0.04, manufacturingDate: "2026-09-15", currentHolder: "FastChain Cold Logistics" },
  { id: "b2", batchNumber: "BN-2026-9012", drugName: "Metformin Hydrochloride", dosage: "850mg Tablet", manufacturer: "Apex BioPharma Inc.", quantity: 100000, status: "QUALITY_APPROVED", algoAssetId: 98124559, counterfeitRiskScore: 0.02, manufacturingDate: "2026-09-18", currentHolder: "Global Health Wholesale" },
  { id: "b3", batchNumber: "BN-2026-9140", drugName: "Atorvastatin Calcium", dosage: "20mg Tablet", manufacturer: "GlobalChem Corp", quantity: 75000, status: "CREATED", counterfeitRiskScore: 0.12, manufacturingDate: "2026-09-20", currentHolder: "Manufacturer" },
  { id: "b4", batchNumber: "PARA-2024-0891", drugName: "Paracetamol IP", dosage: "500mg Tablet", manufacturer: "SunPharma Ltd.", quantity: 200000, status: "FLAGGED", algoAssetId: 97891234, counterfeitRiskScore: 0.94, manufacturingDate: "2024-09-01", currentHolder: "Unknown Entity" },
  { id: "b5", batchNumber: "AMX-2024-0234", drugName: "Amoxicillin", dosage: "250mg Capsule", manufacturer: "Cipla Ltd.", quantity: 80000, status: "FLAGGED", algoAssetId: 97654321, counterfeitRiskScore: 0.87, manufacturingDate: "2024-08-14", currentHolder: "Anonymous Distributor" },
];

const STATUS_CFG: Record<string, { color: string; bg: string }> = {
  CREATED: { color: "#64748b", bg: "rgba(100,116,139,0.1)" },
  MINTED_ON_CHAIN: { color: "#00D4FF", bg: "rgba(0,212,255,0.08)" },
  QUALITY_APPROVED: { color: "#34d399", bg: "rgba(52,211,153,0.1)" },
  DISPATCHED: { color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  FLAGGED: { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

export default function AdminBatchesPage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");

  const filtered = MOCK_BATCHES.filter((b) => {
    const matchSearch = b.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.drugName.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === "ALL"
      || (riskFilter === "HIGH" && b.counterfeitRiskScore > 0.7)
      || (riskFilter === "MEDIUM" && b.counterfeitRiskScore > 0.2 && b.counterfeitRiskScore <= 0.7)
      || (riskFilter === "LOW" && b.counterfeitRiskScore <= 0.2);
    return matchSearch && matchRisk;
  });

  return (
    <DashboardLayout
      title="All Batches"
      subtitle="Complete cross-supply-chain batch registry with ML risk scores"
      role="admin"
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Batches", value: MOCK_BATCHES.length, color: "#00D4FF", icon: Boxes },
          { label: "On Algorand", value: MOCK_BATCHES.filter(b => b.algoAssetId).length, color: "#a78bfa", icon: Cpu },
          { label: "High Risk (≥70%)", value: MOCK_BATCHES.filter(b => b.counterfeitRiskScore >= 0.7).length, color: "#ef4444", icon: AlertTriangle },
          { label: "Total Units", value: MOCK_BATCHES.reduce((s, b) => s + b.quantity, 0).toLocaleString(), color: "#34d399", icon: Package },
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
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
            <input className="input-field pl-10" placeholder="Search batch ID or drug..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input-field" style={{ width: "auto" }}
            value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk (≥70%)</option>
            <option value="MEDIUM">Medium Risk (20-70%)</option>
            <option value="LOW">Low Risk (&lt;20%)</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Batch / Drug</th>
                <th>Manufacturer</th>
                <th>Current Holder</th>
                <th>ASA ID</th>
                <th>Qty</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((batch) => {
                const sc = STATUS_CFG[batch.status] || { color: "#64748b", bg: "rgba(100,116,139,0.1)" };
                const riskColor = batch.counterfeitRiskScore > 0.7 ? "#ef4444" : batch.counterfeitRiskScore > 0.3 ? "#f59e0b" : "#34d399";
                return (
                  <tr key={batch.id}>
                    <td>
                      <p className="font-mono font-bold text-sm" style={{ color: "#00D4FF" }}>{batch.batchNumber}</p>
                      <p className="text-xs" style={{ color: "#94a3b8" }}>{batch.drugName} · {batch.dosage}</p>
                    </td>
                    <td style={{ color: "#94a3b8" }}>{batch.manufacturer}</td>
                    <td style={{ color: "#64748b" }}>{batch.currentHolder}</td>
                    <td>
                      {batch.algoAssetId ? (
                        <span className="font-mono text-xs" style={{ color: "#a78bfa" }}>#{batch.algoAssetId}</span>
                      ) : (
                        <span className="text-xs" style={{ color: "#334155" }}>—</span>
                      )}
                    </td>
                    <td className="font-mono text-xs" style={{ color: "#64748b" }}>
                      {batch.quantity.toLocaleString()}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full" style={{ width: `${batch.counterfeitRiskScore * 100}%`, background: riskColor }} />
                        </div>
                        <span className="font-mono text-xs font-semibold" style={{ color: riskColor }}>
                          {(batch.counterfeitRiskScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs px-2 py-1 rounded-lg font-semibold"
                        style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}30` }}>
                        {batch.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td>
                      <Link href={`/verify/${batch.batchNumber}`}
                        className="text-xs hover:opacity-80 transition-opacity"
                        style={{ color: "#00D4FF" }}>
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
