import { useRouter } from 'next/router';
import members from '../../data/members.json';
import { useEffect, useState } from 'react';

export default function MemberPage() {
  const router = useRouter();
  const { id } = router.query;
  const [member, setMember] = useState(null);
  const [subject, setSubject] = useState('');
  const [bills, setBills] = useState([]);

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
    const res = await fetch(`/api/bills?subject=${subj}`);
    const data = await res.json();
    setBills(data.bills || []);
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
      <select id="subject-select" onChange={handleSubjectChange}>
        <option value="">-- Select a subject --</option>
        <option value="veterans">Veterans</option>
        <option value="abortion">Abortion</option>
        <option value="health">Health</option>
        <option value="immigration">Immigration</option>
        <option value="economy">Economy</option>
      </select>

      {bills.length > 0 && (
        <ul>
          {bills.map((bill) => (
            <li key={bill.number}>
              <a href={bill.url} target="_blank" rel="noreferrer">
                {bill.number}: {bill.title}
              </a>
              <p>{bill.latestAction?.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}