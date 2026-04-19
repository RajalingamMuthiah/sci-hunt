'use client';

/* ─── Teacher Dashboard ─────────────────────────────────────────────────── */
export default function TeacherDashboard() {
  const stats = [
    { label: 'My Exams',        value: '8',   sub: '3 active' },
    { label: 'Total Students',  value: '124', sub: 'across classes' },
    { label: 'Avg. Score',      value: '72%', sub: 'this term' },
    { label: 'Pending Reviews', value: '5',   sub: 'submissions' },
  ];

  const exams = [
    { name: 'Physics – Unit 3',    class: 'Class 10-A', due: '22 Apr 2026', attempts: 28, avg: '68%',  status: 'Active' },
    { name: 'Chemistry Midterm',   class: 'Class 10-B', due: '25 Apr 2026', attempts: 31, avg: '74%',  status: 'Active' },
    { name: 'Biology Quiz 5',      class: 'Class 9-A',  due: '18 Apr 2026', attempts: 26, avg: '81%',  status: 'Closed' },
    { name: 'Science Olympiad Prep', class: 'Class 11', due: '30 Apr 2026', attempts: 0,  avg: '—',    status: 'Draft' },
  ];

  const recentStudents = [
    { name: 'Arjun Mehta',    class: 'Class 10-A', score: '88%', submitted: '2 hrs ago' },
    { name: 'Priya Sharma',   class: 'Class 10-B', score: '76%', submitted: '3 hrs ago' },
    { name: 'Rahul Verma',    class: 'Class 10-A', score: '62%', submitted: '5 hrs ago' },
    { name: 'Sneha Patel',    class: 'Class 9-A',  score: '91%', submitted: '1 day ago' },
  ];

  const statusColor = (s) =>
    s === 'Active' ? 'bg-green-100 text-green-700' :
    s === 'Closed' ? 'bg-slate-100 text-slate-600' :
    'bg-yellow-100 text-yellow-700';

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your exams and track student performance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{s.value}</p>
            <p className="mt-1 text-xs text-slate-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Exams */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">My Exams</h2>
          <button className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand/90 transition">
            + New Exam
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {['Exam Name', 'Class', 'Due Date', 'Attempts', 'Avg Score', 'Status', ''].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exams.map((e) => (
                <tr key={e.name} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3 font-medium text-slate-800">{e.name}</td>
                  <td className="px-6 py-3 text-slate-500">{e.class}</td>
                  <td className="px-6 py-3 text-slate-500">{e.due}</td>
                  <td className="px-6 py-3 text-slate-500">{e.attempts}</td>
                  <td className="px-6 py-3 text-slate-500">{e.avg}</td>
                  <td className="px-6 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(e.status)}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button className="text-xs text-brand hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Recent Submissions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {['Student', 'Class', 'Score', 'Submitted'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentStudents.map((s) => (
                <tr key={s.name} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3 font-medium text-slate-800">{s.name}</td>
                  <td className="px-6 py-3 text-slate-500">{s.class}</td>
                  <td className="px-6 py-3">
                    <span className="font-semibold text-slate-800">{s.score}</span>
                  </td>
                  <td className="px-6 py-3 text-slate-400">{s.submitted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
