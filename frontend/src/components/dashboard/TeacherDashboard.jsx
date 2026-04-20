'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useExams } from '@/lib/hooks/useExams';
import { useAttempts } from '@/lib/hooks/useAttempts';

export default function TeacherDashboard() {
  const { exams, fetchAll: fetchExams } = useExams();
  const { attempts, fetchPendingGrading } = useAttempts();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchExams(), fetchPendingGrading()]).catch(() => {}).finally(() => setLoading(false));
  }, [fetchExams, fetchPendingGrading]);

  const stats = [
    { label: 'My Exams',        value: String(exams.length) },
    { label: 'Pending Grading', value: String(attempts.length) },
  ];

  if (loading) return <div className="space-y-6 animate-pulse"><div className="h-24 rounded-xl bg-slate-100" /><div className="h-48 rounded-xl bg-slate-100" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your exams and track student performance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">My Exams</h2>
          <Link href="/dashboard/exams" className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand/90 transition">
            + New Exam
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {['Exam Name', 'Duration', 'Total Marks', 'Questions', ''].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exams.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3 font-medium text-slate-800">{e.title}</td>
                  <td className="px-6 py-3 text-slate-500">{e.duration} min</td>
                  <td className="px-6 py-3 text-slate-500">{e.totalMarks}</td>
                  <td className="px-6 py-3 text-slate-500">{e.questionCount}</td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/dashboard/exams`} className="text-xs text-brand hover:underline">Edit</Link>
                  </td>
                </tr>
              ))}
              {exams.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-400">No exams created yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {attempts.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Pending Grading</h2>
            <Link href="/dashboard/grading" className="text-xs text-brand hover:underline">Grade all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {['Attempt ID', 'Exam', 'Student', 'Score', ''].map((h) => (
                    <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attempts.slice(0, 5).map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3 text-xs font-mono text-slate-500">{a.id.slice(0, 8)}…</td>
                    <td className="px-6 py-3 text-slate-800">{a.examId.slice(0, 8)}…</td>
                    <td className="px-6 py-3 text-slate-500">{a.userId.slice(0, 8)}…</td>
                    <td className="px-6 py-3 font-semibold text-slate-800">{a.score}</td>
                    <td className="px-6 py-3 text-right">
                      <Link href="/dashboard/grading" className="text-xs text-brand hover:underline">Grade</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
