export default async function handler(req, res) {
  const { id, topic } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Member ID required' });
  }

  try {
    const apiKey = process.env.CONGRESS_API_KEY;
    const bills = [];
    let offset = 0;
    const limit = 250;
    let hasMore = true;
    
    const currentYear = new Date().getFullYear();
    const fiveYearsAgo = currentYear - 5;
    
    while (hasMore && offset < 1000) {
      const url = `https://api.congress.gov/v3/member/${id}/sponsored-legislation?api_key=${apiKey}&format=json&limit=${limit}&offset=${offset}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Congress API returned ${response.status}`);
      }
      
      const data = await response.json();
      const legislation = data.sponsoredLegislation || [];
      
      if (legislation.length === 0) {
        hasMore = false;
        break;
      }
      
      for (const bill of legislation) {
        const introducedYear = bill.introducedDate ? parseInt(bill.introducedDate.split('-')[0]) : 0;
        
        if (introducedYear >= fiveYearsAgo) {
          if (!topic || bill.policyArea?.name === topic) {
            bills.push(bill);
          }
        }
      }
      
      offset += limit;
      
      if (legislation.length < limit) {
        hasMore = false;
      }
    }
    
    const enrichedBills = await Promise.all(
      bills.slice(0, 50).map(async (bill) => {
        try {
          const billUrl = `https://api.congress.gov/v3/bill/${bill.congress}/${bill.type.toLowerCase()}/${bill.number}?api_key=${apiKey}&format=json`;
          const billResponse = await fetch(billUrl);
          
          if (billResponse.ok) {
            const billData = await billResponse.json();
            const fullBill = billData.bill;
            
            return {
              ...bill,
              title: fullBill.title || bill.title,
              latestAction: fullBill.latestAction,
              subjects: fullBill.subjects
            };
          }
          
          return bill;
        } catch (error) {
          console.error(`Error fetching bill details for ${bill.number}:`, error);
          return bill;
        }
      })
    );
    
    res.status(200).json({ 
      bills: enrichedBills,
      total: bills.length
    });
  } catch (error) {
    console.error('Error fetching sponsored legislation:', error);
    res.status(500).json({ error: 'Failed to fetch sponsored legislation' });
  }
}
