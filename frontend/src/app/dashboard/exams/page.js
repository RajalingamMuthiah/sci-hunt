'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import { useExams } from '@/lib/hooks/useExams';
import { useQuestions } from '@/lib/hooks/useQuestions';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ExamsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout><ExamsContent /></DashboardLayout>
    </ProtectedRoute>
  );
}

function ExamsContent() {
  const { user } = useAuth();
  const { exams, loading, fetchAll, create, update, remove } = useExams();
  const { questions, fetchAll: fetchQuestions } = useQuestions();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', duration: 60, totalMarks: 100, questionIds: [] });

  const isTeacherPlus = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'].includes(user?.role);

  useEffect(() => { fetchAll().catch(() => {}); }, [fetchAll]);
  useEffect(() => { if (isTeacherPlus) fetchQuestions().catch(() => {}); }, [isTeacherPlus, fetchQuestions]);

  const openCreate = () => { setEditing(null); setForm({ title: '', duration: 60, totalMarks: 100, questionIds: [] }); setShowForm(true); };
  const openEdit = (e) => { setEditing(e.id); setForm({ title: e.title, duration: e.duration, totalMarks: e.totalMarks, questionIds: [] }); setShowForm(true); };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (editing) await update(editing, form);
    else await create(form);
    setShowForm(false);
  };

  const handleDelete = async (id) => { if (confirm('Delete this exam?')) await remove(id); };

  const toggleQuestion = (qId) => {
    setForm((f) => ({
      ...f,
      questionIds: f.questionIds.includes(qId) ? f.questionIds.filter((x) => x !== qId) : [...f.questionIds, qId],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Exams</h1>
        {isTeacherPlus && (
          <button onClick={openCreate} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand/90">
            + New Exam
          </button>
        )}
      </div>

      {/* Exam form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold">{editing ? 'Edit Exam' : 'Create Exam'}</h2>
            <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" min={1} className="rounded-lg border px-3 py-2 text-sm" placeholder="Duration (min)" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: +e.target.value }))} required />
              <input type="number" min={1} className="rounded-lg border px-3 py-2 text-sm" placeholder="Total marks" value={form.totalMarks} onChange={(e) => setForm((f) => ({ ...f, totalMarks: +e.target.value }))} required />
            </div>
            {!editing && (
              <div>
                <p className="mb-1 text-sm font-medium text-slate-700">Select questions ({form.questionIds.length} selected)</p>
                <div className="max-h-48 overflow-y-auto rounded-lg border p-2 space-y-1">
                  {questions.map((q) => (
                    <label key={q.id} className="flex items-center gap-2 text-sm hover:bg-slate-50 rounded px-1 py-0.5 cursor-pointer">
                      <input type="checkbox" checked={form.questionIds.includes(q.id)} onChange={() => toggleQuestion(q.id)} />
                      <span className="truncate">{q.questionText}</span>
                      <span className="ml-auto text-xs text-slate-400">{q.type} · {q.marks ?? '—'}m</span>
                    </label>
                  ))}
                  {questions.length === 0 && <p className="text-xs text-slate-400 py-2">No questions available. Create questions first.</p>}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90">
                {editing ? 'Save' : 'Create'}
              </button>
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
                {['Exam', 'Duration', 'Marks', 'Questions', ...(isTeacherPlus ? ['Actions'] : [''])].filter(Boolean).map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exams.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {user?.role === 'STUDENT' ? (
                      <Link href={`/exam/${e.id}`} className="text-brand hover:underline">{e.title}</Link>
                    ) : e.title}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{e.duration} min</td>
                  <td className="px-4 py-3 text-slate-700">{e.totalMarks}</td>
                  <td className="px-4 py-3 text-slate-700">{e.questionCount}</td>
                  {isTeacherPlus && (
                    <td className="px-4 py-3 space-x-2">
                      <button onClick={() => openEdit(e)} className="text-xs text-brand hover:underline">Edit</button>
                      <button onClick={() => handleDelete(e.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
              {exams.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">No exams yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
