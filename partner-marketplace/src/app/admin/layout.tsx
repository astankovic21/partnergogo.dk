import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";

// Internal tool — must never be indexed or linked from search results.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container-page py-10">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
          <ShieldCheck className="h-4.5 w-4.5" strokeWidth={2.25} />
        </span>
        <div>
          <h1 className="text-xl font-bold text-foreground">Admin</h1>
          <p className="text-xs text-muted">Internal tool — not part of the advertiser/publisher experience.</p>
        </div>
      </div>

      <div className="mt-6">
        <AdminNav />
      </div>

      <div className="mt-8">{children}</div>
    </div>
  );
}
