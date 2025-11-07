// pages/api/votes.js
import { getMemberVotes } from "../../lib/congress";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing member ID" });
  }

  try {
    const votes = await getMemberVotes(id);
    res.status(200).json({ votes });
  } catch (e) {
    console.error("❌ Member API Error:", e.response?.data || e.message);
    res.status(500).json({ error: "Failed to fetch member votes" });
  }
}
