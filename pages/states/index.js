import Link from "next/link";

const states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY",
"LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA",
"RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

export default function StatesIndex() {
  return (
    <div className="container">
      <Link href="/">← Back to Home</Link>
      <h1>Congressional Clarity</h1>
      <h3>Select your state:</h3>
      <div className="grid">
        {states.map((state) => (
          <Link key={state} href={`/states/${state}`}><button>{state}</button></Link>
        ))}
      </div>
    </div>
  );
}
