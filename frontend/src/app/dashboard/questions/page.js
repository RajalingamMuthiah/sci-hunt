'use client';

import { useEffect, useState } from 'react';
import { useQuestions } from '@/lib/hooks/useQuestions';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

const TYPES = ['MCQ', 'TRUE_FALSE', 'DESCRIPTIVE'];
const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

export default function QuestionsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout><QuestionsContent /></DashboardLayout>
    </ProtectedRoute>
  );
}

const EMPTY_FORM = {
  subject: '', difficulty: 'MEDIUM', type: 'MCQ', grade: '', questionText: '',
  questionImageUrl: '', options: [{ id: 'A', text: '', correct: false }, { id: 'B', text: '', correct: false }],
  correctBoolAnswer: null, modelAnswer: '', maxWords: '', explanation: '', marks: 1, tags: '',
};

function QuestionsContent() {
  const { questions, loading, fetchAll, create, update, remove } = useQuestions();
  const [filters, setFilters] = useState({ subject: '', difficulty: '', type: '' });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => { fetchAll(filters).catch(() => {}); }, [fetchAll, filters]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (q) => {
    setEditing(q.id);
    setForm({
      subject: q.subject, difficulty: q.difficulty, type: q.type, grade: q.grade ?? '',
      questionText: q.questionText, questionImageUrl: q.questionImageUrl ?? '',
      options: q.options?.length ? q.options : EMPTY_FORM.options,
      correctBoolAnswer: q.correctBoolAnswer, modelAnswer: q.modelAnswer ?? '',
      maxWords: q.maxWords ?? '', explanation: q.explanation ?? '', marks: q.marks ?? 1,
      tags: (q.tags ?? []).join(', '),
    });
    setShowForm(true);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const payload = {
      ...form,
      grade: form.grade ? Number(form.grade) : null,
      maxWords: form.maxWords ? Number(form.maxWords) : null,
      marks: Number(form.marks),
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      options: form.type === 'MCQ' ? form.options : null,
      correctBoolAnswer: form.type === 'TRUE_FALSE' ? form.correctBoolAnswer : null,
      modelAnswer: form.type === 'DESCRIPTIVE' ? form.modelAnswer : null,
    };
    if (editing) await update(editing, payload);
    else await create(payload);
    setShowForm(false);
  };

  const handleDelete = async (id) => { if (confirm('Delete question?')) await remove(id); };

  // Option helpers
  const setOpt = (idx, key, val) => {
    setForm((f) => ({ ...f, options: f.options.map((o, i) => (i === idx ? { ...o, [key]: val } : o)) }));
  };
  const addOpt = () => setForm((f) => ({ ...f, options: [...f.options, { id: String.fromCharCode(65 + f.options.length), text: '', correct: false }] }));
  const removeOpt = (idx) => setForm((f) => ({ ...f, options: f.options.filter((_, i) => i !== idx) }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Question Bank</h1>
        <button onClick={openCreate} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand/90">+ New Question</button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input className="rounded-lg border px-3 py-1.5 text-sm" placeholder="Subject…" value={filters.subject} onChange={(e) => setFilters((f) => ({ ...f, subject: e.target.value }))} />
        <select className="rounded-lg border px-3 py-1.5 text-sm" value={filters.difficulty} onChange={(e) => setFilters((f) => ({ ...f, difficulty: e.target.value }))}>
          <option value="">All Difficulty</option>
          {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="rounded-lg border px-3 py-1.5 text-sm" value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}>
          <option value="">All Types</option>
          {TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
        </select>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
          <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold">{editing ? 'Edit Question' : 'New Question'}</h2>
            <div className="grid grid-cols-3 gap-3">
              <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Subject" value={form.subject} onChange={(e) => set('subject', e.target.value)} required />
              <select className="rounded-lg border px-3 py-2 text-sm" value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)}>
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select className="rounded-lg border px-3 py-2 text-sm" value={form.type} onChange={(e) => set('type', e.target.value)}>
                {TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" className="rounded-lg border px-3 py-2 text-sm" placeholder="Grade (optional)" value={form.grade} onChange={(e) => set('grade', e.target.value)} />
              <input type="number" step="0.5" min="0" className="rounded-lg border px-3 py-2 text-sm" placeholder="Marks" value={form.marks} onChange={(e) => set('marks', e.target.value)} required />
            </div>
            <textarea className="w-full rounded-lg border px-3 py-2 text-sm" rows={3} placeholder="Question text" value={form.questionText} onChange={(e) => set('questionText', e.target.value)} required />
            <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Image URL (optional)" value={form.questionImageUrl} onChange={(e) => set('questionImageUrl', e.target.value)} />

            {/* Type-specific fields */}
            {form.type === 'MCQ' && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Options</p>
                {form.options.map((o, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-bold w-5">{o.id}</span>
                    <input className="flex-1 rounded-lg border px-3 py-1.5 text-sm" placeholder="Option text" value={o.text} onChange={(e) => setOpt(i, 'text', e.target.value)} required />
                    <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={o.correct} onChange={(e) => setOpt(i, 'correct', e.target.checked)} /> Correct</label>
                    {form.options.length > 2 && <button type="button" onClick={() => removeOpt(i)} className="text-xs text-red-500">✕</button>}
                  </div>
                ))}
                {form.options.length < 6 && <button type="button" onClick={addOpt} className="text-xs text-brand hover:underline">+ Add option</button>}
              </div>
            )}
            {form.type === 'TRUE_FALSE' && (
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="radio" name="bool" checked={form.correctBoolAnswer === true} onChange={() => set('correctBoolAnswer', true)} /> True</label>
                <label className="flex items-center gap-2 text-sm"><input type="radio" name="bool" checked={form.correctBoolAnswer === false} onChange={() => set('correctBoolAnswer', false)} /> False</label>
              </div>
            )}
            {form.type === 'DESCRIPTIVE' && (
              <div className="space-y-2">
                <textarea className="w-full rounded-lg border px-3 py-2 text-sm" rows={2} placeholder="Model answer" value={form.modelAnswer} onChange={(e) => set('modelAnswer', e.target.value)} />
                <input type="number" className="rounded-lg border px-3 py-2 text-sm" placeholder="Max words (optional)" value={form.maxWords} onChange={(e) => set('maxWords', e.target.value)} />
              </div>
            )}

            <textarea className="w-full rounded-lg border px-3 py-2 text-sm" rows={2} placeholder="Explanation (optional)" value={form.explanation} onChange={(e) => set('explanation', e.target.value)} />
            <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Tags (comma-separated)" value={form.tags} onChange={(e) => set('tags', e.target.value)} />

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
                {['Question', 'Subject', 'Type', 'Difficulty', 'Marks', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {questions.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-900 max-w-xs truncate">{q.questionText}</td>
                  <td className="px-4 py-3 text-slate-500">{q.subject}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">{q.type?.replace('_', ' ')}</span></td>
                  <td className="px-4 py-3 text-slate-500">{q.difficulty}</td>
                  <td className="px-4 py-3 text-slate-700">{q.marks ?? '—'}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button onClick={() => openEdit(q)} className="text-xs text-brand hover:underline">Edit</button>
                    <button onClick={() => handleDelete(q.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {questions.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">No questions yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
