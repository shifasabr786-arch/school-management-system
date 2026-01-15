"use client";

import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import ResultDetailsTable from "@/components/results/ResultDetailsTable";
import Link from "next/link";

export default function ResultDetailsPage({ params }) {
  const { id } = params;
  const [result, setResult] = useState(null);

  const load = async () => {
    const res = await API.authGet(`/results/${id}`);
    setResult(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  if (!result) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <Link href="/dashboard/results" className="underline text-blue-600">
        ← Back
      </Link>

      <h1 className="text-2xl font-semibold mt-4">
        Result for: {result.student?.name}
      </h1>

      <p className="text-gray-700 mt-2">
        Exam: <strong>{result.exam?.name}</strong>
      </p>

      <p className="text-gray-700">
        Marks Obtained: <strong>{result.marksObtained}</strong>
      </p>

      <div className="mt-6">
        <ResultDetailsTable details={result.details} />
      </div>
    </div>
  );
}
