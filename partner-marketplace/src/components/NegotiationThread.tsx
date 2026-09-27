"use client";

import { useState } from "react";
import { Send, Check, X, MessageSquare } from "lucide-react";
import clsx from "clsx";
import type { Deal, NegotiationMessage } from "@/types";
import { getPublisherById, getAdvertiserById } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import { useDemoUser } from "@/context/demo-user-context";

let nextMsgId = 9000;

export default function NegotiationThread({
  deal,
  initialMessages,
}: {
  deal: Deal;
  initialMessages: NegotiationMessage[];
}) {
  const { role } = useDemoUser();
  const publisher = getPublisherById(deal.publisherId);
  const advertiser = getAdvertiserById(deal.advertiserId);

  const [messages, setMessages] = useState<NegotiationMessage[]>(initialMessages);
  const [status, setStatus] = useState(deal.status);
  const [counterOpen, setCounterOpen] = useState(false);
  const [counterAmount, setCounterAmount] = useState("");

  function appendMessage(text: string, proposedTerms?: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg_local_${nextMsgId++}`,
        senderId: role === "advertiser" ? `demo_${advertiser?.id}` : `demo_${publisher?.id}`,
        senderRole: role,
        text,
        proposedTerms,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  function handleAccept() {
    appendMessage("Accepted the current terms.");
    setStatus("accepted");
  }

  function handleDecline() {
    appendMessage("Declined to move forward with this deal.");
    setStatus("rejected");
  }

  function handleCounterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!counterAmount.trim()) return;
    appendMessage(`Countered with new terms: ${counterAmount}.`, counterAmount);
    setStatus("negotiating");
    setCounterOpen(false);
    setCounterAmount("");
  }

  const disabled = status === "accepted" || status === "rejected" || status === "completed";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <MessageSquare className="h-4 w-4 text-muted" />
            {advertiser?.companyName ?? "Advertiser"} &harr; {publisher?.companyName ?? "Publisher"}
          </p>
          <p className="mt-1 text-xs text-muted">{deal.commissionModel} deal</p>
        </div>
        <Badge status={status} />
      </div>

      <div className="mt-6 space-y-4">
        {messages.map((m) => {
          const isAdvertiser = m.senderRole === "advertiser";
          return (
            <div key={m.id} className={clsx("flex", isAdvertiser ? "justify-start" : "justify-end")}>
              <div
                className={clsx(
                  "max-w-[80%] rounded-xl px-4 py-3 text-sm shadow-sm",
                  isAdvertiser
                    ? "rounded-tl-sm bg-card border border-border text-foreground"
                    : "rounded-tr-sm bg-indigo-50 text-slate-900"
                )}
              >
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                  {isAdvertiser ? advertiser?.companyName ?? "Advertiser" : publisher?.companyName ?? "Publisher"}
                </p>
                <p>{m.text}</p>
                {m.proposedTerms && (
                  <p className="mt-2 rounded-lg bg-white/70 px-2.5 py-1.5 text-xs font-medium text-brand">
                    Proposed: {m.proposedTerms}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {disabled ? (
        <div className="mt-6 rounded-xl border border-border bg-card p-4 text-center text-sm text-muted">
          This negotiation is {status}. No further action needed.
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-border bg-card p-4">
          {counterOpen ? (
            <form onSubmit={handleCounterSubmit} className="flex flex-col gap-2 sm:flex-row">
              <input
                autoFocus
                value={counterAmount}
                onChange={(e) => setCounterAmount(e.target.value)}
                placeholder="e.g. 350 DKK CPA, 30-day cookie"
                className="flex-1 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-indigo-700"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
                <button
                  type="button"
                  onClick={() => setCounterOpen(false)}
                  className="rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-muted hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleAccept}
                className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
              >
                <Check className="h-4 w-4" />
                Accept
              </button>
              <button
                type="button"
                onClick={() => setCounterOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-slate-50"
              >
                Counter
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100"
              >
                <X className="h-4 w-4" />
                Decline
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
