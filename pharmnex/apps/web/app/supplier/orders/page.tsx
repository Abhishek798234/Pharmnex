"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ShoppingCart, Clock, CheckCircle2, Truck, Package } from "lucide-react";

interface SupplierOrder {
  id: number;
  manufacturer: string;
  material: string;
  qty: number;
  unit: string;
  price_per_unit: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  date: string;
  deliveryDate: string;
  poNumber: string;
}

const MOCK_ORDERS: SupplierOrder[] = [
  { id: 1, manufacturer: "SunPharma Ltd", material: "Paracetamol API", qty: 500, unit: "kg", price_per_unit: 450, status: "confirmed", date: "2026-09-18", deliveryDate: "2026-09-25", poNumber: "PO-SP-2026-0041" },
  { id: 2, manufacturer: "Cipla India", material: "Amoxicillin Trihydrate", qty: 300, unit: "kg", price_per_unit: 890, status: "shipped", date: "2026-09-20", deliveryDate: "2026-09-27", poNumber: "PO-CI-2026-0038" },
  { id: 3, manufacturer: "DrReddy Labs", material: "Ibuprofen Powder", qty: 200, unit: "kg", price_per_unit: 620, status: "pending", date: "2026-09-21", deliveryDate: "2026-09-30", poNumber: "PO-DR-2026-0051" },
  { id: 4, manufacturer: "Apex BioPharma", material: "Metformin HCl", qty: 800, unit: "kg", price_per_unit: 340, status: "delivered", date: "2026-09-10", deliveryDate: "2026-09-17", poNumber: "PO-AB-2026-0035" },
];

const STATUS_CFG: Record<SupplierOrder["status"], { color: string; bg: string; label: string; icon: React.ElementType }> = {
  pending: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", label: "Pending", icon: Clock },
  confirmed: { color: "#00D4FF", bg: "rgba(0,212,255,0.08)", label: "Confirmed", icon: CheckCircle2 },
  shipped: { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", label: "Shipped", icon: Truck },
  delivered: { color: "#34d399", bg: "rgba(52,211,153,0.1)", label: "Delivered", icon: Package },
};

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const acceptOrder = (id: number) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "confirmed" as const } : o));
  };

  const rejectOrder = (id: number) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
    <DashboardLayout
      title="Manufacturer Orders"
      subtitle="Incoming raw material purchase orders from manufacturers"
      role="supplier"
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: orders.length, color: "#00D4FF" },
          { label: "Pending", value: orders.filter(o => o.status === "pending").length, color: "#fbbf24" },
          { label: "In Transit", value: orders.filter(o => o.status === "shipped").length, color: "#a78bfa" },
          { label: "Revenue (₹)", value: `₹${(orders.filter(o => o.status !== "pending").reduce((s, o) => s + o.qty * o.price_per_unit, 0) / 100000).toFixed(1)}L`, color: "#34d399" },
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

      <div className="glass-card-static p-6">
        <h2 className="text-base font-semibold font-display mb-5" style={{ color: "#f1f5f9" }}>
          Active Orders
        </h2>
        <div className="space-y-4">
          {orders.map((order) => {
            const sc = STATUS_CFG[order.status];
            const Icon = sc.icon;
            return (
              <div key={order.id} className="p-5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: sc.bg, border: `1px solid ${sc.color}25` }}>
                      <Icon className="w-5 h-5" style={{ color: sc.color }} />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-semibold" style={{ color: "#00D4FF" }}>{order.poNumber}</p>
                      <p className="text-xs" style={{ color: "#64748b" }}>{order.manufacturer}</p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-lg font-semibold self-start"
                    style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}30` }}>
                    {sc.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                  <div>
                    <p style={{ color: "#475569" }}>Material</p>
                    <p className="font-medium mt-0.5" style={{ color: "#e2e8f0" }}>{order.material}</p>
                  </div>
                  <div>
                    <p style={{ color: "#475569" }}>Quantity</p>
                    <p className="font-mono font-medium mt-0.5" style={{ color: "#e2e8f0" }}>
                      {order.qty.toLocaleString()} {order.unit}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "#475569" }}>Order Date</p>
                    <p className="font-mono mt-0.5" style={{ color: "#94a3b8" }}>{order.date}</p>
                  </div>
                  <div>
                    <p style={{ color: "#475569" }}>Value</p>
                    <p className="font-mono font-bold mt-0.5" style={{ color: "#f1f5f9" }}>
                      ₹{(order.qty * order.price_per_unit).toLocaleString()}
                    </p>
                  </div>
                </div>

                {order.status === "pending" && (
                  <div className="flex gap-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <button onClick={() => acceptOrder(order.id)}
                      className="btn-primary text-xs px-4 py-2">
                      ✓ Accept Order
                    </button>
                    <button onClick={() => rejectOrder(order.id)}
                      className="btn-danger text-xs px-4 py-2">
                      ✗ Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
