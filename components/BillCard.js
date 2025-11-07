
export default function BillCard({ bill, vote }) {
  return (
    <div className="bill-card">
      <div className="tag-row">
        {bill.categories.map((c) => (
          <span key={c} className="pill">{c}</span>
        ))}
      </div>

      <h2>
        <a href={bill.url} target="_blank" rel="noreferrer">
          {bill.title}
        </a>
      </h2>

      <p>{bill.summary}</p>

      <div className="vote-row">
        <b>Vote:</b> <span className={`vote ${vote.toLowerCase()}`}>{vote}</span>
      </div>
    </div>
  );
}
