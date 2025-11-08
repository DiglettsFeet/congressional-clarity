export default async function handler(req, res) {
  const { bioguideId, subject } = req.query;

  if (!bioguideId || !subject) {
    return res.status(400).json({ error: "Missing bioguideId or subject parameter" });
  }

  const voterUrl = "https://www.govtrack.us/api/v2/vote_voter?person__bioguideid=" +
                   encodeURIComponent(bioguideId) +
                   "&limit=600";

  try {
    const voterRes = await fetch(voterUrl);
    const voterData = await voterRes.json();

    const billVotes = [];

    for (const vote of voterData.objects) {
      const votePosition = vote.vote_position;
      const relatedBill = vote.vote.related_bill;

      if (relatedBill && relatedBill.id) {
        const billUrl = "https://www.govtrack.us/api/v2/bill/" + relatedBill.id;
        const billRes = await fetch(billUrl);
        const billData = await billRes.json();

        const subjects = (billData.subjects || []).map(s => s.toLowerCase());
        if (subjects.some(s => s.includes(subject.toLowerCase()))) {
          billVotes.push({
            billNumber: billData.display_number,
            title: billData.title,
            summary: billData.summary_short || "",
            congressUrl: "https://www.congress.gov/bill/" +
                         billData.congress + "th-congress/" +
                         billData.bill_type + "/" +
                         billData.number,
            vote: votePosition
          });
        }
      }
    }

    res.status(200).json(billVotes);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}
