// Small helper for bucketing a campaign's free-text `commissionAmount`
// (e.g. "150 DKK", "8%", "20 DKK + 5%") into a coarse payout band, used by
// the campaign marketplace filter.
export const PAYOUT_BANDS = ["Any", "Percentage-based", "Under 100 DKK", "100–500 DKK", "500+ DKK"] as const;
export type PayoutBand = (typeof PAYOUT_BANDS)[number];

export function matchesPayoutBand(commissionAmount: string, band: string): boolean {
  if (band === "Any") return true;
  const isPercentage = commissionAmount.includes("%") && !/\d+\s*DKK/.test(commissionAmount);
  if (band === "Percentage-based") return isPercentage;
  if (isPercentage) return false;

  const match = commissionAmount.match(/[\d.]+/);
  const amount = match ? parseFloat(match[0]) : 0;
  if (band === "Under 100 DKK") return amount < 100;
  if (band === "100–500 DKK") return amount >= 100 && amount <= 500;
  return amount > 500;
}
