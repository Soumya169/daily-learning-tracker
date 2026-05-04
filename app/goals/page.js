"use client";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  AlertCircle,
  Calendar,
  Check,
  ClipboardList,
  Edit2,
  Flag,
  Plus,
  Save,
  Target,
  Trash2,
  Trophy,
  X,
} from "lucide-react";

const blankGoal = {
  title: "",
  description: "",
  targetDays: "",
  category: "",
  priority: "medium",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
};

const priorityTone = {
  low: "goal-priority-low",
  medium: "goal-priority-medium",
  high: "goal-priority-high",
};

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [togglingDay, setTogglingDay] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState(blankGoal);

  useEffect(() => {
    fetchGoals();
  }, []);

  async function fetchGoals() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/goals", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Unable to load goals.");
      setGoals(data.data || []);
    } catch (err) {
      setError(err.message || "Unable to load goals.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(blankGoal);
    setEditingGoal(null);
    setShowForm(false);
    setError("");
  }

  function openCreateForm() {
    setForm(blankGoal);
    setEditingGoal(null);
    setShowForm(true);
    setError("");
  }

  function openEditForm(goal) {
    setEditingGoal(goal);
    setForm({
      title: goal.title || "",
      description: goal.description || "",
      targetDays: String(goal.targetDays || ""),
      category: goal.category || "",
      priority: goal.priority || "medium",
      startDate: goal.startDate ? new Date(goal.startDate).toISOString().split("T")[0] : blankGoal.startDate,
      endDate: goal.endDate ? new Date(goal.endDate).toISOString().split("T")[0] : "",
    });
    setShowForm(true);
    setError("");
  }

  async function saveGoal(e) {
    e.preventDefault();
    const targetDays = Number(form.targetDays);
    if (!form.title.trim() || !Number.isInteger(targetDays) || targetDays < 1) {
      setError("Add a goal title and a positive target day count.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const method = editingGoal ? "PUT" : "POST";
      const url = editingGoal ? `/api/goals/${editingGoal._id}` : "/api/goals";
      const payload = {
        ...form,
        title: form.title.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        targetDays,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Unable to save goal.");

      resetForm();
      await fetchGoals();
    } catch (err) {
      setError(err.message || "Unable to save goal right now.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteGoal(id) {
    if (!confirm("Delete this goal?")) return;
    setError("");
    try {
      const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Unable to delete goal.");
      await fetchGoals();
    } catch (err) {
      setError(err.message || "Unable to delete goal.");
    }
  }

  async function toggleDay(goal, day) {
    const key = `${goal._id}-${day}`;
    const completedDays = goal.completedDays || [];
    const updated = completedDays.includes(day)
      ? completedDays.filter((d) => d !== day)
      : [...completedDays, day];

    setTogglingDay(key);
    setError("");
    try {
      const res = await fetch(`/api/goals/${goal._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completedDays: updated }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Unable to update goal.");
      setGoals((current) => current.map((item) => (item._id === goal._id ? data.data : item)));
    } catch (err) {
      setError(err.message || "Unable to update goal.");
    } finally {
      setTogglingDay("");
    }
  }

  const stats = useMemo(() => {
    const active = goals.filter((goal) => goal.status !== "completed");
    const completed = goals.filter((goal) => goal.status === "completed");
    const markedDays = goals.reduce((sum, goal) => sum + (goal.completedDays?.length || 0), 0);
    return { active, completed, markedDays };
  }, [goals]);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="goal-hero">
          <div>
            <p className="section-heading">Challenge board</p>
            <h1 className="goal-title">Choose the promises you can see every day.</h1>
            <p className="goal-copy">
              Keep each learning challenge small enough to touch, clear enough to finish, and visible enough to believe.
            </p>
          </div>
          <button onClick={openCreateForm} className="btn-primary goal-new-button">
            <Plus size={18} />
            New Goal
          </button>
        </section>

        <section className="goal-strip" aria-label="Goal summary">
          <SummaryTile icon={<Target size={18} />} label="Active" value={stats.active.length} />
          <SummaryTile icon={<Check size={18} />} label="Marked Days" value={stats.markedDays} />
          <SummaryTile icon={<Trophy size={18} />} label="Finished" value={stats.completed.length} />
        </section>

        {error && (
          <div className="goal-alert">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {showForm && (
          <form onSubmit={saveGoal} className="goal-form">
            <div className="goal-form-header">
              <div>
                <p className="section-heading">{editingGoal ? "Refine challenge" : "New challenge"}</p>
                <h2>{editingGoal ? "Edit your goal" : "Create a visible target"}</h2>
              </div>
              <button type="button" onClick={resetForm} className="icon-button" aria-label="Close goal form">
                <X size={18} />
              </button>
            </div>

            <div className="goal-form-grid">
              <Field label="Title" required>
                <input
                  className="input-field"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="DSA streak, React fundamentals, English speaking..."
                />
              </Field>
              <Field label="Target Days" required>
                <input
                  className="input-field"
                  type="number"
                  min="1"
                  max="365"
                  value={form.targetDays}
                  onChange={(e) => setForm({ ...form, targetDays: e.target.value })}
                  placeholder="30"
                />
              </Field>
              <Field label="Category">
                <input
                  className="input-field"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Programming, aptitude, language..."
                />
              </Field>
              <Field label="Priority">
                <select
                  className="input-field"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </Field>
              <Field label="Start Date">
                <input
                  className="input-field"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </Field>
              <Field label="End Date">
                <input
                  className="input-field"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </Field>
            </div>

            <Field label="Why this matters">
              <textarea
                className="input-field goal-textarea"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="One sentence that reminds you why this challenge is worth finishing."
              />
            </Field>

            <div className="goal-form-actions">
              <button type="submit" disabled={saving} className="btn-primary">
                <Save size={16} />
                {saving ? "Saving..." : editingGoal ? "Update Goal" : "Create Goal"}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        )}

        <section className="goal-section">
          <div className="goal-section-heading">
            <div>
              <p className="section-heading">In progress</p>
              <h2>Active goals</h2>
            </div>
            <span>{stats.active.length}</span>
          </div>

          {loading ? (
            <div className="goal-empty">Loading your goals...</div>
          ) : stats.active.length === 0 ? (
            <EmptyState onCreate={openCreateForm} />
          ) : (
            <div className="goal-list">
              {stats.active.map((goal) => (
                <GoalCard
                  key={goal._id}
                  goal={goal}
                  togglingDay={togglingDay}
                  onToggleDay={toggleDay}
                  onEdit={openEditForm}
                  onDelete={deleteGoal}
                />
              ))}
            </div>
          )}
        </section>

        {stats.completed.length > 0 && (
          <section className="goal-section">
            <div className="goal-section-heading">
              <div>
                <p className="section-heading">Evidence</p>
                <h2>Completed goals</h2>
              </div>
              <span>{stats.completed.length}</span>
            </div>
            <div className="goal-list">
              {stats.completed.map((goal) => (
                <GoalCard
                  key={goal._id}
                  goal={goal}
                  togglingDay={togglingDay}
                  onToggleDay={toggleDay}
                  onEdit={openEditForm}
                  onDelete={deleteGoal}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function SummaryTile({ icon, label, value }) {
  return (
    <div className="summary-tile">
      <div>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="goal-field">
      <span>
        {label}
        {required && <b>*</b>}
      </span>
      {children}
    </label>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="goal-empty">
      <ClipboardList size={36} />
      <h3>No active goals yet</h3>
      <p>Create one challenge you can check every day.</p>
      <button onClick={onCreate} className="btn-primary">
        <Plus size={16} />
        Create Goal
      </button>
    </div>
  );
}

function GoalCard({ goal, togglingDay, onToggleDay, onEdit, onDelete }) {
  const completedDays = goal.completedDays || [];
  const targetDays = Math.max(Number(goal.targetDays) || 1, 1);
  const completedCount = completedDays.length;
  const progressPct = Math.min(Math.round((completedCount / targetDays) * 100), 100);
  const isCompleted = goal.status === "completed" || completedCount >= targetDays;
  const daysLeft = Math.max(targetDays - completedCount, 0);
  const startDate = goal.startDate ? new Date(goal.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "No start";
  const endDate = goal.endDate ? new Date(goal.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Open";

  return (
    <article className={`goal-card ${isCompleted ? "goal-card-done" : ""}`}>
      <div className="goal-card-top">
        <div className="goal-icon">
          {isCompleted ? <Trophy size={18} /> : <Flag size={18} />}
        </div>
        <div className="goal-card-title">
          <h3>{goal.title}</h3>
          <div className="goal-meta">
            {goal.category && <span>{goal.category}</span>}
            <span className={priorityTone[goal.priority || "medium"]}>{goal.priority || "medium"} priority</span>
          </div>
        </div>
        <div className="goal-actions">
          <button onClick={() => onEdit(goal)} className="icon-button" aria-label={`Edit ${goal.title}`}>
            <Edit2 size={15} />
          </button>
          <button onClick={() => onDelete(goal._id)} className="icon-button danger" aria-label={`Delete ${goal.title}`}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {goal.description && <p className="goal-description">{goal.description}</p>}

      <div className="goal-facts">
        <span><Calendar size={14} /> {startDate} to {endDate}</span>
        <span>{daysLeft === 0 ? "Finished" : `${daysLeft} days left`}</span>
      </div>

      <div className="goal-progress-row">
        <strong>{completedCount}/{targetDays}</strong>
        <span>{progressPct}% complete</span>
      </div>
      <div className="goal-progress-track">
        <div style={{ width: `${progressPct}%` }} />
      </div>

      <div className="goal-day-grid" style={{ "--goal-days": Math.min(targetDays, 12) }}>
        {Array.from({ length: targetDays }, (_, i) => i + 1).map((day) => {
          const isDone = completedDays.includes(day);
          const key = `${goal._id}-${day}`;
          return (
            <button
              key={day}
              onClick={() => onToggleDay(goal, day)}
              disabled={togglingDay === key}
              title={`Day ${day}`}
              className={isDone ? "done" : ""}
            >
              {isDone ? <Check size={13} /> : day}
            </button>
          );
        })}
      </div>
    </article>
  );
}
