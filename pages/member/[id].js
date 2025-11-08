import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { policyAreas } from "../../utils/policyAreas";

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

  if (loading) {
    return (
      <div className="container">
        <Link href="/">← Back to States</Link>
        <p>Loading member information...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="container">
        <Link href="/">← Back to States</Link>
        <p>Member not found.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Link href="/">← Back to States</Link>
      
      {/* Member Header */}
      <div style={{ 
        marginBottom: '2rem', 
        padding: '1.5rem', 
        background: '#1a1a1a', 
        borderRadius: '8px',
        border: '1px solid #333'
      }}>
        <h1 style={{ marginTop: 0, marginBottom: '1rem' }}>
          {member.name}
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.95rem' }}>
          <div>
            <strong>Party:</strong> {member.party}
          </div>
          <div>
            <strong>State:</strong> {member.state}
          </div>
          <div>
            <strong>District:</strong> {member.district || 'Senate'}
          </div>
          {member.terms && member.terms[0] && (
            <div>
              <strong>Current Term:</strong> {member.terms[0].startYear} - {member.terms[0].endYear || 'Present'}
            </div>
          )}
        </div>
      </div>

      {/* Topics Section */}
      <h2>Voting Record by Topic</h2>
      <p style={{ marginBottom: '1.5rem', color: '#999' }}>
        Select a topic to view how {member.name.split(' ').slice(-1)[0]} voted on related legislation throughout their career
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '1rem' 
      }}>
        {Object.keys(policyAreas).map(topic => (
          <Link key={topic} href={`/member/${id}/${encodeURIComponent(topic)}`}>
            <button style={{ 
              width: '100%', 
              padding: '1rem', 
              fontSize: '0.95rem',
              textAlign: 'left',
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              {topic}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
