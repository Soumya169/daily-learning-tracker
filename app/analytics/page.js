"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { BarChart3, Clock, TrendingUp, Target, Calendar, Award, BookOpen, Zap } from "lucide-react";

export default function AnalyticsPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    setLoading(true);
    try {
      const res = await fetch("/api/entries");
      const data = await res.json();
      if (data.success) setEntries(data.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  // Calculate analytics
  const totalEntries = entries.length;
  const totalTime = entries.reduce((sum, entry) => sum + (entry.timeSpent || 0), 0);
  const avgTimePerSession = totalEntries > 0 ? Math.round(totalTime / totalEntries) : 0;
  const longestSession = entries.length > 0 ? Math.max(...entries.map((e) => e.timeSpent || 0)) : 0;
  const percent = (count) => (totalEntries > 0 ? `${Math.round((count / totalEntries) * 100)}%` : "0%");

  // Topic distribution
  const topicStats = entries.reduce((acc, entry) => {
    acc[entry.topic] = (acc[entry.topic] || 0) + 1;
    return acc;
  }, {});

  const topTopics = Object.entries(topicStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Difficulty distribution
  const difficultyStats = entries.reduce((acc, entry) => {
    acc[entry.difficulty || 'medium'] = (acc[entry.difficulty || 'medium'] || 0) + 1;
    return acc;
  }, { easy: 0, medium: 0, hard: 0 });

  // Mood distribution
  const moodStats = entries.reduce((acc, entry) => {
    acc[entry.mood || 'neutral'] = (acc[entry.mood || 'neutral'] || 0) + 1;
    return acc;
  }, { frustrated: 0, neutral: 0, satisfied: 0, excited: 0 });

  // Weekly activity
  const weeklyStats = entries.reduce((acc, entry) => {
    const date = new Date(entry.date);
    const weekKey = `${date.getFullYear()}-W${Math.ceil((date.getDate() - date.getDay() + 1) / 7)}`;
    acc[weekKey] = (acc[weekKey] || 0) + 1;
    return acc;
  }, {});

  const recentWeeks = Object.entries(weeklyStats)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 4);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16 text-slate-500">Loading analytics...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2">Learning Analytics</h1>
          <p className="text-slate-400 text-sm md:text-base">Insights into your learning journey and progress</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <MetricCard
            icon={<BookOpen className="text-emerald-400" size={24} />}
            title="Total Entries"
            value={totalEntries}
            subtitle="Learning sessions"
          />
          <MetricCard
            icon={<Clock className="text-blue-400" size={24} />}
            title="Total Time"
            value={`${Math.round(totalTime / 60)}h ${totalTime % 60}m`}
            subtitle="Time invested"
          />
          <MetricCard
            icon={<Target className="text-purple-400" size={24} />}
            title="Avg Session"
            value={`${avgTimePerSession}m`}
            subtitle="Per learning session"
          />
          <MetricCard
            icon={<Award className="text-yellow-400" size={24} />}
            title="Topics Covered"
            value={Object.keys(topicStats).length}
            subtitle="Different subjects"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Topic Distribution */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-cyan-300" />
              Top Topics
            </h2>
            <div className="space-y-3">
              {topTopics.length === 0 ? (
                <EmptyMetric message="Add entries to see your strongest topics." />
              ) : topTopics.map(([topic, count], index) => (
                <div key={topic} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-cyan-500/15 text-cyan-200 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-slate-200 font-medium">{topic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-900 rounded-full h-2">
                      <div
                        className="bg-cyan-400 h-2 rounded-full"
                        style={{ width: percent(count) }}
                      />
                    </div>
                    <span className="text-slate-400 text-sm w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Distribution */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-violet-300" />
              Difficulty Levels
            </h2>
            <div className="space-y-4">
              {Object.entries(difficultyStats).map(([level, count]) => {
                const colors = {
                  easy: "bg-green-500",
                  medium: "bg-yellow-500",
                  hard: "bg-red-500"
                };
                const percentages = {
                  easy: "text-green-400",
                  medium: "text-yellow-400",
                  hard: "text-red-400"
                };
                return (
                  <div key={level} className="flex items-center justify-between">
                    <span className="text-slate-200 capitalize">{level}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-16 bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colors[level]}`}
                          style={{ width: percent(count) }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${percentages[level]} w-12 text-right`}>
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mood Distribution */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Zap size={20} className="text-cyan-300" />
              Learning Mood
            </h2>
            <div className="space-y-4">
              {Object.entries(moodStats).map(([mood, count]) => {
                const colors = {
                  frustrated: "bg-rose-500",
                  neutral: "bg-slate-500",
                  satisfied: "bg-sky-400",
                  excited: "bg-cyan-400"
                };
                const emojis = {
                  frustrated: "😞",
                  neutral: "😐",
                  satisfied: "🙂",
                  excited: "🤩"
                };
                return (
                  <div key={mood} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{emojis[mood]}</span>
                      <span className="text-slate-200 capitalize">{mood}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colors[mood]}`}
                          style={{ width: percent(count) }}
                        />
                      </div>
                      <span className="text-slate-400 text-sm w-8 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Activity */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-sky-300" />
              Weekly Activity
            </h2>
            <div className="space-y-3">
              {recentWeeks.length === 0 ? (
                <EmptyMetric message="Weekly activity appears after your first saved entry." />
              ) : recentWeeks.map(([week, count]) => (
                <div key={week} className="flex items-center justify-between">
                  <span className="text-slate-200 text-sm">{week}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(Math.min(count, 7))].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-cyan-300 rounded-full" />
                      ))}
                    </div>
                    <span className="text-slate-400 text-sm w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Insights */}
        <div className="mt-8 glass-panel p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Recent Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InsightCard
              title="Most Productive Day"
              value={getMostProductiveDay(entries)}
              icon={<Award className="text-yellow-400" size={20} />}
            />
            <InsightCard
              title="Longest Session"
              value={`${longestSession} minutes`}
              icon={<Clock className="text-blue-400" size={20} />}
            />
            <InsightCard
              title="Current Streak"
              value={`${calculateStreak(entries)} days`}
              icon={<TrendingUp className="text-emerald-400" size={20} />}
            />
          </div>
        </div>
      </main>
    </>
  );
}

function MetricCard({ icon, title, value, subtitle }) {
  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <div>
          <p className="text-2xl font-bold text-slate-100">{value}</p>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>
      </div>
      <p className="text-slate-300 font-medium">{title}</p>
    </div>
  );
}

function InsightCard({ title, value, icon }) {
  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-slate-300 text-sm font-medium">{title}</span>
      </div>
      <p className="text-slate-100 font-semibold">{value}</p>
    </div>
  );
}

function EmptyMetric({ message }) {
  return (
    <p className="rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-4 text-sm text-slate-500">
      {message}
    </p>
  );
}

function getMostProductiveDay(entries) {
  const dayStats = entries.reduce((acc, entry) => {
    const day = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const mostProductive = Object.entries(dayStats).sort(([,a], [,b]) => b - a)[0];
  return mostProductive ? `${mostProductive[0]} (${mostProductive[1]} sessions)` : 'No data';
}

function calculateStreak(entries) {
  if (entries.length === 0) return 0;

  const sortedEntries = entries
    .map(entry => new Date(entry.date).toDateString())
    .filter((date, index, arr) => arr.indexOf(date) === index)
    .sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  const today = new Date().toDateString();

  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i]);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (entryDate.toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
