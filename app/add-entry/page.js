"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { PlusCircle, CheckCircle, AlertCircle } from "lucide-react";

export default function AddEntry() {
  const router = useRouter();
  const [form, setForm] = useState({
    day: "",
    topic: "",
    subtopic: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [existingTopics, setExistingTopics] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [nextDay, setNextDay] = useState(1);

  useEffect(() => {
    fetch("/api/entries")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data.length > 0) {
          const days = d.data.map((e) => e.day);
          setNextDay(Math.max(...days) + 1);
          const topics = [...new Set(d.data.map((e) => e.topic))];
          setExistingTopics(topics);
        }
      });
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.day || !form.topic) return;
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, day: Number(form.day) }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ day: "", topic: "", subtopic: "", notes: "", date: new Date().toISOString().split("T")[0] });
        setTimeout(() => router.push("/"), 1200);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    setSubmitting(false);
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Add Learning Entry</h1>
          <p className="text-slate-400 text-sm">Log what you learned today</p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Day Number */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Day Number <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="day"
                    min="1"
                    value={form.day}
                    onChange={handleChange}
                    placeholder={`e.g. ${nextDay}`}
                    className="flex-1 px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, day: nextDay })}
                    className="px-3 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs whitespace-nowrap transition-colors"
                  >
                    Auto ({nextDay})
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Topic <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="topic"
                value={form.topic}
                onChange={handleChange}
                placeholder="e.g. JavaScript, React, Python..."
                list="topics-list"
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                required
              />
              <datalist id="topics-list">
                {existingTopics.map((t) => <option key={t} value={t} />)}
              </datalist>
              {existingTopics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {existingTopics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, topic: t })}
                      className="px-2 py-0.5 bg-slate-700 hover:bg-emerald-500/20 hover:text-emerald-400 text-slate-400 rounded text-xs transition-colors border border-slate-600 hover:border-emerald-500/40"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subtopic */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Subtopic</label>
              <input
                type="text"
                name="subtopic"
                value={form.subtopic}
                onChange={handleChange}
                placeholder="e.g. Hooks, useEffect, Async/Await..."
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder="What did you learn? Key insights, resources used, challenges faced..."
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Status */}
            {status === "success" && (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2.5 text-sm">
                <CheckCircle size={16} /> Entry saved! Redirecting...
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 text-sm">
                <AlertCircle size={16} /> Something went wrong. Try again.
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              <PlusCircle size={18} />
              {submitting ? "Saving..." : "Save Entry"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
