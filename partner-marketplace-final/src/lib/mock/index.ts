// Barrel file re-exporting all mock data and lookup helpers.
//
// This is the layer that a future integration would swap for real
// Supabase queries (see src/lib/data/* once that layer exists) — UI
// code should import from here (or from "@/lib/mock-data") rather than
// reaching into individual files, so that swap is a single-point change.

export * from "./users";
export * from "./publishers";
export * from "./advertisers";
export * from "./campaigns";
export * from "./requests";
export * from "./traffic";
export * from "./offers";
export * from "./deals";
export * from "./tracking";
