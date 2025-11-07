// lib/congress.js
import axios from "axios";

const baseUrl = "https://api.congress.gov/v3";
const apiKey = process.env.CONGRESS_API_KEY;

// ✅ Wrapper for authenticated requests
async function apiGet(url) {
  const res = await axios.get(`${url}&api_key=${apiKey}`, {
    headers: { Accept: "application/json" },
  });
  return res.data;
}

// ✅ Fetch votes a member has cast
export async function getMemberVotes(memberId) {
  const url = `${baseUrl}/member/${memberId}/votes?limit=500`;
  const data = await apiGet(url);
  return data?.votes?.vote || [];
}

// ✅ Fetch full bill details
export async function getBillDetails(congress, billNumber) {
  const url = `${baseUrl}/bill/${congress}/${billNumber}`;
  const data = await apiGet(url);
  const bill = data?.bill;

  if (!bill) return null;

  return {
    billNumber,
    congress,
    title: bill.title || "Unknown bill",
    summary: bill.summary?.text || "No summary available.",
    categories: [
      bill.policyArea?.name,
      ...(bill.subjects?.billSubjects?.map((s) => s.name) || []),
    ].filter(Boolean),
    url: bill?.urls?.congress || bill?.urls?.govtrack || "",
  };
}

// ✅ Fetch congressional members by state
export async function getMembersByState(state) {
  let page = 1;
  let results = [];

  while (true) {
    const data = await apiGet(`${baseUrl}/member?limit=250&page=${page}`);

    const members = data?.members?.member || [];
    results.push(...members);

    // Stop if no more pages
    if (!data?.members?.pagination?.next) break;
    page++;
  }

  // Filter by state match
  return results.filter(
    (m) =>
      m.state?.toUpperCase() === state.toUpperCase() ||
      m.stateCode?.toUpperCase() === state.toUpperCase()
  );
}
