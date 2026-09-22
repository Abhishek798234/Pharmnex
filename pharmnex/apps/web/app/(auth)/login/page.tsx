"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Eye, EyeOff, Zap, Lock, Mail, AlertCircle, ChevronRight } from "lucide-react";

const ROLE_REDIRECTS: Record<string, string> = {
  admin: "/admin",
  supplier: "/supplier",
  manufacturer: "/manufacturer",
  wholesaler: "/wholesaler",
  distributor: "/distributor",
  customer: "/customer",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("pharmnex_token", data.access_token);
      localStorage.setItem("pharmnex_user", JSON.stringify(data.user));

      const redirect = ROLE_REDIRECTS[data.user.role] || "/";
      router.push(redirect);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
        style={{ background: "radial-gradient(circle, #00D4FF, transparent)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-5 blur-3xl"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center cyan-glow"
              style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.2) 0%, rgba(8,145,178,0.1) 100%)", border: "1px solid rgba(0,212,255,0.3)" }}>
              <Shield className="w-8 h-8" style={{ color: "#00D4FF" }} />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "#00D4FF" }}>
              <Zap className="w-3 h-3 text-gray-900" />
            </div>
          </div>
          <h1 className="text-3xl font-bold font-display" style={{ color: "#f1f5f9" }}>
            Pharmn<span style={{ color: "#00D4FF" }}>Ex</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            Pharmaceutical Supply Chain Intelligence
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold font-display" style={{ color: "#f1f5f9" }}>
              Sign In
            </h2>
            <p className="text-sm mt-1" style={{ color: "#64748b" }}>
              Access your role portal securely
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl flex items-center gap-2 text-sm"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-cyan-400" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: "44px" }}
                  placeholder="admin@pharmnex.io"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-cyan-400" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: "44px", paddingRight: "44px" }}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
              style={{ height: "48px", fontSize: "15px" }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#64748b" }}>
            New customer?{" "}
            <Link href="/register" className="font-medium hover:underline" style={{ color: "#00D4FF" }}>
              Create account
            </Link>
          </p>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-4 p-4 rounded-xl text-center"
          style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.08)" }}>
          <p className="text-xs font-medium mb-2" style={{ color: "#00D4FF" }}>Demo Credentials</p>
          <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: "#64748b" }}>
            <span>Admin: admin@pharmnex.io</span>
            <span>Pass: admin123</span>
          </div>
        </div>

        {/* Algorand badge */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="pulse-dot" />
          <span className="text-xs" style={{ color: "#475569" }}>
            Secured by Algorand TestNet blockchain
          </span>
        </div>
      </div>
    </div>
  );
}
