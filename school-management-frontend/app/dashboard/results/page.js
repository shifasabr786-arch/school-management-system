"use client";

import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import ResultTable from "@/components/results/ResultTable";

export default function ResultsPage() {
  const [results, setResults] = useState([]);

  const loadResults = async () => {
    const res = await API.authGet("/results");
    setResults(res.data);
  };

  useEffect(() => {
    loadResults();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Exam Results</h1>
      <ResultTable results={results} />
    </div>
  );
}
