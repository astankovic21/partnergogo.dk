import clsx from "clsx";

// Small horizontal "match %" indicator used on the matching-recommendation
// sections of both dashboards.
export default function MatchBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "bg-accent" : score >= 40 ? "bg-amber-500" : "bg-slate-400";
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
        <div
          className={clsx("h-full rounded-full", color)}
          style={{ width: `${Math.max(4, score)}%` }}
        />
      </div>
      <span className="w-9 text-right text-xs font-semibold text-foreground">{score}%</span>
    </div>
  );
}
