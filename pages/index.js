import { useState } from 'react';
import states from '../data/states.json';
import members from '../data/members.json';
import Link from 'next/link';

export default function Home() {
  const [selectedState, setSelectedState] = useState('');
  const [stateMembers, setStateMembers] = useState([]);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setStateMembers(members[state] || []);
  };

  return (
    <div>
      <h1>Congressional Clarity</h1>
      <label htmlFor="state-select">Choose your state:</label>
      <select id="state-select" onChange={handleStateChange}>
        <option value="">-- Select a state --</option>
        {states.map((state) => (
          <option key={state.abbr} value={state.abbr}>
            {state.name}
          </option>
        ))}
      </select>

      {selectedState && (
        <>
          <h2>Representatives and Senators for {selectedState}</h2>
          <ul>
            {stateMembers.map((member) => (
              <li key={member.bioguideId}>
                <Link href={`/member/${member.bioguideId}`}>
                  {member.name} ({member.party}) - {member.chamber}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}