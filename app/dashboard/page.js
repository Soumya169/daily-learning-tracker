"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Flame, CheckCircle2, Trophy, BookOpen, ChevronRight, Search, Filter, Trash2, Edit2, X, Save } from "lucide-react";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [progress, setProgress] = useState({ challengeType: 30, completedDays: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [eRes, pRes] = await Promise.all([
        fetch("/api/entries"),
        fetch("/api/progress"),
      ]);
      const eData = await eRes.json();
      const pData = await pRes.json();
      if (eData.success) setEntries(eData.data);
      if (pData.success) setProgress(pData.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function deleteEntry(id) {
    if (!confirm("Delete this entry?")) return;
    await fetch(`/api/entries/${id}`, { method: "DELETE" });
    fetchAll();
  }

  async function saveEdit(id) {
    await fetch(`/api/entries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editForm,
        timeSpent: Number(editForm.timeSpent) || 0,
        tags: editForm.tags ? editForm.tags.split(",").map(tag => tag.trim()) : []
      }),
    });
    setEditingEntry(null);
    fetchAll();
  }

  const topics = [...new Set(entries.map((e) => e.topic))];
  const filteredEntries = entries.filter((e) => {
    const matchSearch =
      !search ||
      e.topic.toLowerCase().includes(search.toLowerCase()) ||
      e.subtopic?.toLowerCase().includes(search.toLowerCase()) ||
      e.notes?.toLowerCase().includes(search.toLowerCase());
    const matchTopic = !filterTopic || e.topic === filterTopic;
    return matchSearch && matchTopic;
  });

  const completedCount = progress.completedDays?.length || 0;
  const challengeTotal = progress.challengeType || 30;
  const progressPct = Math.min(Math.round((completedCount / challengeTotal) * 100), 100);

  // Calculate streak
  const sortedDays = [...(progress.completedDays || [])].sort((a, b) => b - a);
  let streak = 0;
  for (let i = 0; i < sortedDays.length; i++) {
    if (i === 0 || sortedDays[i] === sortedDays[i - 1] - 1) streak++;
    else break;
  }

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 md:mb-8">
          <StatCard
            icon={<CheckCircle2 className="text-cyan-300" size={20} />}
            label="Days Completed"
            value={completedCount}
            sub={`out of ${challengeTotal}`}
            color="cyan"
          />
          <StatCard
            icon={<Flame className="text-violet-300" size={20} />}
            label="Current Streak"
            value={`${streak} day${streak !== 1 ? "s" : ""}`}
            sub="keep it up!"
            color="violet"
          />
          <StatCard
            icon={<Trophy className="text-fuchsia-300" size={20} />}
            label="Challenge"
            value={`${challengeTotal}-Day`}
            sub={`${progressPct}% done`}
            color="fuchsia"
          />
        </div>

        {/* Progress Bar */}
        <div className="glass-panel p-4 md:p-5 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <span className="text-sm font-medium text-slate-300">
              Challenge Progress — {completedCount}/{challengeTotal} Days
            </span>
            <span className="text-sm font-bold text-cyan-300">{progressPct}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>Start</span>
            <span>Day {Math.floor(challengeTotal / 2)}</span>
            <span>Day {challengeTotal}</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 md:mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="relative">
            <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="">All Topics</option>
              {topics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-500">Loading entries...</div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={40} className="mx-auto mb-3 text-slate-600" />
            <p className="text-slate-500">No entries yet. <a href="/add-entry" className="text-emerald-400 hover:underline">Add your first entry!</a></p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <div key={entry._id} className="glass-panel p-4 hover:border-cyan-300/40 transition-all">
                {editingEntry === entry._id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input className="input-field" value={editForm.topic || ""} onChange={e => setEditForm({...editForm, topic: e.target.value})} placeholder="Topic" />
                      <input className="input-field" value={editForm.subtopic || ""} onChange={e => setEditForm({...editForm, subtopic: e.target.value})} placeholder="Subtopic" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input className="input-field" type="number" value={editForm.timeSpent || ""} onChange={e => setEditForm({...editForm, timeSpent: e.target.value})} placeholder="Time spent (min)" />
                      <select className="input-field" value={editForm.difficulty || "medium"} onChange={e => setEditForm({...editForm, difficulty: e.target.value})}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <select className="input-field" value={editForm.mood || "neutral"} onChange={e => setEditForm({...editForm, mood: e.target.value})}>
                        <option value="frustrated">Frustrated</option>
                        <option value="neutral">Neutral</option>
                        <option value="satisfied">Satisfied</option>
                        <option value="excited">Excited</option>
                      </select>
                      <input className="input-field" value={editForm.tags || ""} onChange={e => setEditForm({...editForm, tags: e.target.value})} placeholder="Tags (comma separated)" />
                    </div>
                    <textarea className="input-field w-full resize-none" rows={2} value={editForm.notes || ""} onChange={e => setEditForm({...editForm, notes: e.target.value})} placeholder="Notes" />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button onClick={() => saveEdit(entry._id)} className="flex items-center justify-center gap-1 px-3 py-2 btn-primary text-sm"><Save size={14}/>Save</button>
                      <button onClick={() => setEditingEntry(null)} className="flex items-center justify-center gap-1 px-3 py-2 btn-secondary text-sm"><X size={14}/>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center">
                      <span className="text-cyan-300 font-bold text-xs sm:text-sm">D{entry.day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-1 sm:gap-2 mb-1">
                        <span className="font-semibold text-slate-100">{entry.topic}</span>
                        {entry.subtopic && (
                          <>
                            <ChevronRight size={12} className="text-slate-600 hidden sm:block" />
                            <span className="text-slate-400 text-sm">{entry.subtopic}</span>
                          </>
                        )}
                        {entry.timeSpent > 0 && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                            {entry.timeSpent}m
                          </span>
                        )}
                        <span className="text-xs text-slate-600 sm:ml-auto">
                          {new Date(entry.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      {entry.notes && <p className="text-slate-400 text-sm leading-relaxed mb-2">{entry.notes}</p>}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {entry.difficulty && (
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            entry.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                            entry.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {entry.difficulty}
                          </span>
                        )}
                        {entry.mood && entry.mood !== 'neutral' && (
                          <span className="text-slate-500">
                            {entry.mood === 'frustrated' ? '😞' :
                             entry.mood === 'satisfied' ? '🙂' :
                             entry.mood === 'excited' ? '🤩' : '😐'}
                          </span>
                        )}
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex gap-1">
                            {entry.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                            {entry.tags.length > 2 && (
                              <span className="text-slate-500 text-xs">+{entry.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 self-end sm:self-start">
                      <button onClick={() => { setEditingEntry(entry._id); setEditForm({
                        topic: entry.topic,
                        subtopic: entry.subtopic || '',
                        notes: entry.notes || '',
                        timeSpent: entry.timeSpent || '',
                        difficulty: entry.difficulty || 'medium',
                        mood: entry.mood || 'neutral',
                        tags: entry.tags ? entry.tags.join(', ') : ''
                      }); }} className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"><Edit2 size={14}/></button>
                      <button onClick={() => deleteEntry(entry._id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={14}/></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx global>{`
        .input-field {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 8px 12px;
          color: #e2e8f0;
          font-size: 14px;
          width: 100%;
          outline: none;
        }
        .input-field:focus { border-color: #10b981; }
      `}</style>
    </>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  const colors = {
    cyan: "border-cyan-500/20 bg-cyan-500/5",
    violet: "border-violet-500/20 bg-violet-500/5",
    fuchsia: "border-fuchsia-500/20 bg-fuchsia-500/5",
  };
  return (
    <div className={`border rounded-xl p-5 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-slate-400 text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-100">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{sub}</p>
    </div>
  );
}