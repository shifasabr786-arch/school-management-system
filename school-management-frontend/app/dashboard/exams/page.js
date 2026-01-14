"use client";

import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import Link from "next/link";
import ExamTable from "@/components/exams/ExamTable";

export default function ExamsPage() {
  const [exams, setExams] = useState([]);

  const load = async () => {
    const res = await API.authGet("/exams");
    setExams(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Exams</h1>

        <Link
          href="/dashboard/exams/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Exam
        </Link>
      </div>

      <ExamTable exams={exams} refresh={load} />
    </div>
  );
}

