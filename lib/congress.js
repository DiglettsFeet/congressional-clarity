
import axios from "axios";

const baseUrl = "https://api.data.gov/congress/v3";
const apiKey = process.env.CONGRESS_API_KEY;

// Fetch with DATA.GOV header auth
async function apiGet(url) {
  const res = await axios.get(`${url}&api_key=${apiKey}`, {
  headers: {
    "Accept": "application/json"
  }
});
}

// ✅ Fetch all votes the member has made
export async function getMemberVotes(memberId) {
  const url = `${baseUrl}/member/${memberId}/votes?limit=500`;
  const res = await apiGet(url);
  return res.data?.votes?.vote || [];
}

// ✅ Fetch bill details including categories and summary
export async function getBillDetails(congress, billNumber) {
  const url = `${baseUrl}/bill/${congress}/${billNumber}`;
  const res = await apiGet(url);
  const bill = res.data?.bill;

  if (!bill) return null;

  return {
    billNumber,
    congress,
    title: bill.title || bill.originChamberName || `Bill ${billNumber}`,
    summary: bill.summary?.text || "No summary available.",
    categories: [
      bill.policyArea?.name,
      ...(bill.subjects?.billSubjects?.map((s) => s.name) || [])
    ].filter(Boolean),
    url: bill?.urls?.congress || bill?.urls?.govtrack || "",
  };
}
// ✅ Get all members for a state
export async function getMembersByState(state) {
  const url = `${baseUrl}/member?limit=250&page=1`;
  const res = await apiGet(url);

  const members = res.data?.members?.member || [];

  return members.filter(
    (m) =>
      m.state?.toUpperCase() === state.toUpperCase() ||
      m.stateCode?.toUpperCase() === state.toUpperCase()
  );
}
