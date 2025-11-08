import { searchBillsByTopic, getBillDetails } from "../../lib/congress";
import { getMemberVotesForBill } from "../../lib/congress";

export default async function handler(req, res) {
  const { topic, member } = req.query;

  if (!topic || !member)
    return res.status(400).json({ error: "Missing topic or member parameter" });

  try {
    // 🔍 Pull ALL bills for the topic
    const bills = await searchBillsByTopic(topic);

    const votedBills = [];

    for (const bill of bills) {
      const billDetails = await getBillDetails(bill.bill, bill.congress);

      // ❌ skip bills that have never been voted on
      if (!billDetails?.votes || billDetails.votes.length === 0) continue;

      // ✅ Find how THIS member voted
      const memberVote = billDetails.votes.find(v => v.member_id === member);

      votedBills.push({
        bill: bill.bill,
        congress: bill.congress,
        title: bill.title,
        summary: billDetails?.summaries?.[0]?.text || "No summary available.",
        topic: billDetails?.policyArea?.name || "Uncategorized",
        url: billDetails?.url,
        result: billDetails?.latestAction?.text,
        memberVote: memberVote?.position || "No recorded vote"
      });
    }

    res.status(200).json(votedBills);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch bills" });
  }
}
