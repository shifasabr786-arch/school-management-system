"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import AddFeeModal from "@/components/fees/AddFeeModal";
import EditFeeModal from "@/components/fees/EditFeeModal";
import FeeTable from "@/components/fees/FeeTable";

export default function FeesPage() {
  const token = useAuthStore((s) => s.token);
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [editFee, setEditFee] = useState(null);

  // filters
  const [filterStudentId, setFilterStudentId] = useState("");
  const [filterMonth, setFilterMonth] = useState(""); // 'YYYY-MM'

  // pagination simple client-side
  const [page, setPage] = useState(1);
  const perPage = 12;

  const loadStudents = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/students", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const j = await res.json();
      setStudents(j.data || []);
    } catch (e) {
      console.error("loadStudents", e);
      setStudents([]);
    }
  };

  const loadFees = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/fees", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const j = await res.json();
      // assume backend returns { data: [...] }
      setFees(j.data || []);
    } catch (e) {
      console.error("loadFees", e);
      setFees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadStudents();
    loadFees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAdded = () => {
    setShowAdd(false);
    loadFees();
  };

  const handleUpdated = () => {
    setEditFee(null);
    loadFees();
  };

  const handleDeleted = () => {
    loadFees();
  };

  // filtering logic
  const filtered = useMemo(() => {
    let list = fees.slice();

    if (filterStudentId) {
      list = list.filter((f) => String(f.studentId) === String(filterStudentId));
    }
    if (filterMonth) {
      list = list.filter((f) => {
        if (!f.date) return false;
        const d = new Date(f.date);
        const mm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return mm === filterMonth;
      });
    }
    // sort by date desc
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
    return list;
  }, [fees, filterStudentId, filterMonth]);

  const totalVisible = useMemo(() => {
    return filtered.reduce((s, f) => s + (Number(f.total) || 0), 0);
  }, [filtered]);

  // paging
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Fees</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Fee
          </button>

          <button
            onClick={() => {
              // export visible filtered list to CSV
              const rows = filtered.map((f) => ({
                id: f.id,
                studentId: f.studentId,
                studentName: f.student?.name || "",
                month: f.month || "",
                date: f.date ? new Date(f.date).toISOString().slice(0, 10) : "",
                admissionFee: f.admissionFee ?? "",
                tuitionFee: f.tuitionFee ?? "",
                compFee: f.compFee ?? "",
                lateFee: f.lateFee ?? "",
                activityFee: f.activityFee ?? "",
                total: f.total ?? "",
              }));
              const csv = [
                Object.keys(rows[0] || {}).join(","),
                ...rows.map((r) => Object.values(r).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")),
              ].join("\n");

              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `fees_export_${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm">Student</label>
          <select
            value={filterStudentId}
            onChange={(e) => {
              setFilterStudentId(e.target.value);
              setPage(1);
            }}
            className="border p-2 rounded w-full"
          >
            <option value="">All students</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.admnNo ? `(${s.admnNo})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm">Month</label>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => {
              setFilterMonth(e.target.value);
              setPage(1);
            }}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm">Summary</label>
          <div className="mt-1 font-semibold">Total visible: ₹{totalVisible.toFixed(2)}</div>
        </div>

        <div>
          <label className="block text-sm">Clear</label>
          <div className="mt-1">
            <button
              onClick={() => {
                setFilterStudentId("");
                setFilterMonth("");
                setPage(1);
              }}
              className="px-3 py-2 border rounded"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded p-4">
        {loading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : (
          <FeeTable
            fees={pageItems}
            onEdit={(f) => setEditFee(f)}
            onDeleted={handleDeleted}
            students={students}
          />
        )}
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * perPage + 1} - {Math.min(page * perPage, filtered.length)} of {filtered.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <div className="px-3">{page}</div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <AddFeeModal open={showAdd} onClose={() => setShowAdd(false)} onSuccess={handleAdded} students={students} />
      <EditFeeModal fee={editFee} onClose={() => setEditFee(null)} onSuccess={handleUpdated} students={students} />
    </div>
  );
}
