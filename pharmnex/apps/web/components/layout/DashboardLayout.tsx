"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { RefreshCw } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  role?: string;
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
  role: roleProp,
}: DashboardLayoutProps) {
  const [user, setUser] = useState<{ role: string; name: string; email: string }>({
    role: roleProp?.toLowerCase() ?? "admin",
    name: `${(roleProp ?? "Admin").charAt(0).toUpperCase()}${(roleProp ?? "Admin").slice(1).toLowerCase()} Node`,
    email: `${(roleProp ?? "admin").toLowerCase()}@pharmnex.io`,
  });

  useEffect(() => {
    const userData = localStorage.getItem("pharmnex_user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
      } catch {
        // keep default
      }
    }
  }, []);

  const displayTitle = title ?? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)} Portal`;

  return (
    <div className="min-h-screen mesh-gradient flex">
      <Sidebar role={user.role} userName={user.name} userEmail={user.email} />

      <main
        className="flex-1 min-h-screen overflow-auto"
        style={{ marginLeft: "var(--sidebar-width)" }}
      >
        {/* Top header */}
        <header
          className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between"
          style={{
            background: "rgba(2,8,23,0.85)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(0,212,255,0.06)",
          }}
        >
          <div>
            <h1 className="text-xl font-bold font-display" style={{ color: "#f1f5f9" }}>
              {displayTitle}
            </h1>
            {subtitle && (
              <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {actions}
            <button
              id="btn-refresh"
              className="p-2 rounded-xl transition-all duration-200 hover:opacity-80"
              style={{
                background: "rgba(0,212,255,0.06)",
                border: "1px solid rgba(0,212,255,0.12)",
                color: "#64748b",
              }}
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="p-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
