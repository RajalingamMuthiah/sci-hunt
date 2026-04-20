'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useExams } from '@/lib/hooks/useExams';
import { useSchools } from '@/lib/hooks/useSchools';

export default function SchoolAdminDashboard() {
  const { exams, fetchAll: fetchExams } = useExams();
  const { schools, fetchAll: fetchSchools } = useSchools();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchExams(), fetchSchools()]).catch(() => {}).finally(() => setLoading(false));
  }, [fetchExams, fetchSchools]);

  const metrics = [
    { label: 'Active Exams', value: String(exams.length), color: 'teal'   },
    { label: 'Schools',      value: String(schools.length), color: 'violet' },
  ];

  if (loading) return <div className="space-y-6 animate-pulse"><div className="h-28 rounded-2xl bg-slate-100" /><div className="h-48 rounded-xl bg-slate-100" /></div>;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">School Admin Dashboard</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">School Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your classes, students, and teaching staff.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className={`text-2xl font-bold ${m.color === 'teal' ? 'text-teal-600' : 'text-violet-600'}`}>{m.value}</p>
            <p className="mt-0.5 text-sm font-medium text-slate-700">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Exams</h2>
            <Link href="/dashboard/exams" className="text-xs font-medium text-brand hover:underline">Manage →</Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Exam</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Duration</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Marks</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Questions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exams.slice(0, 5).map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{e.title}</td>
                    <td className="px-4 py-3 text-center text-slate-700">{e.duration} min</td>
                    <td className="px-4 py-3 text-center text-slate-700">{e.totalMarks}</td>
                    <td className="px-4 py-3 text-center text-slate-700">{e.questionCount}</td>
                  </tr>
                ))}
                {exams.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">No exams.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Schools</h2>
            <Link href="/dashboard/schools" className="text-xs font-medium text-brand hover:underline">View all →</Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">City</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schools.slice(0, 5).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                    <td className="px-4 py-3 text-slate-500">{s.city ?? '—'}</td>
                  </tr>
                ))}
                {schools.length === 0 && <tr><td colSpan={2} className="px-4 py-8 text-center text-sm text-slate-400">No schools.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
