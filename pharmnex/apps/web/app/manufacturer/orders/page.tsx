"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ShoppingCart, CheckCircle2, Clock, Package, TrendingUp, AlertCircle } from "lucide-react";

interface RawMaterialOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  material: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  orderDate: string;
  expectedDelivery: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}

const MOCK_ORDERS: RawMaterialOrder[] = [
  {
    id: "o1", orderNumber: "PO-MFG-2026-0041", supplier: "BioPharma Pure LLC",
    material: "Amoxicillin Trihydrate API", quantity: 800, unit: "kg",
    pricePerUnit: 890, orderDate: "2026-09-14", expectedDelivery: "2026-09-22",
    status: "DELIVERED",
  },
  {
    id: "o2", orderNumber: "PO-MFG-2026-0044", supplier: "ChemSource India",
    material: "Metformin Hydrochloride Powder", quantity: 1200, unit: "kg",
    pricePerUnit: 340, orderDate: "2026-09-16", expectedDelivery: "2026-09-24",
    status: "SHIPPED",
  },
  {
    id: "o3", orderNumber: "PO-MFG-2026-0047", supplier: "PureChem Labs",
    material: "Atorvastatin API Grade", quantity: 500, unit: "kg",
    pricePerUnit: 1200, orderDate: "2026-09-19", expectedDelivery: "2026-09-28",
    status: "CONFIRMED",
  },
  {
    id: "o4", orderNumber: "PO-MFG-2026-0050", supplier: "BioPharma Pure LLC",
    material: "Lisinopril Base Compound", quantity: 300, unit: "kg",
    pricePerUnit: 760, orderDate: "2026-09-21", expectedDelivery: "2026-10-02",
    status: "PENDING",
  },
];

const STATUS_CONFIG: Record<RawMaterialOrder["status"], { color: string; bg: string; label: string }> = {
  PENDING: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", label: "Pending" },
  CONFIRMED: { color: "#00D4FF", bg: "rgba(0,212,255,0.08)", label: "Confirmed" },
  SHIPPED: { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", label: "Shipped" },
  DELIVERED: { color: "#34d399", bg: "rgba(52,211,153,0.1)", label: "Delivered" },
  CANCELLED: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", label: "Cancelled" },
};

export default function ManufacturerOrdersPage() {
  const [orders] = useState(MOCK_ORDERS);

  const totalSpend = orders.reduce((sum, o) => sum + o.quantity * o.pricePerUnit, 0);

  return (
    <DashboardLayout
      title="Raw Material Orders"
      subtitle="Purchase orders sent to API suppliers"
      role="manufacturer"
      actions={
        <button className="btn-primary flex items-center gap-2 text-sm">
          <ShoppingCart className="w-4 h-4" /> New Order
        </button>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: orders.length, color: "#00D4FF", icon: ShoppingCart },
          { label: "Pending", value: orders.filter(o => o.status === "PENDING").length, color: "#fbbf24", icon: Clock },
          { label: "In Transit", value: orders.filter(o => o.status === "SHIPPED").length, color: "#a78bfa", icon: Package },
          { label: "Total Spend (₹)", value: `₹${(totalSpend / 100000).toFixed(1)}L`, color: "#34d399", icon: TrendingUp },
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

      <div className="glass-card-static p-6">
        <h2 className="text-base font-semibold font-display mb-5" style={{ color: "#f1f5f9" }}>
          Purchase Orders
        </h2>
        <div className="space-y-4">
          {orders.map((order) => {
            const sc = STATUS_CONFIG[order.status];
            const totalValue = order.quantity * order.pricePerUnit;
            return (
              <div key={order.id} className="p-5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: sc.bg, border: `1px solid ${sc.color}25` }}>
                      <ShoppingCart className="w-5 h-5" style={{ color: sc.color }} />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-semibold" style={{ color: "#00D4FF" }}>
                        {order.orderNumber}
                      </p>
                      <p className="text-xs" style={{ color: "#64748b" }}>{order.supplier}</p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-lg font-semibold self-start sm:self-auto"
                    style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}30` }}>
                    {sc.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-xs">
                  <div>
                    <p style={{ color: "#475569" }}>Material</p>
                    <p className="font-medium mt-0.5" style={{ color: "#e2e8f0" }}>{order.material}</p>
                  </div>
                  <div>
                    <p style={{ color: "#475569" }}>Quantity</p>
                    <p className="font-mono font-medium mt-0.5" style={{ color: "#e2e8f0" }}>
                      {order.quantity.toLocaleString()} {order.unit}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "#475569" }}>Order Date</p>
                    <p className="font-mono mt-0.5" style={{ color: "#94a3b8" }}>{order.orderDate}</p>
                  </div>
                  <div>
                    <p style={{ color: "#475569" }}>Expected Delivery</p>
                    <p className="font-mono mt-0.5" style={{ color: "#94a3b8" }}>{order.expectedDelivery}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <p className="text-sm font-bold" style={{ color: "#f1f5f9" }}>
                    ₹{totalValue.toLocaleString()}
                    <span className="text-xs font-normal ml-1" style={{ color: "#64748b" }}>
                      (₹{order.pricePerUnit}/kg)
                    </span>
                  </p>
                  {order.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button className="text-xs px-3 py-1.5 rounded-lg btn-secondary">Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
