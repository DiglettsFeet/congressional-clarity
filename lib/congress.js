// lib/congress.js
import axios from "axios";

const baseUrl = "https://api.congress.gov/v3";
const apiKey = process.env.CONGRESS_API_KEY;

// ✅ Helper: makes authenticated GET calls
async function apiGet(url) {
  const res = await axios.get(`${url}&api_key=${apiKey}`, {
    headers: { Accept: "application/json" },
  });
  return res.data; // <-- THIS WAS MISSING BEFORE
}

// ✅ Fetch members by state
export async function getMembersByState(state) {
  let page = 1;
  let results = [];

  while (true) {
    const data = await apiGet(`${baseUrl}/member?limit=250&page=${page}`);

    const members = data?.members?.member || [];
    results.push(...members);

    // pagination stops here
    if (!data?.members?.pagination?.next) break;
    page++;
  }

  return results.filter(
    (m) =>
      m.state?.toUpperCase() === state.toUpperCase() ||
      m.stateCode?.toUpperCase() === state.toUpperCase()
  );
}

// ✅ Fetch votes a member cast
export async function getMemberVotes(memberId) {
  const data = await apiGet(`${baseUrl}/member/${memberId}/votes?limit=500`);
  return data?.votes?.vote || [];
}

// ✅ Fetch bill details
export async function getBillDetails(congress, billNumber) {
  const data = await apiGet(`${baseUrl}/bill/${congress}/${billNumber}`);
  const bill = data?.bill;
  if (!bill) return null;

  return {
    billNumber,
    congress,
    title: bill.title || "Unknown bill",
    summary: bill.summary?.text || "No summary available.",
    categories: [
      bill.policyArea?.name,
      ...(bill.subjects?.billSubjects?.map((s) => s.name) || []),
    ].filter(Boolean),
    url: bill?.urls?.congress || bill?.urls?.govtrack || "",
  };
}

// ✅ Merge bills + votes into a formatted, categorized list
export async function getBillsWithVotes(memberId) {
  const votes = await getMemberVotes(memberId);
  const bills = [];

  for (const vote of votes) {
    if (!vote.bill) continue;

    const bill = await getBillDetails(
      vote.bill.congress,
      vote.bill.number.replace(/[^0-9]/g, "")
    );

    if (!bill) continue;

    bills.push({
      ...bill,
      vote:
        vote.position === "Yes"
          ? "Yes"
          : vote.position === "No"
          ? "No"
          : "Did Not Vote",
    });
  }

  return bills;
}
