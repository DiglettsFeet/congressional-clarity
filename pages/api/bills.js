import { searchBillsByTopic, getBillDetails } from "../../lib/congress";

export default async function handler(req, res) {
  const { topic, member } = req.query;
  if (!topic || !member)
    return res.status(400).json({ error: "Missing topic or member parameter" });

  const bills = await searchBillsByTopic(topic);
  const results = [];

  for (const bill of bills) {
    const details = await getBillDetails(bill.bill, bill.congress, bill.type);
    if (!details?.votes?.length) continue;

    const voteObj = details.votes
      .flatMap(v => v.positions ?? [])
      .find(v => v?.memberId === member);

    if (!voteObj) continue;

    results.push({
      bill: bill.bill,
      congress: bill.congress,
      title: bill.title,
      summary: details?.summaries?.[0]?.text ?? "No summary available",
      memberVote: voteObj.position,
      url: details.url,
    });
  }

  res.status(200).json(results);
}
