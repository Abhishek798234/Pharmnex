"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Users, UserPlus, Shield, CheckCircle2, Search, Mail, Lock, Building2, MoreVertical, Key } from "lucide-react";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPPLIER" | "MANUFACTURER" | "WHOLESALER" | "DISTRIBUTOR" | "CUSTOMER";
  organization: string;
  status: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
  algoWalletAddress: string;
}

const MOCK_USERS: UserAccount[] = [
  {
    id: "u1",
    name: "Dr. Sarah Jenkins",
    email: "s.jenkins@apexbiopharma.com",
    role: "MANUFACTURER",
    organization: "Apex BioPharma Inc.",
    status: "ACTIVE",
    algoWalletAddress: "ALGO...7X9K2P",
  },
  {
    id: "u2",
    name: "BioPharma Pure Procurement",
    email: "procure@biopharmapure.com",
    role: "SUPPLIER",
    organization: "BioPharma Pure LLC",
    status: "ACTIVE",
    algoWalletAddress: "ALGO...3B8W1L",
  },
  {
    id: "u3",
    name: "Global Logistics Ops",
    email: "ops@fastchaincold.com",
    role: "DISTRIBUTOR",
    organization: "FastChain Cold Logistics",
    status: "ACTIVE",
    algoWalletAddress: "ALGO...9Q1Z3A",
  },
  {
    id: "u4",
    name: "Apex Wholesale Hub",
    email: "hub@globalwholesale.com",
    role: "WHOLESALER",
    organization: "Global Health Wholesale",
    status: "PENDING_VERIFICATION",
    algoWalletAddress: "ALGO...5M2N4P",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserAccount[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        {/* Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-purple-900/30 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold shadow-lg shadow-cyan-500/10">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading text-slate-100">Participant Node Management</h1>
              <p className="text-slate-400 text-sm mt-1">
                Manage registered supply chain actors, role RBAC permissions, and Algorand wallet address bindings.
              </p>
            </div>
          </div>

          <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-slate-950 bg-cyan-400 hover:bg-cyan-300 font-semibold shadow-lg shadow-cyan-500/20 transition-all">
            <UserPlus className="w-4 h-4" /> Provision New Actor
          </button>
        </div>

        {/* User Table */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="p-6 border-b border-slate-800/80 flex justify-between items-center">
            <h2 className="text-lg font-bold font-heading text-slate-100">Supply Chain Registered Identities</h2>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Actor / Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Organization</th>
                  <th className="px-6 py-4">Algorand Wallet</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-100">{user.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">{user.organization}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{user.algoWalletAddress}</td>
                    <td className="px-6 py-4">
                      {user.status === "ACTIVE" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active Node
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Pending KYC
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
