"use client";

import Link from "next/link";
import { useState } from "react";
import { Handshake, ChevronDown, UserCog } from "lucide-react";
import { publishers, advertisers } from "@/lib/mock-data";
import { useCurrentAdvertiser, useCurrentPublisher, useDemoUser } from "@/context/demo-user-context";
import AuthStatus from "@/components/AuthStatus";

const advertiserNav = [
  { href: "/advertiser/dashboard", label: "Overview" },
  { href: "/marketplace/publishers", label: "Publishers" },
  { href: "/advertiser/campaigns", label: "Campaigns" },
  { href: "/advertiser/distribution", label: "Distribution" },
  { href: "/advertiser/offers", label: "Offers" },
];

const publisherNav = [
  { href: "/publisher/dashboard", label: "Overview" },
  { href: "/marketplace/campaigns", label: "Campaigns" },
  { href: "/distribution", label: "Opportunities" },
  { href: "/publisher/offers", label: "Offers" },
  { href: "/publisher/performance", label: "Performance" },
];

export default function Navbar() {
  const { role, setRole, publisherId, advertiserId, setPublisherId, setAdvertiserId } = useDemoUser();
  const currentPublisher = useCurrentPublisher();
  const currentAdvertiser = useCurrentAdvertiser();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const navLinks = role === "advertiser" ? advertiserNav : publisherNav;
  const profileHref =
    role === "advertiser" ? `/advertiser/dashboard` : `/publishers/${currentPublisher.id}`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
            <Handshake className="h-4.5 w-4.5" strokeWidth={2.25} />
          </span>
          <span className="hidden sm:inline">Partner Marketplace</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <Link href={profileHref} className="transition-colors hover:text-foreground">
            {role === "advertiser" ? "Performance" : "Profile"}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real Supabase auth state — subordinate to and clearly separate
              from the demo switcher below; renders nothing without a real
              session. */}
          <AuthStatus />

          {/* Demo role switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSwitcherOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-dashed border-indigo-300 bg-indigo-50 px-3 py-2 text-xs font-medium text-brand transition-colors hover:bg-indigo-100"
            >
              <UserCog className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                Demo view: {role === "advertiser" ? currentAdvertiser.companyName : currentPublisher.companyName}
              </span>
              <span className="sm:hidden">Demo</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {switcherOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSwitcherOpen(false)} aria-hidden />
                <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-border bg-card p-4 shadow-lg">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Demo viewing mode
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    No real accounts yet — pick who you&apos;re browsing as.
                  </p>

                  <div className="mt-3 flex rounded-lg border border-border p-1 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setRole("advertiser")}
                      className={`flex-1 rounded-md px-2 py-1.5 transition-colors ${
                        role === "advertiser" ? "bg-brand text-brand-foreground" : "text-muted hover:text-foreground"
                      }`}
                    >
                      Advertiser view
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("publisher")}
                      className={`flex-1 rounded-md px-2 py-1.5 transition-colors ${
                        role === "publisher" ? "bg-accent text-white" : "text-muted hover:text-foreground"
                      }`}
                    >
                      Publisher view
                    </button>
                  </div>

                  {role === "advertiser" ? (
                    <div className="mt-3">
                      <label className="text-xs font-medium text-muted">Advertiser account</label>
                      <select
                        value={advertiserId}
                        onChange={(e) => setAdvertiserId(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      >
                        {advertisers.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.companyName}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <label className="text-xs font-medium text-muted">Publisher account</label>
                      <select
                        value={publisherId}
                        onChange={(e) => setPublisherId(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      >
                        {publishers.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.companyName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <Link
                    href={role === "advertiser" ? "/advertiser/dashboard" : "/publisher/dashboard"}
                    onClick={() => setSwitcherOpen(false)}
                    className="mt-3 block rounded-lg bg-slate-900 px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Go to {role} dashboard
                  </Link>
                </div>
              </>
            )}
          </div>

          <Link
            href="/login"
            className="hidden text-sm font-medium text-muted transition-colors hover:text-foreground md:block"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="hidden rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700 sm:inline-flex"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-4 overflow-x-auto border-t border-border px-4 py-2 text-xs font-medium text-muted lg:hidden">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="shrink-0 transition-colors hover:text-foreground">
            {link.label}
          </Link>
        ))}
        <Link href={profileHref} className="shrink-0 transition-colors hover:text-foreground">
          {role === "advertiser" ? "Performance" : "Profile"}
        </Link>
      </nav>
    </header>
  );
}
