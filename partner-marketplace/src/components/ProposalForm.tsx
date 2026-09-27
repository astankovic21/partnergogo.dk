"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { TRAFFIC_SOURCES } from "@/types";

// Simulates submitting a Proposal for a DistributionRequest. No backend —
// this only shows a success state.
export default function ProposalForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-accent">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        Proposal submitted! The advertiser will review and respond.
      </div>
    );
  }

  return (
    <form
      id="proposal"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="expectedVolume" className="text-sm font-medium text-foreground">
            Expected monthly volume
          </label>
          <input
            id="expectedVolume"
            type="number"
            required
            placeholder="400"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div>
          <label htmlFor="requestedCpa" className="text-sm font-medium text-foreground">
            Requested CPA / rate
          </label>
          <input
            id="requestedCpa"
            required
            placeholder="e.g. 400 DKK"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div>
          <label htmlFor="trafficSource" className="text-sm font-medium text-foreground">
            Traffic source
          </label>
          <select
            id="trafficSource"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            {TRAFFIC_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="placement" className="text-sm font-medium text-foreground">
            Placement
          </label>
          <input
            id="placement"
            required
            placeholder="e.g. Homepage deals block"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          rows={3}
          required
          placeholder="Why you're a good fit for this opportunity..."
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700"
      >
        <Send className="h-4 w-4" />
        Submit proposal
      </button>
    </form>
  );
}
