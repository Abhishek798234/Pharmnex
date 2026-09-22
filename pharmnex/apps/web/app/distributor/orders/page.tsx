"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ShoppingCart, Clock, Truck, CheckCircle2, Package, ArrowRight } from "lucide-react";

interface DistributorOrder {
  id: string;
  orderNumber: string;
  batchNumber: string;
  drugName: string;
  quantity: number;
  wholesaler: string;
  destination: string;
  status: "PENDING_PICKUP" | "IN_TRANSIT" | "DELIVERED";
  pickupDate: string;
  deliveryDate: string;
  algoTxHash: string;
}

const MOCK_ORDERS: DistributorOrder[] = [
  { id: "o1", orderNumber: "DO-2026-0801", batchNumber: "BN-2026-8891", drugName: "Amoxicillin Trihydrate 500mg", quantity: 8000, wholesaler: "Global Health Wholesale", destination: "MedPlus #402, New York", status: "IN_TRANSIT", pickupDate: "2026-09-19", deliveryDate: "2026-09-22", algoTxHash: "7X9K2P...M8Q1" },
  { id: "o2", orderNumber: "DO-2026-0808", batchNumber: "BN-2026-9012", drugName: "Insulin Glargine 300U/mL", quantity: 2000, wholesaler: "MedStore Wholesale", destination: "Apollo Pharmacy, Chicago", status: "PENDING_PICKUP", pickupDate: "2026-09-22", deliveryDate: "2026-09-25", algoTxHash: "Pending" },
  { id: "o3", orderNumber: "DO-2026-0792", batchNumber: "BN-2026-7789", drugName: "Metformin 850mg", quantity: 15000, wholesaler: "Global Health Wholesale", destination: "Fortis Hospital Pharmacy", status: "DELIVERED", pickupDate: "2026-09-14", deliveryDate: "2026-09-18", algoTxHash: "3B8W1L...P9X4" },
];

const STATUS_CFG: Record<DistributorOrder["status"], { color: string; bg: string; label: string; icon: React.ElementType }> = {
  PENDING_PICKUP: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", label: "Pending Pickup", icon: Clock },
  IN_TRANSIT: { color: "#fb923c", bg: "rgba(251,146,60,0.1)", label: "In Transit", icon: Truck },
  DELIVERED: { color: "#34d399", bg: "rgba(52,211,153,0.1)", label: "Delivered", icon: CheckCircle2 },
};

export default function DistributorOrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const markPickedUp = (id: string) => {
    setOrders(prev => prev.map(o =>
      o.id === id ? { ...o, status: "IN_TRANSIT" as const, algoTxHash: `${Math.random().toString(36).slice(2, 8).toUpperCase()}...TX` } : o
    ));
  };

  return (
    <DashboardLayout
      title="Distribution Orders"
      subtitle="Outbound deliveries with Algorand custody attestation"
      role="distributor"
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Orders", value: orders.length, color: "#fb923c", icon: ShoppingCart },
          { label: "In Transit", value: orders.filter(o => o.status === "IN_TRANSIT").length, color: "#fbbf24", icon: Truck },
          { label: "Delivered", value: orders.filter(o => o.status === "DELIVERED").length, color: "#34d399", icon: CheckCircle2 },
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

      <div className="glass-card-static p-6 space-y-4">
        <h2 className="text-base font-semibold font-display mb-2" style={{ color: "#f1f5f9" }}>Active Deliveries</h2>
        {orders.map((order) => {
          const sc = STATUS_CFG[order.status];
          const Icon = sc.icon;
          return (
            <div key={order.id} className="p-5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: sc.bg, border: `1px solid ${sc.color}25` }}>
                    <Icon className="w-5 h-5" style={{ color: sc.color }} />
                  </div>
                  <div>
                    <p className="font-mono text-sm font-semibold" style={{ color: "#fb923c" }}>{order.orderNumber}</p>
                    <p className="text-xs" style={{ color: "#64748b" }}>From: {order.wholesaler}</p>
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
                  <p style={{ color: "#475569" }}>Quantity</p>
                  <p className="font-mono font-semibold mt-0.5" style={{ color: "#f1f5f9" }}>
                    {order.quantity.toLocaleString()} units
                  </p>
                </div>
                <div>
                  <p style={{ color: "#475569" }}>Destination</p>
                  <p className="mt-0.5" style={{ color: "#94a3b8" }}>{order.destination}</p>
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
                <div className="text-xs flex items-center gap-4" style={{ color: "#475569" }}>
                  <span>Pickup: <span style={{ color: "#64748b" }}>{order.pickupDate}</span></span>
                  <ArrowRight className="w-3 h-3" />
                  <span>Delivery: <span style={{ color: "#64748b" }}>{order.deliveryDate}</span></span>
                </div>
                {order.status === "PENDING_PICKUP" && (
                  <button onClick={() => markPickedUp(order.id)}
                    className="btn-primary text-xs px-4 py-2">
                    Mark Picked Up
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
