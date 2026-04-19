'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      // AuthProvider sets mfaRequired or isAuthenticated;
      // parent login page handles which view to show.
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        setError('Invalid email or password.');
      } else {
        setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <svg
            className="mt-0.5 h-4 w-4 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 012 0v4a1 1 0 11-2 0V9zm0-4a1 1 0 112 0 1 1 0 01-2 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="
            block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5
            text-sm text-slate-900 placeholder-slate-400
            shadow-sm outline-none
            transition
            focus:border-brand focus:ring-2 focus:ring-brand/20
            disabled:opacity-50
          "
          disabled={loading}
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="
            block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5
            text-sm text-slate-900 placeholder-slate-400
            shadow-sm outline-none
            transition
            focus:border-brand focus:ring-2 focus:ring-brand/20
            disabled:opacity-50
          "
          disabled={loading}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !email || !password}
        className="
          relative w-full rounded-lg bg-brand px-4 py-2.5
          text-sm font-semibold text-white
          shadow-sm transition
          hover:bg-brand-hover
          focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-60
        "
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Signing in…
          </span>
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  );
}
