// pages/api/member-info.js
import { getMemberVotes, getBillsWithVotes } from "../../lib/congress";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const votes = await getMemberVotes(id);
    const categories = await getBillsWithVotes(votes);
    res.status(200).json({ id, categories });
  } catch (err) {
    console.error("❌ Member Info Error:", err.message);
    res.status(500).json({ error: "Failed to fetch member info" });
  }
}
