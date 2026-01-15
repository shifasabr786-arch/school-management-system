"use client";

import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function EditExam({ params }) {
  const { id } = params;
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    date: "",
    durationMinutes: "",
  });

  const load = async () => {
    const res = await API.authGet(`/exams/${id}`);
    const e = res.data;

    setForm({
      name: e.name,
      date: e.date ? e.date.slice(0, 16) : "",
      durationMinutes: e.durationMinutes,
    });
  };

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();

    await API.authPut(`/exams/${id}`, {
      name: form.name,
      date: form.date,
      durationMinutes: Number(form.durationMinutes),
    });

    router.push("/dashboard/exams");
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Edit Exam</h1>

      <form onSubmit={save} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={update}
          className="w-full p-2 border rounded"
        />

        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={update}
          className="w-full p-2 border rounded"
        />

        <input
          name="durationMinutes"
          value={form.durationMinutes}
          onChange={update}
          className="w-full p-2 border rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
