'use client';

import { useEffect, useState } from 'react';
import { useSchools } from '@/lib/hooks/useSchools';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

const STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];
const PLANS = ['FREE', 'BASIC', 'PREMIUM'];

export default function SchoolsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout><SchoolsContent /></DashboardLayout>
    </ProtectedRoute>
  );
}

function SchoolsContent() {
  const { schools, loading, fetchAll, create, update, remove } = useSchools();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', plan: 'FREE', status: 'ACTIVE' });

  useEffect(() => { fetchAll().catch(() => {}); }, [fetchAll]);

  const openCreate = () => { setEditing(null); setForm({ name: '', plan: 'FREE', status: 'ACTIVE' }); setShowForm(true); };
  const openEdit = (s) => { setEditing(s.id); setForm({ name: s.name, plan: s.plan, status: s.status }); setShowForm(true); };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (editing) await update(editing, form);
    else await create(form);
    setShowForm(false);
  };

  const handleDelete = async (id) => { if (confirm('Delete school?')) await remove(id); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Schools</h1>
        <button onClick={openCreate} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand/90">+ Add School</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold">{editing ? 'Edit School' : 'Add School'}</h2>
            <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="School name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            <select className="w-full rounded-lg border px-3 py-2 text-sm" value={form.plan} onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}>
              {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select className="w-full rounded-lg border px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90">{editing ? 'Save' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}

      {loading && <div className="h-40 animate-pulse rounded-xl bg-slate-100" />}

      {!loading && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                {['School', 'Plan', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schools.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">{s.plan}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : s.status === 'SUSPENDED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button onClick={() => openEdit(s)} className="text-xs text-brand hover:underline">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {schools.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-400">No schools registered.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
