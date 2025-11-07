
import { useRouter } from "next/router";
import BillList from "../../components/BillList";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then(r => r.json());

export default function MemberPage() {
  const { query } = useRouter();
  const { data, error } = useSWR(() => query.id ? `/api/member-info?id=${query.id}` : null, fetcher);

  if (error) return <div>Error loading voting record.</div>;
  if (!data) return <div>Loading…</div>;

  return <BillList bills={data.bills} />;
}
