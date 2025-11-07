import { getMembersByState, getBillsWithVotes } from "../../lib/congress";

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    const bills = await getBillsWithVotes(id);

    res.status(200).json({ bills });
  } catch (err) {
    console.error("❌ Member API Error:", err);
    res.status(500).json({ error: "Failed to fetch member data" });
  }
}
