"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

/**
 * Topbar - polished header with search and user area.
 * Replace your existing Topbar.js with this file.
 */

export default function Topbar() {
  const user = useAuthStore((s) => s.user);
  const [q, setQ] = useState("");

  return (
    <header className="topbar flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold">Dashboard</div>

        <div className="hidden md:flex items-center bg-white card border rounded p-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search students, books, exams..."
            className="outline-none p-2 w-64 text-sm"
          />
          <button className="px-3 py-1 rounded text-sm text-slate-600">Search</button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-600 hidden md:block">
          Signed in as <strong className="ml-1">{user?.username ?? user?.role ?? "User"}</strong>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full w-9 h-9 bg-slate-200 flex items-center justify-center text-slate-700 font-semibold">
            {user?.username?.[0]?.toUpperCase() ?? "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
