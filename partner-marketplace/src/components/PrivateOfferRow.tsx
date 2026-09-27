"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, MessageSquare } from "lucide-react";
import type { PrivateOffer, PrivateOfferStatus } from "@/types";
import Badge from "@/components/ui/Badge";
import { deals } from "@/lib/mock-data";

// Renders one private offer with local Accept/Counter/Decline actions.
// Status changes are in-memory only (no persistence), matching the MVP
// scope. `counterpartyName` is whichever side isn't viewing (brand name
// for the publisher view, publisher company name for the advertiser view).
export default function PrivateOfferRow({
  offer,
  counterpartyName,
}: {
  offer: PrivateOffer;
  counterpartyName: string;
}) {
  const [status, setStatus] = useState<PrivateOfferStatus>(offer.status);
  const [counterOpen, setCounterOpen] = useState(false);
  const [counterAmount, setCounterAmount] = useState("");
  const [appliedCounter, setAppliedCounter] = useState<string | null>(null);

  const linkedDeal = deals.find(
    (d) => d.advertiserId === offer.advertiserId && d.publisherId === offer.publisherId
  );

  const finalStatus = status === "countered" && counterOpen === false && appliedCounter ? "countered" : status;
  const locked = finalStatus === "accepted" || finalStatus === "declined";

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">{offer.brand}</p>
          <p className="mt-0.5 text-xs text-muted">with {counterpartyName}</p>
        </div>
        <Badge status={finalStatus} />
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        {offer.standardCpa && (
          <div>
            <p className="text-xs text-muted">Standard rate</p>
            <p className="font-medium text-foreground line-through decoration-slate-300">
              {offer.standardCpa}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs text-muted">Private rate</p>
          <p className="font-semibold text-accent">{appliedCounter ?? offer.privateCpa}</p>
        </div>
      </div>

      {offer.requirement && (
        <p className="mt-3 text-sm text-muted">
          <span className="font-medium text-foreground">Requirement: </span>
          {offer.requirement}
        </p>
      )}

      {!locked && (
        <div className="mt-4 border-t border-border pt-4">
          {counterOpen ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!counterAmount.trim()) return;
                setAppliedCounter(counterAmount);
                setStatus("countered");
                setCounterOpen(false);
              }}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <input
                autoFocus
                value={counterAmount}
                onChange={(e) => setCounterAmount(e.target.value)}
                placeholder="Your counter rate, e.g. 13%"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-brand-foreground hover:bg-indigo-700"
                >
                  Send counter
                </button>
                <button
                  type="button"
                  onClick={() => setCounterOpen(false)}
                  className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setStatus("accepted")}
                className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white hover:bg-teal-700"
              >
                <Check className="h-3.5 w-3.5" />
                Accept
              </button>
              <button
                type="button"
                onClick={() => setCounterOpen(true)}
                className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-slate-50"
              >
                Counter
              </button>
              <button
                type="button"
                onClick={() => setStatus("declined")}
                className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
              >
                <X className="h-3.5 w-3.5" />
                Decline
              </button>
              {linkedDeal && (
                <Link
                  href={`/deals/${linkedDeal.id}`}
                  className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Open negotiation
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {locked && linkedDeal && (
        <div className="mt-4 border-t border-border pt-4">
          <Link
            href={`/deals/${linkedDeal.id}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Open negotiation
          </Link>
        </div>
      )}
    </div>
  );
}
