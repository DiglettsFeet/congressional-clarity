// pages/api/members.js

import { getMembersByState } from "../../lib/congress";

export default async function handler(req, res) {
  const { state } = req.query;

  if (!state || state.length !== 2) {
    return res.status(400).json({ error: "State must be a 2-letter code (e.g., GA)" });
  }

  try {
    const members = await getMembersByState(state);

    if (!members || members.length === 0) {
      return res.status(404).json({ message: `No current members found for ${state}` });
    }

    res.status(200).json({ state, members });
  } catch (err) {
    console.error("❌ API /members Error:", err.message);
    res.status(500).json({ error: "Failed to fetch members" });
  }
}
