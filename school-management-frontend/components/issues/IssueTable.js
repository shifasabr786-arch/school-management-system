export default function IssueTable({ issues, onReturn }) {
  return (
    <table className="w-full bg-white shadow rounded">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 text-left">Student</th>
          <th className="p-3 text-left">Book</th>
          <th className="p-3 text-left">Issued On</th>
          <th className="p-3 text-left">Due Date</th>
          <th className="p-3 text-left">Returned</th>
          <th className="p-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {issues.map((i) => (
          <tr key={i.id} className="border-t">
            <td className="p-3">{i.student?.name}</td>
            <td className="p-3">{i.book?.title}</td>
            <td className="p-3">{new Date(i.issueDate).toLocaleDateString()}</td>
            <td className="p-3">
              {i.dueDate
                ? new Date(i.dueDate).toLocaleDateString()
                : "-"}
            </td>
            <td className="p-3">
              {i.returnedOn
                ? new Date(i.returnedOn).toLocaleDateString()
                : "Not Returned"}
            </td>

            <td className="p-3">
              {!i.returnedOn && (
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  onClick={() => onReturn(i)}
                >
                  Return
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

