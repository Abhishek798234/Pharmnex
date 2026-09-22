"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Database, Plus, Search, Calendar, AlertCircle, CheckCircle2, Package } from "lucide-react";

interface RawMaterial {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  price_per_unit: number;
  certificate_id: string;
  purity: string;
  storage: string;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}

const MOCK_MATERIALS: RawMaterial[] = [
  { id: 1, name: "Paracetamol API", quantity: 5000, unit: "kg", expiry_date: "2025-12-31", price_per_unit: 450, certificate_id: "GMP-CERT-2024-0411", purity: "99.8%", storage: "Room Temp (15-25°C)", status: "IN_STOCK" },
  { id: 2, name: "Amoxicillin Trihydrate", quantity: 420, unit: "kg", expiry_date: "2025-08-15", price_per_unit: 890, certificate_id: "GMP-CERT-2024-0398", purity: "99.5%", storage: "Cool Dry Place", status: "LOW_STOCK" },
  { id: 3, name: "Ibuprofen Powder", quantity: 1500, unit: "kg", expiry_date: "2026-03-20", price_per_unit: 620, certificate_id: "GMP-CERT-2024-0422", purity: "99.7%", storage: "Room Temp", status: "IN_STOCK" },
  { id: 4, name: "Metformin HCl", quantity: 3200, unit: "kg", expiry_date: "2025-11-01", price_per_unit: 340, certificate_id: "GMP-CERT-2024-0415", purity: "99.9%", storage: "Room Temp", status: "IN_STOCK" },
  { id: 5, name: "Atorvastatin Calcium", quantity: 0, unit: "kg", expiry_date: "2026-06-30", price_per_unit: 1200, certificate_id: "GMP-CERT-2024-0431", purity: "99.6%", storage: "Cool (2-8°C)", status: "OUT_OF_STOCK" },
];

const STATUS_CFG: Record<RawMaterial["status"], { color: string; label: string }> = {
  IN_STOCK: { color: "#34d399", label: "In Stock" },
  LOW_STOCK: { color: "#fbbf24", label: "Low Stock" },
  OUT_OF_STOCK: { color: "#ef4444", label: "Out of Stock" },
};

export default function SupplierMaterialsPage() {
  const [materials] = useState(MOCK_MATERIALS);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: "", quantity: "", unit: "kg", price_per_unit: "", purity: "" });

  const filtered = materials.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Raw Materials Inventory"
      subtitle="API certificates, stock levels and GMP documentation"
      role="supplier"
      actions={
        <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Material
        </button>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Materials", value: materials.length, color: "#a78bfa" },
          { label: "In Stock", value: materials.filter(m => m.status === "IN_STOCK").length, color: "#34d399" },
          { label: "Low Stock", value: materials.filter(m => m.status === "LOW_STOCK").length, color: "#fbbf24" },
          { label: "Total Stock (kg)", value: materials.reduce((s, m) => s + m.quantity, 0).toLocaleString(), color: "#00D4FF" },
        ].map((k) => (
          <div key={k.label} className="kpi-card">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${k.color}15`, border: `1px solid ${k.color}25` }}>
              <Database className="w-5 h-5" style={{ color: k.color }} />
            </div>
            <p className="text-2xl font-bold font-display" style={{ color: "#f1f5f9" }}>{k.value}</p>
            <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="glass-card-static p-6 mb-6 animate-slide-up"
          style={{ border: "1px solid rgba(167,139,250,0.2)" }}>
          <h3 className="text-base font-semibold font-display mb-4" style={{ color: "#c4b5fd" }}>
            Register New Material
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <input className="input-field col-span-2" placeholder="Material name"
              value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
            <input className="input-field" placeholder="Quantity" type="number"
              value={form.quantity} onChange={(e) => setForm(f => ({ ...f, quantity: e.target.value }))} />
            <input className="input-field" placeholder="Price/unit (₹)"
              value={form.price_per_unit} onChange={(e) => setForm(f => ({ ...f, price_per_unit: e.target.value }))} />
            <input className="input-field col-span-2" placeholder="Purity % (e.g. 99.5%)"
              value={form.purity} onChange={(e) => setForm(f => ({ ...f, purity: e.target.value }))} />
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn-primary text-sm px-5 py-2">Add Material</button>
            <button className="btn-secondary text-sm px-5 py-2" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="glass-card-static p-6">
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
          <input className="input-field pl-10" placeholder="Search materials..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="space-y-4">
          {filtered.map((mat) => {
            const sc = STATUS_CFG[mat.status];
            const stockValue = (mat.quantity * mat.price_per_unit) / 100000;
            const daysToExpiry = Math.round((new Date(mat.expiry_date).getTime() - Date.now()) / 86400000);
            return (
              <div key={mat.id} className="p-5 rounded-xl flex flex-col sm:flex-row gap-4 transition-all hover:translate-x-1"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}>
                  <Database className="w-6 h-6" style={{ color: "#a78bfa" }} />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <p className="font-semibold" style={{ color: "#e2e8f0" }}>{mat.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-lg font-semibold"
                      style={{ background: `${sc.color}12`, color: sc.color, border: `1px solid ${sc.color}25` }}>
                      {sc.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <p style={{ color: "#475569" }}>Stock</p>
                      <p className="font-mono font-semibold mt-0.5" style={{ color: "#f1f5f9" }}>
                        {mat.quantity.toLocaleString()} {mat.unit}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: "#475569" }}>Purity</p>
                      <p className="font-mono mt-0.5" style={{ color: "#34d399" }}>{mat.purity}</p>
                    </div>
                    <div>
                      <p style={{ color: "#475569" }}>Expiry</p>
                      <p className="font-mono mt-0.5"
                        style={{ color: daysToExpiry < 90 ? "#f59e0b" : "#94a3b8" }}>
                        {mat.expiry_date} ({daysToExpiry}d)
                      </p>
                    </div>
                    <div>
                      <p style={{ color: "#475569" }}>Certificate</p>
                      <p className="font-mono mt-0.5" style={{ color: "#64748b" }}>{mat.certificate_id}</p>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold font-display" style={{ color: "#a78bfa" }}>
                    ₹{stockValue.toFixed(1)}L
                  </p>
                  <p className="text-xs" style={{ color: "#475569" }}>stock value</p>
                  <p className="text-xs mt-1" style={{ color: "#64748b" }}>₹{mat.price_per_unit}/{mat.unit}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
