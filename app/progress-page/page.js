"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Save, CheckSquare, Square, Trophy, RefreshCw } from "lucide-react";

export default function ProgressPage() {
  const [progress, setProgress] = useState({ challengeType: 30, completedDays: [] });
  const [entries, setEntries] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const [pRes, eRes] = await Promise.all([fetch("/api/progress"), fetch("/api/entries")]);
      const pData = await pRes.json();
      const eData = await eRes.json();
      if (pData.success) setProgress(pData.data);
      if (eData.success) setEntries(eData.data);
    } catch (err) {
      setError(err.message || "Unable to load progress data.");
    }
    setLoading(false);
  }

  function toggleDay(day) {
    setSaved(false);
    const curr = progress.completedDays || [];
    const updated = curr.includes(day) ? curr.filter((d) => d !== day) : [...curr, day];
    setProgress({ ...progress, completedDays: updated });
  }

  function setChallenge(type) {
    setSaved(false);
    setProgress({ ...progress, challengeType: type });
  }

  async function saveProgress() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progress),
      });
      
      // Check if response is OK
      if (!res.ok) {
        setError(`Server error: ${res.status} ${res.statusText}`);
        setSaving(false);
        return;
      }

      // Get response text first to debug
      const text = await res.text();
      if (!text) {
        setError("Empty response from server");
        setSaving(false);
        return;
      }

      // Parse JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error("JSON parse error:", parseErr, "Response:", text);
        setError("Invalid response format from server");
        setSaving(false);
        return;
      }

      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        await fetchData();
      } else {
        setError(data.error || "Unable to save progress.");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Unable to save progress.");
    } finally {
      setSaving(false);
    }
  }

  const total = progress.challengeType || 30;
  const completed = progress.completedDays || [];
  const pct = Math.round((completed.length / total) * 100);

  // Group entries by day for quick reference
  const entryDays = new Set(entries.map((e) => e.day));

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mb-1">Progress Tracker</h1>
          <p className="text-slate-400 text-xs md:text-sm">Manage your challenge and mark days complete</p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <p className="text-sm text-emerald-200">
            ✨ <strong>Auto-sync enabled:</strong> Days with logged entries are automatically tracked. Add new entries from the dashboard to update progress instantly.
          </p>
        </div>

        {/* Challenge Selector */}
        <div className="glass-panel p-4 md:p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Challenge Type</h2>
          <div className="flex gap-3">
            {[30, 45].map((type) => (
              <button
                key={type}
                onClick={() => setChallenge(type)}
                className={`flex-1 py-3 rounded-xl font-bold text-lg border-2 transition-all ${
                  progress.challengeType === type
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                    : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500"
                }`}
              >
                {type} Days
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="glass-panel p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="text-cyan-300" size={18} />
              <span className="font-semibold text-slate-200">{completed.length} / {total} Days Completed</span>
            </div>
            <span className="text-cyan-300 font-bold">{pct}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Day Grid */}
        <div className="glass-panel p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Mark Days Complete</h2>
            <div className="flex gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-cyan-500 inline-block"></span>Marked Done</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/60 inline-block border border-emerald-500/40"></span>Has Entry</span>
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
                const entry = entries.find(e => e.day === day);
                return (
                  <div key={day} className="group relative">
                    <button
                      onClick={() => toggleDay(day)}
                      title={hasEntry ? `Day ${day} — ${entry?.topic || "entry logged"}` : `Day ${day}`}
                      className={`aspect-square rounded-lg text-xs font-semibold flex items-center justify-center border transition-all duration-150 w-full ${
                        isDone
                          ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                          : hasEntry
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200 hover:border-emerald-500 hover:bg-emerald-500/25"
                          : "bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-400"
                      }`}
                    >
                      {day}
                    </button>
                    {/* Tooltip on hover */}
                    {hasEntry && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 whitespace-nowrap">
                          {entry?.topic}
                          {entry?.subtopic && ` → ${entry.subtopic}`}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <p className="text-xs text-slate-500 mt-3">💡 Days with entries are auto-marked with <span className="text-emerald-400">green highlight</span></p>
        </div>

        {/* Save Button */}
        <button
          onClick={saveProgress}
          disabled={saving}
          className={`w-full flex items-center justify-center gap-2 py-3 font-semibold rounded-3xl transition-all ${
            saved
              ? "bg-cyan-500 text-slate-950"
              : "btn-primary text-white"
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
        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}

        {/* Entry-wise Log */}
        {entries.length > 0 && (
          <div className="mt-8 glass-panel p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Days with Entries</h2>
            <div className="space-y-2">
              {entries.map((e) => (
                <div key={e._id} className="flex items-center gap-3 text-sm">
                  <span className="w-12 text-center py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded text-xs font-bold">D{e.day}</span>
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
