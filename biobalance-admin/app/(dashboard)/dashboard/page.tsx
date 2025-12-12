'use client';

import { TopBar } from '@/components/TopBar';
import { StatsCard } from '@/components/StatsCard';
import { DataTable } from '@/components/DataTable';
import { Users, Activity, Flame, Droplet } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DashboardData {
  stats: {
    totalUsers: number;
    activeUsersToday: number;
    avgCalories: number;
    avgProtein: number;
    avgWater: number;
  };
  atRiskUsers: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalUsers: 0,
      activeUsersToday: 0,
      avgCalories: 0,
      avgProtein: 0,
      avgWater: 0,
    },
    atRiskUsers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar title="לוח בקרה" description="טוען..." />
        <div className="p-8 text-center">טוען נתונים...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar 
        title="לוח בקרה" 
        description="סקירה כללית של המערכת והמשתמשים"
      />
      
      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="משתמשים רשומים"
            value={data.stats.totalUsers}
            icon={Users}
            description="סה״כ משתמשים במערכת"
          />
          <StatsCard
            title="פעילים היום"
            value={data.stats.activeUsersToday}
            icon={Activity}
            description="משתמשים שדיווחו היום"
          />
          <StatsCard
            title="ממוצע קלוריות"
            value={data.stats.avgCalories}
            icon={Flame}
            description="קלוריות ממוצעות ליום"
          />
          <StatsCard
            title="ממוצע כוסות מים"
            value={data.stats.avgWater}
            icon={Droplet}
            description="כוסות מים ממוצעות למשתמש"
          />
        </div>

        {/* At Risk Users */}
        {data.atRiskUsers.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              משתמשים בסיכון לנטישה
            </h3>
            <DataTable
              columns={[
                { key: 'email', header: 'אימייל' },
                { key: 'full_name', header: 'שם מלא' },
                {
                  key: 'action',
                  header: 'פעולה',
                  render: () => (
                    <span className="text-emerald-600 font-medium">צור קשר</span>
                  ),
                },
              ]}
              data={data.atRiskUsers}
              emptyMessage="אין משתמשים בסיכון"
            />
          </div>
        )}

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            סטטיסטיקות מהירות
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-500 text-sm mb-1">חלבון ממוצע</p>
              <p className="text-2xl font-bold text-gray-900">{data.stats.avgProtein}g</p>
              <p className="text-sm text-gray-600 mt-1">ליום</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">שיעור השלמה</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.stats.totalUsers > 0
                  ? Math.round((data.stats.activeUsersToday / data.stats.totalUsers) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-gray-600 mt-1">משתמשים פעילים</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">נטישה</p>
              <p className="text-2xl font-bold text-gray-900">{data.atRiskUsers.length}</p>
              <p className="text-sm text-gray-600 mt-1">משתמשים בסיכון</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

