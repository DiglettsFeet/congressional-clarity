// pages/states/[state].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function StatePage() {
  const router = useRouter();
  const { state } = router.query;

  const [members, setMembers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state) return;
    async function fetchMembers() {
      const res = await fetch(`/api/members`);
      const data = await res.json();
      const filtered = data.members.filter(
        (m) => m.state?.toUpperCase() === state.toUpperCase()
      );
      setMembers(filtered);
      setLoading(false);
    }
    fetchMembers();
  }, [state]);

  if (loading) return <h2>Loading…</h2>;
  if (!members || members.length === 0)
    return <h2>No Representatives found for {state}</h2>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>Representatives for {state}</h1>
      <div>
        {members.map((m) => (
          <div
            key={m.bioguideId}
            style={{
              padding: 12,
              marginBottom: 12,
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
            onClick={() => router.push(`/member/${m.bioguideId}`)}
          >
            <strong>{m.name}</strong> – {m.partyName}
          </div>
        ))}
      </div>
    </div>
  );
}
