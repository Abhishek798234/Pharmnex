"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { FlaskConical, Plus, Search, Package, Star, CheckCircle2, AlertCircle } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  dosageForm: string;
  strength: string;
  approvalStatus: "APPROVED" | "PENDING" | "SUSPENDED";
  activeBatches: number;
  lastBatchDate: string;
  shelfLife: number;
}

const MOCK_MEDICINES: Medicine[] = [
  {
    id: "m1", name: "Amoxil", genericName: "Amoxicillin Trihydrate", category: "Antibiotic",
    dosageForm: "Capsule", strength: "500mg", approvalStatus: "APPROVED",
    activeBatches: 3, lastBatchDate: "2026-09-15", shelfLife: 24,
  },
  {
    id: "m2", name: "Glucophage", genericName: "Metformin Hydrochloride", category: "Antidiabetic",
    dosageForm: "Tablet", strength: "850mg", approvalStatus: "APPROVED",
    activeBatches: 2, lastBatchDate: "2026-09-18", shelfLife: 30,
  },
  {
    id: "m3", name: "Lipitor", genericName: "Atorvastatin Calcium", category: "Statin",
    dosageForm: "Tablet", strength: "20mg", approvalStatus: "APPROVED",
    activeBatches: 1, lastBatchDate: "2026-09-20", shelfLife: 24,
  },
  {
    id: "m4", name: "Zestril", genericName: "Lisinopril", category: "ACE Inhibitor",
    dosageForm: "Tablet", strength: "10mg", approvalStatus: "PENDING",
    activeBatches: 0, lastBatchDate: "2026-09-01", shelfLife: 24,
  },
  {
    id: "m5", name: "Nexium", genericName: "Esomeprazole", category: "Proton Pump Inhibitor",
    dosageForm: "Capsule", strength: "40mg", approvalStatus: "APPROVED",
    activeBatches: 1, lastBatchDate: "2026-09-10", shelfLife: 30,
  },
];

const STATUS_COLOR: Record<Medicine["approvalStatus"], { color: string; label: string }> = {
  APPROVED: { color: "#34d399", label: "Approved" },
  PENDING: { color: "#fbbf24", label: "Pending Review" },
  SUSPENDED: { color: "#ef4444", label: "Suspended" },
};

export default function ManufacturerMedicinesPage() {
  const [medicines] = useState(MOCK_MEDICINES);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.genericName.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Medicine Catalogue"
      subtitle="Registered formulations and their approval status"
      role="manufacturer"
      actions={
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Register Medicine
        </button>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Registered", value: medicines.length, color: "#00D4FF" },
          { label: "Approved", value: medicines.filter(m => m.approvalStatus === "APPROVED").length, color: "#34d399" },
          { label: "Pending Review", value: medicines.filter(m => m.approvalStatus === "PENDING").length, color: "#fbbf24" },
          { label: "Active Batches", value: medicines.reduce((a, m) => a + m.activeBatches, 0), color: "#a78bfa" },
        ].map((k) => (
          <div key={k.label} className="kpi-card">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${k.color}15`, border: `1px solid ${k.color}25` }}>
              <FlaskConical className="w-5 h-5" style={{ color: k.color }} />
            </div>
            <p className="text-2xl font-bold font-display" style={{ color: "#f1f5f9" }}>{k.value}</p>
            <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(2,8,23,0.8)", backdropFilter: "blur(8px)" }}>
          <div className="glass-card p-8 w-full max-w-md animate-slide-up">
            <h3 className="text-lg font-bold font-display mb-6" style={{ color: "#f1f5f9" }}>Register New Medicine</h3>
            <div className="space-y-4">
              <input className="input-field" placeholder="Brand Name" />
              <input className="input-field" placeholder="Generic (INN) Name" />
              <div className="grid grid-cols-2 gap-4">
                <input className="input-field" placeholder="Strength (e.g. 500mg)" />
                <select className="input-field">
                  <option>Tablet</option>
                  <option>Capsule</option>
                  <option>Syrup</option>
                  <option>Injection</option>
                </select>
              </div>
              <input className="input-field" placeholder="Therapeutic Category" />
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-primary flex-1">Submit for Approval</button>
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Table */}
      <div className="glass-card-static p-6">
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
          <input className="input-field pl-10" placeholder="Search by name, generic, or category..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((med) => {
            const sc = STATUS_COLOR[med.approvalStatus];
            return (
              <div key={med.id} className="p-5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
                    <FlaskConical className="w-5 h-5" style={{ color: "#34d399" }} />
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-lg font-semibold"
                    style={{ background: `${sc.color}15`, color: sc.color, border: `1px solid ${sc.color}25` }}>
                    {sc.label}
                  </span>
                </div>
                <p className="font-bold text-base" style={{ color: "#f1f5f9" }}>{med.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{med.genericName}</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded font-mono"
                    style={{ background: "rgba(0,212,255,0.06)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.15)" }}>
                    {med.strength}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded font-mono"
                    style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}>
                    {med.dosageForm}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded font-mono"
                    style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}>
                    {med.category}
                  </span>
                </div>
                <div className="mt-3 pt-3 flex justify-between"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="text-xs" style={{ color: "#64748b" }}>
                    {med.activeBatches} active batches
                  </span>
                  <span className="text-xs font-mono" style={{ color: "#475569" }}>
                    Last: {med.lastBatchDate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
