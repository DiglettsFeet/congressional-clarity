
import { getCurrentMembers } from "../../lib/congress";

export default async function handler(req, res) {
  try {
    const members = await getCurrentMembers();
    res.status(200).json({ members });
  } catch (err) {
    console.error("❌ API /members Error:", err);
    res.status(500).json({ error: "Failed to load members" });
  }
}
