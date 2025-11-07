import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function StatePage() {
  const router = useRouter();
  const { state } = router.query;
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!state) return;

    fetch(`/api/members?state=${state}`)
      .then(r => r.json())
      .then(d => setMembers(d.members || d.member || []));
  }, [state]);

  return (
    <div className="container">
      <Link href="/">← Back</Link>
      <h1>Representatives for {state}</h1>

      {!members.length && <p>Loading… or no data received from API.</p>}

      {members.map((m) => (
        <div key={m.bioguideId} style={{ marginBottom: "12px" }}>
          <Link href={`/member/${m.bioguideId}`}>
            <b>{m.firstName} {m.lastName}</b>
          </Link>
        </div>
      ))}
    </div>
  );
}
