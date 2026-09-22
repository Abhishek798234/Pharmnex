"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ShoppingCart, CheckCircle2, Clock, Truck, Package, ArrowRight, Shield } from "lucide-react";

interface WholesaleOrder {
  id: string;
  orderNumber: string;
  batchNumber: string;
  drugName: string;
  quantity: number;
  distributor: string;
  status: "PENDING_CONFIRMATION" | "CUSTODY_RECEIVED" | "IN_TRANSIT" | "DELIVERED";
  riskScore: number;
  algoTxHash: string;
  timestamp: string;
}

const INITIAL_ORDERS: WholesaleOrder[] = [
  { id: "o1", orderNumber: "PO-WHOLE-9901", batchNumber: "BN-2026-8891", drugName: "Amoxicillin Trihydrate 500mg", quantity: 8000, distributor: "FastChain Cold Logistics", status: "CUSTODY_RECEIVED", riskScore: 0.04, algoTxHash: "7X9K2P...M8Q1", timestamp: "2026-09-19 14:30" },
  { id: "o2", orderNumber: "PO-WHOLE-9904", batchNumber: "BN-2026-9012", drugName: "Metformin Hydrochloride 850mg", quantity: 20000, distributor: "MedSpeed Express", status: "IN_TRANSIT", riskScore: 0.02, algoTxHash: "3B8W1L...P9X4", timestamp: "2026-09-21 09:15" },
  { id: "o3", orderNumber: "PO-WHOLE-9910", batchNumber: "BN-2026-9140", drugName: "Atorvastatin Calcium 20mg", quantity: 5000, distributor: "Pending Assignment", status: "PENDING_CONFIRMATION", riskScore: 0.14, algoTxHash: "Pending", timestamp: "2026-09-21 18:40" },
];

const STATUS_CFG: Record<WholesaleOrder["status"], { color: string; bg: string; label: string; icon: React.ElementType }> = {
  PENDING_CONFIRMATION: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", label: "Pending", icon: Clock },
  CUSTODY_RECEIVED: { color: "#00D4FF", bg: "rgba(0,212,255,0.08)", label: "Custody Received", icon: CheckCircle2 },
  IN_TRANSIT: { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", label: "In Transit", icon: Truck },
  DELIVERED: { color: "#34d399", bg: "rgba(52,211,153,0.1)", label: "Delivered", icon: Package },
};

export default function WholesalerOrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [confirming, setConfirming] = useState<string | null>(null);

  const confirmCustody = (id: string) => {
    setConfirming(id);
    setTimeout(() => {
      setOrders(prev => prev.map(o =>
        o.id === id ? { ...o, status: "CUSTODY_RECEIVED" as const, algoTxHash: `${Math.random().toString(36).slice(2, 8).toUpperCase()}...TX` } : o
      ));
      setConfirming(null);
    }, 1500);
  };

  return (
    <DashboardLayout
      title="Wholesale Orders"
      subtitle="Outbound custody transfers to distributors"
      role="wholesaler"
      actions={
        <button className="btn-primary flex items-center gap-2 text-sm">
          <ShoppingCart className="w-4 h-4" /> New Order
        </button>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: orders.length, color: "#fbbf24" },
          { label: "Pending", value: orders.filter(o => o.status === "PENDING_CONFIRMATION").length, color: "#ef4444" },
          { label: "In Transit", value: orders.filter(o => o.status === "IN_TRANSIT").length, color: "#a78bfa" },
          { label: "Delivered", value: orders.filter(o => o.status === "DELIVERED").length, color: "#34d399" },
        ].map((k) => (
          <div key={k.label} className="kpi-card">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${k.color}15`, border: `1px solid ${k.color}25` }}>
              <ShoppingCart className="w-5 h-5" style={{ color: k.color }} />
            </div>
            <p className="text-2xl font-bold font-display" style={{ color: "#f1f5f9" }}>{k.value}</p>
            <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>{k.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card-static p-6 space-y-4">
        <h2 className="text-base font-semibold font-display mb-2" style={{ color: "#f1f5f9" }}>
          Outbound Custody Transfers
        </h2>
        {orders.map((order) => {
          const sc = STATUS_CFG[order.status];
          const Icon = sc.icon;
          const riskColor = order.riskScore > 0.5 ? "#ef4444" : order.riskScore > 0.2 ? "#f59e0b" : "#34d399";
          return (
            <div key={order.id} className="p-5 rounded-xl"
              style={{
                background: order.riskScore > 0.2 ? "rgba(239,68,68,0.03)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${order.riskScore > 0.2 ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)"}`,
              }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: sc.bg, border: `1px solid ${sc.color}25` }}>
                    <Icon className="w-5 h-5" style={{ color: sc.color }} />
                  </div>
                  <div>
                    <p className="font-mono text-sm font-semibold" style={{ color: "#fbbf24" }}>
                      {order.orderNumber}
                    </p>
                    <p className="text-xs" style={{ color: "#64748b" }}>{order.distributor}</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-lg font-semibold self-start"
                  style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}30` }}>
                  {sc.label}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div>
                  <p style={{ color: "#475569" }}>Drug</p>
                  <p className="font-medium mt-0.5" style={{ color: "#e2e8f0" }}>{order.drugName}</p>
                </div>
                <div>
                  <p style={{ color: "#475569" }}>Batch</p>
                  <p className="font-mono mt-0.5" style={{ color: "#00D4FF" }}>{order.batchNumber}</p>
                </div>
                <div>
                  <p style={{ color: "#475569" }}>Quantity</p>
                  <p className="font-mono font-semibold mt-0.5" style={{ color: "#f1f5f9" }}>
                    {order.quantity.toLocaleString()} units
                  </p>
                </div>
                <div>
                  <p style={{ color: "#475569" }}>Algo Tx</p>
                  <p className="font-mono mt-0.5" style={{ color: order.algoTxHash === "Pending" ? "#475569" : "#a78bfa" }}>
                    {order.algoTxHash}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" style={{ color: riskColor }} />
                  <span className="text-xs font-mono font-semibold" style={{ color: riskColor }}>
                    Risk: {(order.riskScore * 100).toFixed(0)}%
                  </span>
                </div>
                {order.status === "PENDING_CONFIRMATION" && (
                  <button
                    onClick={() => confirmCustody(order.id)}
                    disabled={confirming === order.id}
                    className="btn-primary text-xs px-4 py-2 flex items-center gap-2"
                  >
                    {confirming === order.id ? (
                      <div className="w-3 h-3 border border-gray-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-3 h-3" />
                    )}
                    Confirm Custody + Sign Algo Tx
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
