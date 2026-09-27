"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import Modal from "@/components/ui/Modal";
import type { Campaign, PublisherProfile } from "@/types";

// Simulates inviting a publisher to one of the current advertiser's
// campaigns. No backend — picking a campaign and clicking "Send invite"
// just shows a success state.
export default function InviteToCampaignModal({
  open,
  onClose,
  publisher,
  campaigns,
}: {
  open: boolean;
  onClose: () => void;
  publisher: PublisherProfile;
  campaigns: Campaign[];
}) {
  const [campaignId, setCampaignId] = useState(campaigns[0]?.id ?? "");
  const [sent, setSent] = useState(false);

  function handleClose() {
    onClose();
    setTimeout(() => setSent(false), 200);
  }

  return (
    <Modal open={open} onClose={handleClose} title={`Invite ${publisher.companyName}`}>
      {sent ? (
        <div className="flex flex-col items-center py-4 text-center">
          <CheckCircle2 className="h-10 w-10 text-accent" />
          <p className="mt-3 font-medium text-foreground">Invite sent!</p>
          <p className="mt-1 text-sm text-muted">
            {publisher.companyName} has been notified about this campaign.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-indigo-700"
          >
            Done
          </button>
        </div>
      ) : campaigns.length === 0 ? (
        <p className="text-sm text-muted">
          You don&apos;t have any campaigns yet. Create one before inviting publishers.
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="invite-campaign" className="text-sm font-medium text-foreground">
              Campaign
            </label>
            <select
              id="invite-campaign"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="invite-message" className="text-sm font-medium text-foreground">
              Message (optional)
            </label>
            <textarea
              id="invite-message"
              rows={3}
              placeholder="Tell them why you think it's a good fit..."
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-indigo-700"
          >
            <Send className="h-4 w-4" />
            Send invite
          </button>
        </form>
      )}
    </Modal>
  );
}
