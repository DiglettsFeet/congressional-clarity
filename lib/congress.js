// lib/congress.js
import axios from "axios";

const baseUrl = "https://api.congress.gov/v3";
const apiKey = process.env.CONGRESS_API_KEY;

// ✅ Generic GET helper
async function apiGet(url) {
  const full = `${url}${url.includes("?") ? "&" : "?"}api_key=${apiKey}`;

  const res = await axios.get(full, {
    headers: { Accept: "application/json" },
  });

  return res.data;
}

// ✅ Votes for a member (up to 500)
export async function getMemberVotes(memberId) {
  const url = `${baseUrl}/member/${memberId}/votes?limit=500`;
  const data = await apiGet(url);

  return data?.votes?.vote || [];
}

// ✅ Bill details + summary + category tags
export async function getBillDetails(congress, billNumber) {
  const url = `${baseUrl}/bill/${congress}/${billNumber}`;
  const data = await apiGet(url);

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
    url: bill?.urls?.congress || bill?.urls?.govtrack || "",
  };
}

// ✅ Get Members by State
export async function getMembersByState(state) {
  const data = await apiGet(`${baseUrl}/member?limit=250&page=1`);
  const all = data?.members?.member || [];

  return all.filter(
    (m) =>
      m.state?.toUpperCase() === state.toUpperCase() ||
      m.stateCode?.toUpperCase() === state.toUpperCase()
  );
}
