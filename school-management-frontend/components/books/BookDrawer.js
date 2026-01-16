"use client";

import { useEffect } from "react";
import BookForm from "./BookForm";

/**
 * Side drawer that slides from right.
 * Props:
 *  - open (bool)
 *  - mode: 'add'|'edit'
 *  - book: object (for edit)
 *  - onClose: fn
 *  - onSaved: fn
 */
export default function BookDrawer({ open = false, mode = "add", book = null, onClose, onSaved }) {
  useEffect(() => {
    if (open) {
      // lock scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="ml-auto w-full max-w-xl bg-white h-full shadow-xl transform transition-transform">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">{mode === "add" ? "Add Book" : `Edit Book — ${book?.title || ""}`}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">Close</button>
        </div>

        <div className="p-4 overflow-auto h-full">
          <BookForm mode={mode} book={book} onSaved={onSaved} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
}
