'use client';

import { useRef, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';

const DIGITS = 6;

export default function MfaVerification() {
  const { verifyMfa } = useAuth();
  const [digits, setDigits]   = useState(Array(DIGITS).fill(''));
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs             = useRef([]);

  const code = digits.join('');
  const isComplete = code.length === DIGITS && digits.every((d) => /^\d$/.test(d));

  const focusAt = (index) => {
    const el = inputRefs.current[index];
    if (el) el.focus();
  };

  const handleChange = (index, value) => {
    // Accept only a single digit; handle paste into first box
    const stripped = value.replace(/\D/g, '');
    if (!stripped) return;

    if (stripped.length === DIGITS && index === 0) {
      // Full paste into first box
      setDigits(stripped.split('').slice(0, DIGITS));
      focusAt(DIGITS - 1);
      return;
    }

    const char = stripped[stripped.length - 1];
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (index < DIGITS - 1) focusAt(index + 1);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        focusAt(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusAt(index - 1);
    } else if (e.key === 'ArrowRight' && index < DIGITS - 1) {
      focusAt(index + 1);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isComplete) return;
    setError('');
    setLoading(true);
    try {
      await verifyMfa({ code });
      // AuthProvider sets isAuthenticated; parent redirects.
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 400) {
        setError('Incorrect code. Please try again.');
      } else {
        setError(err?.response?.data?.message || 'Verification failed. Please try again.');
      }
      setDigits(Array(DIGITS).fill(''));
      focusAt(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <p className="text-center text-sm text-slate-500">
        Enter the 6-digit code from your authenticator app.
      </p>

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

      {/* Digit boxes */}
      <div className="flex justify-center gap-3" aria-label="One-time passcode input">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            pattern="\d"
            maxLength={i === 0 ? DIGITS : 1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            aria-label={`Digit ${i + 1}`}
            disabled={loading}
            className="
              h-12 w-11 rounded-lg border border-slate-300 bg-white
              text-center text-lg font-bold text-slate-900
              shadow-sm outline-none transition
              focus:border-brand focus:ring-2 focus:ring-brand/20
              disabled:opacity-50
            "
          />
        ))}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !isComplete}
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
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Verifying…
          </span>
        ) : (
          'Verify code'
        )}
      </button>
    </form>
  );
}
