"use client";

import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import Link from "next/link";

export default function ExamDetails({ params }) {
  const { id } = params;
  const [exam, setExam] = useState(null);

  const load = async () => {
    const res = await API.authGet(`/exams/${id}`);
    setExam(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  if (!exam) return "Loading...";

  return (
    <div className="p-6">
      <Link href="/dashboard/exams" className="underline text-blue-600">
        ← Back
      </Link>

      <h1 className="text-2xl font-semibold mt-4">{exam.name}</h1>

      <p className="mt-2">Duration: {exam.durationMinutes} minutes</p>

      <div className="mt-6 bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-3">Questions</h2>

        <ul className="space-y-2">
          {exam.questions.map((q) => (
            <li key={q.id} className="border-b pb-2">
              <strong>Q{q.sequenceNo}:</strong> {q.text}
              <ul className="ml-6 list-disc text-gray-600 mt-1">
                {q.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
