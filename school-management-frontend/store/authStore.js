// store/authStore.js
"use client";

import { create } from "zustand";

/**
 * Decode JWT payload without external lib.
 * Returns null on error.
 */
function decodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // base64 decode (URL-safe)
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(decodeURIComponent(escape(atob(payload))));
    return decoded;
  } catch (e) {
    console.error("decodeJwt error", e);
    return null;
  }
}

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,

  login: (token) => {
    try {
      localStorage.setItem("token", token);
      const payload = decodeJwt(token);
      set({ token, user: payload ? payload : null });
    } catch (e) {
      console.error("login error", e);
    }
  },

  loadToken: () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const payload = decodeJwt(token);
      if (!payload) {
        localStorage.removeItem("token");
        set({ token: null, user: null });
        return;
      }
      set({ token, user: payload });
    } catch (e) {
      console.error("loadToken error", e);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
    // optionally refresh or redirect handled by components
  },

  getAuthHeader: () => {
    const t = get().token;
    return t ? { Authorization: `Bearer ${t}` } : {};
  },
}));
