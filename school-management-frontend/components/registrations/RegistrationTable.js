// components/registrations/RegistrationTable.js
"use client";

import RegistrationRow from "./RegistrationRow";

export default function RegistrationTable({ registrations = [], onDeleted }) {
  if (!registrations || registrations.length === 0) {
    return <div className="text-center py-8 text-gray-500">No registrations found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ID</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">R No</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Student</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">For</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y">
          {registrations.map((r) => (
            <RegistrationRow key={r.id} reg={r} onDeleted={onDeleted} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
