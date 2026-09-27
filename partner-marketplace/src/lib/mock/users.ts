import type { User } from "@/types";

// Minimal user records backing the publisher/advertiser profiles above.
export const users: User[] = [
  { id: "user_pub_01", email: "hello@nordicdeals.dk", role: "publisher", name: "Mette Sørensen", createdAt: "2026-03-01", status: "approved" },
  { id: "user_pub_02", email: "team@homeguide.se", role: "publisher", name: "Johan Lindqvist", createdAt: "2026-03-05", status: "approved" },
  { id: "user_pub_03", email: "contact@dealhunter.no", role: "publisher", name: "Ingrid Haugen", createdAt: "2026-02-20", status: "approved" },
  { id: "user_pub_04", email: "info@kreditkompass.de", role: "publisher", name: "Lukas Weber", createdAt: "2026-01-15", status: "approved" },
  { id: "user_pub_05", email: "hi@travelbird.dk", role: "publisher", name: "Freja Madsen", createdAt: "2026-04-10", status: "approved" },
  { id: "user_pub_06", email: "team@fitlife.no", role: "publisher", name: "Erik Solberg", createdAt: "2026-04-22", status: "approved" },
  { id: "user_pub_07", email: "hello@apprabatt.se", role: "publisher", name: "Elin Berg", createdAt: "2026-05-02", status: "approved" },
  { id: "user_pub_08", email: "info@autovergleich24.de", role: "publisher", name: "Max Fischer", createdAt: "2026-02-11", status: "approved" },
  { id: "user_pub_09", email: "kontakt@teletjek.dk", role: "publisher", name: "Anders Jensen", createdAt: "2026-05-18", status: "approved" },
  { id: "user_pub_10", email: "hi@stylescout.no", role: "publisher", name: "Sofie Berge", createdAt: "2026-09-01", status: "pending" },
  { id: "user_adv_01", email: "partnerships@lumorahome.com", role: "advertiser", name: "Camilla Holm", createdAt: "2026-02-01", status: "approved" },
  { id: "user_adv_02", email: "affiliates@pennywisefinance.com", role: "advertiser", name: "Simon Kristiansen", createdAt: "2026-01-20", status: "approved" },
  { id: "user_adv_03", email: "partners@skylinetravel.com", role: "advertiser", name: "Nora Eide", createdAt: "2026-03-14", status: "approved" },
  { id: "user_adv_04", email: "affiliates@verdefashion.com", role: "advertiser", name: "Isabelle Nyström", createdAt: "2026-03-22", status: "approved" },
  { id: "user_adv_05", email: "growth@flowline.io", role: "advertiser", name: "Tobias Richter", createdAt: "2026-04-01", status: "approved" },
  { id: "user_adv_06", email: "partners@safeharborinsurance.com", role: "advertiser", name: "Julia Hoffmann", createdAt: "2026-04-15", status: "approved" },
  { id: "user_adv_07", email: "affiliates@glowandco.com", role: "advertiser", name: "Alma Svensson", createdAt: "2026-05-01", status: "approved" },
  { id: "user_adv_08", email: "partners@pulseplay.gg", role: "advertiser", name: "Oskar Lindberg", createdAt: "2026-08-25", status: "pending" },
  { id: "user_admin_01", email: "admin@partnermarketplace.io", role: "admin", name: "Platform Admin", createdAt: "2026-01-01", status: "approved" },
];

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}
