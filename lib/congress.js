// lib/congress.js
import axios from "axios";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 600 }); // Cache 10 mins

const BASE = "https://api.congress.gov/v3";
const API_KEY = process.env.CONGRESS_API_KEY;

// Generic GET helper with caching
async function apiGet(url) {
  const cached = cache.get(url);
  if (cached) return cached;

  const res = await axios.get(url + `&api_key=${API_KEY}`, {
    headers: { Accept: "application/json" },
  });

  cache.set(url, res.data);
  return res.data;
}

/**
 * ✅ Get current members by state (House + Senate)
 */
export async function getMembersByState(state) {
  const url = `${BASE}/member?limit=500&format=json`;
  const data = await apiGet(url);

  const members = data.members?.filter(
    (m) => m.state?.toUpperCase() === state.toUpperCase()
  );

  return members || [];
}

/**
 * ✅ Get ALL voting history for a member (career)
 */
export async function getMemberVotes(bioguideId) {
  let page = 1;
  let results = [];

  while (true) {
    const url = `${BASE}/member/${bioguideId}/votes?format=json&limit=250&page=${page}`;
    const data = await apiGet(url);

    if (!data.memberVotes || data.memberVotes.length === 0) break;

    results.push(...data.memberVotes);

    if (!data.pagination || !data.pagination.next) break;
    page++;
  }

  return results;
}

/**
 * ✅ Expand bills with:
 *    • category (policy area / subjects)
 *    • summary
 *    • newest → oldest
 */
export async function getBillDetails(congress, type, number) {
  try {
    const url = `${BASE}/bill/${congress}/${type.toLowerCase()}/${number}?format=json`;
    const data = await apiGet(url);

    if (!data.bill) return null;

    return {
      billId: `${type}${number}`,
      title: data.bill.title || "No title",
      categories: [
        data.bill.policyArea?.name,
        ...(data.bill.subjects?.billSubjects?.map((s) => s.name) || []),
      ].filter(Boolean),
      summary: data.bill.summaries?.[0]?.text || "No summary provided.",
      introduced: data.bill.introducedDate || null,
      url: data.bill.url || "",
    };
  } catch (e) {
    console.error("❌ Bill details error:", e.message);
    return null;
  }
}

/**
 * ✅ Build categorized structure for UI
 */
export async function getBillsWithVotes(votes) {
  const categorized = {};

  for (const vote of votes) {
    const bill = await getBillDetails(
      vote.congress,
      vote.legislationType,
      vote.legislationNumber
    );

    if (!bill) continue;

    (bill.categories.length ? bill.categories : ["Uncategorized"]).forEach(
      (cat) => {
        if (!categorized[cat]) categorized[cat] = [];
        categorized[cat].push({
          ...bill,
          vote: vote.voteCast,
        });
      }
    );
  }

  // Sort newest → oldest
  Object.keys(categorized).forEach((cat) => {
    categorized[cat].sort(
      (a, b) => new Date(b.introduced) - new Date(a.introduced)
    );
  });

  return categorized;
}
