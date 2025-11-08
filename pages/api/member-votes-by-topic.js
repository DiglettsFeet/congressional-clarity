import { policyAreas, matchBillToTopics } from "../../utils/policyAreas";

export default async function handler(req, res) {
  const { id, topic, page = '1', limit = '25' } = req.query;
  
  if (!id || !topic) {
    return res.status(400).json({ error: 'Member ID and topic required' });
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  try {
    const apiKey = process.env.CONGRESS_API_KEY;
    const votesData = [];
    let offset = 0;
    const voteLimit = 250;
    
    console.log(`Fetching votes for member ${id}, topic: ${topic}, page: ${pageNum}`);
    
    // Fetch all votes for the member (entire career)
    while (true) {
      const votesUrl = `https://api.congress.gov/v3/member/${id}/votes?api_key=${apiKey}&format=json&limit=${voteLimit}&offset=${offset}`;
      
      const votesResponse = await fetch(votesUrl);
      
      if (!votesResponse.ok) {
        console.error(`Vote fetch failed: ${votesResponse.status}`);
        break;
      }
      
      const data = await votesResponse.json();
      const votes = data.votes || [];
      
      if (votes.length === 0) break;
      
      votesData.push(...votes);
      offset += voteLimit;
      
      // Safety limit to prevent infinite loops
      if (offset > 10000 || votes.length < voteLimit) break;
    }
    
    console.log(`Total votes fetched: ${votesData.length}`);
    
    // Filter for roll call votes only
    const rollCallVotes = votesData.filter(vote => 
      vote.rollCall && vote.recordedVote
    );
    
    console.log(`Roll call votes: ${rollCallVotes.length}`);
    
    // Enrich votes with bill details and filter by topic
    const enrichedVotes = [];
    
    // Process votes in batches for the requested page
    // Calculate which votes we need to process based on page
    const startIdx = (pageNum - 1) * limitNum;
    const endIdx = startIdx + limitNum;
    
    let processedCount = 0;
    
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
          
          processedCount++;
          
          // Stop processing if we have enough results for pagination
          if (processedCount >= endIdx) break;
        }
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 50));
        
      } catch (error) {
        console.error(`Error processing vote:`, error);
        continue;
      }
    }
    
    // Sort by date (most recent first)
    enrichedVotes.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Paginate results
    const paginatedVotes = enrichedVotes.slice(startIdx, endIdx);
    const totalVotes = enrichedVotes.length;
    const hasMore = processedCount < rollCallVotes.length && totalVotes >= endIdx;
    
    console.log(`Returning ${paginatedVotes.length} votes for page ${pageNum}`);
    
    res.status(200).json({ 
      votes: paginatedVotes,
      total: totalVotes,
      page: pageNum,
      limit: limitNum,
      hasMore: hasMore,
      topic: topic
    });
    
  } catch (error) {
    console.error('Error fetching votes by topic:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
}
