import Link from "next/link";
import {
  Building2,
  Megaphone,
  Sparkles,
  Users,
  ShoppingCart,
  LineChart,
  ArrowRight,
} from "lucide-react";
import PublisherCard from "@/components/PublisherCard";
import CampaignCard from "@/components/CampaignCard";
import { publishers, campaigns } from "@/lib/mock-data";

const flowSteps = [
  { icon: Building2, label: "Advertiser", desc: "Lists brand & budget" },
  { icon: Megaphone, label: "Campaign", desc: "Sets terms & goals" },
  { icon: Sparkles, label: "Smart matching", desc: "Scores best-fit partners" },
  { icon: Users, label: "Publisher", desc: "Applies with their audience" },
  { icon: ShoppingCart, label: "Customers", desc: "Discover & convert" },
  { icon: LineChart, label: "Performance", desc: "Tracked, paid, optimized" },
];

export default function Home() {
  const featuredPublishers = publishers.filter((p) => p.approved).slice(0, 3);
  const featuredCampaigns = campaigns.filter((c) => c.status === "active").slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-indigo-50/60 to-background">
        <div className="container-page flex flex-col items-center py-24 text-center sm:py-32">
          <span className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted">
            A marketplace for performance marketing partnerships
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Where performance meets distribution.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Find publishers. Find campaigns. Build performance partnerships.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup?role=advertiser"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700"
            >
              I&apos;m an Advertiser
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup?role=publisher"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-slate-50"
            >
              I&apos;m a Publisher
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Flow diagram */}
      <section id="how-it-works" className="container-page py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How the marketplace works
          </h2>
          <p className="mt-3 text-muted">
            From a listed campaign to a paid, performing partnership — matched by data, not cold outreach.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {flowSteps.map((step, i) => (
            <div key={step.label} className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
                <step.icon className="h-6 w-6 text-brand" strokeWidth={1.75} />
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">{step.label}</p>
              <p className="mt-1 text-xs text-muted">{step.desc}</p>
              {i < flowSteps.length - 1 && (
                <ArrowRight className="absolute -right-4 top-5 hidden h-4 w-4 text-slate-300 lg:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Marketplace preview */}
      <section id="marketplace" className="border-t border-border bg-slate-50/60">
        <div className="container-page py-20 sm:py-28">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Live on the marketplace
              </h2>
              <p className="mt-3 max-w-lg text-muted">
                A sample of the publishers and campaigns already using the platform.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted">
              Featured publishers
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPublishers.map((p) => (
                <PublisherCard key={p.id} publisher={p} />
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted">
              Active campaigns
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCampaigns.map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-20 sm:py-28">
        <div className="rounded-2xl border border-border bg-brand px-8 py-14 text-center shadow-sm sm:px-16">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Ready to build your next partnership?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-indigo-100">
            Join as an advertiser to reach new audiences, or as a publisher to monetize yours.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/signup?role=advertiser"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand shadow-sm transition-colors hover:bg-indigo-50"
            >
              Get started as an advertiser
            </Link>
            <Link
              href="/signup?role=publisher"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-300 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Get started as a publisher
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
