// lib/congress.js
import axios from "axios";

const baseUrl = "https://api.congress.gov/v3";
const apiKey = process.env.CONGRESS_API_KEY;

// ✅ Helper for authenticated requests
async function apiGet(url) {
  return axios.get(url, {
    headers: {
      "X-API-Key": apiKey,
      "Accept": "application/json"
    }
  });
}

// ✅ Fetch members with pagination
export async function getMembersByState(state) {
  let page = 1;
  let members = [];
  let more = true;

  while (more) {
    const url = `${baseUrl}/member?limit=250&page=${page}`;

    // ✅ API now requires API KEY in headers, not query params
    const res = await apiGet(url);

    // ✅ Correct response shape
    const pageMembers = res.data?.members?.member;

    if (Array.isArray(pageMembers) && pageMembers.length > 0) {
      members = members.concat(pageMembers);
      page++;
    } else {
      more = false;
    }
  }

  // ✅ Normalize stateCode/state, keep only this state
  return members.filter(
    (m) =>
      m.state?.toUpperCase() === state.toUpperCase() ||
      m.stateCode?.toUpperCase() === state.toUpperCase()
  );
}

// ✅ Fetch votes
export async function getMemberVotes(memberId) {
  const url = `${baseUrl}/member/${memberId}/votes?limit=500`;
  const res = await apiGet(url);
  return res.data.votes?.vote || [];
}

// ✅ Fetch bill details (summary, tags, links)
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
      ...(bill.subjects?.billSubjects?.map(s => s.name) || [])
    ].filter(Boolean),
    url: bill?.urls?.govtrack || bill?.urls?.congress || ""
  };
}
