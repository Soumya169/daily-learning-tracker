"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Target, Plus, CheckSquare, Square, Edit2, Trash2, Save, X, Calendar, Trophy } from "lucide-react";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetDays: "",
    category: "",
    priority: "medium",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  async function fetchGoals() {
    setLoading(true);
    try {
      const res = await fetch("/api/goals");
      const data = await res.json();
      if (data.success) setGoals(data.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function saveGoal() {
    try {
      const method = editingGoal ? "PUT" : "POST";
      const url = editingGoal ? `/api/goals/${editingGoal._id}` : "/api/goals";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          targetDays: Number(form.targetDays),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setEditingGoal(null);
        setForm({
          title: "",
          description: "",
          targetDays: "",
          category: "",
          priority: "medium",
          startDate: new Date().toISOString().split("T")[0],
          endDate: "",
        });
        fetchGoals();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteGoal(id) {
    if (!confirm("Delete this goal?")) return;
    await fetch(`/api/goals/${id}`, { method: "DELETE" });
    fetchGoals();
  }

  function toggleDay(goalId, day) {
    const goal = goals.find(g => g._id === goalId);
    const completedDays = goal.completedDays || [];
    const updated = completedDays.includes(day)
      ? completedDays.filter(d => d !== day)
      : [...completedDays, day];

    fetch(`/api/goals/${goalId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completedDays: updated }),
    }).then(() => fetchGoals());
  }

  const activeGoals = goals.filter(g => g.status === "active");
  const completedGoals = goals.filter(g => g.status === "completed");

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mb-1">Learning Goals</h1>
            <p className="text-slate-400">Set and track multiple learning challenges</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            New Goal
          </button>
        </div>

        {/* Goal Form */}
        {showForm && (
          <div className="glass-panel p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">
              {editingGoal ? "Edit Goal" : "Create New Goal"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                  placeholder="e.g. Learn React in 30 days"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Target Days *</label>
                <input
                  type="number"
                  value={form.targetDays}
                  onChange={e => setForm({...form, targetDays: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                  placeholder="30"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                  placeholder="e.g. Programming, Design"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                <select
                  value={form.priority}
                  onChange={e => setForm({...form, priority: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm({...form, startDate: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">End Date (Optional)</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={e => setForm({...form, endDate: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 resize-none"
                placeholder="Describe your goal and what you hope to achieve..."
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveGoal}
                className="btn-primary flex items-center gap-2"
              >
                <Save size={16} />
                {editingGoal ? "Update" : "Create"} Goal
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingGoal(null);
                  setForm({
                    title: "",
                    description: "",
                    targetDays: "",
                    category: "",
                    priority: "medium",
                    startDate: new Date().toISOString().split("T")[0],
                    endDate: "",
                  });
                }}
                className="btn-secondary flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Active Goals */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Target size={20} className="text-emerald-400" />
            Active Goals ({activeGoals.length})
          </h2>
          {loading ? (
            <div className="text-center py-8 text-slate-500">Loading goals...</div>
          ) : activeGoals.length === 0 ? (
            <div className="text-center py-8">
              <Target size={40} className="mx-auto mb-3 text-slate-600" />
              <p className="text-slate-500">No active goals yet. Create your first goal!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeGoals.map(goal => (
                <GoalCard
                  key={goal._id}
                  goal={goal}
                  onToggleDay={toggleDay}
                  onEdit={() => {
                    setEditingGoal(goal);
                    setForm({
                      title: goal.title,
                      description: goal.description || "",
                      targetDays: goal.targetDays,
                      category: goal.category || "",
                      priority: goal.priority || "medium",
                      startDate: new Date(goal.startDate).toISOString().split("T")[0],
                      endDate: goal.endDate ? new Date(goal.endDate).toISOString().split("T")[0] : "",
                    });
                    setShowForm(true);
                  }}
                  onDelete={() => deleteGoal(goal._id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-yellow-400" />
              Completed Goals ({completedGoals.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedGoals.map(goal => (
                <GoalCard
                  key={goal._id}
                  goal={goal}
                  onToggleDay={toggleDay}
                  onEdit={() => {
                    setEditingGoal(goal);
                    setForm({
                      title: goal.title,
                      description: goal.description || "",
                      targetDays: goal.targetDays,
                      category: goal.category || "",
                      priority: goal.priority || "medium",
                      startDate: new Date(goal.startDate).toISOString().split("T")[0],
                      endDate: goal.endDate ? new Date(goal.endDate).toISOString().split("T")[0] : "",
                    });
                    setShowForm(true);
                  }}
                  onDelete={() => deleteGoal(goal._id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function GoalCard({ goal, onToggleDay, onEdit, onDelete }) {
  const completedCount = goal.completedDays?.length || 0;
  const progressPct = Math.min(Math.round((completedCount / goal.targetDays) * 100), 100);
  const isCompleted = completedCount >= goal.targetDays;

  const priorityColors = {
    low: "text-blue-400 bg-blue-500/20",
    medium: "text-yellow-400 bg-yellow-500/20",
    high: "text-red-400 bg-red-500/20"
  };

  return (
    <div className={`bg-slate-800/60 border rounded-xl p-6 ${isCompleted ? 'border-yellow-500/30' : 'border-slate-700/50'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-slate-100">{goal.title}</h3>
            {isCompleted && <Trophy size={16} className="text-yellow-400" />}
          </div>
          {goal.description && (
            <p className="text-slate-400 text-sm mb-3">{goal.description}</p>
          )}
          <div className="flex items-center gap-3 mb-3">
            {goal.category && (
              <span className="text-xs bg-slate-700 text-slate-400 px-2 py-1 rounded">
                {goal.category}
              </span>
            )}
            <span className={`text-xs px-2 py-1 rounded ${priorityColors[goal.priority || 'medium']}`}>
              {goal.priority || 'medium'} priority
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={onEdit} className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-700 rounded-lg">
            <Edit2 size={14} />
          </button>
          <button onClick={onDelete} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-400">Progress</span>
          <span className="text-sm font-medium text-slate-200">{completedCount}/{goal.targetDays} days</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden mb-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-yellow-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="text-right text-xs text-slate-500">{progressPct}% complete</div>
      </div>

      {/* Day Grid */}
      <div>
        <div className="text-sm text-slate-400 mb-2">Mark days complete:</div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: Math.min(goal.targetDays, 35) }, (_, i) => i + 1).map(day => {
            const isDone = goal.completedDays?.includes(day);
            return (
              <button
                key={day}
                onClick={() => onToggleDay(goal._id, day)}
                className={`aspect-square rounded text-xs font-semibold flex items-center justify-center border transition-all ${
                  isDone
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
        {goal.targetDays > 35 && (
          <div className="text-xs text-slate-500 mt-2">
            Showing first 35 days of {goal.targetDays} total days
          </div>
        )}
      </div>
    </div>
  );
}