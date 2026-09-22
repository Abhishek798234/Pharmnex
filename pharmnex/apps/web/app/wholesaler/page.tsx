"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Building2, Package, Truck, ArrowRight, ShieldCheck, AlertCircle, RefreshCw,
  Search, CheckCircle2, ChevronRight, Layers, FileText
} from "lucide-react";

interface WholesalerOrder {
  id: string;
  orderNumber: string;
  batchNumber: string;
  drugName: string;
  quantity: number;
  manufacturer: string;
  distributorAssigned: string;
  status: "PENDING_CONFIRMATION" | "CUSTODY_RECEIVED" | "IN_TRANSIT" | "DELIVERED";
  riskScore: number;
  algoTxHash: string;
  timestamp: string;
}

const INITIAL_ORDERS: WholesalerOrder[] = [
  {
    id: "wo1",
    orderNumber: "PO-WHOLE-9901",
    batchNumber: "BN-2026-8891",
    drugName: "Amoxicillin Trihydrate 500mg",
    quantity: 15000,
    manufacturer: "Apex BioPharma Inc.",
    distributorAssigned: "FastChain Cold Logistics",
    status: "CUSTODY_RECEIVED",
    riskScore: 0.04,
    algoTxHash: "7X9K2P...M8Q1",
    timestamp: "2026-09-19 14:30",
  },
  {
    id: "wo2",
    orderNumber: "PO-WHOLE-9904",
    batchNumber: "BN-2026-9012",
    drugName: "Metformin Hydrochloride 850mg",
    quantity: 30000,
    manufacturer: "Apex BioPharma Inc.",
    distributorAssigned: "MedSpeed Express",
    status: "IN_TRANSIT",
    riskScore: 0.02,
    algoTxHash: "3B8W1L...P9X4",
    timestamp: "2026-09-21 09:15",
  },
  {
    id: "wo3",
    orderNumber: "PO-WHOLE-9910",
    batchNumber: "BN-2026-9140",
    drugName: "Atorvastatin Calcium 20mg",
    quantity: 20000,
    manufacturer: "GlobalChem Corp",
    distributorAssigned: "Pending Assignment",
    status: "PENDING_CONFIRMATION",
    riskScore: 0.14,
    algoTxHash: "Pending",
    timestamp: "2026-09-21 18:40",
  },
];

export default function WholesalerPage() {
  const [orders, setOrders] = useState<WholesalerOrder[]>(INITIAL_ORDERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [transferringId, setTransferringId] = useState<string | null>(null);

  const confirmCustodyReceipt = (orderId: string) => {
    setTransferringId(orderId);
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: "CUSTODY_RECEIVED",
                algoTxHash: `${Math.random().toString(36).substring(2, 8).toUpperCase()}...TX`,
              }
            : o
        )
      );
      setTransferringId(null);
    }, 1500);
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="WHOLESALER">
      <div className="space-y-8">
        {/* Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/30 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold shadow-lg shadow-purple-500/10">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-heading text-slate-100">Wholesaler Distribution Hub</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Bulk Custody Portal
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Receive bulk batch shipments from manufacturers, perform smart-contract verification, and assign logistics handlers.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
            <div className="text-xs text-slate-400 font-medium mb-1">TOTAL BULK ORDERS</div>
            <div className="text-2xl font-bold text-slate-100 font-mono">{orders.length}</div>
            <div className="text-xs text-slate-500 mt-1">65,000 total drug units</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
            <div className="text-xs text-slate-400 font-medium mb-1">CUSTODY VERIFIED</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              {orders.filter((o) => o.status === "CUSTODY_RECEIVED").length}
            </div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.0 h-3.0" /> Algorand verified
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
            <div className="text-xs text-slate-400 font-medium mb-1">IN TRANSIT TO DISTRIBUTOR</div>
            <div className="text-2xl font-bold text-cyan-400 font-mono">
              {orders.filter((o) => o.status === "IN_TRANSIT").length}
            </div>
            <div className="text-xs text-slate-500 mt-1">Tracked via IoT sensors</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
            <div className="text-xs text-slate-400 font-medium mb-1">AVERAGE RISK INDEX</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">0.06</div>
            <div className="text-xs text-slate-500 mt-1">ML Counterfeit score</div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="p-6 border-b border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold font-heading text-slate-100">Wholesale Shipments & Custody Log</h2>
              <p className="text-xs text-slate-400 mt-0.5">Cryptographically signed batch transfers between nodes</p>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search orders or batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">PO Number</th>
                  <th className="px-6 py-4">Batch Details</th>
                  <th className="px-6 py-4">Manufacturer</th>
                  <th className="px-6 py-4">Custody Status</th>
                  <th className="px-6 py-4">Algorand Tx</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-100">
                      {order.orderNumber}
                      <div className="text-[11px] text-slate-500 font-normal">{order.timestamp}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">{order.drugName}</div>
                      <div className="text-xs text-purple-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <Package className="w-3 h-3" /> {order.batchNumber} • {order.quantity.toLocaleString()} units
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">{order.manufacturer}</td>
                    <td className="px-6 py-4">
                      {order.status === "CUSTODY_RECEIVED" && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Custody Confirmed
                        </span>
                      )}
                      {order.status === "IN_TRANSIT" && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          In Transit
                        </span>
                      )}
                      {order.status === "PENDING_CONFIRMATION" && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Awaiting Sign-off
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{order.algoTxHash}</td>
                    <td className="px-6 py-4 text-right">
                      {order.status === "PENDING_CONFIRMATION" ? (
                        <button
                          onClick={() => confirmCustodyReceipt(order.id)}
                          disabled={transferringId === order.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/40 flex items-center gap-1.5 ml-auto transition-all"
                        >
                          {transferringId === order.id ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" /> Signing...
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3 h-3" /> Confirm Custody
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Signed & Immutable
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
