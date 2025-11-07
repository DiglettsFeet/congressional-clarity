
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Member() {
  const router = useRouter();
  const { id } = router.query;
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/member-info?id=${id}`)
      .then(r => r.json())
      .then(data => {
        setMember(data.member);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching member:', err);
        setLoading(false);
      });
  }, [id]);

  const topics = [
    { name: 'Healthcare', value: 'Health' },
    { name: 'Immigration', value: 'Immigration' },
    { name: 'Education', value: 'Education' },
    { name: 'Veterans Affairs', value: 'Armed Forces and National Security' },
    { name: 'Economy & Jobs', value: 'Economics and Public Finance' },
    { name: 'Environment', value: 'Environmental Protection' },
    { name: 'Civil Rights', value: 'Civil Rights and Liberties, Minority Issues' },
    { name: 'Crime & Justice', value: 'Crime and Law Enforcement' }
  ];

  if (loading) {
    return (
      <div className="container">
        <Link href="/states">← Back</Link>
        <p>Loading member information...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Link href="/states">← Back</Link>
      <h1>{member ? `${member.name} (${member.party}-${member.state})` : `Member ${id}`}</h1>
      {member && (
        <div style={{ marginBottom: '2rem' }}>
          <p><strong>District:</strong> {member.district || 'Senate'}</p>
          <p><strong>Current Term:</strong> {member.terms?.[0]?.startYear || 'N/A'} - {member.terms?.[0]?.endYear || 'Present'}</p>
        </div>
      )}
      <h2>Legislative Topics</h2>
      <p style={{ marginBottom: '1.5rem', color: '#666' }}>
        View bills and legislation sponsored by this member, organized by topic area
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {topics.map(t => (
          <Link key={t.value} href={`/member/${id}/${encodeURIComponent(t.value)}`}>
            <button style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>{t.name}</button>
          </Link>
        ))}
      </div>
    </div>
  );
}
