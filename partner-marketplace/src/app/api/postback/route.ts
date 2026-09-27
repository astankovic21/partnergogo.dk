import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { SupabaseNotConfiguredError } from "@/lib/supabase/env";
import type { CampaignRow, ClickRow } from "@/lib/supabase/types";

// Conversion postback: GET https://<site>/api/postback?click_id=...&amount=...
//
// This is the URL an advertiser fires (from their own thank-you/confirmation
// page, or their ad-tracking tool's custom postback feature) when a sale
// happens — the one manual integration step required on their side, same as
// with Adtraction/Partner-Ads/Awin. Supports both integration styles: as a
// 1x1 tracking pixel (default) or a JSON response (Accept: application/json
// or ?format=json).
export const dynamic = "force-dynamic";

// A 1x1 transparent GIF — the standard tracking-pixel response body.
const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
  "base64"
);

function wantsJson(request: NextRequest): boolean {
  if (request.nextUrl.searchParams.get("format") === "json") return true;
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("application/json");
}

function pixelResponse(): NextResponse {
  return new NextResponse(TRANSPARENT_GIF, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Content-Length": String(TRANSPARENT_GIF.byteLength),
      "Cache-Control": "no-store",
    },
  });
}

function successResponse(request: NextRequest, conversionId: string | null): NextResponse {
  if (wantsJson(request)) {
    return NextResponse.json({ success: true, conversion_id: conversionId });
  }
  return pixelResponse();
}

// Parses a flat "450 DKK" style commission_amount into a number, or null if
// it's percentage-based (e.g. "8%") or otherwise unparseable, in which case
// the caller must pass an explicit `amount`.
function parseFlatDkk(commissionAmount: string): number | null {
  const match = commissionAmount.match(/(-?\d+(?:[.,]\d+)?)\s*DKK/i);
  if (!match) return null;
  return Number(match[1].replace(",", "."));
}

export async function GET(request: NextRequest) {
  const clickId = request.nextUrl.searchParams.get("click_id");
  const amountParam = request.nextUrl.searchParams.get("amount");

  // A malformed/missing click_id must never break the advertiser's
  // thank-you page — log it and still return the pixel with a 200.
  if (!clickId) {
    console.warn("[postback] request missing required click_id param");
    return pixelResponse();
  }

  let admin;
  try {
    admin = getSupabaseAdminClient();
  } catch (err) {
    if (err instanceof SupabaseNotConfiguredError) {
      console.warn("[postback] backend not configured, ignoring postback for click_id:", clickId);
      return pixelResponse();
    }
    throw err;
  }

  const { data: click } = await admin
    .from("clicks")
    .select("*")
    .eq("click_id", clickId)
    .maybeSingle<ClickRow>();

  if (!click) {
    console.warn("[postback] unknown click_id:", clickId);
    return pixelResponse();
  }

  const { data: campaign } = await admin
    .from("campaigns")
    .select("*")
    .eq("id", click.campaign_id)
    .maybeSingle<CampaignRow>();

  if (!campaign) {
    console.warn("[postback] click references a campaign that no longer exists:", click.campaign_id);
    return pixelResponse();
  }

  let commission: number;
  if (amountParam) {
    const parsed = Number(amountParam);
    if (!Number.isFinite(parsed)) {
      return NextResponse.json({ error: "amount must be a number" }, { status: 400 });
    }
    commission = parsed;
  } else {
    const flat = parseFlatDkk(campaign.commission_amount);
    if (flat === null) {
      return NextResponse.json(
        { error: "amount required for percentage-based commission models" },
        { status: 400 }
      );
    }
    commission = flat;
  }

  let conversionId: string | null = null;
  try {
    const { data: conversion, error } = await admin
      .from("conversions")
      .insert({
        click_id: clickId,
        campaign_id: campaign.id,
        publisher_id: click.publisher_id,
        advertiser_id: campaign.advertiser_id,
        commission,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[postback] failed to record conversion:", error.message);
    } else {
      conversionId = (conversion as { id: string } | null)?.id ?? null;
    }
  } catch (err) {
    console.error("[postback] failed to record conversion:", err);
  }

  return successResponse(request, conversionId);
}
