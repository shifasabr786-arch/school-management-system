"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import BookTable from "@/components/books/BookTable";
import BookDrawer from "@/components/books/BookDrawer";

export default function BooksPage() {
  const token = useAuthStore((s) => s.token);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // drawer state: { mode: 'add'|'edit', book: null|object }
  const [drawer, setDrawer] = useState({ open: false, mode: "add", book: null });

  // filters
  const [q, setQ] = useState(""); // search by title/author/bNo
  const [subject, setSubject] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/books", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const j = await res.json().catch(() => ({}));
      setBooks(j.data || []);
    } catch (e) {
      console.error("load books", e);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const openAdd = () => setDrawer({ open: true, mode: "add", book: null });
  const openEdit = (book) => setDrawer({ open: true, mode: "edit", book });
  const closeDrawer = () => setDrawer({ open: false, mode: "add", book: null });

  const handleSaved = () => {
    closeDrawer();
    loadBooks();
  };

  // distinct subjects for filter
  const subjects = useMemo(() => {
    const s = new Set();
    books.forEach((b) => b.subject && s.add(b.subject));
    return Array.from(s).sort();
  }, [books]);

  // filtered
  const filtered = useMemo(() => {
    let list = books.slice();

    if (q) {
      const Q = q.toLowerCase();
      list = list.filter(
        (b) =>
          (b.title && b.title.toLowerCase().includes(Q)) ||
          (b.author && b.author.toLowerCase().includes(Q)) ||
          (b.bNo && b.bNo.toLowerCase().includes(Q))
      );
    }

    if (subject) {
      list = list.filter((b) => b.subject === subject);
    }

    if (onlyAvailable) {
      list = list.filter((b) => (b.availableCopies ?? 0) > 0);
    }

    // sort by title
    list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    return list;
  }, [books, q, subject, onlyAvailable]);

  const exportCSV = () => {
    const rows = filtered.map((b) => ({
      id: b.id,
      bNo: b.bNo,
      title: b.title || "",
      author: b.author || "",
      subject: b.subject || "",
      price: b.price ?? "",
      totalCopies: b.totalCopies ?? "",
      availableCopies: b.availableCopies ?? "",
      purchaseDate: b.purchaseDate ? new Date(b.purchaseDate).toISOString().slice(0, 10) : "",
    }));

    const csv = [
      Object.keys(rows[0] || {}).join(","),
      ...rows.map((r) => Object.values(r).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `books_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Books</h1>

        <div className="flex gap-2">
          <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Book
          </button>

          <button onClick={exportCSV} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          placeholder="Search title / author / bNo"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border p-2 rounded col-span-2 md:col-span-1"
        />

        <select value={subject} onChange={(e) => setSubject(e.target.value)} className="border p-2 rounded">
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <input id="avail" type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />
          <label htmlFor="avail" className="text-sm">Only available</label>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        {loading ? <div className="py-8 text-center">Loading...</div> : <BookTable books={filtered} onEdit={openEdit} onRefresh={loadBooks} token={token} />}
      </div>

      <BookDrawer open={drawer.open} mode={drawer.mode} book={drawer.book} onClose={closeDrawer} onSaved={handleSaved} />
    </div>
  );
}
