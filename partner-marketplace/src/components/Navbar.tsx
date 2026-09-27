"use client";

import Link from "next/link";
import { Handshake } from "lucide-react";
import { useCurrentPublisher, useDemoUser } from "@/context/demo-user-context";
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
  const { role } = useDemoUser();
  const currentPublisher = useCurrentPublisher();

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
          <span className="hidden sm:inline">PartnerGoGo</span>
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
