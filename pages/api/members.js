// pages/api/members.js
import { getMembersByState } from "../../lib/congress";

export default async function handler(req, res) {
  const { state } = req.query;

  try {
    const members = await getMembersByState(state);
    res.status(200).json({ state, members });
  } catch (err) {
    console.error("Member API Error:", err);
    res.status(500).json({ error: "Could not fetch members" });
  }
}
