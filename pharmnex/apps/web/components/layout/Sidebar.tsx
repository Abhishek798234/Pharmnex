"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield, LayoutDashboard, Users, Bell, Package, FlaskConical,
  ShoppingCart, Truck, User, Microscope, TrendingUp, QrCode,
  Settings, LogOut, ChevronRight, Activity, Zap,
  BarChart3, Database, Boxes
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
};

const navByRole: Record<string, NavItem[]> = {
  admin: [
    { label: "Intelligence Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Alerts", href: "/admin/alerts", icon: Bell, badge: "live" },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "All Batches", href: "/admin/batches", icon: Boxes },
    { label: "ML Experiment A/B", href: "/admin/experiment", icon: BarChart3 },
  ],
  supplier: [
    { label: "Dashboard", href: "/supplier", icon: LayoutDashboard },
    { label: "Raw Materials", href: "/supplier/materials", icon: Database },
    { label: "Orders", href: "/supplier/orders", icon: ShoppingCart },
  ],
  manufacturer: [
    { label: "Dashboard", href: "/manufacturer", icon: LayoutDashboard },
    { label: "Medicines", href: "/manufacturer/medicines", icon: FlaskConical },
    { label: "Batches", href: "/manufacturer/batches", icon: Boxes },
    { label: "Create Batch", href: "/manufacturer/batches/new", icon: Package },
    { label: "Raw Material Orders", href: "/manufacturer/orders", icon: ShoppingCart },
  ],
  wholesaler: [
    { label: "Dashboard", href: "/wholesaler", icon: LayoutDashboard },
    { label: "Inventory", href: "/wholesaler/inventory", icon: Boxes },
    { label: "Orders", href: "/wholesaler/orders", icon: ShoppingCart },
  ],
  distributor: [
    { label: "Dashboard", href: "/distributor", icon: LayoutDashboard },
    { label: "Inventory", href: "/distributor/inventory", icon: Boxes },
    { label: "Orders", href: "/distributor/orders", icon: ShoppingCart },
    { label: "Deliveries", href: "/distributor/deliveries", icon: Truck },
  ],
  customer: [
    { label: "Dashboard", href: "/customer", icon: LayoutDashboard },
    { label: "Browse Medicines", href: "/customer/medicines", icon: FlaskConical },
    { label: "My Orders", href: "/customer/orders", icon: ShoppingCart },
    { label: "Verify Medicine", href: "/customer/verify", icon: QrCode },
  ],
};

const roleColors: Record<string, string> = {
  admin: "#00D4FF",
  supplier: "#a78bfa",
  manufacturer: "#34d399",
  wholesaler: "#fbbf24",
  distributor: "#fb923c",
  customer: "#60a5fa",
};

const roleIcons: Record<string, React.ElementType> = {
  admin: Shield,
  supplier: Database,
  manufacturer: FlaskConical,
  wholesaler: Boxes,
  distributor: Truck,
  customer: User,
};

interface SidebarProps {
  role: string;
  userName: string;
  userEmail: string;
}

export default function Sidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const navItems = navByRole[role] || [];
  const accentColor = roleColors[role] || "#00D4FF";
  const RoleIcon = roleIcons[role] || User;

  function handleLogout() {
    localStorage.removeItem("pharmnex_token");
    localStorage.removeItem("pharmnex_user");
    window.location.href = "/login";
  }

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 flex flex-col z-40"
      style={{
        width: "var(--sidebar-width)",
        background: "rgba(6, 13, 36, 0.98)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(0,212,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `rgba(0,212,255,0.12)`, border: "1px solid rgba(0,212,255,0.25)" }}
          >
            <Shield className="w-5 h-5" style={{ color: "#00D4FF" }} />
          </div>
          <div>
            <p className="font-bold font-display text-base leading-tight" style={{ color: "#f1f5f9" }}>
              Pharmn<span style={{ color: "#00D4FF" }}>Ex</span>
            </p>
            <p className="text-xs leading-tight" style={{ color: "#475569" }}>Supply Chain AI</p>
          </div>
        </div>
      </div>

      {/* Role Badge */}
      <div className="mx-4 mt-4 p-3 rounded-xl"
        style={{ background: `${accentColor}0d`, border: `1px solid ${accentColor}22` }}>
        <div className="flex items-center gap-2">
          <RoleIcon className="w-4 h-4" style={{ color: accentColor }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: accentColor }}>
            {role}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const currentPath = pathname || "";
          const isActive = currentPath === item.href || (item.href !== `/${role}` && currentPath.length > 1 && currentPath.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`sidebar-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? accentColor : "#475569" }} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                  style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" }}>
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight className="w-3 h-3" style={{ color: accentColor }} />}
            </Link>
          );
        })}
      </nav>

      {/* Live indicator */}
      <div className="px-4 py-3 flex items-center gap-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
        <div className="pulse-dot" />
        <span className="text-xs" style={{ color: "#475569" }}>Algorand TestNet</span>
      </div>

      {/* User footer */}
      <div className="px-4 pb-4 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: `${accentColor}20`, color: accentColor }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "#e2e8f0" }}>{userName}</p>
            <p className="text-xs truncate" style={{ color: "#475569" }}>{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          id="btn-logout"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:opacity-90"
          style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.15)" }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
