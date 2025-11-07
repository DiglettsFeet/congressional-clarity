// lib/congress.js
import axios from "axios";

// ✅ Correct endpoint for Data.gov proxy to Congress API
const baseUrl = "https://api.data.gov/congress/v3";
const apiKey = process.env.CONGRESS_API_KEY;

// ✅ All requests must use headers (NOT query parameters)
async function apiGet(url) {
  return axios.get(url, {
    headers: {
      "X-Api-Key": apiKey,
      "Accept": "application/json",
    }
  });
}

// ✅ Fetch members (handles pagination until no more results)
export async function getMembersByState(state) {
  let page = 1;
  let members = [];
  let more = true;

  while (more) {
    const url = `${baseUrl}/member?limit=250&page=${page}`;
    const res = await apiGet(url);

    const pageMembers = res.data?.members?.member;

    if (Array.isArray(pageMembers) && pageMembers.length > 0) {
      members = members.concat(pageMembers);
      page++;
    } else {
      more = false;
    }
  }

  // ✅ Normalize state value (API returns either `state` or `stateCode`)
  return members.filter(
    (m) =>
      m.state?.toUpperCase() === state.toUpperCase() ||
      m.stateCode?.toUpperCase() === state.toUpperCase()
  );
}

// ✅ Fetch voting history for a member
export async function getMemberVotes(memberId) {
  const url = `${baseUrl}/member/${memberId}/votes?limit=500`;
  const res = await apiGet(url);
  return res.data.votes?.vote || [];
}

// ✅ Fetch bill details + summary + tags + external URLs
export async function getBillDetails(congress, billNumber) {
  const url = `${baseUrl}/bill/${congress}/${billNumber}`;
  const res = await apiGet(url);
  const bill = res.data.bill;

  return {
    billNumber,
    name: bill?.title || bill?.originChamberName || "Bill",
    summary: bill?.summary?.text || "No summary available.",
    categories: [
      bill.policyArea?.name,
      ...(bill.subjects?.billSubjects?.map((s) => s.name) || []),
    ].filter(Boolean),
    url: bill?.urls?.govtrack || bill?.urls?.congress || "",
  };
}
