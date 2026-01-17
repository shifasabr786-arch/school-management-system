// components/registrations/AddRegistrationForm.js
"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

/**
 * Fields in backend Registration: rNo (unique), studentId, regFor, regDate, status
 * We'll fetch students to let user pick a student.
 */

export default function AddRegistrationForm({ onSuccess }) {
  const token = useAuthStore((s) => s.token);

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    rNo: "",
    studentId: "",
    regFor: "",
    regDate: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
    status: "pending",
  });
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await fetch("http://localhost:4000/api/students", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        setStudents(json.data || []);
      } catch (err) {
        console.error("Failed to load students", err);
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    if (token) loadStudents();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        rNo: Number(form.rNo),
        studentId: Number(form.studentId),
        regFor: form.regFor || null,
        regDate: form.regDate || null,
        status: form.status || "pending",
      };

      const res = await fetch("http://localhost:4000/api/registrations", {
        method: "POST",
        headers: Object.assign({ "Content-Type": "application/json" }, token ? { Authorization: `Bearer ${token}` } : {}),
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || (json.errors && json.errors.join(", ")) || "Failed to create");

      alert("Registration created");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Create registration error", err);
      alert(err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          name="rNo"
          type="number"
          placeholder="Registration No (unique)"
          value={form.rNo}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <select
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select student</option>
          {loadingStudents ? (
            <option disabled>Loading...</option>
          ) : (
            students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.admnNo ? `(${s.admnNo})` : ""}
              </option>
            ))
          )}
        </select>
      </div>

      <input
        name="regFor"
        placeholder="Registration For (e.g., 2025-26, Admission to X)"
        value={form.regFor}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          name="regDate"
          type="date"
          value={form.regDate}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
        </select>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {loading ? "Saving..." : "Create Registration"}
        </button>

        <button type="button" onClick={() => { if (onSuccess) onSuccess(); }} className="px-4 py-2 rounded border">
          Cancel
        </button>
      </div>
    </form>
  );
}
