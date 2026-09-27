"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import Modal from "@/components/ui/Modal";
import type { Campaign, PublisherProfile } from "@/types";

// Simulates the advertiser sending a private (above-standard) offer to a
// publisher. No backend — this only shows a success state.
export default function SendPrivateOfferModal({
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
  const [sent, setSent] = useState(false);
  const [privateCpa, setPrivateCpa] = useState("");
  const [requirement, setRequirement] = useState("");

  function handleClose() {
    onClose();
    setTimeout(() => {
      setSent(false);
      setPrivateCpa("");
      setRequirement("");
    }, 200);
  }

  return (
    <Modal open={open} onClose={handleClose} title={`Send private offer to ${publisher.companyName}`}>
      {sent ? (
        <div className="flex flex-col items-center py-4 text-center">
          <CheckCircle2 className="h-10 w-10 text-accent" />
          <p className="mt-3 font-medium text-foreground">Offer sent!</p>
          <p className="mt-1 text-sm text-muted">
            {publisher.companyName} will see this in their private offers inbox.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-indigo-700"
          >
            Done
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="space-y-4"
        >
          {campaigns.length > 0 && (
            <div>
              <label htmlFor="offer-campaign" className="text-sm font-medium text-foreground">
                Related campaign (optional)
              </label>
              <select
                id="offer-campaign"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="">General / not tied to a campaign</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label htmlFor="offer-cpa" className="text-sm font-medium text-foreground">
              Private CPA / commission
            </label>
            <input
              id="offer-cpa"
              required
              value={privateCpa}
              onChange={(e) => setPrivateCpa(e.target.value)}
              placeholder="e.g. 12% or 500 DKK"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label htmlFor="offer-requirement" className="text-sm font-medium text-foreground">
              Requirement (optional)
            </label>
            <textarea
              id="offer-requirement"
              rows={2}
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="e.g. Minimum 200 conversions per month"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-indigo-700"
          >
            <Send className="h-4 w-4" />
            Send private offer
          </button>
        </form>
      )}
    </Modal>
  );
}
