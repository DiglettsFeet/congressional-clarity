
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
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!id || !topic) return;
    
    setLoading(true);
    fetch(`/api/sponsored-legislation?id=${id}&topic=${encodeURIComponent(topic)}`)
      .then(r => r.json())
      .then(data => {
        setBills(data.bills || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching legislation:', err);
        setLoading(false);
      });
  }, [id, topic]);

  const displayName = topicNames[topic] || topic;

  if (loading) {
    return (
      <div className="container">
        <Link href={`/member/${id}`}>← Back</Link>
        <p>Loading legislation...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Link href={`/member/${id}`}>← Back</Link>
      <h1>{displayName} Legislation</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        {total} {total === 1 ? 'bill' : 'bills'} sponsored in the last 5 years
        {bills.length < total && ` (showing first ${bills.length})`}
      </p>
      
      {bills.length === 0 ? (
        <p>No {displayName.toLowerCase()} legislation sponsored in the last 5 years.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bills.map(bill => (
            <div key={`${bill.congress}-${bill.type}-${bill.number}`} style={{ 
              border: '1px solid #ddd', 
              padding: '1.5rem', 
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
                {bill.type.toUpperCase()} {bill.number}
              </h3>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {bill.title}
              </p>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Introduced:</strong> {new Date(bill.introducedDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                {bill.congress && ` • ${bill.congress}th Congress`}
              </p>
              {bill.latestAction && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.75rem', 
                  backgroundColor: '#fff', 
                  borderLeft: '3px solid #0066cc',
                  borderRadius: '4px'
                }}>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    <strong>Latest Action:</strong> {bill.latestAction.text}
                  </p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#888' }}>
                    {new Date(bill.latestAction.actionDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}
              <a 
                href={`https://www.congress.gov/bill/${bill.congress}th-congress/${bill.type.toLowerCase()}-bill/${bill.number}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  display: 'inline-block', 
                  marginTop: '1rem',
                  color: '#0066cc',
                  textDecoration: 'none',
                  fontSize: '0.9rem'
                }}
              >
                View on Congress.gov →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
