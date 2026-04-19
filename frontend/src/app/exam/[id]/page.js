'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import ExamScreen from '@/components/exam/ExamScreen';

export default function ExamPage() {
  return (
    <ProtectedRoute>
      <ExamLoader />
    </ProtectedRoute>
  );
}

function ExamLoader() {
  const params  = useParams();
  const router  = useRouter();
  const examId  = params?.id;

  const [exam,    setExam]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!examId) return;
    axiosInstance
      .get(`/exams/${examId}`)
      .then((res) => setExam(res.data))
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 404)      setError('Exam not found.');
        else if (status === 403) setError('You are not authorised to take this exam.');
        else                     setError('Failed to load the exam. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [examId]);

  const handleSubmit = useCallback(
    async (answers) => {
      try {
        await axiosInstance.post(`/exams/${examId}/submit`, { answers });
        router.replace('/dashboard');
      } catch {
        // submission error handled — exam shows submitted state already
      }
    },
    [examId, router],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <svg className="h-10 w-10 animate-spin text-brand" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-slate-900">{error}</p>
        <button
          onClick={() => router.back()}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-brand hover:text-brand"
        >
          Go back
        </button>
      </div>
    );
  }

  return <ExamScreen exam={exam} onSubmit={handleSubmit} />;
}
