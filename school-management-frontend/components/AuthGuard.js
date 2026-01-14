"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const token = useAuthStore((s) => s.token);
  const router = useRouter();

  useEffect(() => {
    // If no token, redirect to login
    if (!token) router.replace("/auth/login");
  }, [token, router]);

  // If no token, render nothing (avoids flashing dashboard)
  if (!token) return null;

  return children;
}
