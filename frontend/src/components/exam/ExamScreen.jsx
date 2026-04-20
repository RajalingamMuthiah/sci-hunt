'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/lib/axios';

const MAX_VIOLATIONS = 3;
const AUTO_SAVE_INTERVAL = 30000; // 30s

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function ExamScreen({ exam, onSubmit }) {
  const { questions = [], duration = 30, title = 'Exam', id: examId } = exam ?? {};
  const total = questions.length;

  const [currentQ, setCurrentQ]         = useState(0);
  const [answers,  setAnswers]          = useState({});
  const [flagged,  setFlagged]          = useState(new Set());
  const [visited,  setVisited]          = useState(new Set([0]));
  const [timeLeft, setTimeLeft]         = useState(duration * 60);
  const [submitted, setSubmitted]       = useState(false);
  const [showSubmitModal,  setShowSubmitModal]  = useState(false);
  const [tabWarning,       setTabWarning]       = useState(false);
  const [tabViolations,    setTabViolations]    = useState(0);

  const timerRef    = useRef(null);
  const autoSaveRef = useRef(null);

  /* ─ countdown timer ──────────────────────────────────────────────── */
  useEffect(() => {
    if (submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  /* ─ auto-save draft every 30s ────────────────────────────────────── */
  useEffect(() => {
    if (submitted || !examId) return;
    autoSaveRef.current = setInterval(() => {
      api.patch(`/attempts/sync`, { examId, answers, timeLeft }).catch(() => {});
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(autoSaveRef.current);
  }, [submitted, examId, answers, timeLeft]);

  /* ─ beforeunload guard ───────────────────────────────────────────── */
  useEffect(() => {
    if (submitted) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [submitted]);

  /* ─ tab-switch / window-blur detection ───────────────────────────── */
  useEffect(() => {
    if (submitted) return;
    const handleVisibility = () => {
      if (document.hidden) {
        setTabViolations((v) => {
          const next = v + 1;
          setTabWarning(true);
          if (next >= MAX_VIOLATIONS) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
          }
          return next;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  /* ─ helpers ──────────────────────────────────────────────────────── */
  const goTo = useCallback((idx) => {
    setCurrentQ(idx);
    setVisited((v) => new Set([...v, idx]));
  }, []);

  const selectOption = useCallback((questionId, optionId) => {
    setAnswers((a) => ({ ...a, [questionId]: optionId }));
  }, []);

  const setTextAnswer = useCallback((questionId, text) => {
    setAnswers((a) => ({ ...a, [questionId]: text }));
  }, []);

  const toggleFlag = useCallback((qIdx) => {
    setFlagged((f) => {
      const next = new Set(f);
      next.has(qIdx) ? next.delete(qIdx) : next.add(qIdx);
      return next;
    });
  }, []);

  const handleAutoSubmit = useCallback(() => {
    setSubmitted(true);
    clearInterval(autoSaveRef.current);
    onSubmit?.(answers);
  }, [answers, onSubmit]);

  const handleConfirmSubmit = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(autoSaveRef.current);
    setSubmitted(true);
    setShowSubmitModal(false);
    onSubmit?.(answers);
  }, [answers, onSubmit]);

  /* ─ palette cell class ───────────────────────────────────────────── */
  const cellClass = (idx) => {
    const isCurrent   = idx === currentQ;
    const isAnswered  = !!answers[questions[idx]?.id];
    const isFlagged   = flagged.has(idx);
    const isVisited   = visited.has(idx);

    if (isCurrent)   return 'ring-2 ring-brand bg-brand text-white font-bold';
    if (isFlagged)   return 'bg-amber-400 text-white font-semibold';
    if (isAnswered)  return 'bg-brand text-white';
    if (isVisited)   return 'bg-white border-2 border-slate-300 text-slate-700';
    return 'bg-slate-200 text-slate-500';
  };

  const timerColor = timeLeft <= 60
    ? 'bg-red-50 text-red-600 border-red-200'
    : timeLeft <= 300
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-brand-light text-brand border-brand/20';

  const q = questions[currentQ];
  const answeredCount = Object.keys(answers).length;

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-sm rounded-2xl border border-green-200 bg-white p-8 text-center shadow-card">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Exam Submitted!</h2>
          <p className="mt-2 text-sm text-slate-500">
            You answered <strong>{answeredCount}</strong> of <strong>{total}</strong> questions.
          </p>
          <p className="mt-1 text-xs text-slate-400">Results will be available shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 font-sans">

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
        <div className="min-w-0">
          <h1 className="truncate text-sm font-bold text-slate-900 sm:text-base">{title}</h1>
          <p className="text-xs text-slate-400">{total} questions</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-mono font-semibold transition-colors ${timerColor}`}>
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            </svg>
            {formatTime(timeLeft)}
          </div>

          {/* Submit */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand/40"
          >
            Submit
          </button>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1">

        {/* Question palette (left) */}
        <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-white sm:flex">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Questions</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  title={`Question ${idx + 1}`}
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-xs transition-all ${cellClass(idx)}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="border-t border-slate-100 px-4 py-3 space-y-1.5">
            {[
              { color: 'bg-brand',      label: 'Answered' },
              { color: 'bg-amber-400',  label: 'Flagged' },
              { color: 'bg-white border border-slate-300', label: 'Visited' },
              { color: 'bg-slate-200',  label: 'Not visited' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-sm ${color}`} />
                <span className="text-xs text-slate-500">{label}</span>
              </div>
            ))}
            <p className="mt-2 text-xs font-medium text-slate-600">
              {answeredCount}/{total} answered
            </p>
          </div>
        </aside>

        {/* Question area (right) */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

          {/* Scrollable question body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8">
            {q ? (
              <div className="mx-auto max-w-2xl">
                {/* Question header */}
                <div className="mb-2 flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-light text-xs font-bold text-brand">
                    {currentQ + 1}
                  </span>
                  <p className="text-base font-medium leading-relaxed text-slate-900">{q.questionText}</p>
                </div>

                {/* Question image */}
                {q.questionImageUrl && (
                  <div className="mb-4 ml-10">
                    <img src={q.questionImageUrl} alt="Question" className="max-h-56 rounded-lg border border-slate-200" />
                  </div>
                )}

                {/* Marks badge */}
                {q.marks != null && (
                  <p className="mb-4 ml-10 text-xs text-slate-400">[{q.marks} mark{q.marks !== 1 ? 's' : ''}]</p>
                )}

                {/* MCQ Options */}
                {q.type === 'MCQ' && (
                  <div className="space-y-3">
                    {q.options?.map((opt) => {
                      const selected = answers[q.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => selectOption(q.id, opt.id)}
                          className={[
                            'flex w-full items-start gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-sm transition-all',
                            selected
                              ? 'border-brand bg-brand-light text-brand font-medium'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-brand/40 hover:bg-brand-light/50',
                          ].join(' ')}
                        >
                          <span
                            className={[
                              'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                              selected ? 'border-brand bg-brand' : 'border-slate-300 bg-white',
                            ].join(' ')}
                          >
                            {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </span>
                          <span className="flex items-center gap-2">
                            {opt.imageUrl && <img src={opt.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />}
                            {opt.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* TRUE / FALSE */}
                {q.type === 'TRUE_FALSE' && (
                  <div className="flex gap-4 ml-10">
                    {['true', 'false'].map((val) => {
                      const selected = answers[q.id] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => selectOption(q.id, val)}
                          className={[
                            'flex-1 rounded-xl border-2 py-4 text-center text-sm font-semibold capitalize transition-all',
                            selected
                              ? 'border-brand bg-brand-light text-brand'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-brand/40',
                          ].join(' ')}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* DESCRIPTIVE */}
                {q.type === 'DESCRIPTIVE' && (
                  <div className="ml-10">
                    <textarea
                      rows={6}
                      value={answers[q.id] ?? ''}
                      onChange={(e) => setTextAnswer(q.id, e.target.value)}
                      placeholder="Type your answer here…"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 resize-y"
                    />
                    {q.maxWords && (
                      <p className="mt-1 text-xs text-slate-400">Max {q.maxWords} words</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-slate-400">No question data.</p>
              </div>
            )}
          </div>

          {/* Bottom navigation bar */}
          <footer className="shrink-0 border-t border-slate-200 bg-white px-4 py-3">
            <div className="mx-auto flex max-w-2xl items-center justify-between">
              <button
                onClick={() => goTo(currentQ - 1)}
                disabled={currentQ === 0}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {/* Flag button */}
              <button
                onClick={() => toggleFlag(currentQ)}
                className={[
                  'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition',
                  flagged.has(currentQ)
                    ? 'border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100'
                    : 'border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-600',
                ].join(' ')}
              >
                <svg className="h-4 w-4" fill={flagged.has(currentQ) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H13l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                {flagged.has(currentQ) ? 'Unflag' : 'Flag for review'}
              </button>

              <button
                onClick={() => goTo(currentQ + 1)}
                disabled={currentQ === total - 1}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </footer>
        </div>
      </div>

      {/* ── Submit Confirmation Modal ────────────────────────────────── */}
      {showSubmitModal && (
        <Modal onClose={() => setShowSubmitModal(false)}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light">
            <svg className="h-6 w-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">Submit exam?</h2>
          <p className="mt-1 text-sm text-slate-500">
            You have answered <strong className="text-slate-700">{answeredCount}</strong> of{' '}
            <strong className="text-slate-700">{total}</strong> questions.
            {answeredCount < total && (
              <span className="block mt-1 text-amber-600 font-medium">
                {total - answeredCount} question{total - answeredCount !== 1 ? 's' : ''} unanswered.
              </span>
            )}
          </p>
          <p className="mt-2 text-xs text-slate-400">This action cannot be undone.</p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSubmit}
              className="flex-1 rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Confirm Submit
            </button>
          </div>
        </Modal>
      )}

      {/* ── Tab-switch Warning Modal ─────────────────────────────────── */}
      {tabWarning && (
        <Modal onClose={() => setTabWarning(false)}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">Tab switch detected!</h2>
          <p className="mt-1 text-sm text-slate-500">
            You have switched away from this tab{' '}
            <strong className="text-red-600">{tabViolations}</strong> time{tabViolations !== 1 ? 's' : ''}.
          </p>
          {tabViolations >= MAX_VIOLATIONS ? (
            <p className="mt-2 text-sm font-semibold text-red-600">
              Maximum violations reached. Your exam has been auto-submitted.
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-400">
              After {MAX_VIOLATIONS} violations your exam will be auto-submitted.{' '}
              <strong>{MAX_VIOLATIONS - tabViolations}</strong> warning{MAX_VIOLATIONS - tabViolations !== 1 ? 's' : ''} remaining.
            </p>
          )}
          <button
            onClick={() => setTabWarning(false)}
            className="mt-6 w-full rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            I understand, return to exam
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ─── Modal wrapper ────────────────────────────────────────────────────── */
function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        {children}
      </div>
    </div>
  );
}
