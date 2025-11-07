// lib/congress.js
import axios from "axios";

// ✅ Use the correct endpoint for api.data.gov keys
const baseUrl = "https://api.data.gov/congress/v3";
const apiKey = process.env.CONGRESS_API_KEY;

// ✅ fetch with query param (data.gov requires it)
async function apiGet(url) {
  return axios.get(url + `&api_key=${apiKey}`);
}

// ✅ Fetch members by state (pagination-safe)
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
