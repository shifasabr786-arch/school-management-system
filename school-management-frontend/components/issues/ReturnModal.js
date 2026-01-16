"use client";

import { API } from "@/lib/api";

export default function ReturnModal({ issue, close, refresh }) {
  const returnBook = async () => {
    await API.authPut(`/issues/${issue.id}/return`, {});
    refresh();
    close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96 shadow">
        <h2 className="text-lg font-semibold mb-4">Return Book</h2>

        <p><strong>Student:</strong> {issue.student?.name}</p>
        <p><strong>Book:</strong> {issue.book?.title}</p>

        <div className="flex justify-between mt-4">
          <button
            onClick={close}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>

          <button
            onClick={returnBook}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Return Book
          </button>
        </div>
      </div>
    </div>
  );
}

