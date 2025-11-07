// File: pages/states/[state].js
import Link from "next/link";

const STATE_NAME = {
  AL:"Alabama", AK:"Alaska", AZ:"Arizona", AR:"Arkansas", CA:"California",
  CO:"Colorado", CT:"Connecticut", DE:"Delaware", FL:"Florida", GA:"Georgia",
  HI:"Hawaii", ID:"Idaho", IL:"Illinois", IN:"Indiana", IA:"Iowa",
  KS:"Kansas", KY:"Kentucky", LA:"Louisiana", ME:"Maine", MD:"Maryland",
  MA:"Massachusetts", MI:"Michigan", MN:"Minnesota", MS:"Mississippi",
  MO:"Missouri", MT:"Montana", NE:"Nebraska", NV:"Nevada", NH:"New Hampshire",
  NJ:"New Jersey", NM:"New Mexico", NY:"New York", NC:"North Carolina",
  ND:"North Dakota", OH:"Ohio", OK:"Oklahoma", OR:"Oregon", PA:"Pennsylvania",
  RI:"Rhode Island", SC:"South Carolina", SD:"South Dakota", TN:"Tennessee",
  TX:"Texas", UT:"Utah", VT:"Vermont", VA:"Virginia", WA:"Washington",
  WV:"West Virginia", WI:"Wisconsin", WY:"Wyoming"
};

export async function getServerSideProps({ params, req }) {
  const { state } = params;
  const code = String(state || "").toUpperCase();
  const stateName = STATE_NAME[code] || null;

  // Why: ensure absolute URL in server context on Vercel/local
  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const baseUrl = `${proto}://${host}`;

  if (!stateName) {
    return { props: { code, stateName: null, members: [], error: "Invalid state code" } };
  }

  try {
    const r = await fetch(`${baseUrl}/api/members?state=${code}`, { cache: "no-store" });
    if (!r.ok) {
      const body = await r.json().catch(() => ({}));
      return { props: { code, stateName, members: [], error: body.error || `API ${r.status}` } };
    }
    const { members = [] } = await r.json();
    return { props: { code, stateName, members, error: null } };
  } catch (e) {
    return { props: { code, stateName, members: [], error: e.message || "Fetch failed" } };
  }
}

export default function StatePage({ code, stateName, members, error }) {
  return (
    <main className="container" style={{ padding: 16 }}>
      <Link href="/states">← Back</Link>
      <h1>Representatives for {code}</h1>

      {error && (
        <div role="alert" style={{ border: "1px solid #ddd", padding: 12, marginTop: 8 }}>
          <strong>Couldn’t load members.</strong>
          <div style={{ marginTop: 4 }}>{error}</div>
        </div>
      )}

      {!error && members.length === 0 && (
        <p style={{ marginTop: 12 }}>No members found for {stateName}.</p>
      )}

      <ul style={{ marginTop: 12 }}>
        {members.map((m) => (
          <li key={m.bioguideId}>
            <Link href={`/member/${m.bioguideId}`}>{m.name || `${m.firstName} ${m.lastName}`}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
