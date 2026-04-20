'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function StudentsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout><StudentsContent /></DashboardLayout>
    </ProtectedRoute>
  );
}

function StudentsContent() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users/by-role/STUDENT')
      .then(({ data }) => setStudents(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Students</h1>
        <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-700">{students.length} total</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              {['Name', 'Email', 'Joined'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{s.email}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-10 text-center text-sm text-slate-400">No students registered.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
