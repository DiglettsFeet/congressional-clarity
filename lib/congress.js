// lib/congress.js
import axios from "axios";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 600 }); // cache = 10 minutes

const API_BASE = "https://api.congress.gov/v3";
const API_KEY = process.env.CONGRESS_API_KEY;

// ✅ Generic GET with caching
async function apiGet(url) {
  const cached = cache.get(url);
  if (cached) return cached;

  const fullUrl = `${url}${url.includes("?") ? "&" : "?"}api_key=${API_KEY}`;

  const res = await axios.get(fullUrl, {
    headers: { Accept: "application/json" },
  });

  cache.set(url, res.data);
  return res.data;
}

/**
 * ✅ Fetch ONLY current members
 */
export async function getCurrentMembers() {
  const data = await apiGet(`${API_BASE}/member?limit=250`);
  const list = data.members || [];

  return list.filter((m) => {
    const firstTerm = m.terms?.item?.[0];
    return firstTerm && (firstTerm.endYear === null || firstTerm.end === null);
  });
}

/**
 * ✅ Fetch ALL votes for a member's career (House -> Senate works too)
 */
export async function getAllVotesForMember(bioguideId) {
  let page = 1;
  let votes = [];

  while (true) {
    const data = await apiGet(
      `${API_BASE}/member/${bioguideId}/votes?limit=250&page=${page}`
    );

    const results = data.memberVotes?.votes || [];

    if (!results.length) break;

    votes = [...votes, ...results];
    page++;
  }

  return votes;
}

/**
 * ✅ Fetch bill summary + metadata
 */
export async function getBillDetails(congress, billType, billNumber) {
  const data = await apiGet(`${API_BASE}/bill/${congress}/${billType}/${billNumber}`);

  const bill = data.bill;
  if (!bill) return null;

  // fetch summary
  let summaryText = null;
  if (bill.latestSummaryUrl) {
    const sumData = await apiGet(bill.latestSummaryUrl);
    summaryText = sumData.summaries?.[0]?.text || null;
  }

  return {
    title: bill.title,
    congress,
    billNumber,
    categories: bill.policyArea?.name || bill.policyArea || "Uncategorized",
    summary: summaryText || "No summary available.",
    url: bill.url || `https://congress.gov/bill/${congress}/${billType}/${billNumber}`
  };
}

/**
 * ✅ Build the final dataset for UI:
 * {
 *   categories: {
 *     "National Security": [...bills]
 *     "Health": [...bills]
 *   }
 * }
 */
export async function getBillsWithVotes(memberId) {
  const votes = await getAllVotesForMember(memberId);
  const output = {};

  for (const v of votes) {
    const bill = v.bill;
    if (!bill) continue;

    const billDetails = await getBillDetails(
      bill.congress,
      bill.type.toLowerCase(),
      bill.number
    );

    if (!billDetails) continue;

    const cat = billDetails.categories ?? "Other";

    if (!output[cat]) output[cat] = [];
    output[cat].push({
      vote: v.voteCast,
      date: v.voteDate,
      bill: billDetails,
    });
  }

  // Sort newest → oldest inside each category
  Object.keys(output).forEach((cat) => {
    output[cat].sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  return output;
}
