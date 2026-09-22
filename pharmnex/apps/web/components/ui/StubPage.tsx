import { Construction } from "lucide-react";
import Link from "next/link";

interface StubPageProps {
  title: string;
  description: string;
  backHref: string;
  backLabel: string;
}

export default function StubPage({ title, description, backHref, backLabel }: StubPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 p-8">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)" }}
      >
        <Construction className="w-8 h-8" style={{ color: "#00D4FF" }} />
      </div>
      <h2 className="text-2xl font-bold font-display" style={{ color: "#f1f5f9" }}>{title}</h2>
      <p className="text-sm max-w-md" style={{ color: "#64748b" }}>{description}</p>
      <Link
        href={backHref}
        className="mt-4 text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
        style={{
          background: "rgba(0,212,255,0.08)",
          border: "1px solid rgba(0,212,255,0.2)",
          color: "#00D4FF",
        }}
      >
        ← {backLabel}
      </Link>
    </div>
  );
}
