"use client";

import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Reads a `?created=1` query param set after an in-memory "submit" flow
// (new campaign, new distribution request, etc.) and renders a success
// banner. Must be rendered inside a <Suspense> boundary since it uses
// useSearchParams.
export default function CreatedBanner({ message }: { message: string }) {
  const params = useSearchParams();
  if (params.get("created") !== "1") return null;

  return (
    <div className="mb-6 flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-accent">
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      {message}
    </div>
  );
}
