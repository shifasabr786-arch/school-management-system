"use client";

import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.username ?? user?.role ?? "User"} 👋</h1>
      <p className="text-gray-700">This is your School Management System dashboard. Use the sidebar to navigate.</p>
    </div>
  );
}
