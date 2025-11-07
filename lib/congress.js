// lib/congress.js - Congress API utility
import axios from "axios";

const baseUrl = "https://api.congress.gov/v3";
const apiKey = process.env.CONGRESS_API_KEY;

// Fetch members by state
export async function getMembersByState(state) {
  let page = 1;
  let results = [];
  let more = true;

  while (more) {
    const url = `${baseUrl}/member?limit=250&page=${page}&api_key=${apiKey}`;
    const res = await axios.get(url);
    const pageMembers = res.data.members?.member;

    if (Array.isArray(pageMembers)) {
      results = results.concat(pageMembers);
      page++;
    } else {
      more = false;
    }
  }

  return results.filter(
    (m) =>
      m.stateCode?.toUpperCase() === state.toUpperCase() ||
      m.state?.toUpperCase() === state.toUpperCase()
  );
}

// Fetch member votes
export async function getMemberVotes(memberId) {
  const url = `${baseUrl}/member/${memberId}/votes?limit=500&api_key=${apiKey}`;
  const res = await axios.get(url);
  return res.data.votes?.vote || [];
}

// Fetch bill details
export async function getBillDetails(congress, billNumber) {
  const url = `${baseUrl}/bill/${congress}/${billNumber}?api_key=${apiKey}`;
  const res = await axios.get(url);
  const bill = res.data.bill;

  let govtrack = bill?.urls?.govtrack;
  let congressgov = bill?.urls?.congress;

  return {
    billNumber: billNumber,
    name: bill?.title || bill?.originChamberName,
    summary: bill?.summary?.text || "No summary provided.",
    url: govtrack || congressgov || "",
    policyArea: bill?.policyArea?.name,
    subjects: bill?.subjects?.billSubjects?.map(s => s.name) || []
  };
}
