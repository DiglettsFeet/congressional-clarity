
import { getMemberVotes, buildBillsFromVotes } from "../../lib/congress";

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const votes = await getMemberVotes(id);
    const bills = await buildBillsFromVotes(votes);

    const byCategory = {};
    bills.forEach(b => {
      (b.categories.length ? b.categories : ["Uncategorized"]).forEach(cat => {
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(b);
      });
    });

    for (const cat in byCategory) {
      byCategory[cat].sort((a, b) => b.congress - a.congress);
    }

    res.status(200).json({ bills: byCategory });
  } catch (err) {
    console.error("❌ API /member-info Error:", err);
    res.status(500).json({ error: "Failed loading member info" });
  }
}
