'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  title: string;
  description?: string;
}

export function TopBar({ title, description }: TopBarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
          {description && (
            <p className="text-slate-600 mt-1 text-sm font-medium">{description}</p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 text-slate-700 hover:text-white hover:bg-slate-900 border border-slate-300 hover:border-slate-900 rounded-lg transition-all font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>יציאה</span>
        </button>
      </div>
    </div>
  );
}

