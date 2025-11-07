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

    if (res.data.members && res.data.members.length > 0) {
      results = results.concat(res.data.members);
      page++;
    } else {
      more = false;
    }
  }


  const filtered = results.filter(m => m.stateCode === state.toUpperCase());

  return filtered;
}
