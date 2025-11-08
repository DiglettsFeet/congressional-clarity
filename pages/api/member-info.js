export default async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Member ID required' });
  }

  try {
    const apiKey = process.env.CONGRESS_API_KEY;
    const memberUrl = `https://api.congress.gov/v3/member/${id}?api_key=${apiKey}&format=json`;
    
    const response = await fetch(memberUrl);
    
    if (!response.ok) {
      throw new Error(`Congress API returned ${response.status}`);
    }
    
    const data = await response.json();
    const memberData = data.member;
    
    res.status(200).json({ 
      member: {
        name: memberData.directOrderName || `${memberData.firstName} ${memberData.lastName}`,
        party: memberData.partyName,
        state: memberData.state,
        district: memberData.district,
        terms: memberData.terms
      }
    });
  } catch (error) {
    console.error('Error fetching member info:', error);
    res.status(500).json({ error: 'Failed to fetch member information' });
  }
}
