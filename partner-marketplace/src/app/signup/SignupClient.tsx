"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Building2, Users, Check, AlertCircle } from "lucide-react";
import clsx from "clsx";
import type { UserRole } from "@/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import BackendNotice from "@/components/ui/BackendNotice";

type SignupRole = Extract<UserRole, "advertiser" | "publisher">;

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role");
  const supabase = getSupabaseBrowserClient();

  const [role, setRole] = useState<SignupRole | null>(
    initialRole === "advertiser" || initialRole === "publisher" ? initialRole : null
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Real signup via Supabase Auth. `handle_new_user()` (see
  // supabase/schema.sql) reads `role`/`name` from this signup metadata and
  // auto-creates the matching `profiles` row.
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role || !supabase) return;
    setError(null);
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role, name } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (role === "advertiser") router.push("/onboarding/advertiser");
    if (role === "publisher") router.push("/onboarding/publisher");
  }

  return (
    <div className="container-page flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">Create your account</h1>
          <p className="mt-1 text-sm text-muted">
            {role
              ? "Enter your details to get started."
              : "First, tell us who you are."}
          </p>
        </div>

        {!role ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setRole("advertiser")}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center transition-colors hover:border-brand hover:bg-indigo-50/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-brand">
                <Building2 className="h-6 w-6" />
              </span>
              <span className="font-semibold text-foreground">I&apos;m an Advertiser</span>
              <span className="text-sm text-muted">
                I have a product or budget and want to reach new audiences.
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRole("publisher")}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center transition-colors hover:border-brand hover:bg-indigo-50/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-accent">
                <Users className="h-6 w-6" />
              </span>
              <span className="font-semibold text-foreground">I&apos;m a Publisher</span>
              <span className="text-sm text-muted">
                I have an audience or traffic and want to monetize it.
              </span>
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <div
              className={clsx(
                "mb-6 flex items-center justify-between rounded-lg border px-4 py-3 text-sm",
                role === "advertiser"
                  ? "border-indigo-200 bg-indigo-50 text-brand"
                  : "border-teal-200 bg-teal-50 text-accent"
              )}
            >
              <span className="flex items-center gap-2 font-medium">
                <Check className="h-4 w-4" />
                Signing up as {role === "advertiser" ? "an advertiser" : "a publisher"}
              </span>
              <button
                type="button"
                onClick={() => setRole(null)}
                className="text-xs font-medium underline underline-offset-2"
              >
                Change
              </button>
            </div>

            {!supabase && (
              <div className="mb-4">
                <BackendNotice />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Work email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <button
                type="submit"
                disabled={!supabase || loading}
                className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account…" : `Continue to ${role === "advertiser" ? "advertiser" : "publisher"} setup`}
              </button>
            </form>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
