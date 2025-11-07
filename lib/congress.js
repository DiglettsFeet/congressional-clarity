
import axios from "axios";
import NodeCache from "node-cache";

const API_KEY = process.env.CONGRESS_API_KEY;
const BASE = "https://api.congress.gov/v3";

const cache = new NodeCache({ stdTTL: 600 });

async function apiGet(url) {
  const cached = cache.get(url);
  if (cached) return cached;

  const full = `${url}${url.includes("?") ? "&" : "?"}api_key=${API_KEY}&format=json`;
  const res = await axios.get(full, { headers: { Accept: "application/json" }});
  cache.set(url, res.data);
  return res.data;
}

export async function getCurrentMembers() {
  const data = await apiGet(`${BASE}/member`);
  return (data?.members || []).filter(m => m.terms?.item?.[0]?.end === null);
}

export async function getMemberVotes(memberId) {
  let page = 1;
  let all = [];
  while (true) {
    const data = await apiGet(`${BASE}/member/${memberId}/votes?page=${page}`);
    const pageVotes = data?.memberVotes?.votes || [];
    if (!pageVotes.length) break;
    all.push(...pageVotes);
    page++;
  }
  return all;
}

async function getBillSummary(congress, type, number) {
  const data = await apiGet(`${BASE}/bill/${congress}/${type}/${number}/summaries`);
  return data?.summaries?.[0]?.text || "Summary not available.";
}

export async function buildBillsFromVotes(votes) {
  const billMap = {};

  for (const v of votes) {
    if (!v.legislationUrl) continue;

    const urlParts = v.legislationUrl.split("/bill/")[1].split("/");
    const congress = urlParts[0];
    const type = urlParts[1];
    const number = urlParts[2];

    if (!billMap[number]) {
      const billData = await apiGet(`${BASE}/bill/${congress}/${type}/${number}`);
      const bill = billData?.bill || {};

      billMap[number] = {
        congress,
        billNumber: number,
        title: bill.title || bill.originChamberName || `Bill ${number}`,
        summary: await getBillSummary(congress, type, number),
        url: bill?.url || v.legislationUrl,
        categories: [
          bill.policyArea?.name,
          ...(bill.subjects?.billSubjects?.map(s => s.name) || [])
        ].filter(Boolean),
        votes: []
      };
    }
    billMap[number].votes.push(v.voteCast || "Did Not Vote");
  }

  return Object.values(billMap);
}

