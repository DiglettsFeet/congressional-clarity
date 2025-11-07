// lib/congress.js
import axios from "axios";

const baseUrl = "https://api.congress.gov/v3";
const apiKey = process.env.CONGRESS_API_KEY;

// ✅ Fetch members with pagination, fixed for current API format
export async function getMembersByState(state) {
  let page = 1;
  let members = [];
  let more = true;

  while (more) {
    const url = `${baseUrl}/member?limit=250&page=${page}&api_key=${apiKey}`;
    const res = await axios.get(url);

    // ✅ Correct path according to the Congress API spec
    const pageMembers = res.data?.members?.member;

    if (Array.isArray(pageMembers) && pageMembers.length > 0) {
      members = members.concat(pageMembers);
      page++;
    } else {
      more = false;
    }
  }

  // ✅ Congress API sometimes calls field "stateCode", sometimes "state"
  return members.filter(
    (m) =>
      m.state?.toUpperCase() === state.toUpperCase() ||
      m.stateCode?.toUpperCase() === state.toUpperCase()
  );
}

// ✅ Fetch votes for a member
export async function getMemberVotes(memberId) {
  const url = `${baseUrl}/member/${memberId}/votes?limit=500&api_key=${apiKey}`;
  const res = await axios.get(url);
  return res.data.votes?.vote || [];
}

// ✅ Fetch detailed bill information + summary + links
export async function getBillDetails(congress, billNumber) {
  const url = `${baseUrl}/bill/${congress}/${billNumber}?api_key=${apiKey}`;
  const res = await axios.get(url);
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
