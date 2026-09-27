"use client";

// ---------------------------------------------------------------------------
// Demo "viewing as" context.
//
// This app has no real authentication or backend session. To make the
// two-sided marketplace explorable, we simulate "being logged in" as one
// of the mock publishers or advertisers, and let the viewer switch roles
// and companies from the navbar. State is kept in React context and mirrored
// to localStorage purely as a per-browser convenience (so a refresh keeps
// your choice); nothing here is a real session and it is never read by
// other users or persisted anywhere else.
// ---------------------------------------------------------------------------

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { publishers, advertisers } from "@/lib/mock-data";
import { DEMO_PUBLISHER_ID, DEMO_ADVERTISER_ID } from "@/lib/current-user";
import type { PublisherProfile, AdvertiserProfile } from "@/types";

export type DemoRole = "advertiser" | "publisher";

interface DemoUserState {
  role: DemoRole;
  publisherId: string;
  advertiserId: string;
  setRole: (role: DemoRole) => void;
  setPublisherId: (id: string) => void;
  setAdvertiserId: (id: string) => void;
}

const STORAGE_KEY = "pm_demo_user_v1";

const DemoUserContext = createContext<DemoUserState | null>(null);

export function DemoUserProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<DemoRole>("advertiser");
  const [publisherId, setPublisherIdState] = useState(DEMO_PUBLISHER_ID);
  const [advertiserId, setAdvertiserIdState] = useState(DEMO_ADVERTISER_ID);

  // One-time hydration from localStorage on mount: the initial render must
  // match the server (no window access during SSR), so the stored "viewing
  // as" choice is applied here rather than in the useState initializer.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<{
        role: DemoRole;
        publisherId: string;
        advertiserId: string;
      }>;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage hydration, not a render-cascade
      if (parsed.role === "advertiser" || parsed.role === "publisher") setRoleState(parsed.role);
      if (parsed.publisherId) setPublisherIdState(parsed.publisherId);
      if (parsed.advertiserId) setAdvertiserIdState(parsed.advertiserId);
    } catch {
      // Ignore unavailable/blocked storage (private browsing, etc).
    }
  }, []);

  function persist(next: Partial<{ role: DemoRole; publisherId: string; advertiserId: string }>) {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ role, publisherId, advertiserId, ...next })
      );
    } catch {
      // Ignore.
    }
  }

  const setRole = (next: DemoRole) => {
    setRoleState(next);
    persist({ role: next });
  };
  const setPublisherId = (id: string) => {
    setPublisherIdState(id);
    persist({ publisherId: id });
  };
  const setAdvertiserId = (id: string) => {
    setAdvertiserIdState(id);
    persist({ advertiserId: id });
  };

  return (
    <DemoUserContext.Provider
      value={{ role, publisherId, advertiserId, setRole, setPublisherId, setAdvertiserId }}
    >
      {children}
    </DemoUserContext.Provider>
  );
}

export function useDemoUser(): DemoUserState {
  const ctx = useContext(DemoUserContext);
  if (!ctx) throw new Error("useDemoUser must be used within a DemoUserProvider");
  return ctx;
}

export function useCurrentPublisher(): PublisherProfile {
  const { publisherId } = useDemoUser();
  return publishers.find((p) => p.id === publisherId) ?? publishers[0];
}

export function useCurrentAdvertiser(): AdvertiserProfile {
  const { advertiserId } = useDemoUser();
  return advertisers.find((a) => a.id === advertiserId) ?? advertisers[0];
}
