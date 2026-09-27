"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const adminNavLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/publishers", label: "Publishers" },
  { href: "/admin/advertisers", label: "Advertisers" },
  { href: "/admin/campaigns", label: "Campaigns" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/deals", label: "Deals" },
  { href: "/admin/opportunities", label: "Opportunities" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 border-b border-border pb-3">
      {adminNavLinks.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              active ? "bg-slate-900 text-white" : "text-muted hover:bg-slate-100 hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
