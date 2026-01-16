"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

function toNumber(v) {
  if (v === "" || v === null || v === undefined) return 0;
  const n = Number(String(v).replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
}

export default function EditFeeModal({ fee, onClose, onSuccess, students = [] }) {
  const token = useAuthStore((s) => s.token);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fee) return setForm(null);
    setForm({
      studentId: fee.studentId || "",
      month: fee.month || "",
      date: fee.date ? new Date(fee.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      admissionFee: fee.admissionFee ?? "",
      tuitionFee: fee.tuitionFee ?? "",
      compFee: fee.compFee ?? "",
      lateFee: fee.lateFee ?? "",
      activityFee: fee.activityFee ?? "",
      total: fee.total ?? 0,
    });
  }, [fee]);

  useEffect(() => {
    if (!form) return;
    const total =
      toNumber(form.admissionFee) +
      toNumber(form.tuitionFee) +
      toNumber(form.compFee) +
      toNumber(form.lateFee) +
      toNumber(form.activityFee);
    setForm((f) => ({ ...f, total }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.admissionFee, form?.tuitionFee, form?.compFee, form?.lateFee, form?.activityFee]);

  if (!fee || !form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        studentId: Number(form.studentId),
        month: form.month || null,
        date: form.date || null,
        admissionFee: toNumber(form.admissionFee),
        tuitionFee: toNumber(form.tuitionFee),
        compFee: toNumber(form.compFee),
        lateFee: toNumber(form.lateFee),
        activityFee: toNumber(form.activityFee),
        total: toNumber(form.total),
      };

      const res = await fetch(`http://localhost:4000/api/fees/${fee.id}`, {
        method: "PUT",
        headers: Object.assign({ "Content-Type": "application/json" }, token ? { Authorization: `Bearer ${token}` } : {}),
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errors = json.errors ? json.errors.join(", ") : json.error || "Update failed";
        throw new Error(errors);
      }

      alert("Fee updated");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("update fee err", err);
      alert(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Fee</h2>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">Close</button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
            <div className="grid md:grid-cols-2 gap-3">
              <select name="studentId" value={form.studentId} onChange={handleChange} className="border p-2 rounded" required>
                <option value="">Select student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.admnNo ? `(${s.admnNo})` : ""}
                  </option>
                ))}
              </select>

              <input name="month" type="month" value={form.month} onChange={handleChange} className="border p-2 rounded" />
            </div>

            <input name="date" type="date" value={form.date} onChange={handleChange} className="border p-2 rounded" />

            <div className="grid md:grid-cols-2 gap-3">
              <input name="admissionFee" placeholder="Admission Fee" value={form.admissionFee} onChange={handleChange} className="border p-2 rounded" />
              <input name="tuitionFee" placeholder="Tuition Fee" value={form.tuitionFee} onChange={handleChange} className="border p-2 rounded" />
              <input name="compFee" placeholder="Comp Fee" value={form.compFee} onChange={handleChange} className="border p-2 rounded" />
              <input name="lateFee" placeholder="Late Fee" value={form.lateFee} onChange={handleChange} className="border p-2 rounded" />
              <input name="activityFee" placeholder="Activity Fee" value={form.activityFee} onChange={handleChange} className="border p-2 rounded" />
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="font-semibold">Total: ₹{Number(form.total || 0).toFixed(2)}</div>

              <div className="flex gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60">
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
