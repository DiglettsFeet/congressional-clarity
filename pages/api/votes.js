// pages/api/votes.js
import { getMemberVotes, getBillDetails } from "../../lib/congress";

export default async function handler(req, res) {
  const { memberId, topic } = req.query;

  try {
    const votes = await getMemberVotes(memberId);

    const matchingVotes = votes.filter(v =>
      (v?.issue?.toLowerCase() || "").includes(topic.toLowerCase())
    );

    const detailed = await Promise.all(
      matchingVotes.map(async (v) => {
        const bill = await getBillDetails(v.congress, v.bill.number);
        return {
          bill: bill.name,
          summary: bill.summary,
          url: bill.url,
          vote: v.position,
        };
      })
    );

    res.status(200).json({ topic, bills: detailed });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}
