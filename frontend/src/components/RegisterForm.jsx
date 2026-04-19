'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'STUDENT' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, role: form.role });
      router.push('/login?registered=1');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || err?.message;
      if (err?.response?.status === 409 || String(msg).toLowerCase().includes('email')) {
        setError('An account with this email already exists.');
      } else {
        setError(String(msg) || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:bg-slate-50 disabled:text-slate-400';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div>
        <label htmlFor="reg-name" className="block text-sm font-medium text-slate-700">Full name</label>
        <input
          id="reg-name"
          type="text"
          autoComplete="name"
          required
          disabled={loading}
          value={form.name}
          onChange={set('name')}
          placeholder="Jane Smith"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700">Email address</label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          required
          disabled={loading}
          value={form.email}
          onChange={set('email')}
          placeholder="you@school.edu"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="reg-role" className="block text-sm font-medium text-slate-700">
          I am registering as
        </label>
        <select
          id="reg-role"
          required
          disabled={loading}
          value={form.role}
          onChange={set('role')}
          className={inputClass}
        >
          <option value="STUDENT">Student</option>
          <option value="SCHOOL_ADMIN">School Administrator</option>
        </select>
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700">Password</label>
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          required
          disabled={loading}
          value={form.password}
          onChange={set('password')}
          placeholder="At least 8 characters"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="reg-confirm" className="block text-sm font-medium text-slate-700">Confirm password</label>
        <input
          id="reg-confirm"
          type="password"
          autoComplete="new-password"
          required
          disabled={loading}
          value={form.confirm}
          onChange={set('confirm')}
          placeholder="Repeat password"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={!form.name || !form.email || !form.password || !form.confirm || !form.role || loading}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}
