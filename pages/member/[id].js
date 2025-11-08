import { useRouter } from 'next/router';
import members from '../../data/members.json';
import subjects from '../../data/subjects.json';
import { useEffect, useState } from 'react';

export default function MemberPage() {
  const router = useRouter();
  const { id } = router.query;
  const [member, setMember] = useState(null);
  const [subject, setSubject] = useState('');
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    if (id) {
      for (const state in members) {
        const match = members[state].find((m) => m.bioguideId === id);
        if (match) {
          setMember(match);
          break;
        }
      }
    }
  }, [id]);

  const handleSubjectChange = async (e) => {
    const subj = e.target.value;
    setSubject(subj);
    const res = await fetch(`/api/member-votes?bioguideId=${id}&subject=${subj}`);
    const data = await res.json();
    setVotes(data || []);
  };

  if (!member) return <p>Loading...</p>;

  return (
    <div>
      <h1>{member.name}</h1>
      <p>Party: {member.party}</p>
      <p>Chamber: {member.chamber}</p>
      <p>
        <a href={`https://www.congress.gov/member/${member.name.toLowerCase().replace(' ', '-')}/${member.bioguideId}`} target="_blank" rel="noreferrer">
          View on Congress.gov
        </a>
      </p>

      <label htmlFor="subject-select">Choose an issue area:</label>
      <select id="subject-select" onChange={handleSubjectChange} value={subject}>
        <option value="">-- Select a subject --</option>
        {subjects.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {votes.length > 0 && (
        <div>
          <h2>Bills Voted On Related to "{subject}"</h2>
          <ul>
            {votes.map((bill, i) => (
              <li key={i}>
                <a href={bill.congressUrl} target="_blank" rel="noreferrer">
                  {bill.billNumber}: {bill.title}
                </a>
                <p>{bill.summary}</p>
                <strong>Vote: {bill.vote}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {votes.length === 0 && subject && (
        <p>No votes found for this subject.</p>
      )}
    </div>
  );
}