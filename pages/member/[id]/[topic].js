import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

const topicNames = {
  'Health': 'Healthcare',
  'Immigration': 'Immigration',
  'Education': 'Education',
  'Armed Forces and National Security': 'Veterans Affairs',
  'Economics and Public Finance': 'Economy & Jobs',
  'Environmental Protection': 'Environment',
  'Civil Rights and Liberties, Minority Issues': 'Civil Rights',
  'Crime and Law Enforcement': 'Crime & Justice'
};

export default function Topic() {
  const router = useRouter();
  const { id, topic } = router.query;
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !topic) return;

    setLoading(true);
    fetch(`/api/bills?member=${id}&topic=${topic}`)
      .then((r) => r.json())
      .then((data) => {
        setBills(data || []);         // ✅ our API returns an array, not { bills }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading voting data:", err);
        setLoading(false);
      });
  }, [id, topic]);

  const displayName = topicNames[topic] || topic;

  if (loading) {
    return (
      <div className="container">
        <Link href={`/member/${id}`}>← Back</Link>
        <p>Loading voting record...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Link href={`/member/${id}`}>← Back</Link>

      <h1>{displayName} — Voting Record</h1>

      <p style={{ marginBottom: "2rem", color: "#666" }}>
        {bills.length} bill{bills.length === 1 ? "" : "s"} with recorded votes
      </p>

      {bills.length === 0 ? (
        <p>No recorded votes found for this issue.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {bills.map((bill) => {
            const vote = bill.memberVote?.toLowerCase();
            const badges = {
              yes: { label: "Yes", bg: "#e8f7ed", color: "#0a7b34", border: "#bfe3cc" },
              no: { label: "No", bg: "#fdeaea", color: "#b1181a", border: "#f1c2c3" },
              present: { label: "Present", bg: "#f4f4f4", color: "#444", border: "#ccc" },
              unknown: { label: "Not Voting", bg: "#f4f4f4", color: "#444", border: "#ccc" }
            };

            const badge =
              vote === "yes" ? badges.yes :
              vote === "no" ? badges.no :
              vote === "present" ? badges.present :
              badges.unknown;

            return (
              <div
                key={`${bill.congress}-${bill.type}-${bill.number}`}
                style={{
                  border: "1px solid #ddd",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>
                    {bill.type.toUpperCase()} {bill.number}
                  </h3>

                  {/* ✅ Added vote badge */}
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "999px",
                      backgroundColor: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {badge.label}
                  </span>
                </div>

                <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{bill.title}</p>

                {bill.introducedDate && (
                  <p style={{ color: "#666", fontSize: "0.9rem" }}>
                    <strong>Introduced:</strong>{" "}
                    {new Date(bill.introducedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {bill.congress && ` • ${bill.congress}th Congress`}
                  </p>
                )}

                {bill.latestAction && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "0.75rem",
                      backgroundColor: "#fff",
                      borderLeft: "3px solid #0066cc",
                      borderRadius: "4px",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>
                      <strong>Latest Action:</strong> {bill.latestAction.text}
                    </p>
                  </div>
                )}

                <a
                  href={`https://www.congress.gov/bill/${bill.congress}th-congress/${bill.type.toLowerCase()}-bill/${bill.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "1rem",
                    color: "#0066cc",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  View on Congress.gov →
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
