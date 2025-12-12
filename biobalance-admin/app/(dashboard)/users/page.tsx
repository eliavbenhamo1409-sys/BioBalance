'use client';

import { TopBar } from '@/components/TopBar';
import { DataTable } from '@/components/DataTable';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

interface User {
  id: string;
  email?: string;
  full_name?: string;
  goal?: string;
  created_at?: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('he-IL');
  };

  const formatGoal = (goal?: string) => {
    const goalMap: Record<string, string> = {
      cut: 'חיטוב',
      bulk: 'מסה',
      maintain: 'שמירה',
    };
    return goalMap[goal || ''] || goal || '-';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="משתמשים"
        description="ניהול וצפייה בכל המשתמשים במערכת"
      />

      <div className="p-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="חיפוש לפי אימייל או שם..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <DataTable
            columns={[
              {
                key: 'email',
                header: 'אימייל',
                render: (user) => user.email || '-',
              },
              {
                key: 'full_name',
                header: 'שם מלא',
                render: (user) => user.full_name || '-',
              },
              {
                key: 'goal',
                header: 'מטרה',
                render: (user) => (
                  <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700">
                    {formatGoal(user.goal)}
                  </span>
                ),
              },
              {
                key: 'created_at',
                header: 'תאריך הצטרפות',
                render: (user) => formatDate(user.created_at),
              },
            ]}
            data={filteredUsers}
            onRowClick={(user) => router.push(`/users/${user.id}`)}
            emptyMessage="לא נמצאו משתמשים"
          />
        )}

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-600">
          מציג {filteredUsers.length} מתוך {users.length} משתמשים
        </div>
      </div>
    </div>
  );
}

