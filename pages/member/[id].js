
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Member() {
  const router = useRouter();
  const { id } = router.query;
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/votes?id=${id}`).then(r => r.json()).then(d => setVotes(d.votes || []));
  }, [id]);

  const topics = [...new Set(votes.map(v => v.policyArea))].filter(Boolean);

  return (
    <div className="container">
      <Link href="/states">← Back</Link>
      <h1>Votes — {id}</h1>
      {topics.map(t => <Link key={t} href={`/member/${id}/${t}`}><button>{t}</button></Link>)}
    </div>
  );
}
