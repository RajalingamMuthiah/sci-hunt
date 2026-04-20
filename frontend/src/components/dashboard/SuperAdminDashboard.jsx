'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useExams } from '@/lib/hooks/useExams';
import { useSchools } from '@/lib/hooks/useSchools';

export default function SuperAdminDashboard() {
  const { exams, fetchAll: fetchExams } = useExams();
  const { schools, fetchAll: fetchSchools } = useSchools();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchExams(), fetchSchools()]).catch(() => {}).finally(() => setLoading(false));
  }, [fetchExams, fetchSchools]);

  const kpis = [
    { label: 'Total Schools',  value: String(schools.length), color: 'teal'   },
    { label: 'Active Exams',   value: String(exams.length),   color: 'amber'  },
  ];

  if (loading) return <div className="space-y-6 animate-pulse"><div className="h-28 rounded-2xl bg-slate-100" /><div className="h-48 rounded-xl bg-slate-100" /></div>;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-red-600">Super Admin Dashboard</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">System Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Platform-wide metrics, schools, users, and exam reports.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className={`text-2xl font-bold ${k.color === 'teal' ? 'text-teal-600' : 'text-amber-600'}`}>{k.value}</p>
            <p className="mt-0.5 text-sm font-medium text-slate-700">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Schools</h2>
            <Link href="/dashboard/schools" className="text-xs font-medium text-brand hover:underline">Manage →</Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  {['School', 'City'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schools.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                    <td className="px-4 py-3 text-slate-500">{s.city ?? '—'}</td>
                  </tr>
                ))}
                {schools.length === 0 && <tr><td colSpan={2} className="px-4 py-8 text-center text-sm text-slate-400">No schools registered.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Exams</h2>
            <Link href="/dashboard/exams" className="text-xs font-medium text-brand hover:underline">View all →</Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  {['Exam', 'Duration', 'Marks', 'Questions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exams.slice(0, 5).map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{e.title}</td>
                    <td className="px-4 py-3 text-slate-500">{e.duration} min</td>
                    <td className="px-4 py-3 text-slate-700">{e.totalMarks}</td>
                    <td className="px-4 py-3 text-slate-700">{e.questionCount}</td>
                  </tr>
                ))}
                {exams.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">No exams.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
