
import { getMemberVotes, getBillDetails } from "../../lib/congress";

export default async function handler(req, res) {
  const { id } = req.query;
  const votes = await getMemberVotes(id);

  const results = [];
  for (const v of votes) {
    if (!v.bill?.number) continue;

    const bill = await getBillDetails(v.bill.congress, v.bill.number);
    if (!bill) continue;
    results.push({
      billNumber: bill.billNumber,
      bill,
      vote: v.position || "Did Not Vote",
    });
  }

  res.status(200).json({ votes: results });
}
