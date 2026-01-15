// app/dashboard/students/page.js
"use client";

import { useEffect, useState } from "react";
import AddStudentModal from "@/components/students/AddStudentModal";
import StudentTable from "@/components/students/StudentTable";
import { useAuthStore } from "@/store/authStore";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const token = useAuthStore((s) => s.token);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/students", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      setStudents(json.data || []);
    } catch (err) {
      console.error("Load students error", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // wait until token is available
    if (!token) return;
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAdded = () => {
    setShowAdd(false);
    loadStudents();
  };

  const handleDeleted = () => {
    loadStudents();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <div>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Student
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        {loading ? (
          <div className="text-center py-12">Loading students...</div>
        ) : (
          <StudentTable students={students} onDeleted={handleDeleted} />
        )}
      </div>

      <AddStudentModal open={showAdd} onClose={() => setShowAdd(false)} onSuccess={handleAdded} />
    </div>
  );
}
