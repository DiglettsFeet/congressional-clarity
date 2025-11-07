import axios from "axios";

const baseUrl = "https://api.data.gov/congress/v3";
const apiKey = process.env.CONGRESS_API_KEY;

// ✅ Correct API GET wrapper (returns JSON)
async function apiGet(endpoint) {
  const url = `${baseUrl}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${apiKey}`;

  try {
    const res = await axios.get(url, {
      headers: { Accept: "application/json" }
    });

    return res.data;
  } catch (err) {
    console.error("❌ API ERROR:", err.response?.data || err.message);
    throw err;
  }
}

// ✅ Get all members for a state
export async function getMembersByState(state) {
  const data = await apiGet(`/member?limit=250&page=1`);
  const members = data?.members?.member || [];

  return members.filter(
    (m) =>
      m.state?.toUpperCase() === state.toUpperCase() ||
      m.stateCode?.toUpperCase() === state.toUpperCase()
  );
}

// ✅ Get votes a member cast
export async function getMemberVotes(memberId) {
  const data = await apiGet(`/member/${memberId}/votes?limit=500`);
  return data?.votes?.vote || [];
}

// ✅ Get bill details including categories and summary
export async function getBillDetails(congress, billNumber) {
  const data = await apiGet(`/bill/${congress}/${billNumber}`);
  const bill = data?.bill;

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
