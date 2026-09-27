"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Handshake, AlertCircle } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import BackendNotice from "@/components/ui/BackendNotice";

// Real login, wired to Supabase Auth. Additive to the demo — the navbar's
// "Demo: viewing as…" switcher is untouched and keeps working with or
// without a Supabase project configured.
export default function LoginClient() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setError(null);
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const role = data.user?.user_metadata?.role;
    if (role === "advertiser") router.push("/advertiser/campaigns/live");
    else if (role === "publisher") router.push("/publisher/campaigns/live");
    else router.push("/");
    router.refresh();
  }

  return (
    <div className="container-page flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-brand-foreground">
            <Handshake className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <h1 className="mt-4 text-xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Log in to your Partner Marketplace account.</p>
        </div>

        {!supabase && (
          <div className="mt-6">
            <BackendNotice />
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
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
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-brand hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
