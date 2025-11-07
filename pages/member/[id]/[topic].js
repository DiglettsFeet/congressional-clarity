import { useRouter } from "next/router";
import VoteTable from "../../../components/VoteTable";

export default function TopicPage({ data }) {
  return (
    <div className="container">
      <h1>{data.topic} Bills</h1>
      <VoteTable bills={data.bills} />
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/votes?memberId=${params.id}&topic=${params.topic}`
  );
  const data = await res.json();
  return { props: { data } };
}
