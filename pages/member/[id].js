
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BillCard from "../../components/BillCard";

export default function MemberPage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const res = await fetch(`/api/votes?id=${id}`);
      const data = await res.json();
      setVotes(data.votes);
      setLoading(false);
    }
    load();
  }, [id]);

  return (
    <div className="container">
      <h1>Vote history</h1>
      {loading && <p>Loading bill votes...</p>}

      {votes.map((v) => (
        <BillCard key={`${v.billNumber}${v.vote}`} bill={v.bill} vote={v.vote} />
      ))}
    </div>
  );
}
