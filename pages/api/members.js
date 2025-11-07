// pages/api/members.js
import { getMembersByState } from "../../lib/congress";

export default async function handler(req, res) {
  const state = req.query.state;

  if (!state) {
    return res.status(400).json({ error: "Missing state parameter" });
  }

  try {
    const members = await getMembersByState(state);
    res.status(200).json({ state, members });
  } catch (err) {
    console.error("❌ Member API Error:", err.response?.data || err.message);
    res.status(500).json({
      state,
      members: [],
      error: "Failed to fetch members",
    });
  }
}
