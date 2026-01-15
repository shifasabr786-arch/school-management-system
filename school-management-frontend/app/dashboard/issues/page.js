"use client";

import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import IssueTable from "@/components/issues/IssueTable";
import IssueModal from "@/components/issues/IssueModal";
import ReturnModal from "@/components/issues/ReturnModal";

export default function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [openIssueModal, setOpenIssueModal] = useState(false);
  const [returnItem, setReturnItem] = useState(null);

  const loadIssues = async () => {
    const res = await API.authGet("/issues");
    setIssues(res.data);
  };

  useEffect(() => {
    loadIssues();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Issue Tracking</h1>
        <button
          onClick={() => setOpenIssueModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Issue Book
        </button>
      </div>

      <IssueTable
        issues={issues}
        onReturn={(item) => setReturnItem(item)}
      />

      {openIssueModal && (
        <IssueModal
          close={() => setOpenIssueModal(false)}
          refresh={loadIssues}
        />
      )}

      {returnItem && (
        <ReturnModal
          issue={returnItem}
          close={() => setReturnItem(null)}
          refresh={loadIssues}
        />
      )}
    </div>
  );
}
