"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  FlaskConical, Plus, Package, ShieldCheck, QrCode, Cpu, ArrowRight, CheckCircle2,
  AlertTriangle, RefreshCw, BarChart3, Database, Layers, Sparkles, ExternalLink
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

const INITIAL_BATCHES: Batch[] = [
  {
    id: "b1",
    batchNumber: "BN-2026-8891",
    drugName: "Amoxicillin Trihydrate",
    dosage: "500mg Capsule",
    quantity: 50000,
    manufacturingDate: "2026-09-15",
    expiryDate: "2028-09-15",
    rawMaterialBatch: "RM-RAW-4091",
    status: "MINTED_ON_CHAIN",
    algoTxHash: "7X9K2P...M8Q1",
    algoAssetId: 98124012,
    counterfeitRiskScore: 0.04,
  },
  {
    id: "b2",
    batchNumber: "BN-2026-9012",
    drugName: "Metformin Hydrochloride",
    dosage: "850mg Tablet",
    quantity: 100000,
    manufacturingDate: "2026-09-18",
    expiryDate: "2029-03-18",
    rawMaterialBatch: "RM-RAW-4102",
    status: "MINTED_ON_CHAIN",
    algoTxHash: "3B8W1L...P9X4",
    algoAssetId: 98124559,
    counterfeitRiskScore: 0.02,
  },
  {
    id: "b3",
    batchNumber: "BN-2026-9140",
    drugName: "Atorvastatin Calcium",
    dosage: "20mg Tablet",
    quantity: 75000,
    manufacturingDate: "2026-09-20",
    expiryDate: "2028-09-20",
    rawMaterialBatch: "RM-RAW-4115",
    status: "CREATED",
    counterfeitRiskScore: 0.12,
  },
];

export default function ManufacturerPage() {
  const [batches, setBatches] = useState<Batch[]>(INITIAL_BATCHES);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    drugName: "Lipitor (Atorvastatin)",
    dosage: "10mg",
    quantity: "25000",
    rawMaterialBatch: "RM-RAW-4115",
    expiryMonths: "24",
  });

  const [isMinting, setIsMinting] = useState<string | null>(null);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch: Batch = {
      id: `b${Date.now()}`,
      batchNumber: `BN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      drugName: formData.drugName,
      dosage: formData.dosage,
      quantity: parseInt(formData.quantity) || 10000,
      manufacturingDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + parseInt(formData.expiryMonths) * 30 * 24 * 3600 * 1000).toISOString().split("T")[0],
      rawMaterialBatch: formData.rawMaterialBatch,
      status: "CREATED",
      counterfeitRiskScore: 0.03,
    };
    setBatches([newBatch, ...batches]);
    setShowCreateModal(false);
  };

  const mintOnAlgorand = (batchId: string) => {
    setIsMinting(batchId);
    setTimeout(() => {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === batchId
            ? {
                ...b,
                status: "MINTED_ON_CHAIN",
                algoTxHash: `${Math.random().toString(36).substring(2, 8).toUpperCase()}...${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                algoAssetId: Math.floor(90000000 + Math.random() * 10000000),
              }
            : b
        )
      );
      setIsMinting(null);
    }, 1800);
  };

  return (
    <DashboardLayout role="MANUFACTURER">
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-purple-900/30 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold shadow-lg shadow-cyan-500/10">
              <FlaskConical className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-heading text-slate-100">Pharmaceutical Production Suite</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Algorand ASA Minting Active
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Synthesize medicine batches, bind raw material provenance, and mint verifiable ASA tokens on Algorand.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            Manufacture New Batch
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium mb-2">
              <span>ACTIVE BATCHES</span>
              <Package className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100 font-mono">{batches.length}</div>
            <div className="text-xs text-slate-500 mt-1">3 ready for distribution</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium mb-2">
              <span>ALGORAND ASA TOKENS</span>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100 font-mono">
              {batches.filter((b) => b.status === "MINTED_ON_CHAIN").length}
            </div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.0 h-3.0" /> Immutable proof on-chain
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium mb-2">
              <span>RAW MATERIAL CONSUMPTION</span>
              <Database className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100 font-mono">1,420 kg</div>
            <div className="text-xs text-slate-500 mt-1">Active supplier: BioPharma Pure</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium mb-2">
              <span>QUALITY INTEGRITY AVG</span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">99.4%</div>
            <div className="text-xs text-slate-500 mt-1">0 defect flag in last 30d</div>
          </div>
        </div>

        {/* Batches Table Section */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-heading text-slate-100">Batches & Blockchain Assets</h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage batch production lifecycle and trigger Algorand state updates</p>
            </div>
            <span className="text-xs font-mono text-cyan-400/80 bg-cyan-950/40 px-3 py-1 rounded-lg border border-cyan-800/30">
              Total Units: {batches.reduce((acc, b) => acc + b.quantity, 0).toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Batch Number</th>
                  <th className="px-6 py-4">Drug & Dosage</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Raw Material Link</th>
                  <th className="px-6 py-4">Algorand ASA State</th>
                  <th className="px-6 py-4">Risk Index</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-100 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      {batch.batchNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">{batch.drugName}</div>
                      <div className="text-xs text-slate-400 font-mono">{batch.dosage}</div>
                    </td>
                    <td className="px-6 py-4 font-mono">{batch.quantity.toLocaleString()} units</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 font-mono text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        <Layers className="w-3 h-3 text-cyan-400" />
                        {batch.rawMaterialBatch}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {batch.status === "MINTED_ON_CHAIN" ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Minted ASA #{batch.algoAssetId}
                          </span>
                          <div className="text-[11px] font-mono text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors flex items-center gap-1">
                            Tx: {batch.algoTxHash} <ExternalLink className="w-2.5 h-2.5" />
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Sparkles className="w-3 h-3" /> Ready to Mint
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              batch.counterfeitRiskScore < 0.1
                                ? "bg-emerald-400"
                                : batch.counterfeitRiskScore < 0.3
                                ? "bg-amber-400"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${batch.counterfeitRiskScore * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-slate-300">
                          {(batch.counterfeitRiskScore * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {batch.status === "CREATED" && (
                          <button
                            onClick={() => mintOnAlgorand(batch.id)}
                            disabled={isMinting === batch.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 flex items-center gap-1.5 transition-all"
                          >
                            {isMinting === batch.id ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin" /> Minting ASA...
                              </>
                            ) : (
                              <>
                                <Cpu className="w-3 h-3" /> Mint on Algorand
                              </>
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedBatch(batch)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Generate QR Code & Passport"
                        >
                          <QrCode className="w-4 h-4 text-cyan-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Manufacture Batch */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
              <h3 className="text-xl font-bold font-heading text-slate-100 mb-1">Create Medicine Batch</h3>
              <p className="text-xs text-slate-400 mb-6">Bind raw materials and prepare Algorand cryptographic payload</p>

              <form onSubmit={handleCreateBatch} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Drug Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.drugName}
                    onChange={(e) => setFormData({ ...formData, drugName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Dosage Form
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.dosage}
                      onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Units Quantity
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Raw Material Batch Identifier
                  </label>
                  <select
                    value={formData.rawMaterialBatch}
                    onChange={(e) => setFormData({ ...formData, rawMaterialBatch: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="RM-RAW-4091">RM-RAW-4091 (BioPharma Pure - Active)</option>
                    <option value="RM-RAW-4102">RM-RAW-4102 (BioPharma Pure - Approved)</option>
                    <option value="RM-RAW-4115">RM-RAW-4115 (GlobalChem Labs - Verified)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Shelf Life (Months)
                  </label>
                  <input
                    type="number"
                    value={formData.expiryMonths}
                    onChange={(e) => setFormData({ ...formData, expiryMonths: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-sm font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 font-semibold shadow-lg shadow-cyan-500/20"
                  >
                    Create & Register Batch
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: QR Code & Digital Passport Details */}
        {selectedBatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-center">
              <h3 className="text-xl font-bold font-heading text-slate-100">Digital Product Passport</h3>
              <p className="text-xs text-slate-400 mb-4">{selectedBatch.batchNumber}</p>

              <div className="bg-white p-4 rounded-2xl inline-block my-2 shadow-xl border border-slate-700">
                {/* Simulated QR Code SVG pattern */}
                <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="white" />
                  {/* Position detection patterns */}
                  <rect x="5" y="5" width="30" height="30" fill="black" />
                  <rect x="9" y="9" width="22" height="22" fill="white" />
                  <rect x="13" y="13" width="14" height="14" fill="black" />

                  <rect x="65" y="5" width="30" height="30" fill="black" />
                  <rect x="69" y="9" width="22" height="22" fill="white" />
                  <rect x="73" y="13" width="14" height="14" fill="black" />

                  <rect x="5" y="65" width="30" height="30" fill="black" />
                  <rect x="9" y="69" width="22" height="22" fill="white" />
                  <rect x="13" y="73" width="14" height="14" fill="black" />

                  {/* Random data squares */}
                  <rect x="40" y="10" width="8" height="8" fill="black" />
                  <rect x="50" y="20" width="8" height="8" fill="black" />
                  <rect x="42" y="35" width="6" height="6" fill="black" />
                  <rect x="15" y="45" width="8" height="8" fill="black" />
                  <rect x="50" y="50" width="12" height="12" fill="black" />
                  <rect x="70" y="45" width="8" height="8" fill="black" />
                  <rect x="45" y="70" width="10" height="10" fill="black" />
                  <rect x="65" y="75" width="8" height="8" fill="black" />
                  <rect x="80" y="60" width="10" height="10" fill="black" />
                </svg>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-left space-y-1.5 my-4 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">ASA Token:</span>
                  <span className="text-cyan-400">#{selectedBatch.algoAssetId || "Pending"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Drug:</span>
                  <span className="text-slate-200">{selectedBatch.drugName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Raw Source:</span>
                  <span className="text-slate-200">{selectedBatch.rawMaterialBatch}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedBatch(null)}
                  className="w-full py-2.5 rounded-xl font-medium text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  Close Passport
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
