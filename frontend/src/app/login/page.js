'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import LoginForm from '@/components/LoginForm';
import MfaVerification from '@/components/MfaVerification';

export default function LoginPage() {
  const { isAuthenticated, isLoading, mfaRequired } = useAuth();
  const router = useRouter();
  const searchParams = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : null;
  const justRegistered = searchParams?.get('registered') === '1';

  // Already logged in → go to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <svg className="h-10 w-10 animate-spin text-brand" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo / wordmark */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white shadow">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">Scientis<span className="text-brand">Hunt</span></span>
          </span>
          <p className="mt-2 text-sm text-slate-500">
            {mfaRequired ? 'Two-step verification' : 'Sign in to your account'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card">

          {/* Success banner after registration */}
          {justRegistered && (
            <div className="mb-5 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
              <svg className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Account created! Please sign in.
            </div>
          )}

          {/* Step indicator */}
          <div className="mb-6 flex items-center gap-2">
            <StepDot active={!mfaRequired} done={mfaRequired} label="1" />
            <div className="h-px flex-1 bg-slate-200" />
            <StepDot active={mfaRequired} done={false} label="2" />
          </div>

          {mfaRequired ? (
            <>
              <h1 className="mb-1 text-lg font-semibold text-slate-900">Authenticator code</h1>
              <MfaVerification />
            </>
          ) : (
            <>
              <h1 className="mb-1 text-lg font-semibold text-slate-900">Welcome back</h1>
              <LoginForm />
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-brand hover:text-brand-hover hover:underline">
            Sign up
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Scientis-Hunt · Examination Platform
        </p>
      </div>
    </main>
  );
}

function StepDot({ active, done, label }) {
  const base = 'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors';
  if (done) return (
    <span className={`${base} bg-brand text-white`}>
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
  if (active) return <span className={`${base} bg-brand text-white ring-4 ring-brand/20`}>{label}</span>;
  return <span className={`${base} border border-slate-300 text-slate-400`}>{label}</span>;
}
