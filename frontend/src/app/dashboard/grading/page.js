'use client';

import { useEffect, useState } from 'react';
import { useAttempts } from '@/lib/hooks/useAttempts';
import { useExams } from '@/lib/hooks/useExams';
import api from '@/lib/axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function GradingPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout><GradingContent /></DashboardLayout>
    </ProtectedRoute>
  );
}

function GradingContent() {
  const { attempts, loading, fetchPendingGrading, gradeDescriptive } = useAttempts();
  const { exams, fetchAll: fetchExams } = useExams();
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState(null);       // attempt id
  const [examDetail, setExamDetail] = useState(null);    // full exam with questions
  const [grades, setGrades] = useState({});              // { questionId: marks }
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([fetchPendingGrading(), fetchExams()]).catch(() => {}).finally(() => setLoaded(true));
  }, [fetchPendingGrading, fetchExams]);

  const examMap = Object.fromEntries(exams.map((e) => [e.id, e]));

  const openGrading = async (attempt) => {
    setSelected(attempt);
    setGrades({});
    try {
      const { data } = await api.get(`/exams/${attempt.examId}`);
      setExamDetail(data);
    } catch { setExamDetail(null); }
  };

  const descriptiveQs = examDetail?.questions?.filter((q) => q.type === 'DESCRIPTIVE') ?? [];

  const handleGrade = async () => {
    if (!selected) return;
    setSaving(true);
    const gradeList = Object.entries(grades).map(([questionId, marks]) => ({ questionId, marks: Number(marks) }));
    try {
      await gradeDescriptive(selected.id, gradeList);
      await fetchPendingGrading();
      setSelected(null);
      setExamDetail(null);
    } catch { /* error */ }
    setSaving(false);
  };

  if (!loaded || loading) return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Grade Descriptive Answers</h1>

      {/* Grading detail modal */}
      {selected && examDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold">Grade Attempt</h2>
            <p className="text-sm text-slate-500">Exam: <span className="font-medium text-slate-800">{examDetail.title}</span></p>

            {descriptiveQs.length === 0 && <p className="text-sm text-slate-400">No descriptive questions in this exam.</p>}

            {descriptiveQs.map((q) => (
              <div key={q.id} className="rounded-lg border border-slate-200 p-4 space-y-2">
                <p className="text-sm font-medium text-slate-900">{q.questionText}</p>
                {q.modelAnswer && <p className="text-xs text-slate-400">Model: {q.modelAnswer}</p>}
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Student answer:</p>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{selected.answers?.[q.id] ?? <span className="italic text-slate-400">No answer</span>}</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-700">Marks (max {q.marks ?? '?'}):</label>
                  <input
                    type="number"
                    min={0}
                    max={q.marks ?? 100}
                    step="0.5"
                    className="w-24 rounded-lg border px-3 py-1.5 text-sm"
                    value={grades[q.id] ?? ''}
                    onChange={(e) => setGrades((g) => ({ ...g, [q.id]: e.target.value }))}
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setSelected(null); setExamDetail(null); }} className="rounded-lg border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleGrade} disabled={saving} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-50">
                {saving ? 'Saving…' : 'Submit Grades'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending list */}
      {attempts.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">No attempts pending grading.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                {['Exam', 'Student', 'Current Score', 'Date', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attempts.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{examMap[a.examId]?.title ?? a.examId}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{a.userId}</td>
                  <td className="px-4 py-3 text-slate-700">{a.score}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openGrading(a)} className="rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-200">
                      Grade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
