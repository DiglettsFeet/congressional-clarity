
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function StatePage() {
  const router = useRouter();
  const { state } = router.query;
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!state) return;
    fetch(`/api/members?state=${state}`).then(r => r.json()).then(d => setMembers(d.members || []));
  }, [state]);

  return (
    <div className="container">
      <Link href="/">← Back</Link>
      <h1>Representatives for {state}</h1>
      {members.map((m) => (
        <div key={m.bioguideId}><Link href={`/member/${m.bioguideId}`}><b>{m.name}</b></Link></div>
      ))}
    </div>
  );
}
