// VoteTable component
export default function VoteTable({ bills }) {
  return (
    <table className="vote-table">
      <thead>
        <tr>
          <th>Bill</th>
          <th>Summary</th>
          <th>Vote</th>
        </tr>
      </thead>
      <tbody>
        {bills.map((b, idx) => (
          <tr key={idx}>
            <td><a href={b.url} target="_blank">{b.bill}</a></td>
            <td>{b.summary}</td>
            <td>{b.vote}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
