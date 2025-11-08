// Congress.gov Policy Areas plus Hot Topics
export const policyAreas = {
  // Core Policy Areas from Congress.gov
  "Agriculture and Food": {
    keywords: ["agriculture", "farm", "food", "crop", "livestock", "rural"]
  },
  "Armed Forces and National Security": {
    keywords: ["military", "defense", "veteran", "armed forces", "national security", "war"]
  },
  "Civil Rights and Liberties": {
    keywords: ["civil rights", "discrimination", "equality", "liberty", "freedom"]
  },
  "Commerce": {
    keywords: ["commerce", "business", "trade", "consumer"]
  },
  "Crime and Law Enforcement": {
    keywords: ["crime", "police", "law enforcement", "prison", "criminal justice"]
  },
  "Economics and Public Finance": {
    keywords: ["economy", "budget", "debt", "fiscal", "finance"]
  },
  "Education": {
    keywords: ["education", "school", "student", "college", "university"]
  },
  "Energy": {
    keywords: ["energy", "power", "electricity", "oil", "gas", "renewable"]
  },
  "Environmental Protection": {
    keywords: ["environment", "pollution", "conservation", "wildlife", "epa"]
  },
  "Government Operations and Politics": {
    keywords: ["government", "federal", "agency", "administration", "congress"]
  },
  "Health": {
    keywords: ["health", "medical", "hospital", "healthcare", "medicaid", "medicare"]
  },
  "Immigration": {
    keywords: ["immigration", "immigrant", "visa", "citizenship", "border", "asylum"]
  },
  "International Affairs": {
    keywords: ["foreign", "international", "treaty", "diplomacy", "sanctions"]
  },
  "Labor and Employment": {
    keywords: ["labor", "employment", "worker", "wage", "union", "job"]
  },
  "Law": {
    keywords: ["law", "legal", "court", "judicial", "judge"]
  },
  "Science, Technology, Communications": {
    keywords: ["science", "technology", "research", "telecommunications", "internet", "cyber"]
  },
  "Social Welfare": {
    keywords: ["welfare", "poverty", "social security", "assistance", "benefits"]
  },
  "Taxation": {
    keywords: ["tax", "revenue", "irs", "taxation"]
  },
  "Transportation and Public Works": {
    keywords: ["transportation", "highway", "infrastructure", "transit", "aviation"]
  },
  
  // Hot Topic Issues
  "Abortion": {
    keywords: ["abortion", "reproductive", "roe v wade", "pro-life", "pro-choice", "pregnancy"]
  },
  "Gun Rights": {
    keywords: ["gun", "firearm", "second amendment", "weapon", "shooting"]
  },
  "Climate Change": {
    keywords: ["climate change", "global warming", "carbon", "emissions", "greenhouse"]
  },
  "LGBTQ+ Rights": {
    keywords: ["lgbtq", "gay", "lesbian", "transgender", "same-sex", "gender identity"]
  }
};

// Helper function to match bill to topics
export function matchBillToTopics(billTitle, billSummary, billPolicyArea) {
  const matches = [];
  const searchText = `${billTitle} ${billSummary} ${billPolicyArea}`.toLowerCase();
  
  for (const [topic, data] of Object.entries(policyAreas)) {
    // Direct policy area match
    if (billPolicyArea && billPolicyArea.toLowerCase().includes(topic.toLowerCase())) {
      matches.push(topic);
      continue;
    }
    
    // Keyword matching
    const hasKeyword = data.keywords.some(keyword => 
      searchText.includes(keyword.toLowerCase())
    );
    
    if (hasKeyword) {
      matches.push(topic);
    }
  }
  
  return matches;
}
