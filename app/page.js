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
      body: JSON.stringify(editForm),
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
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<CheckCircle2 className="text-emerald-400" size={22} />}
            label="Days Completed"
            value={completedCount}
            sub={`out of ${challengeTotal}`}
            color="emerald"
          />
          <StatCard
            icon={<Flame className="text-orange-400" size={22} />}
            label="Current Streak"
            value={`${streak} day${streak !== 1 ? "s" : ""}`}
            sub="keep it up!"
            color="orange"
          />
          <StatCard
            icon={<Trophy className="text-yellow-400" size={22} />}
            label="Challenge"
            value={`${challengeTotal}-Day`}
            sub={`${progressPct}% done`}
            color="yellow"
          />
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-slate-300">
              Challenge Progress — {completedCount}/{challengeTotal} Days
            </span>
            <span className="text-sm font-bold text-emerald-400">{progressPct}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>Start</span>
            <span>Day {Math.floor(challengeTotal / 2)}</span>
            <span>Day {challengeTotal}</span>
          </div>
        </div>

        {/* Entries Section */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="relative">
            <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
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
              <div key={entry._id} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all">
                {editingEntry === entry._id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input className="input-field" value={editForm.topic || ""} onChange={e => setEditForm({...editForm, topic: e.target.value})} placeholder="Topic" />
                      <input className="input-field" value={editForm.subtopic || ""} onChange={e => setEditForm({...editForm, subtopic: e.target.value})} placeholder="Subtopic" />
                    </div>
                    <textarea className="input-field w-full resize-none" rows={2} value={editForm.notes || ""} onChange={e => setEditForm({...editForm, notes: e.target.value})} placeholder="Notes" />
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(entry._id)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm"><Save size={14}/>Save</button>
                      <button onClick={() => setEditingEntry(null)} className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm"><X size={14}/>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-emerald-400 font-bold text-sm">D{entry.day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-100">{entry.topic}</span>
                        {entry.subtopic && (
                          <>
                            <ChevronRight size={14} className="text-slate-600" />
                            <span className="text-slate-400 text-sm">{entry.subtopic}</span>
                          </>
                        )}
                        <span className="text-xs text-slate-600 ml-auto">
                          {new Date(entry.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      {entry.notes && <p className="text-slate-400 text-sm leading-relaxed">{entry.notes}</p>}
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingEntry(entry._id); setEditForm({ topic: entry.topic, subtopic: entry.subtopic, notes: entry.notes }); }} className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"><Edit2 size={14}/></button>
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
    emerald: "border-emerald-500/20 bg-emerald-500/5",
    orange: "border-orange-500/20 bg-orange-500/5",
    yellow: "border-yellow-500/20 bg-yellow-500/5",
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
