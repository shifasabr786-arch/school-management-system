"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

/**
 * Sidebar - polished layout with active highlighting and icons.
 * Replace your existing Sidebar.js with this file.
 */

function Icon({ name, className = "w-5 h-5" }) {
  // small set of inline SVG icons used in sidebar
  const map = {
    home: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 11.25L12 4l9 7.25v7.5A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75v-7.5z"/><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9"/></svg>),
    students: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M16 11a4 4 0 1 0-8 0"/><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 15v6"/></svg>),
    registrations: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="16" rx="2"/><path strokeWidth="1.5" d="M8 8h8"/></svg>),
    fees: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" d="M12 8v8"/><circle cx="12" cy="12" r="9" strokeWidth="1.2"/></svg>),
    books: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.4" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path strokeWidth="1.4" d="M4 4.5A2.5 2.5 0 0 1 6.5 7H20"/><path strokeWidth="1.4" d="M4 12v7"/></svg>),
    issues: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" d="M12 20v-8"/><path strokeWidth="1.5" d="M5 8h14"/></svg>),
    questions: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" d="M12 6v6"/><path strokeWidth="1.5" d="M12 14h.01"/></svg>),
    exams: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="1.4"/><path strokeWidth="1.4" d="M8 2v4"/></svg>),
    results: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.4" d="M4 6h16"/><path strokeWidth="1.4" d="M4 12h10"/><path strokeWidth="1.4" d="M4 18h7"/></svg>),
  };
  return map[name] || null;
}

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  const menu = [
    { label: "Home", path: "/dashboard", icon: "home" },
    { label: "Students", path: "/dashboard/students", icon: "students" },
    { label: "Registrations", path: "/dashboard/registrations", icon: "registrations" },
    { label: "Fees", path: "/dashboard/fees", icon: "fees" },
    { label: "Books", path: "/dashboard/books", icon: "books" },
    { label: "Issues", path: "/dashboard/issues", icon: "issues" },
    { label: "Questions", path: "/dashboard/questions", icon: "questions" },
    { label: "Exams", path: "/dashboard/exams", icon: "exams" },
    { label: "Results", path: "/dashboard/results", icon: "results" },
  ];

  return (
    <aside className="sidebar hidden md:block">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-teal-500 text-white font-bold">
          SM
        </div>
        <div>
          <div className="font-semibold text-sm">SchoolMS</div>
          <div className="text-xs text-slate-500">Admin Panel</div>
        </div>
      </div>

      <nav className="space-y-1">
        {menu.map((m) => {
          const active = pathname?.startsWith(m.path);
          return (
            <Link
              key={m.path}
              href={m.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm ${
                active ? "bg-teal-600 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="shrink-0">
                <Icon name={m.icon} className="w-5 h-5" />
              </span>
              <span className="truncate">{m.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">
        <button
          onClick={logout}
          className="btn btn-danger w-full px-3 py-2 text-sm"
        >
          Logout
        </button>
      </div>

      <div className="mt-6 text-xs text-slate-400">
        v1.0 • Built for MCA
      </div>
    </aside>
  );
}
