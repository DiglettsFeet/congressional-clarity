import Link from "next/link";
import { useRouter } from "next/router";
import { issueGroups } from "../../../utils/issueGroups";

export default function Member() {
  const router = useRouter();
  const { id } = router.query;
  const go = (topic) => router.push(`/member/${id}/${topic}`);

  return (
    <div className="container">
      <Link href={`/member/${id}`}>← Back</Link>
      <h1>Issues & Voting Record</h1>

      {Object.entries(issueGroups).map(([group, topics]) => (
        <details
          key={group}
          style={{
            marginBottom: "1rem",
            borderRadius: "10px",
            padding: "1rem",
            background: "white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontSize: "1.25rem",
              fontWeight: "600",
              padding: "0.25rem 0"
            }}
          >
            {group}
          </summary>

          <ul style={{ listStyle: "none", paddingLeft: "1rem" }}>
            {topics.map((topic) => (
              <li key={topic} style={{ margin: "0.25rem 0" }}>
                <button
                  onClick={() => go(topic)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#0066cc",
                    textDecoration: "underline",
                    fontSize: "1rem",
                    padding: "0"
                  }}
                >
                  {topic}
                </button>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
