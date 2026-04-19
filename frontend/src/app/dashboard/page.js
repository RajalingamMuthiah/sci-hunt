'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthProvider';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import SchoolAdminDashboard from '@/components/dashboard/SchoolAdminDashboard';
import SuperAdminDashboard from '@/components/dashboard/SuperAdminDashboard';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <RoleDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function RoleDashboard() {
  const { user } = useAuth();
  switch (user?.role) {
    case 'SUPER_ADMIN':  return <SuperAdminDashboard />;
    case 'SCHOOL_ADMIN': return <SchoolAdminDashboard />;
    case 'TEACHER':      return <TeacherDashboard />;
    case 'STUDENT':
    default:             return <StudentDashboard />;
  }
}


