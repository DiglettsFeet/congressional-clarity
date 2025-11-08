
import { policyAreas, matchBillToTopics } from "../../utils/policyAreas";

export default async function handler(req, res) {
  const { id, topic } = req.query;
  
  if (!id || !topic) {
    return res.status(400).json({ error: 'Member ID and topic required' });
  }

  try {
    const apiKey = process.env.CONGRESS_API_KEY;
    const votesData = [];
    let offset = 0;
    const limit = 250;
    
    console.log(`Fetching votes for member ${id}, topic: ${topic}`);
    
    // Fetch all votes for the member (entire career)
    while (true) {
      const votesUrl = `https://api.congress.gov/v3/member/${id}/votes?api_key=${apiKey}&format=json&limit=${limit}&offset=${offset}`;
      
      const votesResponse = await fetch(votesUrl);
      
      if (!votesResponse.ok) {
        console.error(`Vote fetch failed: ${votesResponse.status}`);
        break;
      }
      
      const data = await votesResponse.json();
      const votes = data.votes || [];
      
      if (votes.length === 0) break;
      
      votesData.push(...votes);
      offset += limit;
      
      // Safety limit to prevent infinite loops
      if (offset > 10000 || votes.length < limit) break;
    }
    
    console.log(`Total votes fetched: ${votesData.length}`);
    
    // Filter for roll call votes only
    const rollCallVotes = votesData.filter(vote => 
      vote.rollCall && vote.recordedVote
    );
    
    console.log(`Roll call votes: ${rollCallVotes.length}`);
    
    // Enrich votes with bill details and filter by topic
    const enrichedVotes = [];
    
    for (const vote of rollCallVotes) {
      try {
        // Extract bill information from the vote
        const billMatch = vote.bill || vote.amendment?.bill;
        
        if (!billMatch) continue;
        
        const congress = billMatch.congress;
        const billType = billMatch.type?.toLowerCase();
        const billNumber = billMatch.number;
        
        if (!congress || !billType || !billNumber) continue;
        
        // Fetch bill details
        const billUrl = `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}?api_key=${apiKey}&format=json`;
        const billResponse = await fetch(billUrl);
        
        if (!billResponse.ok) continue;
        
        const billData = await billResponse.json();
        const bill = billData.bill;
        
        // Get bill summary and policy area
        const summary = bill.summaries?.[0]?.text || bill.title || '';
        const policyArea = bill.policyArea?.name || '';
        const title = bill.title || '';
        
        // Check if bill matches the requested topic
        const matchingTopics = matchBillToTopics(title, summary, policyArea);
        
        if (matchingTopics.includes(topic)) {
          enrichedVotes.push({
            billNumber: `${billType.toUpperCase()} ${billNumber}`,
            congress: congress,
            title: title,
            summary: summary.substring(0, 500) + (summary.length > 500 ? '...' : ''),
            vote: vote.recordedVote?.position || 'Not Recorded',
            date: vote.date,
            rollCall: vote.rollCall?.number,
            chamber: vote.chamber,
            billUrl: `https://www.congress.gov/bill/${congress}th-congress/${billType}-bill/${billNumber}`,
            policyArea: policyArea
          });
        }
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 50));
        
      } catch (error) {
        console.error(`Error processing vote:`, error);
        continue;
      }
    }
    
    console.log(`Filtered votes for ${topic}: ${enrichedVotes.length}`);
    
    // Sort by date (most recent first)
    enrichedVotes.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.status(200).json({ 
      votes: enrichedVotes,
      total: enrichedVotes.length,
      topic: topic
    });
    
  } catch (error) {
    console.error('Error fetching votes by topic:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
}
