'use client';

import { useEffect, useState } from 'react';
import { useAttempts } from '@/lib/hooks/useAttempts';
import { useExams } from '@/lib/hooks/useExams';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout><AnalyticsContent /></DashboardLayout>
    </ProtectedRoute>
  );
}

function AnalyticsContent() {
  const { attempts, fetchMine } = useAttempts();
  const { exams, fetchAll: fetchExams } = useExams();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([fetchMine(), fetchExams()]).catch(() => {}).finally(() => setLoaded(true));
  }, [fetchMine, fetchExams]);

  if (!loaded) return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />;

  const examMap = Object.fromEntries(exams.map((e) => [e.id, e]));
  const totalAttempts = attempts.length;
  const avgScore = totalAttempts > 0 ? (attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts).toFixed(1) : 0;

  const scores = attempts.map((a) => {
    const exam = examMap[a.examId];
    return exam ? Math.round((a.score / exam.totalMarks) * 100) : 0;
  });
  const bestPct = scores.length > 0 ? Math.max(...scores) : 0;
  const passed = scores.filter((s) => s >= 40).length;

  const kpis = [
    { label: 'Total Attempts', value: totalAttempts, color: 'text-brand' },
    { label: 'Avg Score', value: avgScore, color: 'text-teal-600' },
    { label: 'Best %', value: `${bestPct}%`, color: 'text-green-600' },
    { label: 'Pass Rate', value: totalAttempts > 0 ? `${Math.round((passed / totalAttempts) * 100)}%` : '—', color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="mt-0.5 text-sm font-medium text-slate-700">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Score distribution bars */}
      <section>
        <h2 className="mb-4 text-base font-semibold text-slate-900">Score Distribution</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {attempts.map((a) => {
            const exam = examMap[a.examId];
            const pct = exam ? Math.round((a.score / exam.totalMarks) * 100) : 0;
            return (
              <div key={a.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-sm font-medium text-slate-700 truncate">{exam?.title ?? a.examId}</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full ${pct >= 60 ? 'bg-green-500' : pct >= 40 ? 'bg-amber-400' : 'bg-red-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">{a.score}/{exam?.totalMarks ?? '?'} ({pct}%)</p>
              </div>
            );
          })}
          {attempts.length === 0 && <p className="col-span-full py-10 text-center text-sm text-slate-400">Take some exams to see analytics.</p>}
        </div>
      </section>
    </div>
  );
}
