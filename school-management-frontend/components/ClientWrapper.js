"use client";

import AuthInitializer from "./AuthInitializer";

export default function ClientWrapper({ children }) {
  return (
    <>
      <AuthInitializer />
      {children}
    </>
  );
}
