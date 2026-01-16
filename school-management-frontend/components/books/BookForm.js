"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

function numOrNull(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(String(v).replace(/,/g, ""));
  return isNaN(n) ? null : n;
}

export default function BookForm({ mode = "add", book = null, onSaved, onCancel }) {
  const token = useAuthStore((s) => s.token);

  const [form, setForm] = useState({
    bNo: "",
    title: "",
    author: "",
    subject: "",
    price: "",
    purchaseDate: new Date().toISOString().slice(0, 10),
    totalCopies: 1,
    availableCopies: 1,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === "edit" && book) {
      setForm({
        bNo: book.bNo ?? "",
        title: book.title ?? "",
        author: book.author ?? "",
        subject: book.subject ?? "",
        price: book.price != null ? String(book.price) : "",
        purchaseDate: book.purchaseDate ? new Date(book.purchaseDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        totalCopies: book.totalCopies ?? 1,
        availableCopies: book.availableCopies ?? (book.totalCopies ?? 1),
      });
    } else {
      // reset for add
      setForm((f) => ({ ...f, bNo: "", title: "", author: "", subject: "", price: "", totalCopies: 1, availableCopies: 1 }));
    }
  }, [mode, book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // basic validation
    if (!form.bNo || !form.title) {
      alert("bNo and title are required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        bNo: String(form.bNo).trim(),
        title: String(form.title).trim(),
        author: form.author ? String(form.author).trim() : null,
        subject: form.subject ? String(form.subject).trim() : null,
        price: numOrNull(form.price),
        purchaseDate: form.purchaseDate ? new Date(form.purchaseDate).toISOString() : null,
        totalCopies: Number(form.totalCopies) || 0,
        availableCopies: Number(form.availableCopies) || 0,
      };

      let res;
      if (mode === "add") {
        res = await fetch("http://localhost:4000/api/books", {
          method: "POST",
          headers: Object.assign({ "Content-Type": "application/json" }, token ? { Authorization: `Bearer ${token}` } : {}),
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`http://localhost:4000/api/books/${book.id}`, {
          method: "PUT",
          headers: Object.assign({ "Content-Type": "application/json" }, token ? { Authorization: `Bearer ${token}` } : {}),
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errors = json.errors ? json.errors.join(", ") : json.error || "Save failed";
        throw new Error(errors);
      }

      alert(`Book ${mode === "add" ? "created" : "updated"} successfully`);
      if (onSaved) onSaved();
    } catch (err) {
      console.error("save book error", err);
      alert(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input name="bNo" value={form.bNo} onChange={handleChange} placeholder="Book No (unique)" className="border p-2 rounded" required />
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border p-2 rounded" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="border p-2 rounded" />
        <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="border p-2 rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="border p-2 rounded" type="number" step="0.01" />
        <input name="purchaseDate" value={form.purchaseDate} onChange={handleChange} placeholder="Purchase Date" className="border p-2 rounded" type="date" />
        <input name="totalCopies" value={form.totalCopies} onChange={handleChange} placeholder="Total Copies" className="border p-2 rounded" type="number" min="0" />
      </div>

      <div>
        <label className="block text-sm mb-1">Available Copies</label>
        <input name="availableCopies" value={form.availableCopies} onChange={handleChange} type="number" min="0" className="border p-2 rounded w-32" />
      </div>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60">
          {saving ? (mode === "add" ? "Saving..." : "Updating...") : (mode === "add" ? "Save Book" : "Update Book")}
        </button>
      </div>
    </form>
  );
}
