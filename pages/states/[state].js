// File: lib/congress.js
// Simple, closest to your original: query param auth only + tiny guard.

import axios from "axios";

const BASE_URL = "https://api.congress.gov/v3";
const API_KEY = process.env.CONGRESS_API_KEY; // <- unchanged var name

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Helper to GET with query-param key; no headers.
async function getJson(path, params = {}) {
  if (!API_KEY) {
    const e = new Error("Missing CONGRESS_API_KEY");
    e.status = 500;
    throw e;
  }
  try {
    const res = await client.get(path, {
      params: { ...params, api_key: API_KEY },
    });
    return res.data;
  } catch (err) {
    const status = err?.response?.status || 502;
    const e = new Error(
      status === 401
        ? "Congress.gov returned 401 (check API key value and redeploy)"
        : `Congress.gov request failed (${status})`
    );
    e.status = status;
    e.details = err?.response?.data || null;
    throw e;
  }
}

// State map (unchanged)
const STATE_NAME = {
  AL:"Alabama", AK:"Alaska", AZ:"Arizona", AR:"Arkansas", CA:"California",
  CO:"Colorado", CT:"Connecticut", DE:"Delaware", FL:"Florida", GA:"Georgia",
  HI:"Hawaii", ID:"Idaho", IL:"Illinois", IN:"Indiana", IA:"Iowa",
  KS:"Kansas", KY:"Kentucky", LA:"Louisiana", ME:"Maine", MD:"Maryland",
  MA:"Massachusetts", MI:"Michigan", MN:"Minnesota", MS:"Mississippi",
  MO:"Missouri", MT:"Montana", NE:"Nebraska", NV:"Nevada", NH:"New Hampshire",
  NJ:"New Jersey", NM:"New Mexico", NY:"New York", NC:"North Carolina",
  ND:"North Dakota", OH:"Ohio", OK:"Oklahoma", OR:"Oregon", PA:"Pennsylvania",
  RI:"Rhode Island", SC:"South Carolina", SD:"South Dakota", TN:"Tennessee",
  TX:"Texas", UT:"Utah", VT:"Vermont", VA:"Virginia", WA:"Washington",
  WV:"West Virginia", WI:"Wisconsin", WY:"Wyoming"
};

export async function getMembers(chamber, congress) {
  const d = await getJson(`/member/${chamber}`, { congress, limit: 500 });
  return d?.members || [];
}

export async function getMemberInfo(memberId) {
  const d = await getJson(`/member/${memberId}`);
  return d?.member || null;
}

export async function getMemberVotes(memberId) {
  const d = await getJson(`/member/${memberId}/votes`, { limit: 500 });
  return d?.votes || [];
}

export async function getSponsoredLegislation(memberId) {
  const d = await getJson(`/member/${memberId}/sponsored-legislation`, { limit: 500 });
  return d?.legislation || [];
}

export async function getBillDetails(billNumber, congress) {
  const d = await getJson(`/bill/${congress}/${billNumber}`);
  return d?.bill || null;
}

export function membersByState(allMembers, code) {
  const name = STATE_NAME[(code || "").toUpperCase()];
  if (!name) return [];
  return (allMembers || []).filter((m) => m.state === name);
}
