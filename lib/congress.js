// lib/congress.js
import axios from "axios";

const baseUrl = "https://api.congress.gov/v3";
const apiKey = process.env.CONGRESS_API_KEY;

// ✅ Fetch all members, handle pagination, normalize state field
export async function getMembersByState(state) {
  let page = 1;
  let allMembers = [];
  let more = true;

  while (more) {
    const url = `${baseUrl}/member?limit=250&page=${page}&api_key=${apiKey}`;
    const res = await axios.get(url);

    // Congress.gov nests members under: members.member
    const pageMembers = res.data.members?.member;

    if (Array.isArray(pageMembers) && pageMembers.length > 0) {
      allMembers = allMembers.concat(pageMembers);
      page++;
    } else {
      more = false;
    }
  }

  return allMembers.filter(
    (m) =>
      m.stateCode?.toUpperCase() === state.toUpperCase() ||
      m.state?.toUpperCase() === state.toUpperCase()
  );
}

// ✅ Fetch votes for a member
export async function getMemberVotes(memberId) {
  const url = `${baseUrl}/member/${memberId}/votes?limit=500&api_key=${apiKey}`;
  const res = await axios.get(url);
  return res.data.votes?.vote || [];
}

// ✅ Fetch bill details + summary + categories
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
    ].filter(Boolean), // remove null/undefined
    url: bill?.urls?.govtrack || bill?.urls?.congress || ""
  };
}
