'use client';

import { useEffect, useState } from 'react';
import { useAttempts } from '@/lib/hooks/useAttempts';
import { useExams } from '@/lib/hooks/useExams';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ResultsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout><ResultsContent /></DashboardLayout>
    </ProtectedRoute>
  );
}

function ResultsContent() {
  const { attempts, loading, fetchMine } = useAttempts();
  const { exams, fetchAll: fetchExams } = useExams();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([fetchMine(), fetchExams()]).catch(() => {}).finally(() => setLoaded(true));
  }, [fetchMine, fetchExams]);

  const examMap = Object.fromEntries(exams.map((e) => [e.id, e]));

  if (!loaded || loading) return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Results</h1>

      {attempts.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">You haven't taken any exams yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                {['Exam', 'Score', 'Total Marks', '%', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attempts.map((a) => {
                const exam = examMap[a.examId];
                const pct = exam ? Math.round((a.score / exam.totalMarks) * 100) : '—';
                return (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{exam?.title ?? a.examId}</td>
                    <td className="px-4 py-3 text-slate-700">{a.score}</td>
                    <td className="px-4 py-3 text-slate-500">{exam?.totalMarks ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${pct >= 60 ? 'bg-green-100 text-green-700' : pct >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {pct}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
