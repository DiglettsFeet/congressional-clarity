
import { getBillDetails } from "../../lib/congress";
export default async function handler(req, res) {
  const { congress, bill } = req.query;
  if (!congress || !bill) return res.status(400).json({ error: "Missing params" });
  try {
    const d = await getBillDetails(bill, congress);
    res.status(200).json({
      bill, congress,
      summary: d?.summaries?.[0]?.text || "No summary available.",
      topic: d?.policyArea?.name || "Uncategorized",
      url: d?.url
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch" });
  }
}
