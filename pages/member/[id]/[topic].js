
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Topic() {
  const router = useRouter();
  const { id, topic } = router.query;
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/votes?id=${id}`).then(r => r.json()).then(d => {
      setVotes(d.votes.filter(v => v.policyArea === topic));
    });
  }, [id, topic]);

  return (
    <div className="container">
      <Link href={`/member/${id}`}>← Back</Link>
      <h1>{topic} Votes</h1>
      {votes.map(v => (
        <div key={v.rollNumber}><b>{v.bill?.number}</b> — {v.position}</div>
      ))}
    </div>
  );
}
