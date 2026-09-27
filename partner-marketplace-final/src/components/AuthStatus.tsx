"use client";

// ---------------------------------------------------------------------------
// Small, clearly-separate indicator of REAL Supabase auth state, shown next
// to (never instead of) the existing demo-switcher in the navbar. Renders
// nothing when Supabase isn't configured or there's no real session, so it
// never gets in the way of the demo.
// ---------------------------------------------------------------------------

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthStatus() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user?.email ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (!supabase || !email) return null;

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-muted md:flex">
      <User className="h-3.5 w-3.5 shrink-0" />
      <span className="max-w-[10rem] truncate">
        Your account: <span className="font-medium text-foreground">{email}</span>
      </span>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-1 rounded-md px-1.5 py-1 font-medium text-foreground transition-colors hover:bg-slate-200"
      >
        <LogOut className="h-3 w-3" />
        Log out
      </button>
    </div>
  );
}
