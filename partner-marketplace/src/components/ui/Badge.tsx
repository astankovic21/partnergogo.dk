import clsx from "clsx";

// Generic status pill. Maps the various domain status strings used across
// campaigns, applications, proposals, offers, and deals to a consistent
// color language: teal/green = good, amber = pending/in-progress,
// rose = negative, slate = neutral/inactive.
const STATUS_STYLES: Record<string, string> = {
  active: "bg-teal-50 text-accent border-teal-200",
  approved: "bg-teal-50 text-accent border-teal-200",
  accepted: "bg-teal-50 text-accent border-teal-200",
  completed: "bg-teal-50 text-accent border-teal-200",
  open: "bg-teal-50 text-accent border-teal-200",

  pending: "bg-amber-50 text-amber-700 border-amber-200",
  negotiating: "bg-amber-50 text-amber-700 border-amber-200",
  countered: "bg-amber-50 text-amber-700 border-amber-200",

  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  declined: "bg-rose-50 text-rose-700 border-rose-200",
  disabled: "bg-rose-50 text-rose-700 border-rose-200",

  paused: "bg-slate-100 text-muted border-border",
  draft: "bg-slate-100 text-muted border-border",
  closed: "bg-slate-100 text-muted border-border",
};

export default function Badge({ status, label }: { status: string; label?: string }) {
  const style = STATUS_STYLES[status.toLowerCase()] ?? "bg-slate-100 text-muted border-border";
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
        style
      )}
    >
      {label ?? status}
    </span>
  );
}
