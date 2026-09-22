"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Zap, User, Mail, Lock, Building2, Phone, ChevronRight, AlertCircle, Check } from "lucide-react";

const ROLES = [
  { value: "customer", label: "Customer", desc: "Order & verify medicines" },
  { value: "supplier", label: "Supplier", desc: "Manage raw materials" },
  { value: "manufacturer", label: "Manufacturer", desc: "Produce medicine batches" },
  { value: "wholesaler", label: "Wholesaler", desc: "Wholesale distribution" },
  { value: "distributor", label: "Distributor", desc: "Last-mile distribution" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "customer",
    organization: "", phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Registration failed");
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen mesh-gradient flex items-center justify-center p-4">
        <div className="glass-card p-10 text-center max-w-sm w-full animate-fade-in">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(16,185,129,0.15)", border: "2px solid rgba(16,185,129,0.4)" }}>
            <Check className="w-8 h-8" style={{ color: "#34d399" }} />
          </div>
          <h2 className="text-xl font-bold font-display mb-2" style={{ color: "#f1f5f9" }}>Account Created!</h2>
          <p className="text-sm" style={{ color: "#64748b" }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
        style={{ background: "radial-gradient(circle, #00D4FF, transparent)" }} />

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.3)" }}>
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
        </div>

        <div className="glass-card p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold font-display" style={{ color: "#f1f5f9" }}>Create Account</h2>
            <p className="text-sm mt-1" style={{ color: "#64748b" }}>Join the secure supply chain network</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl flex items-center gap-2 text-sm"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Role select */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>Role</label>
              <select
                id="register-role"
                value={form.role}
                onChange={set("role")}
                className="input-field"
                style={{ appearance: "none" }}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label} — {r.desc}
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-cyan-400" />
                <input id="register-name" type="text" value={form.name} onChange={set("name")}
                  className="input-field" style={{ paddingLeft: "44px" }} placeholder="Dr. Priya Sharma" required />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-cyan-400" />
                <input id="register-email" type="email" value={form.email} onChange={set("email")}
                  className="input-field" style={{ paddingLeft: "44px" }} placeholder="priya@pharmnex.io" required />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-cyan-400" />
                <input id="register-password" type="password" value={form.password} onChange={set("password")}
                  className="input-field" style={{ paddingLeft: "44px" }} placeholder="Min 6 characters" required minLength={6} />
              </div>
            </div>

            {/* Organization */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>Organization (optional)</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-cyan-400" />
                <input id="register-org" type="text" value={form.organization} onChange={set("organization")}
                  className="input-field" style={{ paddingLeft: "44px" }} placeholder="Cipla Ltd." />
              </div>
            </div>

            <button id="register-submit" type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              style={{ height: "48px", fontSize: "15px" }}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#64748b" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-medium hover:underline" style={{ color: "#00D4FF" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
