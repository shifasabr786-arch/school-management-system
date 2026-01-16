"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

export default function FeeRow({ fee, onEdit, onDeleted }) {
  const token = useAuthStore((s) => s.token);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const ok = confirm(`Delete fee record for studentId ${fee.studentId}?`);
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:4000/api/fees/${fee.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Delete failed");
      }

      alert("Fee deleted");
      if (onDeleted) onDeleted();
    } catch (err) {
      console.error("delete fee err", err);
      alert(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const studentName = fee.student ? `${fee.student.name}${fee.student.admnNo ? ` (${fee.student.admnNo})` : ""}` : `ID:${fee.studentId}`;

  return (
    <tr>
      <td className="px-4 py-2 text-sm text-gray-700">{fee.id}</td>
      <td className="px-4 py-2 text-sm text-gray-700">{studentName}</td>
      <td className="px-4 py-2 text-sm text-gray-700">{fee.month ?? "-"}</td>
      <td className="px-4 py-2 text-sm text-gray-700">{fee.date ? new Date(fee.date).toLocaleDateString() : "-"}</td>
      <td className="px-4 py-2 text-sm text-gray-700">₹{Number(fee.admissionFee ?? 0).toFixed(2)}</td>
      <td className="px-4 py-2 text-sm text-gray-700">₹{Number(fee.tuitionFee ?? 0).toFixed(2)}</td>
      <td className="px-4 py-2 text-sm text-gray-700">₹{Number(fee.compFee ?? 0).toFixed(2)}</td>
      <td className="px-4 py-2 text-sm text-gray-700">₹{Number(fee.lateFee ?? 0).toFixed(2)}</td>
      <td className="px-4 py-2 text-sm text-gray-700">₹{Number(fee.activityFee ?? 0).toFixed(2)}</td>
      <td className="px-4 py-2 text-sm text-gray-700 font-semibold">₹{Number(fee.total ?? 0).toFixed(2)}</td>
      <td className="px-4 py-2 text-sm text-gray-700">
        <div className="flex gap-2">
          <button onClick={() => onEdit && onEdit(fee)} className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500">Edit</button>
          <button onClick={handleDelete} disabled={deleting} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-60">
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}
