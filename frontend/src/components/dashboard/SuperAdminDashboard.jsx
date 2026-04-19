'use client';

import Link from 'next/link';

const KPI = [
  { label: 'Total Schools',  value: '24',    delta: '+3 this quarter',  color: 'teal'   },
  { label: 'Registered Users', value: '4,812', delta: '+148 this month', color: 'violet' },
  { label: 'Active Exams',   value: '37',    delta: '12 ending today',   color: 'amber'  },
  { label: 'Attempts Today', value: '683',   delta: 'Peak: 9 AM',        color: 'sky'    },
];

const SCHOOLS = [
  { name: 'Greenfield Academy',  city: 'Mumbai',    students: 412, teachers: 28, exams: 8  },
  { name: 'Sunrise High School', city: 'Delhi',     students: 389, teachers: 22, exams: 5  },
  { name: 'St. Xavier Institute', city: 'Pune',     students: 251, teachers: 18, exams: 11 },
  { name: 'Horizon Public School', city: 'Chennai', students: 198, teachers: 14, exams: 3  },
];

const RECENT_USERS = [
  { name: 'Rahul Gupta',   email: 'rahul@green.edu',   role: 'SCHOOL_ADMIN', joined: 'Apr 18, 2026' },
  { name: 'Aisha Khan',    email: 'aisha@sunrise.edu',  role: 'TEACHER',      joined: 'Apr 17, 2026' },
  { name: 'Dev Sharma',    email: 'dev@xavier.edu',     role: 'STUDENT',      joined: 'Apr 17, 2026' },
  { name: 'Priya Nair',    email: 'priya@horizon.edu',  role: 'STUDENT',      joined: 'Apr 16, 2026' },
];

const ROLE_BADGE = {
  SCHOOL_ADMIN: 'bg-violet-100 text-violet-700',
  TEACHER:      'bg-amber-100 text-amber-700',
  STUDENT:      'bg-teal-100 text-teal-700',
};

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-red-600">Super Admin Dashboard</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">System Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Platform-wide metrics, schools, users, and exam reports.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPI.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Schools table */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Schools</h2>
            <Link href="/dashboard/schools" className="text-xs font-medium text-brand hover:underline">Manage →</Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  {['School', 'City', 'Students', 'Exams'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SCHOOLS.map((s) => (
                  <tr key={s.name} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                    <td className="px-4 py-3 text-slate-500">{s.city}</td>
                    <td className="px-4 py-3 text-slate-700">{s.students}</td>
                    <td className="px-4 py-3 text-slate-700">{s.exams}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent users */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Recent Users</h2>
            <Link href="/dashboard/users" className="text-xs font-medium text-brand hover:underline">View all →</Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  {['Name', 'Email', 'Role', 'Joined'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RECENT_USERS.map((u) => (
                  <tr key={u.email} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_BADGE[u.role] ?? 'bg-slate-100 text-slate-700'}`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* System health bar */}
      <section>
        <h2 className="mb-4 text-base font-semibold text-slate-900">System Health</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <HealthBar label="API Response (avg)" value={98} unit="ms" inverse />
          <HealthBar label="Uptime (30d)"        value={99.97} unit="%"  />
          <HealthBar label="Storage Used"        value={42} unit="%"  />
        </div>
      </section>
    </div>
  );
}

function KpiCard({ label, value, delta, color }) {
  const c = { teal:'text-teal-600', violet:'text-violet-600', amber:'text-amber-600', sky:'text-sky-600' }[color] ?? 'text-slate-700';
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className={`text-2xl font-bold ${c}`}>{value}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-700">{label}</p>
      <p className="mt-1 text-xs text-slate-400">{delta}</p>
    </div>
  );
}

function HealthBar({ label, value, unit, inverse }) {
  const pct = unit === 'ms' ? Math.min(100, 100 - value / 5) : value;
  const good = inverse ? value < 200 : value >= 95;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-end justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className={`text-lg font-bold ${good ? 'text-green-600' : 'text-red-500'}`}>{value}{unit}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${good ? 'bg-green-500' : 'bg-red-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
