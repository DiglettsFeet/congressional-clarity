// pages/api/votes.js
import { getMemberVotes } from "../../lib/congress";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const votes = await getMemberVotes(id);
    res.status(200).json({ id, votes });
  } catch (err) {
    console.error("❌ Votes API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch votes" });
  }
}
