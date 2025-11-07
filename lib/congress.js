
import axios from "axios";
const baseUrl = "https://api.congress.gov/v3";
const apiKey = process.env.CONGRESS_API_KEY;

export async function getMembersByState(state) {
  const res = await axios.get(`${baseUrl}/member?state=${state}&limit=500&api_key=${apiKey}`);
  return res.data.members;
}

export async function getMemberVotes(memberId) {
  const res = await axios.get(`${baseUrl}/member/${memberId}/votes?limit=500&api_key=${apiKey}`);
  return res.data.votes;
}

export async function getBillDetails(billNumber, congress) {
  const res = await axios.get(`${baseUrl}/bill/${congress}/${billNumber}?api_key=${apiKey}`);
  return res.data.bill;
}
