import { getMembersByState } from "../../lib/congress";

export default async function handler(req, res) {
  try {
    const state = req.query.state?.toUpperCase();
    if (!state) return res.status(400).json({ error: "State code required" });

    const members = await getMembersByState(state);

    res.status(200).json({
      state,
      members,
    });
  } catch (err) {
    console.error("Member API Error:", err);
    res.status(500).json({ error: "Failed to fetch members" });
  }
}
