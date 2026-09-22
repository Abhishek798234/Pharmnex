"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  QrCode, ShieldCheck, AlertOctagon, CheckCircle2, Search, ExternalLink,
  FlaskConical, Calendar, Building2, Cpu, ArrowRight
} from "lucide-react";
import Link from "next/link";

interface VerificationResult {
  batchNumber: string;
  drugName: string;
  dosage: string;
  manufacturer: string;
  mfgDate: string;
  expDate: string;
  algoAssetId: number;
  algoTxHash: string;
  status: "AUTHENTIC" | "SUSPECT" | "EXPIRED";
  counterfeitRiskScore: number;
  custodyChain: {
    role: string;
    entity: string;
    timestamp: string;
    status: string;
  }[];
}

const SAMPLE_VERIFICATIONS: Record<string, VerificationResult> = {
  "BN-2026-8891": {
    batchNumber: "BN-2026-8891",
    drugName: "Amoxicillin Trihydrate",
    dosage: "500mg Capsule",
    manufacturer: "Apex BioPharma Inc.",
    mfgDate: "2026-09-15",
    expDate: "2028-09-15",
    algoAssetId: 98124012,
    algoTxHash: "7X9K2P4L9M8Q1...Z",
    status: "AUTHENTIC",
    counterfeitRiskScore: 0.04,
    custodyChain: [
      { role: "Manufacturer", entity: "Apex BioPharma Inc.", timestamp: "2026-09-15 08:00", status: "Minted ASA Token" },
      { role: "Wholesaler", entity: "Global Health Wholesale", timestamp: "2026-09-17 11:30", status: "Custody Transfer Verified" },
      { role: "Distributor", entity: "FastChain Cold Logistics", timestamp: "2026-09-19 14:20", status: "IoT Temp Monitored (4.2°C)" },
      { role: "Pharmacy", entity: "MedPlus Pharmacy #402", timestamp: "2026-09-21 10:00", status: "Received & Shelf Ready" },
    ],
  },
  "BN-2026-9012": {
    batchNumber: "BN-2026-9012",
    drugName: "Metformin Hydrochloride",
    dosage: "850mg Tablet",
    manufacturer: "Apex BioPharma Inc.",
    mfgDate: "2026-09-18",
    expDate: "2029-03-18",
    algoAssetId: 98124559,
    algoTxHash: "3B8W1L9P4...X4",
    status: "AUTHENTIC",
    counterfeitRiskScore: 0.02,
    custodyChain: [
      { role: "Manufacturer", entity: "Apex BioPharma Inc.", timestamp: "2026-09-18 09:00", status: "Minted ASA Token" },
      { role: "Wholesaler", entity: "Global Health Wholesale", timestamp: "2026-09-19 14:00", status: "Custody Transfer Verified" },
    ],
  },
};

export default function CustomerPage() {
  const [inputBatch, setInputBatch] = useState("BN-2026-8891");
  const [result, setResult] = useState<VerificationResult | null>(SAMPLE_VERIFICATIONS["BN-2026-8891"]);
  const [isScanning, setIsScanning] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const found = SAMPLE_VERIFICATIONS[inputBatch.trim()];
    if (found) {
      setResult(found);
    } else {
      setResult({
        batchNumber: inputBatch,
        drugName: "Unknown Pharmaceutical Product",
        dosage: "N/A",
        manufacturer: "Unverified Entity",
        mfgDate: "N/A",
        expDate: "N/A",
        algoAssetId: 0,
        algoTxHash: "None",
        status: "SUSPECT",
        counterfeitRiskScore: 0.94,
        custodyChain: [],
      });
    }
  };

  const triggerScanSim = () => {
    setIsScanning(true);
    setTimeout(() => {
      setInputBatch("BN-2026-8891");
      setResult(SAMPLE_VERIFICATIONS["BN-2026-8891"]);
      setIsScanning(false);
    }, 1200);
  };

  return (
    <DashboardLayout role="CUSTOMER">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Banner */}
        <div className="text-center space-y-3 bg-gradient-to-b from-cyan-950/40 via-slate-900/60 to-slate-900/80 border border-cyan-500/20 p-8 rounded-3xl backdrop-blur-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <ShieldCheck className="w-4 h-4" /> Algorand Zero-Trust Authenticator
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-slate-100">
            Verify Medicine Authenticity
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Scan the QR code on your medicine packaging or enter the Batch ID to verify immutable blockchain provenance and AI counterfeit safety index.
          </p>

          {/* Search Box */}
          <form onSubmit={handleVerify} className="max-w-xl mx-auto pt-4 flex gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Enter Batch ID e.g. BN-2026-8891"
                value={inputBatch}
                onChange={(e) => setInputBatch(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-mono shadow-inner"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl font-medium text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 font-semibold shadow-lg shadow-cyan-500/25 transition-all"
            >
              Verify
            </button>

            <button
              type="button"
              onClick={triggerScanSim}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 flex items-center justify-center transition-colors"
              title="Simulate Camera QR Scan"
            >
              <QrCode className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Verification Certificate */}
        {result && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Status Header Badge */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                  Batch Certificate #{result.batchNumber}
                </span>
                <h2 className="text-2xl font-bold font-heading text-slate-100 mt-1">{result.drugName}</h2>
                <p className="text-slate-400 text-sm">{result.dosage}</p>
              </div>

              {result.status === "AUTHENTIC" ? (
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-5 py-3 rounded-2xl">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  <div>
                    <div className="text-sm font-bold text-emerald-300">BLOCKCHAIN VERIFIED</div>
                    <div className="text-xs text-emerald-400/80">On-chain record found · ASA #{result.algoAssetId}</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/30 px-5 py-3 rounded-2xl">
                  <AlertOctagon className="w-8 h-8 text-rose-400 animate-pulse" />
                  <div>
                    <div className="text-sm font-bold text-rose-300">UNVERIFIED / SUSPECT</div>
                    <div className="text-xs text-rose-400/80">No valid blockchain anchor found</div>
                  </div>
                </div>
              )}
            </div>

            {/* Spec Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Manufacturer
                </div>
                <div className="text-sm font-semibold text-slate-200">{result.manufacturer}</div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Expiry Date
                </div>
                <div className="text-sm font-semibold text-slate-200 font-mono">{result.expDate}</div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Counterfeit Risk
                </div>
                <div className={`text-sm font-semibold font-mono ${
                  result.counterfeitRiskScore < 0.35 ? "text-emerald-400" :
                  result.counterfeitRiskScore < 0.70 ? "text-amber-400" : "text-rose-400"
                }`}>
                  {(result.counterfeitRiskScore * 100).toFixed(1)}%{" "}
                  ({result.counterfeitRiskScore < 0.35 ? "Low" : result.counterfeitRiskScore < 0.70 ? "Medium" : "High"} Risk Estimate)
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Algorand Asset ID
                </div>
                <div className="text-sm font-semibold text-cyan-400 font-mono">#{result.algoAssetId || "N/A"}</div>
              </div>
            </div>

            {/* Custody Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold font-heading text-slate-200 uppercase tracking-wider">
                Full Supply Chain Trail of Custody
              </h3>

              <div className="space-y-3 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                {result.custodyChain.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-10">
                    <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-slate-900" />
                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-cyan-400">{step.role}</div>
                        <div className="text-sm font-semibold text-slate-200">{step.entity}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{step.status}</div>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">{step.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap justify-between gap-4">
              <Link
                href={`/verify/${result.batchNumber}`}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                View Public Immutable Certificate Link <ExternalLink className="w-3 h-3" />
              </Link>

              <button
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
              >
                Report Suspect Counterfeit Package
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
