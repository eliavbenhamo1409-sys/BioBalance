import { TopBar } from '@/components/TopBar';
import { StatsCard } from '@/components/StatsCard';
import { DataTable } from '@/components/DataTable';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';
import { Flame, Beef, Droplet, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getUserData(userId: string) {
  const { data: user } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!user) return null;

  // Get user's daily stats
  const { data: stats } = await supabaseAdmin
    .from('daily_stats')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(30);

  // Get user's meals
  const { data: meals } = await supabaseAdmin
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  // Calculate averages
  const avgCalories = stats?.length
    ? Math.round(stats.reduce((sum, s) => sum + (s.calories || 0), 0) / stats.length)
    : 0;

  const avgProtein = stats?.length
    ? Math.round(stats.reduce((sum, s) => sum + (s.protein || 0), 0) / stats.length)
    : 0;

  const avgWater = stats?.length
    ? Math.round(stats.reduce((sum, s) => sum + (s.water || 0), 0) / stats.length)
    : 0;

  return { user, stats: stats || [], meals: meals || [], avgCalories, avgProtein, avgWater };
}

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getUserData(id);

  if (!data) {
    notFound();
  }

  const { user, stats, meals, avgCalories, avgProtein, avgWater } = data;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('he-IL');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title={user.full_name || user.email || 'משתמש'}
        description={`פרטי משתמש מלאים - ${user.email || ''}`}
      />

      <div className="p-8">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">פרטי פרופיל</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">אימייל</p>
              <p className="text-lg font-medium text-gray-900">{user.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">מטרה</p>
              <p className="text-lg font-medium text-gray-900">
                {user.goal === 'cut' ? 'חיטוב' : user.goal === 'bulk' ? 'מסה' : user.goal === 'maintain' ? 'שמירה' : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">תאריך הצטרפות</p>
              <p className="text-lg font-medium text-gray-900">{formatDate(user.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="ממוצע קלוריות"
            value={avgCalories}
            icon={Flame}
            description="ב-30 ימים אחרונים"
          />
          <StatsCard
            title="ממוצע חלבון"
            value={`${avgProtein}g`}
            icon={Beef}
            description="ב-30 ימים אחרונים"
          />
          <StatsCard
            title="ממוצע מים"
            value={avgWater}
            icon={Droplet}
            description="כוסות ביום"
          />
          <StatsCard
            title="ימי פעילות"
            value={stats.length}
            icon={Calendar}
            description="ב-30 ימים אחרונים"
          />
        </div>

        {/* Recent Stats */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">סטטיסטיקה יומית אחרונה</h3>
          <DataTable
            columns={[
              {
                key: 'date',
                header: 'תאריך',
                render: (stat) => formatDate(stat.date),
              },
              { key: 'calories', header: 'קלוריות' },
              {
                key: 'protein',
                header: 'חלבון (גרם)',
                render: (stat) => Math.round(stat.protein || 0),
              },
              {
                key: 'carbs',
                header: 'פחמימות (גרם)',
                render: (stat) => Math.round(stat.carbs || 0),
              },
              {
                key: 'fat',
                header: 'שומן (גרם)',
                render: (stat) => Math.round(stat.fat || 0),
              },
              { key: 'water', header: 'כוסות מים' },
            ]}
            data={stats}
            emptyMessage="אין נתונים"
          />
        </div>

        {/* Recent Meals */}
        {meals.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">ארוחות אחרונות</h3>
            <DataTable
              columns={[
                {
                  key: 'created_at',
                  header: 'תאריך',
                  render: (meal) => formatDate(meal.created_at),
                },
                {
                  key: 'description',
                  header: 'תיאור',
                  render: (meal) => meal.description || '-',
                },
                { key: 'calories', header: 'קלוריות' },
                {
                  key: 'protein',
                  header: 'חלבון',
                  render: (meal) => `${Math.round(meal.protein || 0)}g`,
                },
              ]}
              data={meals}
              emptyMessage="אין ארוחות"
            />
          </div>
        )}
      </div>
    </div>
  );
}

