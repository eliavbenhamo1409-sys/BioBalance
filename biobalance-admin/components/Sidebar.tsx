'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Utensils,
  BookOpen,
  MessageSquare,
  Brain,
  Settings,
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
  { href: '/users', label: 'משתמשים', icon: Users },
  { href: '/stats', label: 'סטטיסטיקה', icon: BarChart3 },
  { href: '/meals', label: 'ארוחות', icon: Utensils },
  { href: '/recipes', label: 'מתכונים', icon: BookOpen },
  { href: '/chats', label: 'שיחות', icon: MessageSquare },
  { href: '/ai-insights', label: 'ניתוח AI', icon: Brain },
  { href: '/settings', label: 'הגדרות', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-l border-slate-800 min-h-screen p-6">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white tracking-tight">BioBalance</h1>
        <p className="text-sm text-slate-400 mt-1 font-medium">Admin Dashboard</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all group
                ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-900/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="border-t border-slate-700 pt-4">
          <p className="text-xs text-slate-500 text-center">Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
}

