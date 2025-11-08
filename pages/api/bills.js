export default async function handler(req, res) {
  const { subject } = req.query;

  const response = await fetch(`https://api.congress.gov/v3/bill?subject=${subject}&format=json&api_key=${process.env.CONGRESS_API_KEY}`);
  const data = await response.json();

  res.status(200).json(data);
}