'use client';

/**
 * /preview  —  Dev-only dashboard preview
 * View all role dashboards with mock data, no auth / MongoDB required.
 * Access at: http://localhost:3000/preview
 */

import { useMemo, useState } from 'react';
import { AuthContext } from '@/context/AuthProvider';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import SchoolAdminDashboard from '@/components/dashboard/SchoolAdminDashboard';
import SuperAdminDashboard from '@/components/dashboard/SuperAdminDashboard';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';

/* ─── Mock users per role ───────────────────────────────────────────────── */
const MOCK_USERS = {
  STUDENT: {
    id: 'preview-student',
    name: 'Arjun Mehta',
    email: 'student@preview.dev',
    role: 'STUDENT',
    mfaEnabled: false,
  },
  SCHOOL_ADMIN: {
    id: 'preview-school-admin',
    name: 'Dr. Priya Nair',
    email: 'schooladmin@preview.dev',
    role: 'SCHOOL_ADMIN',
    mfaEnabled: false,
  },
  TEACHER: {
    id: 'preview-teacher',
    name: 'Mr. Rahul Verma',
    email: 'teacher@preview.dev',
    role: 'TEACHER',
    mfaEnabled: false,
  },
  SUPER_ADMIN: {
    id: 'preview-super-admin',
    name: 'Super Admin',
    email: 'superadmin@preview.dev',
    role: 'SUPER_ADMIN',
    mfaEnabled: true,
  },
};

const ROLES = ['STUDENT', 'SCHOOL_ADMIN', 'TEACHER', 'SUPER_ADMIN'];

const ROLE_LABEL = {
  STUDENT:     'Student',
  SCHOOL_ADMIN:'School Admin',
  TEACHER:     'Teacher',
  SUPER_ADMIN: 'Super Admin',
};

const ROLE_COLOR = {
  STUDENT:     'bg-blue-100 text-blue-700 border-blue-200',
  SCHOOL_ADMIN:'bg-emerald-100 text-emerald-700 border-emerald-200',
  TEACHER:     'bg-purple-100 text-purple-700 border-purple-200',
  SUPER_ADMIN: 'bg-rose-100 text-rose-700 border-rose-200',
};

function RoleContent({ role }) {
  switch (role) {
    case 'SUPER_ADMIN':  return <SuperAdminDashboard />;
    case 'SCHOOL_ADMIN': return <SchoolAdminDashboard />;
    case 'TEACHER':      return <TeacherDashboard />;
    case 'STUDENT':
    default:             return <StudentDashboard />;
  }
}

export default function PreviewPage() {
  const [activeRole, setActiveRole] = useState('STUDENT');

  /* Provide a fully-mocked auth context so child components can call useAuth() */
  const mockAuthValue = useMemo(
    () => ({
      user: MOCK_USERS[activeRole],
      isAuthenticated: true,
      isLoading: false,
      mfaRequired: false,
      mfaChallengeToken: null,
      login: async () => {},
      register: async () => {},
      logout: async () => {},
      verifyMfa: async () => {},
      setupMfa: async () => {},
      enableMfa: async () => {},
      refreshProfile: async () => MOCK_USERS[activeRole],
    }),
    [activeRole]
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Preview banner */}
      <div className="sticky top-0 z-50 flex items-center gap-3 border-b border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">
        <span className="font-semibold">DEV PREVIEW</span>
        <span className="text-amber-600">—</span>
        <span>Mock data only. No backend required.</span>
        <span className="ml-auto text-amber-500">http://localhost:3000/preview</span>
      </div>

      {/* Role switcher */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-slate-200">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 mr-2">Switch Role:</span>
        {ROLES.map((role) => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              activeRole === role
                ? ROLE_COLOR[role] + ' shadow-sm'
                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            {ROLE_LABEL[role]}
          </button>
        ))}
      </div>

      {/* Dashboard rendered with mock auth */}
      <AuthContext.Provider value={mockAuthValue}>
        <DashboardLayout>
          <RoleContent role={activeRole} />
        </DashboardLayout>
      </AuthContext.Provider>

    </div>
  );
}
