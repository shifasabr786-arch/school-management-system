"use client";

import { useEffect, useState } from "react";
import { API } from "@/lib/api";

import QuestionModal from "@/components/questions/QuestionModal";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const loadQuestions = async () => {
    try {
      const res = await API.authGet("/questions");
      setQuestions(res.data);
    } catch (err) {
      alert("Failed to load questions");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const onAdd = () => {
    setEditingQuestion(null);
    setIsOpen(true);
  };

  const onEdit = (q) => {
    setEditingQuestion(q);
    setIsOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Questions</h1>

        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Question
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-2">ID</th>
              <th className="border px-2 py-2">Question</th>
              <th className="border px-2 py-2">Type</th>
              <th className="border px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <td className="border p-2">{q.id}</td>
                <td className="border p-2">{q.question}</td>
                <td className="border p-2">{q.type}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => onEdit(q)}
                    className="text-blue-600 mr-2 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm("Delete this question?")) return;
                      await API.authDelete(`/questions/${q.id}`);
                      loadQuestions();
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {isOpen && (
        <QuestionModal
          close={() => setIsOpen(false)}
          refresh={loadQuestions}
          question={editingQuestion}
        />
      )}
    </div>
  );
}
