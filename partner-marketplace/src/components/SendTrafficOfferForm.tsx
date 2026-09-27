"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

// Simulates an advertiser sending an offer on a TrafficListing.
export default function SendTrafficOfferForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-accent">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        Offer sent! The publisher will review and respond.
      </div>
    );
  }

  return (
    <form
      id="offer"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="proposedTerms" className="text-sm font-medium text-foreground">
          Proposed terms
        </label>
        <input
          id="proposedTerms"
          required
          placeholder="e.g. 8% CPS, 30-day cookie"
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>
      <div>
        <label htmlFor="offerMessage" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="offerMessage"
          rows={3}
          required
          placeholder="What would you like to promote on this traffic?"
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700"
      >
        <Send className="h-4 w-4" />
        Send offer
      </button>
    </form>
  );
}
