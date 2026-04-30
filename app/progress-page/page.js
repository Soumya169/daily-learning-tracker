"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Save, CheckSquare, Square, Trophy, RefreshCw } from "lucide-react";

export default function ProgressPage() {
  const [progress, setProgress] = useState({ challengeType: 30, completedDays: [] });
  const [entries, setEntries] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [pRes, eRes] = await Promise.all([fetch("/api/progress"), fetch("/api/entries")]);
    const pData = await pRes.json();
    const eData = await eRes.json();
    if (pData.success) setProgress(pData.data);
    if (eData.success) setEntries(eData.data);
    setLoading(false);
  }

  function toggleDay(day) {
    const curr = progress.completedDays || [];
    const updated = curr.includes(day) ? curr.filter((d) => d !== day) : [...curr, day];
    setProgress({ ...progress, completedDays: updated });
  }

  function setChallenge(type) {
    setProgress({ ...progress, challengeType: type });
  }

  async function saveProgress() {
    setSaving(true);
    const res = await fetch("/api/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(progress),
    });
    const data = await res.json();
    if (data.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  const total = progress.challengeType || 30;
  const completed = progress.completedDays || [];
  const pct = Math.round((completed.length / total) * 100);

  // Group entries by day for quick reference
  const entryDays = new Set(entries.map((e) => e.day));

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Progress Tracker</h1>
          <p className="text-slate-400 text-sm">Manage your challenge and mark days complete</p>
        </div>

        {/* Challenge Selector */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Challenge Type</h2>
          <div className="flex gap-3">
            {[30, 45].map((type) => (
              <button
                key={type}
                onClick={() => setChallenge(type)}
                className={`flex-1 py-3 rounded-xl font-bold text-lg border-2 transition-all ${
                  progress.challengeType === type
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600"
                }`}
              >
                {type} Days
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-400" size={18} />
              <span className="font-semibold text-slate-200">{completed.length} / {total} Days Completed</span>
            </div>
            <span className="text-emerald-400 font-bold">{pct}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Day Grid */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Mark Days Complete</h2>
            <div className="flex gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>Done</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500/40 inline-block border border-blue-500/40"></span>Entry exists</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-slate-700 inline-block"></span>Pending</span>
            </div>
          </div>
          {loading ? (
            <p className="text-slate-500 text-sm">Loading...</p>
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
              {Array.from({ length: total }, (_, i) => i + 1).map((day) => {
                const isDone = completed.includes(day);
                const hasEntry = entryDays.has(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    title={hasEntry ? `Day ${day} — entry logged` : `Day ${day}`}
                    className={`aspect-square rounded-lg text-xs font-semibold flex items-center justify-center border transition-all duration-150 ${
                      isDone
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : hasEntry
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:border-emerald-500"
                        : "bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-400"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={saveProgress}
          disabled={saving}
          className={`w-full flex items-center justify-center gap-2 py-3 font-semibold rounded-xl transition-all ${
            saved
              ? "bg-emerald-700 text-white"
              : "bg-emerald-600 hover:bg-emerald-500 text-white"
          } disabled:opacity-60`}
        >
          {saving ? (
            <><RefreshCw size={18} className="animate-spin" /> Saving...</>
          ) : saved ? (
            <><CheckSquare size={18} /> Saved!</>
          ) : (
            <><Save size={18} /> Save Progress</>
          )}
        </button>

        {/* Entry-wise Log */}
        {entries.length > 0 && (
          <div className="mt-8 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Days with Entries</h2>
            <div className="space-y-2">
              {entries.map((e) => (
                <div key={e._id} className="flex items-center gap-3 text-sm">
                  <span className="w-12 text-center py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs font-bold">D{e.day}</span>
                  <span className="text-slate-300 font-medium">{e.topic}</span>
                  {e.subtopic && <span className="text-slate-500">→ {e.subtopic}</span>}
                  <span className="ml-auto text-slate-600 text-xs">{new Date(e.date).toLocaleDateString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
