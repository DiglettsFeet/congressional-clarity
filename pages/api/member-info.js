import { getBillsWithVotes } from "../../lib/congress";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id)
    return res.status(400).json({ error: "Missing member id" });

  try {
    const categories = await getBillsWithVotes(id);
    res.status(200).json({ categories });
  } catch (err) {
    console.error("❌ API /member-info Error:", err.response?.data || err);
    res.status(500).json({ error: true });
  }
}
