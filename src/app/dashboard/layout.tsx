import { AdminShell } from '@/components/layout/AdminShell';
import { RequireAuth } from '@/components/auth/RequireAuth';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequireAuth>
      <AdminShell>{children}</AdminShell>
    </RequireAuth>
  );
}
