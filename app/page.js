"use client";
import Link from "next/link";
import { ArrowRight, BookOpen, BarChart3, Target, TrendingUp, Clock, CheckCircle2, PlusCircle, Smartphone, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-cyan-500/10 bg-[#030714]/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 text-cyan-300 font-bold text-xl">
            <BookOpen size={24} />
            <span>LearnTracker</span>
          </Link>
          <nav className="flex items-center gap-4 md:gap-6">
            <Link href="/dashboard" className="btn-primary">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Track Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 block md:inline"> Learning Journey</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              A simple, powerful way to track your daily learning progress.
              Log your sessions, monitor your streak, and achieve your goals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-16 px-4">
            <Link href="/dashboard" className="btn-primary inline-flex items-center justify-center gap-2 text-base md:text-lg">
              Start Tracking Now
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto px-4">
            <PreviewCard
              icon={<PlusCircle className="text-cyan-300" size={24} />}
              title="Add Entries"
              description="Log your daily learning sessions with topics, time spent, and notes"
            />
            <PreviewCard
              icon={<BarChart3 className="text-violet-300" size={24} />}
              title="Track Progress"
              description="Visual progress tracking with streaks and completion rates"
            />
            <PreviewCard
              icon={<TrendingUp className="text-sky-300" size={24} />}
              title="View Analytics"
              description="Detailed insights into your learning patterns and habits"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Everything You Need to Track Learning</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
              Simple yet powerful features to keep you motivated and on track.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<Target className="text-emerald-400" size={32} />}
              title="Goal Setting"
              description="Set learning goals and track multiple challenges simultaneously."
            />
            <FeatureCard
              icon={<Clock className="text-blue-400" size={32} />}
              title="Time Tracking"
              description="Log time spent on each learning session to understand your habits."
            />
            <FeatureCard
              icon={<CheckCircle2 className="text-purple-400" size={32} />}
              title="Progress Monitoring"
              description="Visual progress bars and streak counters to keep you motivated."
            />
            <FeatureCard
              icon={<TrendingUp className="text-yellow-400" size={32} />}
              title="Detailed Analytics"
              description="Insights into your learning patterns, topics, and productivity."
            />
            <FeatureCard
              icon={<BookOpen className="text-pink-400" size={32} />}
              title="Topic Organization"
              description="Categorize your learning by topics and subtopics for better tracking."
            />
            <FeatureCard
              icon={<Smartphone className="text-cyan-400" size={32} />}
              title="Mobile Friendly"
              description="Access your learning tracker from any device, anywhere."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-300 text-sm md:text-base">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <StepCard
              number="1"
              title="Add Your First Entry"
              description="Log what you learned today - topic, time spent, and any notes."
            />
            <StepCard
              number="2"
              title="Track Daily Progress"
              description="Mark days complete and maintain your learning streak."
            />
            <StepCard
              number="3"
              title="Review & Analyze"
              description="Check your progress, view analytics, and set new goals."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-emerald-100 mb-6 md:mb-8 text-sm md:text-base max-w-2xl mx-auto">
            Build a visible record of what you complete each day, one focused session at a time.
          </p>
          <Link href="/dashboard" className="bg-white text-emerald-600 hover:bg-slate-100 px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all duration-200 inline-flex items-center gap-2 group">
            Start Tracking Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-4 border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-lg md:text-xl mb-4">
            <BookOpen size={20} />
            <span>LearnTracker</span>
          </div>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            A simple and effective way to track your learning progress and achieve your goals.
          </p>
          <div className="flex justify-center gap-6 text-sm text-slate-500">
            <span>Built with Next.js</span>
            <span>•</span>
            <span>Open Source</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PreviewCard({ icon, title, description }) {
  return (
    <div className="glass-panel p-4 md:p-6 text-center transition-all duration-300 hover:border-cyan-300/40">
      <div className="mb-3 flex justify-center">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass-panel p-4 md:p-6 hover:border-violet-300/40 transition-all duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm md:text-base">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-600 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold text-white mb-4 mx-auto">
        {number}
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm md:text-base">{description}</p>
    </div>
  );
}
