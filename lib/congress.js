import axios from "axios";

const baseUrl = "https://api.congress.gov/v3";
const apiKey = process.env.CONGRESS_API_KEY;

export async function getMembersByState(state) {
  let page = 1;
  let all = [];
  let more = true;

  while (more) {
    const url = `${baseUrl}/member?limit=250&page=${page}&api_key=${apiKey}`;
    const res = await axios.get(url);

    // ✅ Correct path (Member list is nested inside `members.member`)
    const pageMembers = res.data.members?.member;

    // ✅ No optional chaining on .member
    if (Array.isArray(pageMembers) && pageMembers.length > 0) {
      all = all.concat(pageMembers);
      page++;
    } else {
      more = false;
    }
  }

  // ✅ Congress API uses inconsistent field names
  return all.filter(
    (m) =>
      m.stateCode?.toUpperCase() === state.toUpperCase() ||
      m.state?.toUpperCase() === state.toUpperCase()
  );
}
