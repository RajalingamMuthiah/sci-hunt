'use client';

import { useEffect, useState } from 'react';
import { useExams } from '@/lib/hooks/useExams';
import { useAttempts } from '@/lib/hooks/useAttempts';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout><ReportsContent /></DashboardLayout>
    </ProtectedRoute>
  );
}

function ReportsContent() {
  const { exams, fetchAll: fetchExams } = useExams();
  const [examAttempts, setExamAttempts] = useState({});
  const { fetchByExam } = useAttempts();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchExams()
      .then(async (data) => {
        const map = {};
        for (const e of data) {
          try {
            const attempts = await fetchByExam(e.id);
            map[e.id] = attempts;
          } catch { map[e.id] = []; }
        }
        setExamAttempts(map);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [fetchExams, fetchByExam]);

  if (!loaded) return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Reports</h1>

      {exams.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">No exams to report on.</p>
      ) : (
        <div className="grid gap-4">
          {exams.map((e) => {
            const attempts = examAttempts[e.id] ?? [];
            const avgScore = attempts.length > 0 ? (attempts.reduce((s, a) => s + a.score, 0) / attempts.length).toFixed(1) : '—';
            const highest = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : '—';
            return (
              <div key={e.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{e.title}</h3>
                  <span className="text-xs text-slate-400">{e.duration} min · {e.totalMarks} marks</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-brand">{attempts.length}</p>
                    <p className="text-xs text-slate-500">Attempts</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-teal-600">{avgScore}</p>
                    <p className="text-xs text-slate-500">Avg Score</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-green-600">{highest}</p>
                    <p className="text-xs text-slate-500">Highest</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
