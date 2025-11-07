
import { getMemberVotes } from "../../lib/congress";
export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Member ID required" });
  try {
    res.status(200).json({ memberId: id, votes: await getMemberVotes(id) });
  } catch {
    res.status(500).json({ error: "Failed to fetch" });
  }
}
