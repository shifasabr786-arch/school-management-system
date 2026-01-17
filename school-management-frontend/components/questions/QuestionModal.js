"use client";

import { useState } from "react";
import { API } from "@/lib/api";

export default function QuestionModal({ close, refresh, question }) {
  const [form, setForm] = useState({
    question: question?.question || "",
    type: question?.type || "mcq",
    options: question?.options?.join("\n") || "",
    answer: question?.answer || "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      question: form.question,
      type: form.type,
      options:
        form.type === "mcq"
          ? form.options.split("\n").map((o) => o.trim())
          : [],
      answer: form.answer,
    };

    if (question) {
      await API.authPut(`/questions/${question.id}`, payload);
    } else {
      await API.authPost("/questions", payload);
    }

    refresh();
    close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white w-[400px] p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {question ? "Edit Question" : "Add Question"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="font-semibold">Question</label>
          <textarea
            name="question"
            className="w-full border p-2 rounded mb-3"
            value={form.question}
            onChange={handleChange}
          />

          <label className="font-semibold">Type</label>
          <select
            name="type"
            className="w-full border p-2 rounded mb-3"
            value={form.type}
            onChange={handleChange}
          >
            <option value="mcq">MCQ</option>
            <option value="short">Short Answer</option>
          </select>

          {form.type === "mcq" && (
            <>
              <label className="font-semibold">Options (one per line)</label>
              <textarea
                name="options"
                className="w-full border p-2 rounded mb-3"
                value={form.options}
                onChange={handleChange}
              />

              <label className="font-semibold">Correct Option Index</label>
              <input
                type="number"
                name="answer"
                className="w-full border p-2 rounded mb-3"
                value={form.answer}
                onChange={handleChange}
              />
            </>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {question ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
