"use client";

import FeeRow from "./FeeRow";

export default function FeeTable({ fees = [], onEdit, onDeleted, students = [] }) {
  if (!fees || fees.length === 0) {
    return <div className="py-8 text-center text-gray-500">No fee records found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ID</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Student</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Month</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Admission</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Tuition</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Comp</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Late</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Activity</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Total</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y">
          {fees.map((f) => (
            <FeeRow key={f.id} fee={f} onEdit={onEdit} onDeleted={onDeleted} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
