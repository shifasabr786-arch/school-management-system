// lib/api.js
const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

async function request(path, opts = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, opts);
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) throw { status: res.status, body: json };
    return json;
  } catch (e) {
    // if parse failed, still check status
    if (!res.ok) throw { status: res.status, body: text };
    return {};
  }
}

export const API = {
  // auth
  login: async ({ username, password }) => {
    return await request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  },

  // generic helpers (token optional)
  get: async (path, token) =>
    request(path, { method: "GET", headers: token ? { Authorization: `Bearer ${token}` } : {} }),

  post: async (path, body, token) =>
    request(path, {
      method: "POST",
      headers: Object.assign({ "Content-Type": "application/json" }, token ? { Authorization: `Bearer ${token}` } : {}),
      body: JSON.stringify(body),
    }),

  put: async (path, body, token) =>
    request(path, {
      method: "PUT",
      headers: Object.assign({ "Content-Type": "application/json" }, token ? { Authorization: `Bearer ${token}` } : {}),
      body: JSON.stringify(body),
    }),

  del: async (path, token) =>
    request(path, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
};
