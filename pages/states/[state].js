// pages/states/[state].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function StatePage() {
  const router = useRouter();
  const { state } = router.query;
  const [members, setMembers] = useState(null);

  useEffect(() => {
    if (!state) return;

    fetch(`/api/members?state=${state}`)
      .then((r) => r.json())
      .then((d) => setMembers(d.members ?? []));
  }, [state]);

  return (
    <div className="container">
      <Link href="/">← Back</Link>
      <h1>Representatives for {state}</h1>

      {members === null && <p>Loading…</p>}

      {members?.length === 0 && (
        <p>No representatives found or no data returned.</p>
      )}

      {members?.map((m) => (
        <div key={m.bioguideId}>
          <Link href={`/member/${m.bioguideId}`}>
            <b>
              {m.firstName} {m.lastName}
            </b>
            {" — "}
            {m.party}
          </Link>
        </div>
      ))}
    </div>
  );
}
