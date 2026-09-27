import Link from "next/link";
import {
  Users,
  Store,
  Briefcase,
  Megaphone,
  ClipboardList,
  Handshake,
  Radio,
  Wifi,
  Gift,
  TriangleAlert,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import {
  users,
  publishers,
  advertisers,
  campaigns,
  campaignApplications,
  deals,
  distributionRequests,
  trafficListings,
  privateOffers,
} from "@/lib/mock-data";

export default function AdminOverviewPage() {
  const pendingUsers = users.filter((u) => u.status === "pending");
  const pendingPublishers = publishers.filter((p) => !p.approved);
  const pendingAdvertisers = advertisers.filter((a) => !a.approved);
  const pendingCampaigns = campaigns.filter((c) => c.status === "draft");

  const pendingItems = [
    ...pendingUsers.map((u) => ({
      key: `user_${u.id}`,
      type: "User",
      name: `${u.name} (${u.email})`,
      href: "/admin/users",
    })),
    ...pendingPublishers.map((p) => ({
      key: `pub_${p.id}`,
      type: "Publisher",
      name: p.companyName,
      href: "/admin/publishers",
    })),
    ...pendingAdvertisers.map((a) => ({
      key: `adv_${a.id}`,
      type: "Advertiser",
      name: a.companyName,
      href: "/admin/advertisers",
    })),
    ...pendingCampaigns.map((c) => ({
      key: `camp_${c.id}`,
      type: "Campaign",
      name: c.name,
      href: "/admin/campaigns",
    })),
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={Users} label="Users" value={users.length.toString()} />
        <StatCard icon={Store} label="Publishers" value={publishers.length.toString()} />
        <StatCard icon={Briefcase} label="Advertisers" value={advertisers.length.toString()} />
        <StatCard icon={Megaphone} label="Campaigns" value={campaigns.length.toString()} />
        <StatCard icon={ClipboardList} label="Applications" value={campaignApplications.length.toString()} />
        <StatCard icon={Handshake} label="Deals" value={deals.length.toString()} />
        <StatCard icon={Radio} label="Distribution requests" value={distributionRequests.length.toString()} />
        <StatCard icon={Wifi} label="Traffic listings" value={trafficListings.length.toString()} />
        <StatCard icon={Gift} label="Private offers" value={privateOffers.length.toString()} />
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <TriangleAlert className="h-4 w-4 text-amber-600" strokeWidth={2} />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Pending approval</h2>
          <Badge status="pending" label={pendingItems.length.toString()} />
        </div>

        <div className="mt-4 divide-y divide-border">
          {pendingItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="flex items-center justify-between gap-4 py-2.5 text-sm hover:text-brand"
            >
              <span className="font-medium text-foreground">{item.name}</span>
              <span className="shrink-0 text-xs text-muted">{item.type}</span>
            </Link>
          ))}
          {pendingItems.length === 0 && (
            <p className="py-4 text-sm text-muted">Nothing needs attention right now.</p>
          )}
        </div>
      </div>
    </div>
  );
}
