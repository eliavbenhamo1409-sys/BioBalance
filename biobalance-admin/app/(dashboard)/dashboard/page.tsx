import { TopBar } from '@/components/TopBar';
import { StatsCard } from '@/components/StatsCard';
import { DataTable } from '@/components/DataTable';
import { Users, Activity, Flame, Droplet } from 'lucide-react';
import { getOverallStats, getActivityHistory, getAtRiskUsers } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const stats = await getOverallStats();
  const atRiskUsers = await getAtRiskUsers();

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
            value={stats.totalUsers}
            icon={Users}
            description="סה״כ משתמשים במערכת"
          />
          <StatsCard
            title="פעילים היום"
            value={stats.activeUsersToday}
            icon={Activity}
            description="משתמשים שדיווחו היום"
          />
          <StatsCard
            title="ממוצע קלוריות"
            value={stats.avgCalories}
            icon={Flame}
            description="קלוריות ממוצעות ליום"
          />
          <StatsCard
            title="ממוצע כוסות מים"
            value={stats.avgWater}
            icon={Droplet}
            description="כוסות מים ממוצעות למשתמש"
          />
        </div>

        {/* At Risk Users */}
        {atRiskUsers.length > 0 && (
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
              data={atRiskUsers}
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
              <p className="text-2xl font-bold text-gray-900">{stats.avgProtein}g</p>
              <p className="text-sm text-gray-600 mt-1">ליום</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">שיעור השלמה</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalUsers > 0
                  ? Math.round((stats.activeUsersToday / stats.totalUsers) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-gray-600 mt-1">משתמשים פעילים</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">נטישה</p>
              <p className="text-2xl font-bold text-gray-900">{atRiskUsers.length}</p>
              <p className="text-sm text-gray-600 mt-1">משתמשים בסיכון</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

