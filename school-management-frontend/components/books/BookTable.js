"use client";

import BookRow from "./BookRow";

export default function BookTable({ books = [], onEdit, onRefresh, token }) {
  if (!books || books.length === 0) {
    return <div className="py-8 text-center text-gray-500">No books found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">BNo</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Title</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Author</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Subject</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Price</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Total</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Available</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y">
          {books.map((b) => (
            <BookRow key={b.id} book={b} onEdit={onEdit} onRefresh={onRefresh} token={token} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
