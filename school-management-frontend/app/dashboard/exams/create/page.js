"use client";

import { useState } from "react";
import { API } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateExamPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    date: "",
    durationMinutes: "",
    questionIds: "",
    generate: {
      total: "",
      bySubject: "",
      difficulty: "",
    },
  });

  const [mode, setMode] = useState("manual");

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const updateGenerate = (e) =>
    setForm({
      ...form,
      generate: { ...form.generate, [e.target.name]: e.target.value },
    });

  const submit = async (e) => {
    e.preventDefault();

    let payload = {
      name: form.name,
      date: form.date,
      durationMinutes: Number(form.durationMinutes),
    };

    if (mode === "manual") {
      payload.questionIds = form.questionIds
        .split(",")
        .map((id) => Number(id.trim()));
    } else {
      payload.generate = {
        total: Number(form.generate.total),
        bySubject: form.generate.bySubject
          ? JSON.parse(form.generate.bySubject)
          : undefined,
        difficulty: form.generate.difficulty
          ? JSON.parse(form.generate.difficulty)
          : undefined,
      };
    }

    await API.authPost("/exams", payload);
    router.push("/dashboard/exams");
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Create Exam</h1>

      <div className="space-x-4 mb-4">
        <button
          onClick={() => setMode("manual")}
          className={`px-3 py-1 rounded ${
            mode === "manual" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Manual Mode
        </button>
        <button
          onClick={() => setMode("auto")}
          className={`px-3 py-1 rounded ${
            mode === "auto" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Auto Generate
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <input
          name="name"
          onChange={update}
          className="w-full p-2 border rounded"
          placeholder="Exam Name"
        />

        <input
          type="datetime-local"
          name="date"
          onChange={update}
          className="w-full p-2 border rounded"
        />

        <input
          name="durationMinutes"
          onChange={update}
          className="w-full p-2 border rounded"
          placeholder="Duration in minutes"
        />

        {mode === "manual" ? (
          <input
            name="questionIds"
            onChange={update}
            className="w-full p-2 border rounded"
            placeholder="Question IDs (comma separated)"
          />
        ) : (
          <div>
            <input
              name="total"
              onChange={updateGenerate}
              className="w-full p-2 border rounded mb-2"
              placeholder='Total Questions (e.g. "10")'
            />

            <input
              name="bySubject"
              onChange={updateGenerate}
              className="w-full p-2 border rounded mb-2"
              placeholder='By Subject JSON (e.g. {"Math":5,"Physics":5})'
            />

            <input
              name="difficulty"
              onChange={updateGenerate}
              className="w-full p-2 border rounded"
              placeholder='Difficulty JSON (e.g. {"easy":3,"hard":2})'
            />
          </div>
        )}

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Create Exam
        </button>
      </form>
    </div>
  );
}