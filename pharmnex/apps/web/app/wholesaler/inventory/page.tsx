"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Boxes, Package, ShieldCheck, AlertTriangle, Search, TrendingDown } from "lucide-react";

interface InventoryItem {
  id: string;
  batchNumber: string;
  drugName: string;
  dosage: string;
  manufacturer: string;
  quantity: number;
  reservedQty: number;
  warehouse: string;
  receivedDate: string;
  expiryDate: string;
  riskScore: number;
  algoAssetId: number;
  temperature: string;
}

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: "i1", batchNumber: "BN-2026-8891", drugName: "Amoxicillin Trihydrate",
    dosage: "500mg Capsule", manufacturer: "Apex BioPharma Inc.",
    quantity: 15000, reservedQty: 8000, warehouse: "Cold Hub Delhi",
    receivedDate: "2026-09-17", expiryDate: "2028-09-15",
    riskScore: 0.04, algoAssetId: 98124012, temperature: "4.2°C",
  },
  {
    id: "i2", batchNumber: "BN-2026-9012", drugName: "Metformin Hydrochloride",
    dosage: "850mg Tablet", manufacturer: "Apex BioPharma Inc.",
    quantity: 30000, reservedQty: 20000, warehouse: "Dry Store Mumbai",
    receivedDate: "2026-09-19", expiryDate: "2029-03-18",
    riskScore: 0.02, algoAssetId: 98124559, temperature: "22°C",
  },
  {
    id: "i3", batchNumber: "BN-2026-9140", drugName: "Atorvastatin Calcium",
    dosage: "20mg Tablet", manufacturer: "GlobalChem Corp",
    quantity: 5000, reservedQty: 0, warehouse: "Dry Store Bangalore",
    receivedDate: "2026-09-21", expiryDate: "2028-09-20",
    riskScore: 0.14, algoAssetId: 98125001, temperature: "21°C",
  },
];

export default function WholesalerInventoryPage() {
  const [inventory] = useState(MOCK_INVENTORY);
  const [search, setSearch] = useState("");

  const filtered = inventory.filter(item =>
    item.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
    item.drugName.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = inventory.reduce((s, i) => s + i.quantity, 0);
  const totalReserved = inventory.reduce((s, i) => s + i.reservedQty, 0);
  const available = totalStock - totalReserved;

  return (
    <DashboardLayout
      title="Wholesale Inventory"
      subtitle="Current stock levels with blockchain custody verification"
      role="wholesaler"
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "SKUs in Stock", value: inventory.length, color: "#fbbf24", icon: Boxes },
          { label: "Total Units", value: totalStock.toLocaleString(), color: "#00D4FF", icon: Package },
          { label: "Reserved", value: totalReserved.toLocaleString(), color: "#a78bfa", icon: ShieldCheck },
          { label: "Available", value: available.toLocaleString(), color: "#34d399", icon: TrendingDown },
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
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
          <input className="input-field pl-10" placeholder="Search batch number or drug name..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="space-y-4">
          {filtered.map((item) => {
            const availableQty = item.quantity - item.reservedQty;
            const riskColor = item.riskScore > 0.5 ? "#ef4444" : item.riskScore > 0.2 ? "#f59e0b" : "#34d399";
            const availPct = Math.round((availableQty / item.quantity) * 100);
            return (
              <div key={item.id} className="p-5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm font-bold" style={{ color: "#fbbf24" }}>
                        {item.batchNumber}
                      </span>
                      <span className="text-xs font-mono" style={{ color: "#475569" }}>
                        ASA #{item.algoAssetId}
                      </span>
                    </div>
                    <p className="font-semibold" style={{ color: "#f1f5f9" }}>{item.drugName}</p>
                    <p className="text-xs" style={{ color: "#64748b" }}>{item.dosage} · {item.manufacturer}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs" style={{ color: "#475569" }}>Counterfeit Risk</p>
                    <p className="font-mono font-bold text-lg" style={{ color: riskColor }}>
                      {(item.riskScore * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                {/* Stock bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "#64748b" }}>Stock Utilization</span>
                    <span style={{ color: "#94a3b8" }}>{availPct}% available</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full"
                      style={{ width: `${100 - availPct}%`, background: "#fbbf24" }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div>
                    <p style={{ color: "#475569" }}>Total</p>
                    <p className="font-mono font-semibold mt-0.5" style={{ color: "#f1f5f9" }}>
                      {item.quantity.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "#475569" }}>Reserved</p>
                    <p className="font-mono font-semibold mt-0.5" style={{ color: "#a78bfa" }}>
                      {item.reservedQty.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "#475569" }}>Available</p>
                    <p className="font-mono font-semibold mt-0.5" style={{ color: "#34d399" }}>
                      {availableQty.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "#475569" }}>Warehouse</p>
                    <p className="mt-0.5" style={{ color: "#94a3b8" }}>{item.warehouse}</p>
                  </div>
                  <div>
                    <p style={{ color: "#475569" }}>Temp</p>
                    <p className="font-mono mt-0.5" style={{ color: "#34d399" }}>{item.temperature}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
