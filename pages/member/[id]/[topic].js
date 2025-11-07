import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MemberPage() {
  const router = useRouter();
  const { id } = router.query;
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/votes?memberId=${id}&topic=all`)
      .then(r => r.json())
      .then((d) => {
        // generate unique categories
        const tags = new Set();
        d.bills?.forEach((b) => b.categories?.forEach((c) => tags.add(c)));
        setCategories([...tags]);
      });
  }, [id]);

  return (
    <div className="container">
      <Link href="/">← Back</Link>
      <h1>Bill Categories</h1>

      {categories.map((topic) => (
        <div key={topic}>
          <Link href={`/member/${id}/${topic}`}>{topic}</Link>
        </div>
      ))}
    </div>
  );
}
