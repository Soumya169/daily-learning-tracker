"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";

const noteKey = "learntracker-leetcode-notes";
const usernameKey = "learntracker-leetcode-username";

const patternOptions = [
  "Array",
  "String",
  "Hash Map",
  "Two Pointers",
  "Sliding Window",
  "Binary Search",
  "Stack",
  "Queue",
  "Tree",
  "Graph",
  "DP",
  "Greedy",
  "Backtracking",
  "Math",
];

export default function LeetCodePage() {
  const [username, setUsername] = useState("");
  const [draftUsername, setDraftUsername] = useState("");
  const [data, setData] = useState(null);
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const syncLeetCode = useCallback(async (name) => {
    const cleanName = name?.trim();
    if (!cleanName) {
      setError("Enter your LeetCode username first.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/leetcode?username=${encodeURIComponent(cleanName)}`, { cache: "no-store" });
      const payload = await res.json();
      if (!res.ok || !payload.success) throw new Error(payload.error || "Unable to sync LeetCode.");
      setUsername(cleanName);
      setDraftUsername(cleanName);
      setData(payload.data);
      localStorage.setItem(usernameKey, cleanName);
    } catch (err) {
      setError(err.message || "Unable to sync LeetCode.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedUsername = localStorage.getItem(usernameKey) || "";
    const savedNotes = JSON.parse(localStorage.getItem(noteKey) || "{}");
    setUsername(savedUsername);
    setDraftUsername(savedUsername);
    setNotes(savedNotes);
    if (savedUsername) syncLeetCode(savedUsername);
  }, [syncLeetCode]);

  function updateNote(slug, patch) {
    const updated = {
      ...notes,
      [slug]: {
        pattern: notes[slug]?.pattern || "",
        note: notes[slug]?.note || "",
        ...patch,
      },
    };
    setNotes(updated);
    localStorage.setItem(noteKey, JSON.stringify(updated));
  }

  const solvedStats = data?.user?.submitStats?.acSubmissionNum || [];
  const recentAccepted = useMemo(() => data?.recentAccepted || [], [data]);
  const uniqueProblems = useMemo(() => {
    const seen = new Set();
    return recentAccepted
      .filter((problem) => {
        if (seen.has(problem.titleSlug)) return false;
        seen.add(problem.titleSlug);
        return true;
      })
      .sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
  }, [recentAccepted]);

  const groupedDays = useMemo(() => {
    const groups = new Map();
    uniqueProblems.forEach((problem) => {
      const dateKey = new Date(Number(problem.timestamp) * 1000).toISOString().split("T")[0];
      if (!groups.has(dateKey)) groups.set(dateKey, []);
      groups.get(dateKey).push(problem);
    });
    return Array.from(groups.entries()).map(([date, problems], index) => ({ date, day: index + 1, problems }));
  }, [uniqueProblems]);

  const todayKey = new Date().toISOString().split("T")[0];
  const todaySolved = groupedDays.find((group) => group.date === todayKey)?.problems.length || 0;
  const totalSolved = solvedStats.find((item) => item.difficulty === "All")?.count || 0;
  const easySolved = solvedStats.find((item) => item.difficulty === "Easy")?.count || 0;
  const mediumSolved = solvedStats.find((item) => item.difficulty === "Medium")?.count || 0;
  const hardSolved = solvedStats.find((item) => item.difficulty === "Hard")?.count || 0;

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="leetcode-hero">
          <div>
            <p className="section-heading">LeetCode sync</p>
            <h1>Turn solved problems into proof and revision.</h1>
            <p>
              Sync your public accepted submissions, group them into challenge days, and keep quick pattern notes beside each problem.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              syncLeetCode(draftUsername);
            }}
            className="leetcode-sync-box"
          >
            <label>
              <span>Username</span>
              <div>
                <Search size={16} />
                <input
                  value={draftUsername}
                  onChange={(e) => setDraftUsername(e.target.value)}
                  placeholder="your-leetcode-username"
                />
              </div>
            </label>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              {loading ? "Syncing..." : "Sync"}
            </button>
          </form>
        </section>

        {error && (
          <div className="goal-alert">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <section className="leetcode-stat-grid">
          <LeetStat icon={<Trophy size={18} />} label="Total solved" value={totalSolved} />
          <LeetStat icon={<CheckCircle2 size={18} />} label="Easy" value={easySolved} />
          <LeetStat icon={<Sparkles size={18} />} label="Medium" value={mediumSolved} />
          <LeetStat icon={<BookOpen size={18} />} label="Hard" value={hardSolved} />
        </section>

        <section className="leetcode-today-card">
          <div>
            <p className="section-heading">Today</p>
            <h2>{todaySolved > 0 ? `${todaySolved} accepted today` : "No public accepted submission today yet"}</h2>
            <p>
              {todaySolved > 0
                ? "This can count as today's learning proof. Add a tracker entry if you want it reflected in your main challenge."
                : "Solve one problem, sync again, and this page will show it in your challenge timeline."}
            </p>
          </div>
          <Link href={`/add-entry?topic=LeetCode&subtopic=${encodeURIComponent(username || "Practice")}`} className="btn-secondary">
            Add tracker entry
            <ArrowRight size={16} />
          </Link>
        </section>

        <section className="leetcode-section">
          <div className="goal-section-heading">
            <div>
              <p className="section-heading">Challenge days</p>
              <h2>Recent accepted problems</h2>
            </div>
            <span>{uniqueProblems.length}</span>
          </div>

          {!data ? (
            <div className="goal-empty">
              <CalendarDays size={36} />
              <h3>Connect your LeetCode username</h3>
              <p>Your recent accepted submissions will appear here as Day 1, Day 2, and revision cards.</p>
            </div>
          ) : groupedDays.length === 0 ? (
            <div className="goal-empty">
              <BookOpen size={36} />
              <h3>No public accepted submissions found</h3>
              <p>LeetCode only exposes a limited recent accepted list publicly.</p>
            </div>
          ) : (
            <div className="leetcode-day-list">
              {groupedDays.map((group) => (
                <article key={group.date} className="leetcode-day-card">
                  <div className="leetcode-day-head">
                    <div>
                      <p>Day {group.day}</p>
                      <h3>{new Date(group.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</h3>
                    </div>
                    <strong>{group.problems.length} solved</strong>
                  </div>
                  <div className="leetcode-problem-list">
                    {group.problems.map((problem) => (
                      <ProblemCard key={problem.titleSlug} problem={problem} note={notes[problem.titleSlug]} onUpdate={updateNote} />
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function LeetStat({ icon, label, value }) {
  return (
    <div className="leet-stat">
      <div>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ProblemCard({ problem, note, onUpdate }) {
  return (
    <div className="leetcode-problem-card">
      <div className="leetcode-problem-title">
        <div>
          <span>{new Date(Number(problem.timestamp) * 1000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
          <h4>{problem.title}</h4>
        </div>
        <a href={`https://leetcode.com/problems/${problem.titleSlug}/`} target="_blank" rel="noreferrer" aria-label={`Open ${problem.title} on LeetCode`}>
          <ExternalLink size={16} />
        </a>
      </div>
      <div className="leetcode-note-row">
        <select value={note?.pattern || ""} onChange={(e) => onUpdate(problem.titleSlug, { pattern: e.target.value })}>
          <option value="">Pattern</option>
          {patternOptions.map((pattern) => (
            <option key={pattern} value={pattern}>{pattern}</option>
          ))}
        </select>
        <div>
          <Save size={14} />
          <input
            value={note?.note || ""}
            onChange={(e) => onUpdate(problem.titleSlug, { note: e.target.value })}
            placeholder="Approach note, trick, or revision reminder"
          />
        </div>
      </div>
    </div>
  );
}
