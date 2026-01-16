"use client";

import Link from "next/link";
import { API } from "@/lib/api";

export default function ExamTable({ exams, refresh }) {
  const deleteExam = async (id) => {
    if (!confirm("Delete this exam?")) return;

    await API.authDelete(`/exams/${id}`);
    refresh();
  };

  return (
    <table className="w-full bg-white shadow rounded">
      <thead className="bg-gray-100 border-b">
        <tr>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Date</th>
          <th className="p-3 text-left">Duration</th>
          <th className="p-3 text-left">Actions</th>
        </tr>
      </thead>

      <tbody>
        {exams.map((e) => (
          <tr key={e.id} className="border-t">
            <td className="p-3">{e.name}</td>
            <td className="p-3">
              {e.date ? new Date(e.date).toLocaleString() : "—"}
            </td>
            <td className="p-3">{e.durationMinutes} min</td>

            <td className="p-3 space-x-3">
              <Link
                href={`/dashboard/exams/${e.id}`}
                className="text-blue-600 underline"
              >
                View
              </Link>

              <Link
                href={`/dashboard/exams/${e.id}/edit`}
                className="text-green-600 underline"
              >
                Edit
              </Link>

              <button
                onClick={() => deleteExam(e.id)}
                className="text-red-600 underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
