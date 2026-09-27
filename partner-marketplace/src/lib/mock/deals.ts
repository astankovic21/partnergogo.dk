import type {
  CampaignApplication,
  Deal,
  Negotiation,
} from "@/types";

export const campaignApplications: CampaignApplication[] = [
  {
    id: "capp_01",
    campaignId: "camp_01",
    publisherId: "pub_01",
    status: "approved",
    message: "We'd like to feature the autumn collection in our next newsletter.",
    createdAt: "2026-08-02",
  },
  {
    id: "capp_02",
    campaignId: "camp_07",
    publisherId: "pub_03",
    status: "approved",
    message: "Our fashion audience is a strong fit for Verde's new arrivals.",
    createdAt: "2026-08-16",
  },
  {
    id: "capp_03",
    campaignId: "camp_03",
    publisherId: "pub_02",
    status: "pending",
    message: "Would like to add the loan offer to our finance comparison table.",
    createdAt: "2026-09-01",
  },
  {
    id: "capp_04",
    campaignId: "camp_11",
    publisherId: "pub_08",
    status: "approved",
    createdAt: "2026-08-05",
  },
  {
    id: "capp_05",
    campaignId: "camp_12",
    publisherId: "pub_06",
    status: "approved",
    message: "Great fit for our health and wellness audience.",
    createdAt: "2026-08-10",
  },
  {
    id: "capp_06",
    campaignId: "camp_09",
    publisherId: "pub_09",
    status: "rejected",
    message: "Interested in promoting the free trial.",
    createdAt: "2026-08-24",
  },
  {
    id: "capp_07",
    campaignId: "camp_14",
    publisherId: "pub_07",
    status: "pending",
    createdAt: "2026-09-09",
  },
];

export const deals: Deal[] = [
  {
    id: "deal_01",
    advertiserId: "adv_01",
    publisherId: "pub_01",
    campaignId: "camp_01",
    commissionModel: "CPS",
    terms: { percentage: 0.08, notes: "Standard campaign terms." },
    status: "active",
    createdAt: "2026-08-03",
    updatedAt: "2026-08-03",
  },
  {
    id: "deal_02",
    advertiserId: "adv_04",
    publisherId: "pub_03",
    campaignId: "camp_07",
    commissionModel: "CPS",
    terms: { percentage: 0.1, notes: "Standard campaign terms." },
    status: "active",
    createdAt: "2026-08-17",
    updatedAt: "2026-08-17",
  },
  {
    id: "deal_03",
    advertiserId: "adv_02",
    publisherId: "pub_04",
    campaignId: "camp_03",
    commissionModel: "CPA",
    terms: { baseFixed: 600, notes: "Private offer accepted, exclusive placement." },
    status: "negotiating",
    createdAt: "2026-08-19",
    updatedAt: "2026-08-21",
  },
  {
    id: "deal_04",
    advertiserId: "adv_07",
    publisherId: "pub_06",
    campaignId: "camp_12",
    commissionModel: "Hybrid",
    terms: { baseFixed: 0, percentage: 0.18, notes: "Includes dedicated review video." },
    status: "active",
    createdAt: "2026-08-23",
    updatedAt: "2026-08-23",
  },
  {
    id: "deal_05",
    advertiserId: "adv_05",
    publisherId: "pub_09",
    campaignId: "camp_09",
    commissionModel: "CPA",
    terms: { baseFixed: 110, notes: "Countered from 80 DKK standard rate." },
    status: "negotiating",
    createdAt: "2026-09-04",
    updatedAt: "2026-09-14",
  },
  {
    id: "deal_06",
    advertiserId: "adv_06",
    publisherId: "pub_08",
    commissionModel: "CPL",
    terms: { notes: "Discussing lead volume commitments." },
    status: "rejected",
    createdAt: "2026-08-15",
    updatedAt: "2026-08-20",
  },
];

export const negotiations: Negotiation[] = [
  {
    id: "neg_01",
    dealId: "deal_03",
    messages: [
      {
        id: "msg_01",
        senderId: "user_adv_02",
        senderRole: "advertiser",
        text: "We'd like to offer 600 DKK per approved loan for an exclusive top placement.",
        proposedTerms: "600 DKK CPA, exclusive placement",
        createdAt: "2026-08-19",
      },
      {
        id: "msg_02",
        senderId: "user_pub_04",
        senderRole: "publisher",
        text: "That works for us, but we'd like a 45-day cookie window instead of 30.",
        proposedTerms: "600 DKK CPA, 45-day cookie",
        createdAt: "2026-08-20",
      },
      {
        id: "msg_03",
        senderId: "user_adv_02",
        senderRole: "advertiser",
        text: "Agreed on the 45-day cookie. Sending updated contract terms.",
        proposedTerms: "600 DKK CPA, 45-day cookie",
        createdAt: "2026-08-21",
      },
    ],
  },
  {
    id: "neg_02",
    dealId: "deal_05",
    messages: [
      {
        id: "msg_04",
        senderId: "user_pub_09",
        senderRole: "publisher",
        text: "We can commit to a top-3 placement for 130 DKK per trial signup.",
        proposedTerms: "130 DKK CPA",
        createdAt: "2026-09-05",
      },
      {
        id: "msg_05",
        senderId: "user_adv_05",
        senderRole: "advertiser",
        text: "130 is a bit high for us given trial-to-paid rates. Could you do 110?",
        proposedTerms: "110 DKK CPA",
        createdAt: "2026-09-10",
      },
      {
        id: "msg_06",
        senderId: "user_pub_09",
        senderRole: "publisher",
        text: "110 DKK works if the placement stays top-3 for at least 3 months.",
        proposedTerms: "110 DKK CPA, 3-month top-3 placement",
        createdAt: "2026-09-14",
      },
    ],
  },
  {
    id: "neg_03",
    dealId: "deal_06",
    messages: [
      {
        id: "msg_07",
        senderId: "user_adv_06",
        senderRole: "advertiser",
        text: "We need a minimum of 500 qualified leads per month to justify 40 DKK per lead.",
        proposedTerms: "40 DKK CPL, 500 lead minimum",
        createdAt: "2026-08-15",
      },
      {
        id: "msg_08",
        senderId: "user_pub_08",
        senderRole: "publisher",
        text: "500 is more than our current volume for insurance content — we can realistically deliver 250.",
        proposedTerms: "40 DKK CPL, 250 lead minimum",
        createdAt: "2026-08-18",
      },
      {
        id: "msg_09",
        senderId: "user_adv_06",
        senderRole: "advertiser",
        text: "Unfortunately that volume doesn't work for this campaign's budget. We'll pass for now.",
        createdAt: "2026-08-20",
      },
    ],
  },
];

export function getCampaignApplicationsByCampaign(campaignId: string): CampaignApplication[] {
  return campaignApplications.filter((a) => a.campaignId === campaignId);
}

export function getDealsByPublisher(publisherId: string): Deal[] {
  return deals.filter((d) => d.publisherId === publisherId);
}

export function getDealsByAdvertiser(advertiserId: string): Deal[] {
  return deals.filter((d) => d.advertiserId === advertiserId);
}

export function getNegotiationByDeal(dealId: string): Negotiation | undefined {
  return negotiations.find((n) => n.dealId === dealId);
}
