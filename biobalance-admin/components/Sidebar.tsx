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
  Sparkles,
  Settings,
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
  { href: '/users', label: 'משתמשים', icon: Users },
  { href: '/stats', label: 'סטטיסטיקה יומית', icon: BarChart3 },
  { href: '/meals', label: 'ארוחות', icon: Utensils },
  { href: '/recipes', label: 'מתכונים שמורים', icon: BookOpen },
  { href: '/chats', label: 'שיחות צ\'אט', icon: MessageSquare },
  { href: '/ai-insights', label: 'תובנות AI', icon: Sparkles },
  { href: '/settings', label: 'הגדרות', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-l border-gray-200 min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-emerald-600">BioBalance</h1>
        <p className="text-sm text-gray-500 mt-1">מערכת ניהול</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

