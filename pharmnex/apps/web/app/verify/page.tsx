"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Search, QrCode, ArrowRight, ExternalLink, Activity, Cpu } from "lucide-react";

export default function VerifySearchPage() {
  const [batchId, setBatchId] = useState("");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-slate-100">PharmnEx</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40 ml-2">
              Public Ledger
            </span>
          </div>
        </div>

        <Link
          href="/login"
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
        >
          Portal Login
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="w-full max-w-2xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            <Cpu className="w-3.5 h-3.5" /> Algorand Blockchain Verification Engine
          </div>

          <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight leading-tight md:leading-[1.2] py-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-cyan-200 to-blue-400">
            Zero-Trust Pharmaceutical Batch Explorer
          </h1>

          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Verify medicine authenticity, active ingredients, cold-chain temperature telemetry, and raw material origins via immutable Algorand state proofs.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (batchId) window.location.href = `/verify/${batchId}`;
            }}
            className="flex flex-col sm:flex-row gap-3 pt-4"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="Enter Batch ID (e.g., BATCH-2026-0921-A)"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                style={{ paddingLeft: "52px" }}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl pr-4 py-3.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-400 shadow-xl"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all"
            >
              Verify On-Chain <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Links */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-xs">
            <span className="text-slate-500 font-mono">Try sample batch:</span>
            <Link
              href="/verify/BN-2026-8891"
              className="font-mono text-cyan-400 hover:underline px-3 py-1 rounded-lg bg-slate-900 border border-slate-800"
            >
              BN-2026-8891 (Amoxicillin)
            </Link>
            <Link
              href="/verify/BN-2026-9012"
              className="font-mono text-cyan-400 hover:underline px-3 py-1 rounded-lg bg-slate-900 border border-slate-800"
            >
              BN-2026-9012 (Metformin)
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
