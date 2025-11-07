// pages/member/[id]/index.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MemberPage() {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchVotes() {
      const res = await fetch(`/api/member-info?id=${id}`);
      const result = await res.json();
      setData(result.categories);
    }

    fetchVotes();
  }, [id]);

  if (!data) return <h2>Loading voting history…</h2>;

  const categories = Object.keys(data);

  return (
    <div style={{ padding: "24px" }}>
      <button onClick={() => router.back()} style={{ marginBottom: 20 }}>
        ← Back
      </button>

      <h1>Voting Record</h1>
      <p>(Sorted by newest votes first)</p>

      {categories.map((cat) => (
        <div key={cat} style={{ marginBottom: "50px" }}>
          <h2>{cat}</h2>

          {data[cat].map((entry, idx) => {
            const { vote, bill, date } = entry;

            return (
              <div
                key={idx}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <strong>{bill.title}</strong>
                <br />
                <div>
                  <strong>Vote:</strong>{" "}
                  <span
                    style={{
                      color:
                        vote === "Yea" || vote === "Yes"
                          ? "green"
                          : vote === "No" || vote === "Nay"
                          ? "red"
                          : "gray",
                    }}
                  >
                    {vote || "Did not vote"}
                  </span>
                </div>
                <div>
                  <strong>Date:</strong> {new Date(date).toLocaleDateString()}
                </div>
                <p style={{ marginTop: 10 }}>
                  <strong>Summary:</strong> <br />
                  {bill.summary}
                </p>

                <a
                  href={bill.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "blue" }}
                >
                  View bill on Congress.gov →
                </a>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
