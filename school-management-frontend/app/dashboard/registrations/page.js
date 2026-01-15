// app/dashboard/registrations/page.js
"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import AddRegistrationModal from "@/components/registrations/AddRegistrationModal";
import RegistrationTable from "@/components/registrations/RegistrationTable";

export default function RegistrationsPage() {
  const token = useAuthStore((s) => s.token);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const loadRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/registrations", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      setRegistrations(json.data || []);
    } catch (err) {
      console.error("Failed to load registrations", err);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAdded = () => {
    setShowAdd(false);
    loadRegistrations();
  };

  const handleDeleted = () => {
    loadRegistrations();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Registrations</h1>
        <div>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Registration
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        {loading ? (
          <div className="text-center py-8">Loading registrations...</div>
        ) : (
          <RegistrationTable registrations={registrations} onDeleted={handleDeleted} />
        )}
      </div>

      <AddRegistrationModal open={showAdd} onClose={() => setShowAdd(false)} onSuccess={handleAdded} />
    </div>
  );
}
