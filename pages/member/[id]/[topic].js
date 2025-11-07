// pages/member/[id]/[topic].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MemberTopicPage() {
  const router = useRouter();
  const { id, topic } = router.query;

  const [votes, setVotes] = useState([]);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/votes?id=${id}`)
      .then((r) => r.json())
      .then((d) => setVotes(d.votes || []));
  }, [id]);

  return (
    <div className="container">
      <Link href={`/member/${id}`}>← Back</Link>
      <h1>Votes on: {topic}</h1>

      {votes.length === 0 && <div>No voting data available.</div>}

      <table className="vote-table">
        <thead>
          <tr>
            <th>Bill</th>
            <th>Result</th>
            <th>Vote</th>
          </tr>
        </thead>

        <tbody>
          {votes.map((v, i) => (
            <tr key={i}>
              <td>
                <a href={v?.bill?.url} target="_blank" rel="noopener noreferrer">
                  {v?.bill?.title || v?.bill?.number}
                </a>
              </td>
              <td>{v.voteResult}</td>
              <td>
                {v.position === "Yes" && "Yes"}
                {v.position === "No" && "No"}
                {!v.position && "Did Not Vote"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
