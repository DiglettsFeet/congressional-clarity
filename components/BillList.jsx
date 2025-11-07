
import { useState } from "react";

export default function BillList({ bills }) {
  return (
    <div>
      {Object.keys(bills).map(category => (
        <Accordion key={category} category={category} items={bills[category]} />
      ))}
    </div>
  );
}

function Accordion({ category, items }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: "pointer",
          background: "#ddd",
          padding: "8px",
          fontWeight: "bold"
        }}
      >
        {category} ({items.length})
      </div>

      {open && (
        <div style={{ paddingLeft: "12px", background: "#f5f5f5" }}>
          {items.map(b => (
            <div key={b.billNumber} style={{ marginBottom: "10px" }}>
              <a href={b.url} target="_blank" rel="noreferrer">
                {b.title}
              </a>
              <div>{b.summary?.substring(0, 200)}...</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
