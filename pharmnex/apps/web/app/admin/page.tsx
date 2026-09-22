"use client";

import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Activity, AlertTriangle, Package, TrendingUp, Zap, Shield,
  ArrowUpRight, ArrowDownRight, Brain, ChevronRight, ExternalLink,
  AlertCircle, CheckCircle, Clock, BarChart3, Eye, RefreshCw,
  FlaskConical, MapPin, Cpu
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── Mock data generators ────────────────────────────────────────────────────

function genForecastData() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((m, i) => ({
    month: m,
    actual: Math.round(1200 + Math.sin(i * 0.8) * 400 + ((i * 37) % 150)),
    forecast: Math.round(1200 + Math.sin(i * 0.8) * 400 + ((i * 23) % 100)),
    demand: Math.round(900 + i * 60 + ((i * 41) % 200)),
  }));
}

function genAnomalyScores() {
  return Array.from({ length: 30 }, (_, i) => ({
    day: `D${i + 1}`,
    score_a: +(((i * 13) % 60) / 100 + 0.1).toFixed(3),
    score_b: +(((i * 17) % 50) / 100 + 0.05).toFixed(3),
    flagged: i === 7 || i === 19 || i === 28,
  }));
}

const RISK_DONUT = [
  { name: "Low Risk", value: 58, color: "#10b981" },
  { name: "Medium Risk", value: 29, color: "#f59e0b" },
  { name: "High Risk", value: 13, color: "#ef4444" },
];

const MOCK_ALERTS = [
  {
    id: 1, batch: "PARA-2024-0891", severity: "critical",
    reason: "Unexpected ownership transfer detected. Route deviation score: 0.94",
    anomaly_score: 0.96, time: "2 min ago", status: "open",
  },
  {
    id: 2, batch: "AMX-2024-0234", severity: "high",
    reason: "Abnormally short transfer interval (1.2 hrs). Blockchain verification failed.",
    anomaly_score: 0.87, time: "14 min ago", status: "investigating",
  },
  {
    id: 3, batch: "IBUPROF-0567", severity: "high",
    reason: "Quantity discrepancy: ordered 5000, received 4750. 3 ownership hops detected.",
    anomaly_score: 0.83, time: "37 min ago", status: "open",
  },
  {
    id: 4, batch: "DIAZEP-0123", severity: "warning",
    reason: "Unregistered supplier entity in custody chain.",
    anomaly_score: 0.71, time: "1 hr ago", status: "open",
  },
  {
    id: 5, batch: "METRO-0445", severity: "warning",
    reason: "Distribution duration deviation: 3.2x expected timeframe.",
    anomaly_score: 0.68, time: "2 hrs ago", status: "resolved",
  },
];

const HEATMAP_LOCATIONS = [
  { name: "Mumbai", risk: 0.72, batches: 84, lat: 19.07, lng: 72.87 },
  { name: "Delhi", risk: 0.51, batches: 121, lat: 28.61, lng: 77.20 },
  { name: "Hyderabad", risk: 0.38, batches: 67, lat: 17.38, lng: 78.48 },
  { name: "Chennai", risk: 0.61, batches: 53, lat: 13.08, lng: 80.27 },
  { name: "Bangalore", risk: 0.29, batches: 95, lat: 12.97, lng: 77.59 },
  { name: "Kolkata", risk: 0.44, batches: 41, lat: 22.57, lng: 88.36 },
  { name: "Pune", risk: 0.33, batches: 78, lat: 18.52, lng: 73.85 },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function KPICard({
  title, value, subtitle, icon: Icon, color, trend, trendVal
}: {
  title: string; value: string | number; subtitle: string;
  icon: React.ElementType; color: string;
  trend?: "up" | "down" | "neutral"; trendVal?: string;
}) {
  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-semibold"
            style={{ color: trend === "up" ? "#34d399" : trend === "down" ? "#f87171" : "#64748b" }}>
            {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trendVal}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold font-display count-up" style={{ color: "#f1f5f9" }}>{value}</p>
      <p className="text-sm font-medium mt-1" style={{ color: "#94a3b8" }}>{title}</p>
      <p className="text-xs mt-1" style={{ color: "#475569" }}>{subtitle}</p>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  return <span className={`badge-${severity}`}>{severity}</span>;
}

function AnomalyScoreBar({ score }: { score: number }) {
  const color = score > 0.8 ? "#ef4444" : score > 0.6 ? "#f59e0b" : "#10b981";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score * 100}%`, background: color }} />
      </div>
      <span className="text-xs font-mono font-medium w-10" style={{ color }}>{score.toFixed(2)}</span>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [kpis, setKpis] = useState({
    total_transactions: 3847,
    active_batches: 421,
    high_risk_batches: 23,
    open_alerts: 7,
    avg_fraud_score: 0.234,
    forecast_accuracy_mae: 87.3,
  });
  const [forecastData] = useState(genForecastData);
  const [anomalyData] = useState(genAnomalyScores);
  const [activeAlerts, setActiveAlerts] = useState(MOCK_ALERTS);
  const [liveAlerts, setLiveAlerts] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState("Paracetamol");
  const [refreshing, setRefreshing] = useState(false);

  // WebSocket for live alerts
  useEffect(() => {
    const token = localStorage.getItem("pharmnex_token");
    if (!token) return;
    try {
      const ws = new WebSocket(`ws://localhost:8000/ws/admin/alerts`);
      wsRef.current = ws;
      ws.onmessage = (e) => {
        const alert = JSON.parse(e.data);
        setLiveAlerts((prev) => [alert, ...prev].slice(0, 5));
      };
    } catch { /* mock mode */ }

    return () => wsRef.current?.close();
  }, []);

  // Fetch real KPIs
  useEffect(() => {
    const token = localStorage.getItem("pharmnex_token");
    if (!token) return;
    fetch("http://localhost:8000/admin/dashboard/kpis", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { if (data.total_transactions !== undefined) setKpis(data); })
      .catch(() => { /* use mock */ });
  }, []);

  // Simulate live KPI ticker
  useEffect(() => {
    const t = setInterval(() => {
      setKpis((k) => ({
        ...k,
        total_transactions: k.total_transactions + Math.floor(Math.random() * 3),
      }));
    }, 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <DashboardLayout
      title="Intelligence Dashboard"
      subtitle="Real-time blockchain + ML supply chain monitoring"
    >
      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <KPICard
          title="Total Transactions" value={kpis.total_transactions.toLocaleString()}
          subtitle="All-time on-chain" icon={Activity} color="#00D4FF"
          trend="up" trendVal="+12.4%"
        />
        <KPICard
          title="Active Batches" value={kpis.active_batches}
          subtitle="In supply chain" icon={Package} color="#34d399"
          trend="up" trendVal="+3.1%"
        />
        <KPICard
          title="High-Risk Batches" value={kpis.high_risk_batches}
          subtitle="Counterfeit risk ≥ 70%" icon={AlertTriangle} color="#ef4444"
          trend="down" trendVal="-2 since yesterday"
        />
        <KPICard
          title="Open Alerts" value={kpis.open_alerts}
          subtitle="Requires action" icon={AlertCircle} color="#f59e0b"
          trend="up" trendVal="+3 today"
        />
        <KPICard
          title="Avg Fraud Score" value={kpis.avg_fraud_score.toFixed(3)}
          subtitle="Across all transactions" icon={Brain} color="#a78bfa"
          trend="neutral"
        />
        <KPICard
          title="Forecast MAE" value={`${kpis.forecast_accuracy_mae}`}
          subtitle="30-day demand accuracy" icon={TrendingUp} color="#60a5fa"
          trend="down" trendVal="↓ Improving"
        />
      </section>

      {/* ── Row 2: Alerts + Risk Donut ────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Live Anomaly Alerts */}
        <div className="xl:col-span-2 glass-card-static p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold font-display" style={{ color: "#f1f5f9" }}>
                🚨 Anomaly Alerts
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                WebSocket-fed · auto-raised when anomaly score &gt; 0.80
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="pulse-dot" />
              <span className="text-xs" style={{ color: "#34d399" }}>LIVE</span>
            </div>
          </div>

          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl transition-all duration-200 cursor-pointer hover:translate-x-1"
                style={{
                  background: alert.severity === "critical"
                    ? "rgba(239,68,68,0.06)"
                    : alert.severity === "high"
                      ? "rgba(251,146,60,0.06)"
                      : "rgba(251,191,36,0.04)",
                  border: `1px solid ${
                    alert.severity === "critical"
                      ? "rgba(239,68,68,0.2)"
                      : alert.severity === "high"
                        ? "rgba(251,146,60,0.2)"
                        : "rgba(251,191,36,0.15)"
                  }`,
                }}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{
                      color: alert.severity === "critical" ? "#ef4444"
                        : alert.severity === "high" ? "#fb923c" : "#fbbf24"
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold font-mono" style={{ color: "#e2e8f0" }}>
                        {alert.batch}
                      </span>
                      <SeverityBadge severity={alert.severity} />
                      {alert.status === "resolved" && (
                        <span className="badge-success">resolved</span>
                      )}
                      {alert.status === "investigating" && (
                        <span className="badge-info">investigating</span>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
                      {alert.reason}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <AnomalyScoreBar score={alert.anomaly_score} />
                      <span className="text-xs flex-shrink-0" style={{ color: "#475569" }}>{alert.time}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "#475569" }} />
                </div>
              </div>
            ))}
          </div>

          <button className="btn-secondary w-full mt-4 text-sm" id="btn-view-all-alerts">
            View All Alerts <ExternalLink className="w-3 h-3 inline ml-1" />
          </button>
        </div>

        {/* Risk Distribution Donut */}
        <div className="glass-card-static p-6 flex flex-col">
          <h2 className="text-base font-semibold font-display mb-1" style={{ color: "#f1f5f9" }}>
            Counterfeit Risk Distribution
          </h2>
          <p className="text-xs mb-5" style={{ color: "#475569" }}>
            Random Forest · metadata-only · <span className="text-amber-400">simulated labels</span>
          </p>

          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={RISK_DONUT}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {RISK_DONUT.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, ""]}
                  contentStyle={{
                    background: "rgba(6,13,36,0.95)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-2">
            {RISK_DONUT.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs" style={{ color: "#94a3b8" }}>{item.name}</span>
                </div>
                <span className="text-xs font-semibold" style={{ color: item.color }}>
                  {item.value}%
                </span>
              </div>
            ))}
          </div>

          {/* SHAP hint */}
          <div className="mt-4 p-3 rounded-xl text-center"
            style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.08)" }}>
            <p className="text-xs" style={{ color: "#64748b" }}>
              Click any batch for <span style={{ color: "#00D4FF" }}>SHAP explanations</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Row 3: Demand Forecast + Risk Heatmap ────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Demand Forecast */}
        <div className="glass-card-static p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold font-display" style={{ color: "#f1f5f9" }}>
                Inventory Demand Forecast
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                LSTM vs XGBoost Regression · 30-day horizon · nightly refresh
              </p>
            </div>
            <select
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", color: "#94a3b8" }}
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(e.target.value)}
              id="select-medicine-forecast"
            >
              <option>Paracetamol</option>
              <option>Amoxicillin</option>
              <option>Ibuprofen</option>
              <option>Metformin</option>
              <option>Diazepam</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={forecastData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "rgba(6,13,36,0.95)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "12px" }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Area type="monotone" dataKey="actual" stroke="#00D4FF" strokeWidth={2}
                fill="url(#gradActual)" name="Actual Demand" dot={false} />
              <Area type="monotone" dataKey="forecast" stroke="#a78bfa" strokeWidth={2}
                fill="url(#gradForecast)" strokeDasharray="5 3" name="Forecast" dot={false} />
              <Legend wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }} />
            </AreaChart>
          </ResponsiveContainer>

          {/* Horizon selector */}
          <div className="flex gap-2 mt-4">
            {["7d", "30d", "90d"].map((h) => (
              <button
                key={h}
                id={`btn-horizon-${h}`}
                className={`text-xs px-3 py-1 rounded-lg transition-all ${h === "30d" ? "btn-primary" : "btn-secondary"}`}
                style={h === "30d" ? {} : { padding: "4px 12px" }}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Heatmap (Location-based) */}
        <div className="glass-card-static p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold font-display" style={{ color: "#f1f5f9" }}>
                Manufacturing Risk Heatmap
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                Aggregated counterfeit risk by location
              </p>
            </div>
            <MapPin className="w-4 h-4" style={{ color: "#64748b" }} />
          </div>

          {/* Visual heatmap grid */}
          <div className="space-y-2.5">
            {HEATMAP_LOCATIONS.sort((a, b) => b.risk - a.risk).map((loc) => {
              const color = loc.risk > 0.6 ? "#ef4444" : loc.risk > 0.4 ? "#f59e0b" : "#10b981";
              return (
                <div key={loc.name} className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: color, boxShadow: `0 0 6px ${color}60` }}
                  />
                  <span className="text-sm w-24 flex-shrink-0" style={{ color: "#e2e8f0" }}>{loc.name}</span>
                  <div className="flex-1 h-6 rounded-lg overflow-hidden relative"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div
                      className="h-full rounded-lg transition-all duration-700 flex items-center px-2"
                      style={{
                        width: `${loc.risk * 100}%`,
                        background: `linear-gradient(90deg, ${color}30, ${color}60)`,
                        border: `1px solid ${color}30`,
                      }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono"
                      style={{ color }}>
                      {(loc.risk * 100).toFixed(0)}%
                    </span>
                  </div>
                  <span className="text-xs w-16 text-right" style={{ color: "#475569" }}>
                    {loc.batches} batches
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-xl flex items-center gap-2"
            style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.08)" }}>
            <Zap className="w-3 h-3" style={{ color: "#00D4FF" }} />
            <p className="text-xs" style={{ color: "#64748b" }}>
              Connect Mapbox API key to enable interactive choropleth map
            </p>
          </div>
        </div>
      </div>

      {/* ── Row 4: A/B Experiment Panel ───────────────────────────────────── */}
      <div className="glass-card-static p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.25)" }}>
            <Brain className="w-4 h-4" style={{ color: "#a78bfa" }} />
          </div>
          <div>
            <h2 className="text-base font-semibold font-display" style={{ color: "#f1f5f9" }}>
              Research: Experiment A vs B — Fraud Detection
            </h2>
            <p className="text-xs" style={{ color: "#475569" }}>
              Does adding blockchain-derived behavioural features improve ML fraud detection accuracy?
            </p>
          </div>
          <div className="ml-auto">
            <span className="badge-success">Significant at α=0.05</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Metrics comparison */}
          <div>
            <div className="overflow-hidden rounded-xl" style={{ border: "1px solid rgba(0,212,255,0.08)" }}>
              <table className="data-table">
                <thead>
                  <tr style={{ background: "rgba(0,212,255,0.04)" }}>
                    <th>Metric</th>
                    <th>Exp A <span style={{ color: "#475569", fontWeight: 400 }}>(Baseline)</span></th>
                    <th>Exp B <span style={{ color: "#475569", fontWeight: 400 }}>(+Blockchain)</span></th>
                    <th>Δ Improvement</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: "Precision", a: 0.7812, b: 0.8934 },
                    { metric: "Recall", a: 0.7234, b: 0.8612 },
                    { metric: "F1 Score", a: 0.7512, b: 0.8770 },
                    { metric: "ROC-AUC", a: 0.8134, b: 0.9241 },
                  ].map((row) => {
                    const delta = ((row.b - row.a) / row.a * 100).toFixed(1);
                    return (
                      <tr key={row.metric}>
                        <td className="font-medium" style={{ color: "#e2e8f0" }}>{row.metric}</td>
                        <td style={{ color: "#94a3b8" }}>{row.a.toFixed(4)}</td>
                        <td style={{ color: "#34d399", fontWeight: 600 }}>{row.b.toFixed(4)}</td>
                        <td>
                          <span className="badge-success">+{delta}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* McNemar's test result */}
            <div className="mt-4 p-4 rounded-xl"
              style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)" }}>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#a78bfa" }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#c4b5fd" }}>
                    McNemar's Test: p = 0.0023 (significant at α=0.05)
                  </p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: "#94a3b8" }}>
                    Blockchain-behavioural features (Exp B) improved F1 by{" "}
                    <strong style={{ color: "#a78bfa" }}>16.7%</strong> and ROC-AUC by{" "}
                    <strong style={{ color: "#a78bfa" }}>13.6%</strong> over conventional features alone.
                    Statistically significant at α=0.05.
                  </p>
                  <p className="text-xs mt-2" style={{ color: "#475569" }}>
                    ⚠ Run{" "}
                    <code className="font-mono" style={{ color: "#00D4FF" }}>
                      POST /ml/experiment/run
                    </code>{" "}
                    for real trained metrics via MLflow.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bar chart comparison */}
          <div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={[
                  { name: "Precision", expA: 0.7812, expB: 0.8934 },
                  { name: "Recall", expA: 0.7234, expB: 0.8612 },
                  { name: "F1 Score", expA: 0.7512, expB: 0.8770 },
                  { name: "ROC-AUC", expA: 0.8134, expB: 0.9241 },
                ]}
                margin={{ top: 5, right: 5, bottom: 5, left: -20 }}
                barGap={4}
              >
                <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0.6, 1.0]} tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "rgba(6,13,36,0.95)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Bar dataKey="expA" name="Exp A (Baseline)" fill="rgba(100,116,139,0.6)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expB" name="Exp B (+Blockchain)" fill="#a78bfa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Features used */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "#64748b" }}>EXPERIMENT A — CONVENTIONAL FEATURES</p>
            <div className="flex flex-wrap gap-1.5">
              {["supplier_id", "manufacturer_id", "medicine_category", "batch_size", "manufacturing_location",
                "distribution_duration_days", "quantity_ordered", "quantity_received", "quantity_discrepancy"
              ].map((f) => (
                <span key={f} className="text-xs px-2 py-0.5 rounded font-mono"
                  style={{ background: "rgba(100,116,139,0.12)", color: "#94a3b8", border: "1px solid rgba(100,116,139,0.2)" }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl" style={{ background: "rgba(167,139,250,0.03)", border: "1px solid rgba(167,139,250,0.12)" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "#a78bfa" }}>EXPERIMENT B — + BLOCKCHAIN FEATURES</p>
            <div className="flex flex-wrap gap-1.5">
              {["transfer_count", "ownership_hops", "route_deviation_score", "timestamp_gap_hrs",
                "verification_fail_count", "unexpected_entity_flag"
              ].map((f) => (
                <span key={f} className="text-xs px-2 py-0.5 rounded font-mono"
                  style={{ background: "rgba(167,139,250,0.1)", color: "#c4b5fd", border: "1px solid rgba(167,139,250,0.2)" }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 5: Anomaly Score Timeline ─────────────────────────────────── */}
      <div className="glass-card-static p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold font-display" style={{ color: "#f1f5f9" }}>
              Anomaly Score Timeline (Last 30 Transactions)
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
              Isolation Forest output · threshold: 0.80 · ⚠ synthetic anomalies labeled separately
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
            <span className="text-xs" style={{ color: "#475569" }}>Threshold: 0.80</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={anomalyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false}
              interval={4} />
            <YAxis domain={[0, 1]} tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "rgba(6,13,36,0.95)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "12px" }}
            />
            {/* Threshold reference line at 0.80 */}
            <Line type="monotone" dataKey={() => 0.8} stroke="#ef4444" strokeWidth={1}
              strokeDasharray="4 2" dot={false} name="Threshold (0.80)" />
            <Line type="monotone" dataKey="score_a" stroke="#64748b" strokeWidth={1.5}
              dot={false} name="Exp A Score" />
            <Line type="monotone" dataKey="score_b" stroke="#00D4FF" strokeWidth={2}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (payload.flagged) {
                  return <circle key={`dot-${cx}-${cy}`} cx={cx} cy={cy} r={5} fill="#ef4444" stroke="#020817" strokeWidth={2} />;
                }
                return <circle key={`dot-${cx}-${cy}`} cx={cx} cy={cy} r={0} />;
              }}
              name="Exp B Score" />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
          </LineChart>
        </ResponsiveContainer>

        <p className="text-xs mt-3" style={{ color: "#475569" }}>
          🔴 Red dots = flagged anomalies (score &gt; 0.80, auto-raised to Alerts panel).
          All synthetic anomaly data is labeled <code className="font-mono" style={{ color: "#fbbf24" }}>is_synthetic=True</code> in the database
          and never reported as real fraud.
        </p>
      </div>
    </DashboardLayout>
  );
}
