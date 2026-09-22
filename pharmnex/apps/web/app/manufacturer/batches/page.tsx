"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";
import {
  Package, Cpu, CheckCircle2, Clock, ShieldCheck, AlertTriangle,
  Plus, ExternalLink, QrCode, Search, Filter
} from "lucide-react";

interface Batch {
  id: string;
  batchNumber: string;
  drugName: string;
  dosage: string;
  quantity: number;
  manufacturingDate: string;
  expiryDate: string;
  rawMaterialBatch: string;
  status: "CREATED" | "MINTED_ON_CHAIN" | "QUALITY_APPROVED" | "DISPATCHED";
  algoTxHash?: string;
  algoAssetId?: number;
  counterfeitRiskScore: number;
}

const MOCK_BATCHES: Batch[] = [
  {
    id: "b1", batchNumber: "BN-2026-8891", drugName: "Amoxicillin Trihydrate",
    dosage: "500mg Capsule", quantity: 50000, manufacturingDate: "2026-09-15",
    expiryDate: "2028-09-15", rawMaterialBatch: "RM-RAW-4091",
    status: "MINTED_ON_CHAIN", algoTxHash: "7X9K2P...M8Q1",
    algoAssetId: 98124012, counterfeitRiskScore: 0.04,
  },
  {
    id: "b2", batchNumber: "BN-2026-9012", drugName: "Metformin Hydrochloride",
    dosage: "850mg Tablet", quantity: 100000, manufacturingDate: "2026-09-18",
    expiryDate: "2029-03-18", rawMaterialBatch: "RM-RAW-4102",
    status: "QUALITY_APPROVED", algoTxHash: "3B8W1L...P9X4",
    algoAssetId: 98124559, counterfeitRiskScore: 0.02,
  },
  {
    id: "b3", batchNumber: "BN-2026-9140", drugName: "Atorvastatin Calcium",
    dosage: "20mg Tablet", quantity: 75000, manufacturingDate: "2026-09-20",
    expiryDate: "2028-09-20", rawMaterialBatch: "RM-RAW-4115",
    status: "CREATED", counterfeitRiskScore: 0.12,
  },
  {
    id: "b4", batchNumber: "BN-2026-9211", drugName: "Lisinopril",
    dosage: "10mg Tablet", quantity: 60000, manufacturingDate: "2026-09-21",
    expiryDate: "2028-09-21", rawMaterialBatch: "RM-RAW-4120",
    status: "DISPATCHED", algoTxHash: "9A2B3C...Z7Y6",
    algoAssetId: 98125001, counterfeitRiskScore: 0.06,
  },
];

const STATUS_CONFIG: Record<Batch["status"], { label: string; color: string; bg: string; icon: React.ElementType }> = {
  CREATED: { label: "Created", color: "#64748b", bg: "rgba(100,116,139,0.1)", icon: Clock },
  MINTED_ON_CHAIN: { label: "Minted On-Chain", color: "#00D4FF", bg: "rgba(0,212,255,0.08)", icon: Cpu },
  QUALITY_APPROVED: { label: "Quality Approved", color: "#34d399", bg: "rgba(52,211,153,0.1)", icon: CheckCircle2 },
  DISPATCHED: { label: "Dispatched", color: "#a78bfa", bg: "rgba(167,139,250,0.1)", icon: ShieldCheck },
};

export default function ManufacturerBatchesPage() {
  const [batches] = useState(MOCK_BATCHES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = batches.filter((b) => {
    const matchSearch = b.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.drugName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout
      title="Batch Registry"
      subtitle="All production batches with on-chain Algorand ASA tokens"
      role="manufacturer"
      actions={
        <Link href="/manufacturer" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Batch
        </Link>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Batches", value: batches.length, color: "#00D4FF", icon: Package },
          { label: "On-Chain (ASA)", value: batches.filter(b => b.algoAssetId).length, color: "#34d399", icon: Cpu },
          { label: "Quality Approved", value: batches.filter(b => b.status === "QUALITY_APPROVED" || b.status === "DISPATCHED").length, color: "#a78bfa", icon: CheckCircle2 },
          { label: "Total Units", value: batches.reduce((a, b) => a + b.quantity, 0).toLocaleString(), color: "#fbbf24", icon: ShieldCheck },
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

      {/* Filters */}
      <div className="glass-card-static p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
            <input
              className="input-field pl-10"
              placeholder="Search batch number or drug name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input-field w-auto px-4"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: "auto" }}
          >
            <option value="ALL">All Statuses</option>
            <option value="CREATED">Created</option>
            <option value="MINTED_ON_CHAIN">Minted On-Chain</option>
            <option value="QUALITY_APPROVED">Quality Approved</option>
            <option value="DISPATCHED">Dispatched</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Batch Number</th>
                <th>Drug / Dosage</th>
                <th>Qty</th>
                <th>Mfg Date</th>
                <th>Exp Date</th>
                <th>ASA / Tx Hash</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((batch) => {
                const cfg = STATUS_CONFIG[batch.status];
                const riskColor = batch.counterfeitRiskScore > 0.5 ? "#ef4444" : batch.counterfeitRiskScore > 0.2 ? "#f59e0b" : "#34d399";
                return (
                  <tr key={batch.id}>
                    <td>
                      <span className="font-mono text-sm font-semibold" style={{ color: "#00D4FF" }}>
                        {batch.batchNumber}
                      </span>
                    </td>
                    <td>
                      <p className="font-medium" style={{ color: "#e2e8f0" }}>{batch.drugName}</p>
                      <p className="text-xs" style={{ color: "#64748b" }}>{batch.dosage}</p>
                    </td>
                    <td className="font-mono" style={{ color: "#94a3b8" }}>{batch.quantity.toLocaleString()}</td>
                    <td className="font-mono text-xs" style={{ color: "#64748b" }}>{batch.manufacturingDate}</td>
                    <td className="font-mono text-xs" style={{ color: "#64748b" }}>{batch.expiryDate}</td>
                    <td>
                      {batch.algoAssetId ? (
                        <div>
                          <p className="font-mono text-xs" style={{ color: "#a78bfa" }}>#{batch.algoAssetId}</p>
                          <p className="font-mono text-xs" style={{ color: "#475569" }}>{batch.algoTxHash}</p>
                        </div>
                      ) : (
                        <span className="text-xs" style={{ color: "#475569" }}>Not minted</span>
                      )}
                    </td>
                    <td>
                      <span className="font-mono font-semibold text-xs" style={{ color: riskColor }}>
                        {(batch.counterfeitRiskScore * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td>
                      <span className="text-xs px-2 py-1 rounded-lg font-semibold"
                        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td>
                      <Link href={`/verify/${batch.batchNumber}`}
                        className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
                        style={{ color: "#00D4FF" }}>
                        <ExternalLink className="w-3 h-3" /> Verify
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-10 h-10 mx-auto mb-3" style={{ color: "#334155" }} />
            <p style={{ color: "#64748b" }}>No batches match your search.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
