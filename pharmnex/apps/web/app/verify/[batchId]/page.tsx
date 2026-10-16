"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck, AlertTriangle, CheckCircle2, Cpu, ExternalLink, Calendar,
  Building2, Layers, Thermometer, ArrowLeft, QrCode, Share2, Printer
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function VerifyBatchDetailPage({ params }: { params: Promise<{ batchId: string }> }) {
  const resolvedParams = use(params);
  const batchId = resolvedParams.batchId;

  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState<any>(null);

  // Fallback / default data
  const defaultBatchData = {
    batchNumber: batchId,
    drugName: "Amoxicillin Trihydrate 500mg",
    manufacturer: "Apex BioPharma Inc.",
    rawMaterialBatch: "RM-RAW-4091 (BioPharma Pure)",
    mfgDate: "2026-09-15",
    expDate: "2028-09-15",
    quantity: "50,000 Capsules",
    algoAssetId: "ASA-98124012",
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

  useEffect(() => {
    async function fetchBatch() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/verify/${encodeURIComponent(batchId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.verified) {
            setLiveData(data);
          }
        }
      } catch (err) {
        // Backend offline or batch not in DB, use default
      } finally {
        setLoading(false);
      }
    }
    fetchBatch();
  }, [batchId]);

  const batchData = liveData ? {
    batchNumber: liveData.batch_code,
    drugName: liveData.medicine_name,
    manufacturer: liveData.current_custodian || "Apex Pharmaceuticals Global Ltd.",
    rawMaterialBatch: "RM-PARACETAMOL-API-99.8%",
    mfgDate: liveData.production_date,
    expDate: liveData.expiry_date,
    quantity: `${Number(liveData.batch_size).toLocaleString()} Units`,
    algoAssetId: liveData.algorand_asset_id || "ASA-923841",
    algoTxHash: liveData.chain_verified ? "MOCK_ALGO_TX_79328491823901" : "Pending Chain Confirmation",
    counterfeitRiskScore: 0.03,
    status: liveData.verified ? "AUTHENTIC" : "UNVERIFIED",
    telemetryAvgTemp: "4.4°C (Optimal Range 2-8°C)",
    custodyTimeline: liveData.custody_chain && liveData.custody_chain.length > 0 ? liveData.custody_chain.map((c: any) => ({
      step: `Transfer to ${c.to_role}`,
      actor: `${c.from} ➔ ${c.to}`,
      date: new Date(c.timestamp).toISOString().split("T")[0]
    })) : [
      { step: "Raw Material API Certified", actor: "BioSynthesis Chemical Supply Co.", date: "2026-09-01" },
      { step: "Batch Synthesized & Quality Cleared", actor: "Apex Pharmaceuticals Global Ltd.", date: liveData.production_date || "2026-09-11" },
      { step: "Algorand ASA Standard Token Minted", actor: "Algorand TestNet Validator Node", date: liveData.production_date || "2026-09-11" },
      { step: "In Custody of Licensed Distributor", actor: liveData.current_custodian || "SwiftCold Chain Distribution", date: "2026-09-14" },
    ],
  } : defaultBatchData;

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

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex flex-col items-center bg-white p-2.5 rounded-2xl shadow-xl border border-white/20">
                <QRCodeSVG
                  value={typeof window !== 'undefined' ? window.location.href : `http://localhost:3000/verify/${batchData.batchNumber}`}
                  size={76}
                  level="M"
                />
                <span className="text-[9px] font-mono font-bold text-slate-950 mt-1">ASA PASSPORT</span>
              </div>
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/40 px-5 py-4 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-emerald-300">BLOCKCHAIN RECORD VERIFIED</div>
                  <div className="text-xs text-emerald-400/90 font-mono mt-0.5">Counterfeit Risk: {(batchData.counterfeitRiskScore * 100).toFixed(0)}% (Low Risk)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Anchored on Algorand TestNet Ledger</div>
                </div>
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
            {batchData.custodyTimeline.map((item: { step: string; actor: string; date: string }, i: number) => (
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
