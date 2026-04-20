'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function UsersPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout><UsersContent /></DashboardLayout>
    </ProtectedRoute>
  );
}

const ROLE_BADGE = {
  SUPER_ADMIN:  'bg-red-100 text-red-700',
  SCHOOL_ADMIN: 'bg-violet-100 text-violet-700',
  TEACHER:      'bg-amber-100 text-amber-700',
  STUDENT:      'bg-teal-100 text-teal-700',
};

function UsersContent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetTarget, setResetTarget] = useState(null);
  const [newPwd, setNewPwd] = useState('');

  useEffect(() => {
    api.get('/admin/users').then(({ data }) => setUsers(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleReset = async (ev) => {
    ev.preventDefault();
    if (!resetTarget || newPwd.length < 8) return;
    await api.post(`/admin/users/${resetTarget}/reset-password`, { newPassword: newPwd });
    setResetTarget(null);
    setNewPwd('');
  };

  if (loading) return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Users</h1>

      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleReset} className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold">Reset Password</h2>
            <input type="password" className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="New password (min 8 chars)" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} minLength={8} required />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setResetTarget(null)} className="rounded-lg border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90">Reset</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              {['Name', 'Email', 'Role', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_BADGE[u.role] ?? 'bg-slate-100 text-slate-700'}`}>
                    {u.role?.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => setResetTarget(u.id)} className="text-xs text-brand hover:underline">Reset password</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-400">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
