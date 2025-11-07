
import { getMembersByState } from "../../lib/congress";
export default async function handler(req, res) {
  const { state } = req.query;
  if (!state) return res.status(400).json({ error: "State required" });
  try {
    res.status(200).json({ state, members: await getMembersByState(state) });
  } catch {
    res.status(500).json({ error: "Failed to fetch" });
  }
}
