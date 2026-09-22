"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ArrowRight,
  Building2,
  FlaskConical,
  Truck,
  Users,
  QrCode,
  Cpu,
  Activity,
  Lock,
  Zap,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const ROLE_CARDS = [
  {
    role: " Admin Portal",
    href: "/admin",
    icon: ShieldCheck,
    tag: "Governance & ML",
    color: "#00F0FF",
    borderGlow: "rgba(0, 240, 255, 0.4)",
    bgGlow: "rgba(0, 240, 255, 0.08)",
    badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    buttonColor: "text-cyan-400 group-hover:text-cyan-300",
    desc: " Executive command center with anomaly detection timelines, counterfeit risk donuts, and A/B synthetic test lab.",
  },
  {
    role: "Manufacturer Portal",
    href: "/manufacturer",
    icon: FlaskConical,
    tag: "Minting & Batching",
    color: "#10B981",
    borderGlow: "rgba(16, 185, 129, 0.4)",
    bgGlow: "rgba(16, 185, 129, 0.08)",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    buttonColor: "text-emerald-400 group-hover:text-emerald-300",
    desc: "Batch production synthesis, raw material binding, Algorand ASA minting, and cryptographically signed QR passports.",
  },
  {
    role: "Distributor Portal",
    href: "/distributor",
    icon: Truck,
    tag: "Cold-Chain IoT",
    color: "#F59E0B",
    borderGlow: "rgba(245, 158, 11, 0.4)",
    bgGlow: "rgba(245, 158, 11, 0.08)",
    badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    buttonColor: "text-amber-400 group-hover:text-amber-300",
    desc: "Real-time 2°C–8°C sensor telemetry, GPS route geofencing, temperature excursion alerts, and fleet handovers.",
  },
  {
    role: "Wholesaler Portal",
    href: "/wholesaler",
    icon: Building2,
    tag: "Bulk Custody",
    color: "#8B5CF6",
    borderGlow: "rgba(139, 92, 246, 0.4)",
    bgGlow: "rgba(139, 92, 246, 0.08)",
    badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    buttonColor: "text-purple-400 group-hover:text-purple-300",
    desc: "Bulk custody transfers, multi-signature contract sign-offs, regional warehouse allocations, and batch auditing.",
  },
  {
    role: "Supplier Portal",
    href: "/supplier",
    icon: Users,
    tag: "Raw Materials",
    color: "#38BDF8",
    borderGlow: "rgba(56, 189, 248, 0.4)",
    bgGlow: "rgba(56, 189, 248, 0.08)",
    badgeColor: "bg-sky-500/10 text-sky-300 border-sky-500/30",
    buttonColor: "text-sky-400 group-hover:text-sky-300",
    desc: "Active pharmaceutical ingredient (API) certificates, purity analysis logs, and raw material provenance chains.",
  },
  {
    role: "Customer Authenticator",
    href: "/customer",
    icon: QrCode,
    tag: "Patient & Pharmacy",
    color: "#F43F5E",
    borderGlow: "rgba(244, 63, 94, 0.4)",
    bgGlow: "rgba(244, 63, 94, 0.08)",
    badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    buttonColor: "text-rose-400 group-hover:text-rose-300",
    desc: "Scan QR codes on drug packs to verify immutable custody timeline, genuine ASA tokens, and report counterfeit risks.",
  },
];

const STATS = [
  { label: "Blockchain Verification", value: "100%", sub: "Algorand State Proofs", color: "text-cyan-400" },
  { label: "IoT Excursion Response", value: "<1.2s", sub: "Live Telemetry Streaming", color: "text-amber-400" },
  { label: "ML Anomaly Detection", value: "99.4%", sub: "Isolation Forest + SHAP", color: "text-emerald-400" },
  { label: "Supply Chain Latency", value: "3.4ms", sub: "Zero Microservice Hop", color: "text-purple-400" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020817] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* ─── Ambient Bright Glow Orbs ────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/12 blur-[140px]"
        />
        <div
          className="absolute top-1/3 -right-32 w-[550px] h-[550px] rounded-full bg-purple-600/12 blur-[150px]"
        />
        <div
          className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full bg-emerald-500/8 blur-[130px]"
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,240,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,1) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ─── Top Separated Header ───────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-cyan-500/10 bg-slate-950/80 backdrop-blur-2xl shadow-xl shadow-black/40 transition-all">
        <div className="landing-shell px-5 sm:px-8 py-3.5 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-teal-400 to-indigo-500 p-[1.5px] shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
                Pharmn<span className="text-cyan-400">Ex</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold tracking-wide">
                Blockchain + ML
              </span>
            </div>
          </Link>

          {/* Right Navigation */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/verify"
              className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-slate-900/90 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/15 hover:border-cyan-400/60 shadow-sm transition-all flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span className="hidden xs:inline">Public</span> Batch Verifier
            </Link>
            <Link
              href="/login"
              className="text-xs sm:text-sm font-bold px-5 py-2 rounded-xl text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Main Content Container (Centered) ─────────────────────────── */}
      <main className="landing-shell flex-1 px-5 sm:px-8 py-8 sm:py-12 relative z-10 flex flex-col gap-16 sm:gap-20">
        {/* ─── Hero Section (Centered Vertically & Horizontally) ───────── */}
        <section className="min-h-[660px] grid items-center gap-12 py-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,.8fr)] lg:gap-16">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-mono bg-gradient-to-r from-cyan-500/15 via-purple-500/15 to-emerald-500/15 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 mb-7"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Algorand ASA + Isolation Forest ML</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-[760px] text-4xl font-black font-heading tracking-[-0.045em] leading-[1.04] sm:text-6xl xl:text-7xl bg-clip-text text-transparent bg-gradient-to-br from-white via-cyan-100 to-fuchsia-300"
            >
              Trust every dose, from source to patient.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl mt-6"
            >
              A real-time intelligence layer for pharmaceutical supply chains—uniting immutable provenance, cold-chain telemetry, and AI-powered risk detection.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-9"
            >
            <Link
              href="/login"
              className="group px-6 py-3.5 rounded-2xl text-base font-bold text-slate-950 bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-400 hover:from-cyan-200 hover:to-teal-200 shadow-[0_12px_30px_rgba(34,211,238,.24)] inline-flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(34,211,238,.34)] active:translate-y-0"
            >
              <span>Enter Portal</span><ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/verify"
              className="group px-6 py-3.5 rounded-2xl text-base font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-100 border border-slate-600 hover:border-cyan-400/60 shadow-lg shadow-black/30 inline-flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <QrCode className="w-5 h-5 text-cyan-400" />
              Verify Drug Packaging
            </Link>
            </motion.div>
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-5 text-xs text-slate-400">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> End-to-end traceability</span>
              <span className="flex items-center gap-2"><Lock className="h-4 w-4 text-cyan-400" /> Tamper-evident proof</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 16 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="relative mx-auto w-full max-w-[480px]"
          >
            <div className="absolute -inset-8 rounded-full bg-cyan-500/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-cyan-400/25 bg-slate-900/75 p-5 shadow-2xl shadow-cyan-950/50 backdrop-blur-2xl sm:p-7">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-300">Live integrity signal</p>
                  <h2 className="mt-2 text-xl font-bold text-white">Batch PHX-48291</h2>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Verified
                </div>
              </div>
              <div className="mt-7 rounded-2xl border border-white/5 bg-slate-950/65 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400"><span>Cold-chain status</span><span className="font-mono text-cyan-300">4.2°C</span></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full w-[72%] rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_14px_rgba(34,211,238,.7)]" /></div>
                <div className="mt-3 flex justify-between text-[11px] text-slate-500"><span>2°C safe floor</span><span>8°C safe ceiling</span></div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"><Activity className="h-5 w-5 text-fuchsia-300" /><p className="mt-3 text-2xl font-bold text-white">99.4%</p><p className="mt-1 text-xs text-slate-400">Risk confidence</p></div>
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"><Cpu className="h-5 w-5 text-cyan-300" /><p className="mt-3 text-2xl font-bold text-white">0</p><p className="mt-1 text-xs text-slate-400">Anomalies detected</p></div>
              </div>
              <div className="mt-5 flex items-center gap-3 border-t border-white/5 pt-5 text-xs text-slate-400"><ShieldCheck className="h-5 w-5 text-cyan-400" /> Cryptographically anchored on Algorand</div>
            </div>
          </motion.div>
        </section>

        {/* ─── Bright Live Stats Ribbon (Scroll Animated) ────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-xl shadow-2xl shadow-cyan-950/20"
        >
          {STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
              <span className={`text-3xl sm:text-4xl font-black font-heading ${stat.color} tracking-tight`}>
                {stat.value}
              </span>
              <span className="text-sm font-semibold text-slate-200">{stat.label}</span>
              <span className="text-xs text-slate-400">{stat.sub}</span>
            </div>
          ))}
        </motion.section>

        {/* ─── 6 Role Portals Grid (Scroll Animated) ────────────────────── */}
        <section className="flex flex-col items-center gap-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/25">
              <Zap className="w-3.5 h-3.5 text-purple-400" /> Multi-Role Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              Enterprise Role Portals
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Access your role-specific portal to manage batches, monitor IoT cold chains, evaluate ML models, and transfer custody.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-9 w-full max-w-[1240px] mx-auto">
            {ROLE_CARDS.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.role}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Link
                    href={card.href}
                    className="role-portal-card group relative flex flex-col justify-between min-h-[300px] h-full p-8 sm:p-9 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl transition-all duration-300 shadow-xl overflow-hidden"
                    style={{
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Top glowing aura gradient on hover */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl transition-opacity opacity-70 group-hover:opacity-100"
                      style={{ background: `linear-gradient(90deg, transparent, ${card.color}, transparent)` }}
                    />

                    <div>
                      {/* Icon & Badge */}
                      <div className="flex items-center justify-between mb-5">
                        <div
                          className="w-13 h-13 rounded-2xl flex items-center justify-center p-3 shadow-lg transition-transform duration-300 group-hover:scale-110"
                          style={{
                            background: card.bgGlow,
                            border: `1px solid ${card.borderGlow}`,
                            color: card.color,
                          }}
                        >
                          <Icon className="w-7 h-7" />
                        </div>
                        <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                          {card.tag}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-2xl font-bold font-heading text-white group-hover:text-cyan-300 transition-colors">
                        {card.role}
                      </h3>
                      <p className="text-[15px] text-slate-300 mt-4 leading-7 max-w-[52ch]">
                        {card.desc}
                      </p>
                    </div>

                    {/* Launch Link Footer */}
                    <div className="mt-8 pt-5 border-t border-slate-700/70 flex items-center justify-between text-sm font-semibold">
                      <span className={`${card.buttonColor} tracking-wide`}>Launch Portal</span>
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-800/80 text-slate-200 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300"
                      >
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-8 px-6 mt-16 relative z-10">
        <div className="landing-shell flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
            <span className="text-slate-300 font-medium">Algorand TestNet Status: Operational</span>
          </div>
          <p>© {new Date().getFullYear()} PharmnEx Intelligence Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
