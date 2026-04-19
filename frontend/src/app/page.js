'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthProvider';

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex min-h-screen flex-col bg-white">

      {/* Nav */}
      <header className="border-b border-slate-100 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <span className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </span>
            Scientis<span className="text-brand">Hunt</span>
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Sign in
            </Link>
            <Link href="/register"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Science &amp; Mathematics Exam Platform
        </span>
        <h1 className="mb-6 max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
          Assess. Grade. <span className="text-brand">Excel.</span>
        </h1>
        <p className="mb-10 max-w-xl text-lg text-slate-500">
          Scientis-Hunt is a role-based online examination platform for schools —
          publish exams, auto-grade attempts, and track student progress in real time.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/register"
            className="rounded-xl bg-brand px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-hover">
            Create free account
          </Link>
          <Link href="/login"
            className="rounded-xl border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand hover:text-brand">
            Sign in
          </Link>
        </div>
      </section>

      {/* Feature grid */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-2xl font-bold text-slate-900">Everything you need to run exams</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="mb-1 font-semibold text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role table */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">Four roles, clear boundaries</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Can do</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {ROLES.map((r) => (
                <tr key={r.role}>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${r.badge}`}>{r.role}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{r.can}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mb-8 text-brand-light">Register as a student today. Admins can promote you to teacher or school admin.</p>
          <Link href="/register"
            className="inline-block rounded-xl bg-white px-8 py-3 text-sm font-semibold text-brand shadow-md transition hover:bg-slate-100">
            Create free account
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Scientis-Hunt · Examination Platform
      </footer>
    </div>
  );
}

const FEATURES = [
  {
    title: 'Multi-role access',
    desc: 'Super Admin, School Admin, Teacher, and Student roles with enforced permissions.',
    color: 'bg-teal-50 text-teal-600',
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" /></svg>,
  },
  {
    title: 'Auto-grading',
    desc: 'Submit an attempt and get instant scores — no manual marking required.',
    color: 'bg-violet-50 text-violet-600',
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  },
  {
    title: 'JWT + MFA security',
    desc: 'Cookie-based JWT with refresh rotation and optional TOTP two-factor auth.',
    color: 'bg-amber-50 text-amber-600',
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  },
  {
    title: 'Question bank',
    desc: 'Organise MCQ and short-answer questions by school and subject.',
    color: 'bg-sky-50 text-sky-600',
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    title: 'Timed exams',
    desc: 'Set start/end windows and time limits per exam.',
    color: 'bg-rose-50 text-rose-600',
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    title: 'Attempt history',
    desc: 'Students see past scores; admins get a full attempt audit trail.',
    color: 'bg-emerald-50 text-emerald-600',
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  },
];

const ROLES = [
  { role: 'Super Admin',   badge: 'bg-red-100 text-red-700',    can: 'Full access — manage all schools, users, questions, and exams' },
  { role: 'School Admin',  badge: 'bg-violet-100 text-violet-700', can: 'Manage teachers and students within their school' },
  { role: 'Teacher',       badge: 'bg-amber-100 text-amber-700',  can: 'Create questions and exams, view student attempts' },
  { role: 'Student',       badge: 'bg-teal-100 text-teal-700',    can: 'Take exams and view their own results' },
];

