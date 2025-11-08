import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function TopicVotes() {
  const router = useRouter();
  const { id, topic } = router.query;
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberName, setMemberName] = useState('');

  useEffect(() => {
    if (!id || !topic) return;
    
    // Fetch member info for display
    fetch(`/api/member-info?id=${id}`)
      .then(r => r.json())
      .then(data => {
        setMemberName(data.member?.name || '');
      })
      .catch(err => console.error('Error fetching member:', err));
    
    // Fetch votes by topic
    setLoading(true);
    fetch(`/api/member-votes-by-topic?id=${id}&topic=${encodeURIComponent(topic)}`)
      .then(r => r.json())
      .then(data => {
        setVotes(data.votes || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching votes:', err);
        setLoading(false);
      });
  }, [id, topic]);

  const getVoteColor = (vote) => {
    if (!vote) return '#666';
    const v = vote.toLowerCase();
    if (v.includes('yea') || v.includes('yes')) return '#4CAF50';
    if (v.includes('nay') || v.includes('no')) return '#f44336';
    if (v.includes('present')) return '#FF9800';
    return '#999';
  };

  if (loading) {
    return (
      <div className="container">
        <Link href={`/member/${id}`}>← Back to Member</Link>
        <p>Loading voting record...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Link href={`/member/${id}`}>← Back to Member</Link>
      
      <h1>{topic}</h1>
      {memberName && (
        <p style={{ fontSize: '1.1rem', color: '#999', marginBottom: '2rem' }}>
          {memberName}'s voting record
        </p>
      )}
      
      <p style={{ marginBottom: '2rem', color: '#999' }}>
        {votes.length} {votes.length === 1 ? 'vote' : 'votes'} on record
      </p>
      
      {votes.length === 0 ? (
        <div style={{ 
          padding: '2rem', 
          background: '#1a1a1a', 
          borderRadius: '8px',
          border: '1px solid #333',
          textAlign: 'center' 
        }}>
          <p>No votes found for this topic.</p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            This member may not have voted on any bills related to {topic.toLowerCase()}, 
            or the bills haven't reached a floor vote yet.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            background: '#1a1a1a',
            border: '1px solid #333'
          }}>
            <thead>
              <tr style={{ background: '#222', borderBottom: '2px solid #444' }}>
                <th style={{ padding: '1rem', textAlign: 'left', width: '120px' }}>Bill</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '1rem', textAlign: 'left', minWidth: '300px' }}>Summary</th>
                <th style={{ padding: '1rem', textAlign: 'center', width: '100px' }}>Vote</th>
                <th style={{ padding: '1rem', textAlign: 'left', width: '110px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {votes.map((vote, idx) => (
                <tr key={idx} style={{ 
                  borderBottom: '1px solid #333',
                  transition: 'background 0.2s'
                }}>
                  <td style={{ padding: '1rem' }}>
                    <a 
                      href={vote.billUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        color: '#4A9EFF',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}
                    >
                      {vote.billNumber}
                    </a>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                      {vote.congress}th Congress
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                    {vote.title}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#ccc' }}>
                    {vote.summary}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      background: getVoteColor(vote.vote),
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      display: 'inline-block'
                    }}>
                      {vote.vote}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#999' }}>
                    {new Date(vote.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
