// lib/congress.js
import axios from "axios";
import NodeCache from "node-cache";

const baseUrl = "https://api.congress.gov/v3";
const apiKey = process.env.CONGRESS_API_KEY;

// Cache - 600 seconds (10 minutes)
const cache = new NodeCache({ stdTTL: 600 });

/** ✅ Raw GET helper with caching and Data.gov key */
async function apiGet(endpoint) {
  const url = `${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${apiKey}`;

  // ✅ cache layer
  const cached = cache.get(url);
  if (cached) return cached;

  const res = await axios.get(url, {
    headers: { Accept: "application/json" },
  });

  cache.set(url, res.data);
  return res.data;
}

/** ✅ Get all voting history for a member */
export async function getMemberVotes(memberId) {
  const data = await apiGet(`${baseUrl}/member/${memberId}/votes?limit=500`);
  const votes = data?.votes?.vote || [];

  return votes.map((v) => ({
    billNumber: v.bill?.number,
    congress: v.bill?.congress,
    vote: v.position, // "Yes", "No", "Did Not Vote"
  }));
}

/** ✅ Get bill details + category extraction */
export async function getBillDetails(congress, billNumber) {
  const data = await apiGet(`${baseUrl}/bill/${congress}/${billNumber}`);

  const bill = data?.bill;
  if (!bill) return null;

  return {
    billNumber,
    congress,
    title: bill.title || bill.originChamberName || `Bill ${billNumber}`,
    summary: bill.summary?.text || "No summary available.",
    categories: [
      bill.policyArea?.name,
      ...(bill.subjects?.billSubjects?.map((s) => s.name) || []),
    ].filter(Boolean),
    url: bill.urls?.congress || bill.urls?.govtrack || "",
  };
}

/** ✅ Get all members of Congress, filter by state */
export async function getMembersByState(stateCode) {
  const data = await apiGet(`${baseUrl}/member?limit=250&page=1`);

  const members = data?.members?.member || [];

  return members.filter((m) => {
    const s = m.state?.toUpperCase() || m.stateCode?.toUpperCase();
    return s === stateCode.toUpperCase();
  });
}

/** ✅ Get categorized bills based on how the member voted */
export async function getBillsWithVotes(memberId) {
  const votes = await getMemberVotes(memberId);

  const bills = await Promise.all(
    votes.map(async (v) => ({
      vote: v.vote,
      ...(await getBillDetails(v.congress, v.billNumber)),
    }))
  );

  return bills.filter((b) => b.title); // remove failures
}
