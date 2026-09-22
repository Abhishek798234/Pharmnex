"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Database, Plus, Package, ShoppingBag, TrendingUp, ArrowUpRight, AlertCircle } from "lucide-react";

const MOCK_MATERIALS = [
  { id: 1, name: "Paracetamol API", quantity: 5000, unit: "kg", expiry_date: "2025-12-31", price_per_unit: 450 },
  { id: 2, name: "Amoxicillin Trihydrate", quantity: 2800, unit: "kg", expiry_date: "2025-08-15", price_per_unit: 890 },
  { id: 3, name: "Ibuprofen Powder", quantity: 1500, unit: "kg", expiry_date: "2026-03-20", price_per_unit: 620 },
  { id: 4, name: "Metformin HCl", quantity: 3200, unit: "kg", expiry_date: "2025-11-01", price_per_unit: 340 },
];

const MOCK_ORDERS = [
  { id: 1, manufacturer: "SunPharma Ltd", material: "Paracetamol API", qty: 500, status: "confirmed", date: "2024-09-18" },
  { id: 2, manufacturer: "Cipla India", material: "Amoxicillin Trihydrate", qty: 300, status: "shipped", date: "2024-09-20" },
  { id: 3, manufacturer: "DrReddy Labs", material: "Ibuprofen Powder", qty: 200, status: "pending", date: "2024-09-21" },
];

export default function SupplierDashboard() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: "", quantity: "", unit: "kg", price_per_unit: "" });

  const statusColor: Record<string, string> = {
    pending: "#fbbf24", confirmed: "#34d399", shipped: "#00D4FF", delivered: "#a78bfa",
  };

  return (
    <DashboardLayout
      title="Supplier Dashboard"
      subtitle="Manage raw materials and manufacturer orders"
      actions={
        <button onClick={() => setShowAddForm(true)} id="btn-add-material"
          className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Material
        </button>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Materials", value: "4", icon: Database, color: "#a78bfa" },
          { label: "Total Stock (kg)", value: "12,500", icon: Package, color: "#00D4FF" },
          { label: "Active Orders", value: "3", icon: ShoppingBag, color: "#34d399" },
          { label: "Revenue (₹)", value: "₹42.1L", icon: TrendingUp, color: "#fbbf24" },
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Raw Materials Inventory */}
        <div className="glass-card-static p-6">
          <h2 className="text-base font-semibold font-display mb-4" style={{ color: "#f1f5f9" }}>
            Raw Materials Inventory
          </h2>

          {showAddForm && (
            <div className="mb-4 p-4 rounded-xl animate-slide-up"
              style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
              <p className="text-sm font-semibold mb-3" style={{ color: "#c4b5fd" }}>Add New Material</p>
              <div className="grid grid-cols-2 gap-3">
                <input className="input-field col-span-2" placeholder="Material name"
                  value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                <input className="input-field" placeholder="Quantity" type="number"
                  value={form.quantity} onChange={(e) => setForm(f => ({ ...f, quantity: e.target.value }))} />
                <input className="input-field" placeholder="Price/unit (₹)"
                  value={form.price_per_unit} onChange={(e) => setForm(f => ({ ...f, price_per_unit: e.target.value }))} />
              </div>
              <div className="flex gap-2 mt-3">
                <button className="btn-primary text-sm px-4 py-2">Add Material</button>
                <button className="btn-secondary text-sm px-4 py-2" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {MOCK_MATERIALS.map((mat) => (
              <div key={mat.id} className="p-4 rounded-xl flex items-center gap-4 transition-all duration-200 hover:translate-x-1"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}>
                  <Database className="w-5 h-5" style={{ color: "#a78bfa" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>{mat.name}</p>
                  <p className="text-xs" style={{ color: "#64748b" }}>
                    {mat.quantity.toLocaleString()} {mat.unit} · Exp: {mat.expiry_date} · ₹{mat.price_per_unit}/kg
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: "#a78bfa" }}>
                    ₹{((mat.quantity * mat.price_per_unit) / 100000).toFixed(1)}L
                  </p>
                  <p className="text-xs" style={{ color: "#475569" }}>stock value</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incoming Orders */}
        <div className="glass-card-static p-6">
          <h2 className="text-base font-semibold font-display mb-4" style={{ color: "#f1f5f9" }}>
            Manufacturer Orders
          </h2>
          <div className="space-y-3">
            {MOCK_ORDERS.map((order) => (
              <div key={order.id} className="p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>{order.manufacturer}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{ background: `${statusColor[order.status]}15`, color: statusColor[order.status], border: `1px solid ${statusColor[order.status]}30` }}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "#64748b" }}>
                  {order.material} · {order.qty} kg · {order.date}
                </p>
                {order.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <button className="btn-primary text-xs px-3 py-1.5">Accept</button>
                    <button className="btn-danger text-xs px-3 py-1.5">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
