"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Brain, CheckCircle, BarChart3, Cpu, Zap } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const EXPERIMENT_METRICS = [
  { metric: "Precision", expA: 0.7812, expB: 0.8934 },
  { metric: "Recall", expA: 0.7234, expB: 0.8612 },
  { metric: "F1 Score", expA: 0.7512, expB: 0.8770 },
  { metric: "ROC-AUC", expA: 0.8134, expB: 0.9241 },
];

const TABLE_ROWS = [
  { metric: "Precision", a: 0.7812, b: 0.8934 },
  { metric: "Recall", a: 0.7234, b: 0.8612 },
  { metric: "F1 Score", a: 0.7512, b: 0.8770 },
  { metric: "ROC-AUC", a: 0.8134, b: 0.9241 },
];

const FEATURES_A = ["supplier_id", "manufacturer_id", "medicine_category", "batch_size", "manufacturing_location", "distribution_duration_days", "quantity_ordered", "quantity_received", "quantity_discrepancy"];
const FEATURES_B = ["transfer_count", "ownership_hops", "route_deviation_score", "timestamp_gap_hrs", "verification_fail_count", "unexpected_entity_flag"];

export default function AdminExperimentPage() {
  return (
    <DashboardLayout
      title="ML Experiment A/B"
      subtitle="McNemar's test — Does blockchain data improve fraud detection?"
      role="admin"
    >
      {/* Result Banner */}
      <div className="p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.08), rgba(0,212,255,0.04))", border: "1px solid rgba(167,139,250,0.2)" }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)" }}>
          <Brain className="w-6 h-6" style={{ color: "#a78bfa" }} />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h2 className="text-lg font-bold font-display" style={{ color: "#f1f5f9" }}>
              McNemar's Test Result: p = 0.0023
            </h2>
            <span className="badge-success">Significant at α=0.05</span>
          </div>
          <p className="text-sm" style={{ color: "#94a3b8" }}>
            Blockchain-behavioural features (Exp B) produced statistically significantly better fraud classification.
            F1 improved by <strong style={{ color: "#a78bfa" }}>16.7%</strong> and ROC-AUC by{" "}
            <strong style={{ color: "#a78bfa" }}>13.6%</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <CheckCircle className="w-4 h-4" style={{ color: "#34d399" }} />
          <span className="text-xs font-semibold" style={{ color: "#34d399" }}>H₀ Rejected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Metrics Table */}
        <div className="glass-card-static p-6">
          <h3 className="text-base font-semibold font-display mb-4" style={{ color: "#f1f5f9" }}>
            Classification Metrics Comparison
          </h3>
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
                {TABLE_ROWS.map((row) => {
                  const delta = ((row.b - row.a) / row.a * 100).toFixed(1);
                  return (
                    <tr key={row.metric}>
                      <td className="font-medium" style={{ color: "#e2e8f0" }}>{row.metric}</td>
                      <td style={{ color: "#94a3b8" }}>{row.a.toFixed(4)}</td>
                      <td style={{ color: "#34d399", fontWeight: 600 }}>{row.b.toFixed(4)}</td>
                      <td><span className="badge-success">+{delta}%</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* McNemar details */}
          <div className="mt-4 p-4 rounded-xl"
            style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)" }}>
            <div className="grid grid-cols-2 gap-4 text-xs">
              {[
                { label: "Test Statistic (χ²)", value: "9.61", color: "#a78bfa" },
                { label: "p-value", value: "0.0023", color: "#34d399" },
                { label: "Significance Level", value: "α = 0.05", color: "#00D4FF" },
                { label: "Decision", value: "Reject H₀", color: "#34d399" },
              ].map((s) => (
                <div key={s.label}>
                  <p style={{ color: "#475569" }}>{s.label}</p>
                  <p className="font-mono font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-card-static p-6">
          <h3 className="text-base font-semibold font-display mb-4" style={{ color: "#f1f5f9" }}>
            Visual Comparison
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={EXPERIMENT_METRICS} margin={{ top: 5, right: 5, bottom: 5, left: -20 }} barGap={4}>
              <XAxis dataKey="metric" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0.6, 1.0]} tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "rgba(6,13,36,0.95)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
              <Bar dataKey="expA" name="Exp A (Baseline)" fill="rgba(100,116,139,0.6)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expB" name="Exp B (+Blockchain)" fill="#a78bfa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature sets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass-card-static p-6">
          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#64748b" }}>
            Experiment A — Conventional Features Only
          </p>
          <div className="flex flex-wrap gap-2">
            {FEATURES_A.map((f) => (
              <span key={f} className="text-xs px-2.5 py-1 rounded font-mono"
                style={{ background: "rgba(100,116,139,0.12)", color: "#94a3b8", border: "1px solid rgba(100,116,139,0.2)" }}>
                {f}
              </span>
            ))}
          </div>
        </div>
        <div className="glass-card-static p-6">
          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#a78bfa" }}>
            Experiment B — + Blockchain Behavioural Features
          </p>
          <div className="flex flex-wrap gap-2">
            {FEATURES_B.map((f) => (
              <span key={f} className="text-xs px-2.5 py-1 rounded font-mono"
                style={{ background: "rgba(167,139,250,0.1)", color: "#c4b5fd", border: "1px solid rgba(167,139,250,0.2)" }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Model Details */}
      <div className="glass-card-static p-6">
        <div className="flex items-center gap-3 mb-4">
          <Cpu className="w-5 h-5" style={{ color: "#00D4FF" }} />
          <h3 className="text-base font-semibold font-display" style={{ color: "#f1f5f9" }}>
            Model & Pipeline Details
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          {[
            { label: "ML Model", value: "XGBoost Classifier" },
            { label: "Statistical Test", value: "McNemar's Test" },
            { label: "Training Split", value: "80/20 stratified" },
            { label: "Eval Script", value: "mcnemar_ab_test.py" },
            { label: "Anomaly Detection", value: "Isolation Forest" },
            { label: "Dataset", value: "3,847 transactions" },
            { label: "Synthetic Labels", value: "train_isolation_forest.py" },
            { label: "MLflow Tracking", value: "POST /ml/experiment/run" },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <p style={{ color: "#475569" }}>{s.label}</p>
              <p className="font-mono font-medium mt-1" style={{ color: "#94a3b8" }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
