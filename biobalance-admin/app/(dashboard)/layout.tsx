import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>
      
      {/* Sidebar on the right (RTL) */}
      <Sidebar />
    </div>
  );
}

