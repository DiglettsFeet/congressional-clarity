// pages/member/[id]/[topic].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function TopicPage() {
  const router = useRouter();
  const { id, topic } = router.query;

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchVotes() {
      const res = await fetch(`/api/member-info?id=${id}`);
      const result = await res.json();
      setData(result.categories[topic]);
    }

    fetchVotes();
  }, [id, topic]);

  if (!data) return <h2>Loading…</h2>;

  return (
    <div style={{ padding: "24px" }}>
      <button onClick={() => router.push(`/member/${id}`)}>
        ← Back to {id}
      </button>

      <h1>{topic} Bills</h1>
      {data.map((entry, idx) => (
        <div key={idx} style={{ border: "1px solid #ccc", padding: 16, marginBottom: 10 }}>
          <strong>{entry.bill.title}</strong>
          <br />
          <strong>Vote:</strong> {entry.vote}
          <br />
          <p>{entry.bill.summary}</p>
          <a href={entry.bill.url} target="_blank" rel="noopener noreferrer">
            Open Bill →
          </a>
        </div>
      ))}
    </div>
  );
}
