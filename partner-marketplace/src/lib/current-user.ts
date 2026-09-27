import { publishers, advertisers } from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// Demo "current user" helpers.
//
// There is no real authentication yet, so the app simulates "being logged
// in" as a hardcoded demo publisher or advertiser. `DemoUserProvider`
// (src/context/demo-user-context.tsx) lets a viewer switch which demo
// company they're browsing as, but these constants define the defaults.
// ---------------------------------------------------------------------------

export const DEMO_PUBLISHER_ID = publishers[0].id;
export const DEMO_ADVERTISER_ID = advertisers[0].id;

export function getDemoPublisher() {
  return publishers.find((p) => p.id === DEMO_PUBLISHER_ID) ?? publishers[0];
}

export function getDemoAdvertiser() {
  return advertisers.find((a) => a.id === DEMO_ADVERTISER_ID) ?? advertisers[0];
}
