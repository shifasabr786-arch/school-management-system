// components/registrations/RegistrationRow.js
"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

/**
 * reg fields from backend:
 * { id, rNo, regFor, regDate, status, student: { id, name, admnNo } }
 */

export default function RegistrationRow({ reg, onDeleted }) {
  const token = useAuthStore((s) => s.token);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const ok = confirm(`Delete registration ${reg.rNo} for ${reg.student?.name || "student"}?`);
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:4000/api/registrations/${reg.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Delete failed");
      }

      alert("Registration deleted");
      if (onDeleted) onDeleted();
    } catch (err) {
      console.error("Delete reg error", err);
      alert(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <tr>
      <td className="px-4 py-3 text-sm text-gray-700">{reg.id}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{reg.rNo}</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {reg.student ? `${reg.student.name} ${reg.student.admnNo ? `(${reg.student.admnNo})` : ""}` : "—"}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{reg.regFor ?? "-"}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{reg.regDate ? new Date(reg.regDate).toLocaleDateString() : "-"}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{reg.status}</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <div className="flex gap-2">
          <button disabled className="px-3 py-1 rounded bg-gray-200 text-gray-700 cursor-not-allowed">Edit</button>

          <button
            onClick={handleDelete}
            className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}
