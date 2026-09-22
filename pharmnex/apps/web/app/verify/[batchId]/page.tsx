"use client";

import { use } from "react";
import Link from "next/link";
import {
  ShieldCheck, AlertTriangle, CheckCircle2, Cpu, ExternalLink, Calendar,
  Building2, Layers, Thermometer, ArrowLeft, QrCode, Share2
} from "lucide-react";

export default function VerifyBatchDetailPage({ params }: { params: Promise<{ batchId: string }> }) {
  const resolvedParams = use(params);
  const batchId = resolvedParams.batchId;

  // Mock batch lookup
  const batchData = {
    batchNumber: batchId,
    drugName: "Amoxicillin Trihydrate 500mg",
    manufacturer: "Apex BioPharma Inc.",
    rawMaterialBatch: "RM-RAW-4091 (BioPharma Pure)",
    mfgDate: "2026-09-15",
    expDate: "2028-09-15",
    quantity: "50,000 Capsules",
    algoAssetId: 98124012,
    algoTxHash: "7X9K2P4L9M8Q1Z3A7B9C1D2E3F4G5H6I7J8K9L0M",
    counterfeitRiskScore: 0.04,
    status: "AUTHENTIC",
    telemetryAvgTemp: "4.2°C (Optimal Range 2-8°C)",
    custodyTimeline: [
      { step: "Raw Material Certified", actor: "BioPharma Pure LLC", date: "2026-09-10" },
      { step: "Batch Synthesized & Minted ASA", actor: "Apex BioPharma Inc.", date: "2026-09-15" },
      { step: "Wholesale Inspection", actor: "Global Health Wholesale", date: "2026-09-17" },
      { step: "Cold-Chain Dispatch", actor: "FastChain Cold Logistics", date: "2026-09-19" },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/verify" className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </Link>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span className="font-heading font-bold text-slate-100">Algorand Immutable Passport</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full p-6 space-y-8 my-6">
        {/* Verification Status Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 mb-3">
                <Cpu className="w-3.5 h-3.5" /> Algorand Standard Asset (ASA) #{batchData.algoAssetId}
              </div>
              <h1 className="text-3xl font-extrabold font-heading text-slate-100">{batchData.drugName}</h1>
              <p className="text-slate-400 font-mono text-sm mt-1">Batch Identifier: {batchData.batchNumber}</p>
            </div>

            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/40 px-6 py-4 rounded-2xl">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
              <div>
                <div className="text-base font-bold text-emerald-300">BLOCKCHAIN RECORD FOUND</div>
                <div className="text-xs text-emerald-400/80">Counterfeit risk estimate: {(batchData.counterfeitRiskScore * 100).toFixed(0)}% (Low)</div>
                <div className="text-xs text-slate-500 mt-0.5">Risk is an ML estimate, not a guarantee of authenticity</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Blockchain & Provenance */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" /> Blockchain Credentials
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block mb-1">Algorand ASA ID</span>
                <span className="text-cyan-400 text-sm font-bold">#{batchData.algoAssetId}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block mb-1">Creation Transaction Hash</span>
                <span className="text-slate-300 break-all">{batchData.algoTxHash}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block mb-1">Raw Material Provenance Link</span>
                <span className="text-purple-400 font-bold">{batchData.rawMaterialBatch}</span>
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" /> Manufacturing Specs
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Manufacturer Name</span>
                <span className="font-semibold text-slate-200">{batchData.manufacturer}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800 font-mono">
                <span className="text-slate-400">Manufacturing Date</span>
                <span className="text-slate-200">{batchData.mfgDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800 font-mono">
                <span className="text-slate-400">Expiration Date</span>
                <span className="text-slate-200">{batchData.expDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Cold Telemetry Sensor Avg</span>
                <span className="text-emerald-400 font-mono">{batchData.telemetryAvgTemp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold font-heading text-slate-100">Supply Chain Ledger Steps</h2>

          <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {batchData.custodyTimeline.map((item, i) => (
              <div key={i} className="relative flex items-center justify-between pl-8">
                <div className="absolute left-2 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-slate-900" />
                <div>
                  <div className="text-sm font-semibold text-slate-200">{item.step}</div>
                  <div className="text-xs text-slate-400">{item.actor}</div>
                </div>
                <div className="text-xs font-mono text-slate-500">{item.date}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
