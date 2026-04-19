'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';

const EXAMS = [
  { id: '1', title: 'Mathematics — Mid Term',   due: 'Apr 22, 2026', status: 'upcoming',   score: null  },
  { id: '2', title: 'Physics — Unit 3 Test',    due: 'Apr 18, 2026', status: 'completed',  score: 87   },
  { id: '3', title: 'Chemistry — Lab Quiz',     due: 'Apr 15, 2026', status: 'completed',  score: 72   },
  { id: '4', title: 'Biology — Chapter 5',      due: 'Apr 28, 2026', status: 'upcoming',   score: null  },
];

const STATS = [
  { label: 'Exams Taken',      value: '12', delta: '+2 this month',   color: 'teal'   },
  { label: 'Average Score',    value: '81%', delta: '+3% vs last term', color: 'violet' },
  { label: 'Upcoming Exams',   value: '2',  delta: 'Next: Apr 22',    color: 'amber'  },
  { label: 'Rank (School)',     value: '#7', delta: 'Top 15%',         color: 'sky'    },
];

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">

      {/* Welcome */}
      <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand-light to-white p-6 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Student Dashboard</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Hello, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track your exams, results, and performance all in one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* My Exams */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">My Exams</h2>
          <Link href="/dashboard/exams" className="text-xs font-medium text-brand hover:underline">
            View all →
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Exam</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Due</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Score</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {EXAMS.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">{exam.title}</td>
                  <td className="px-5 py-3.5 text-slate-500">{exam.due}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={exam.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-slate-900">
                    {exam.score !== null ? `${exam.score}%` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {exam.status === 'upcoming' ? (
                      <Link
                        href={`/exam/${exam.id}`}
                        className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-hover"
                      >
                        Start
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/results/${exam.id}`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand hover:text-brand"
                      >
                        Review
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Performance strip */}
      <section>
        <h2 className="mb-4 text-base font-semibold text-slate-900">Recent Performance</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ScoreCard label="Physics — Unit 3" score={87} max={100} color="bg-brand" />
          <ScoreCard label="Chemistry — Lab Quiz" score={72} max={100} color="bg-violet-500" />
          <ScoreCard label="Biology — CH 4" score={94} max={100} color="bg-sky-500" />
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, delta, color }) {
  const colors = {
    teal:   { bg: 'bg-teal-50',   text: 'text-teal-600'   },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-600'  },
    sky:    { bg: 'bg-sky-50',    text: 'text-sky-600'    },
  };
  const c = colors[color] ?? colors.teal;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-700">{label}</p>
      <p className="mt-1 text-xs text-slate-400">{delta}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'upcoming')
    return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Upcoming</span>;
  if (status === 'completed')
    return <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">Completed</span>;
  return <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{status}</span>;
}

function ScoreCard({ label, score, max, color }) {
  const pct = Math.round((score / max) * 100);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="mb-3 text-sm font-medium text-slate-700 truncate">{label}</p>
      <div className="mb-1.5 flex items-end justify-between">
        <span className="text-2xl font-bold text-slate-900">{score}</span>
        <span className="text-sm text-slate-400">/ {max}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
