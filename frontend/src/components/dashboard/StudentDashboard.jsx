'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import { useExams } from '@/lib/hooks/useExams';
import { useAttempts } from '@/lib/hooks/useAttempts';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { exams, fetchAll: fetchExams } = useExams();
  const { attempts, fetchMine } = useAttempts();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchExams(), fetchMine()]).catch(() => {}).finally(() => setLoading(false));
  }, [fetchExams, fetchMine]);

  const attemptMap = {};
  attempts.forEach((a) => { attemptMap[a.examId] = a; });

  const completed = attempts.length;
  const upcoming = exams.filter((e) => !attemptMap[e.id]);
  const avgScore = completed > 0
    ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / completed)
    : 0;

  const stats = [
    { label: 'Exams Taken',    value: String(completed), color: 'teal'   },
    { label: 'Average Score',  value: `${avgScore}%`,    color: 'violet' },
    { label: 'Upcoming Exams', value: String(upcoming.length), color: 'amber' },
    { label: 'Total Exams',    value: String(exams.length),    color: 'sky'   },
  ];

  if (loading) return <Skeleton />;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand-light to-white p-6 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Student Dashboard</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Hello, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="mt-1 text-sm text-slate-500">Track your exams, results, and performance all in one place.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">My Exams</h2>
          <Link href="/dashboard/exams" className="text-xs font-medium text-brand hover:underline">View all →</Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Exam</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Duration</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Score</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exams.map((exam) => {
                const attempt = attemptMap[exam.id];
                return (
                  <tr key={exam.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{exam.title}</td>
                    <td className="px-5 py-3.5 text-slate-500">{exam.duration} min</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={attempt ? 'completed' : 'upcoming'} />
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-slate-900">
                      {attempt ? `${attempt.score}` : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {!attempt ? (
                        <Link href={`/exam/${exam.id}`} className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-hover">Start</Link>
                      ) : (
                        <Link href={`/dashboard/results/${exam.id}`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand hover:text-brand">Review</Link>
                      )}
                    </td>
                  </tr>
                );
              })}
              {exams.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-400">No exams available yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {attempts.length > 0 && (
        <section>
          <h2 className="mb-4 text-base font-semibold text-slate-900">Recent Performance</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {attempts.slice(0, 3).map((a) => {
              const exam = exams.find((e) => e.id === a.examId);
              return <ScoreCard key={a.id} label={exam?.title ?? a.examId} score={a.score} max={exam?.totalMarks ?? 100} color="bg-brand" />;
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-28 rounded-2xl bg-slate-100" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[1,2,3,4].map(i=><div key={i} className="h-24 rounded-xl bg-slate-100" />)}</div>
      <div className="h-48 rounded-xl bg-slate-100" />
    </div>
  );
}

function StatCard({ label, value, color }) {
  const c = { teal:'text-teal-600', violet:'text-violet-600', amber:'text-amber-600', sky:'text-sky-600' }[color] ?? 'text-slate-700';
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className={`text-2xl font-bold ${c}`}>{value}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-700">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'upcoming') return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Upcoming</span>;
  return <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">Completed</span>;
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
