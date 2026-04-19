'use client';

import Link from 'next/link';

const METRICS = [
  { label: 'Total Classes',    value: '8',   sub: '2 added this term',   color: 'teal'   },
  { label: 'Total Students',   value: '214', sub: '+12 this month',       color: 'violet' },
  { label: 'Teachers',         value: '16',  sub: '3 pending approval',   color: 'amber'  },
  { label: 'Active Exams',     value: '5',   sub: '2 ending this week',   color: 'sky'    },
];

const RECENT_STUDENTS = [
  { name: 'Arjun Mehta',    class: 'Grade 10-A', joined: 'Apr 17, 2026', status: 'active'   },
  { name: 'Priya Sharma',   class: 'Grade 9-B',  joined: 'Apr 16, 2026', status: 'active'   },
  { name: 'Ravi Kumar',     class: 'Grade 11-C', joined: 'Apr 15, 2026', status: 'pending'  },
  { name: 'Sneha Patel',    class: 'Grade 10-A', joined: 'Apr 14, 2026', status: 'active'   },
];

const CLASSES = [
  { name: 'Grade 9-A',  teacher: 'Dr. S. Iyer',     students: 28, exams: 3 },
  { name: 'Grade 10-A', teacher: 'Mr. R. Nair',      students: 31, exams: 5 },
  { name: 'Grade 11-B', teacher: 'Ms. K. Reddy',     students: 25, exams: 4 },
];

export default function SchoolAdminDashboard() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">School Admin Dashboard</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">School Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your classes, students, and teaching staff.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {METRICS.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Classes */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Classes</h2>
            <Link href="/dashboard/classes" className="text-xs font-medium text-brand hover:underline">Manage →</Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Teacher</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Students</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Exams</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CLASSES.map((c) => (
                  <tr key={c.name} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                    <td className="px-4 py-3 text-slate-500">{c.teacher}</td>
                    <td className="px-4 py-3 text-center text-slate-700">{c.students}</td>
                    <td className="px-4 py-3 text-center text-slate-700">{c.exams}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Students */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Recent Students</h2>
            <Link href="/dashboard/students" className="text-xs font-medium text-brand hover:underline">View all →</Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RECENT_STUDENTS.map((s) => (
                  <tr key={s.name} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                    <td className="px-4 py-3 text-slate-500">{s.class}</td>
                    <td className="px-4 py-3 text-slate-500">{s.joined}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, color }) {
  const c = {
    teal:   'text-teal-600',
    violet: 'text-violet-600',
    amber:  'text-amber-600',
    sky:    'text-sky-600',
  }[color] ?? 'text-slate-700';
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className={`text-2xl font-bold ${c}`}>{value}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-700">{label}</p>
      <p className="mt-1 text-xs text-slate-400">{sub}</p>
    </div>
  );
}
