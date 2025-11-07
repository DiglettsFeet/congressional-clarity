import { getMembersByState } from "../../lib/congress";

export default async function handler(req, res) {
  const { state } = req.query;

  if (!state) {
    return res.status(400).json({ error: "State parameter is required." });
  }

  try {
    const members = await getMembersByState(state);
    res.status(200).json({ state, members });
  } catch (error) {
    console.error("Error in /api/members:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch members" });
  }
}
