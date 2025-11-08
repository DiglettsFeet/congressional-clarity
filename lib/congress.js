
import axios from "axios";
const baseUrl = "https://api.congress.gov/v3";
const apiKey = process.env.CONGRESS_API_KEY;

const stateMap = {
  "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
  "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia",
  "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
  "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
  "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri",
  "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey",
  "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
  "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
  "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
  "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
};

export async function getMembersByState(state) {
  const stateName = stateMap[state.toUpperCase()] || state;
  let allMembers = [];
  let offset = 0;
  const limit = 250;
  
  while (true) {
    const res = await axios.get(`${baseUrl}/member?currentMember=true&offset=${offset}&limit=${limit}&api_key=${apiKey}`);
    const members = res.data.members || [];
    allMembers = allMembers.concat(members);
    
    if (!res.data.pagination?.next || members.length < limit) {
      break;
    }
    offset += limit;
  }
  
  return allMembers.filter(m => m.state === stateName);
}

export async function getMemberVotes(memberId) {
  const res = await axios.get(`${baseUrl}/member/${memberId}/votes?limit=500&api_key=${apiKey}`);
  return res.data.votes;
}

export async function getBillDetails(billNumber, congress) {
  const res = await axios.get(`${baseUrl}/bill/${congress}/${billNumber}?api_key=${apiKey}`);
  return res.data.bill;
}


export async function getBillDetails(billNumber, congress, billType = null) {
  const url = `https://api.congress.gov/v3/bill/${congress}/${billType ?? "hr"}/${billNumber}?format=json&votes=1&api_key=${process.env.CONGRESS_API_KEY}`;
  const r = await fetch(url);
  if (!r.ok) return null;
  const data = await r.json();
  return data.bill;
}
