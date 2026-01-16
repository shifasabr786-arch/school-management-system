"use client";

import { useState } from "react";

export default function BookRow({ book, onEdit, onRefresh, token }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete book "${book.title}" (bNo: ${book.bNo})?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:4000/api/books/${book.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Delete failed");
      }
      alert("Book deleted");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("delete book", err);
      alert(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <tr>
      <td className="px-4 py-2 text-sm text-gray-700">{book.bNo}</td>
      <td className="px-4 py-2 text-sm text-gray-700">{book.title}</td>
      <td className="px-4 py-2 text-sm text-gray-700">{book.author}</td>
      <td className="px-4 py-2 text-sm text-gray-700">{book.subject}</td>
      <td className="px-4 py-2 text-sm text-gray-700">{book.price != null ? `₹${Number(book.price).toFixed(2)}` : "-"}</td>
      <td className="px-4 py-2 text-sm text-gray-700">{book.totalCopies ?? 0}</td>
      <td className="px-4 py-2 text-sm text-gray-700">{book.availableCopies ?? 0}</td>
      <td className="px-4 py-2 text-sm text-gray-700">
        <div className="flex gap-2">
          <button onClick={() => onEdit && onEdit(book)} className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500">Edit</button>
          <button onClick={handleDelete} disabled={deleting} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-60">
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}
