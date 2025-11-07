import axios from "axios";

const baseUrl = "https://api.congress.gov/v3";
const apiKey = process.env.CONGRESS_API_KEY;

export async function getMembersByState(state) {
  let page = 1;
  let results = [];
  let more = true;

  while (more) {
    const url = `${baseUrl}/member?limit=250&page=${page}&api_key=${apiKey}`;
    const res = await axios.get(url);

    // ✅ Members are nested at res.data.members.member
    const pageMembers = res.data.members?.member;

    if (Array.isArray(pageMembers) && pageMembers.length > 0) {
      results = results.concat(pageMembers);
      page++;
    } else {
      more = false;
    }
  }

  // ✅ Congress API sometimes uses `state` and sometimes `stateCode`
  const filtered = results.filter(
    (m) =>
      m.stateCode?.toUpperCase() === state.toUpperCase() ||
      m.state?.toUpperCase() === state.toUpperCase()
  );

  return filtered;
}

export async function getMemberVotes(memberId) {
  const url = `${baseUrl}/member/${memberId}/votes?limit=500&api_key=${apiKey}`;
  const res = await axios.get(url);
  return res.data.votes;
}

export async function getBillDetails(billNumber, congress) {
  const url = `${baseUrl}/bill/${congress}/${billNumber}?api_key=${apiKey}`;
  const res = await axios.get(url);
  return res.data.bill;
}
