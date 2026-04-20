'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ClassesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout><ClassesContent /></DashboardLayout>
    </ProtectedRoute>
  );
}

function ClassesContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Classes</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-slate-400">Class management coming soon. You can manage students and teachers from their respective pages.</p>
      </div>
    </div>
  );
}
