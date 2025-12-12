import { TopBar } from '@/components/TopBar';
import { StatsCard } from '@/components/StatsCard';
import { DataTable } from '@/components/DataTable';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';
import { Flame, Beef, Droplet, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getStatsData() {
  const today = new Date().toISOString().split('T')[0];

  // Get today's stats
  const { data: todayStats } = await supabaseAdmin
    .from('daily_stats')
    .select('*, user_profiles(email, full_name)')
    .eq('date', today)
    .order('calories', { ascending: false });

  // Calculate averages for today
  const avgCalories = todayStats?.length
    ? Math.round(todayStats.reduce((sum, s) => sum + (s.calories || 0), 0) / todayStats.length)
    : 0;

  const avgProtein = todayStats?.length
    ? Math.round(todayStats.reduce((sum, s) => sum + (s.protein || 0), 0) / todayStats.length)
    : 0;

  const avgWater = todayStats?.length
    ? Math.round(todayStats.reduce((sum, s) => sum + (s.water || 0), 0) / todayStats.length)
    : 0;

  // Get recent stats (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const { data: recentStats } = await supabaseAdmin
    .from('daily_stats')
    .select('*, user_profiles(email, full_name)')
    .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
    .order('date', { ascending: false })
    .limit(100);

  return {
    todayStats: todayStats || [],
    recentStats: recentStats || [],
    avgCalories,
    avgProtein,
    avgWater,
    activeToday: todayStats?.length || 0,
  };
}

export default async function StatsPage() {
  const { todayStats, recentStats, avgCalories, avgProtein, avgWater, activeToday } = await getStatsData();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('he-IL');
  };

  const getUserName = (stat: any) => {
    return stat.user_profiles?.full_name || stat.user_profiles?.email || 'לא ידוע';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="סטטיסטיקה יומית"
        description="סיכומי יום של כל משתמש - קלוריות, חלבון, שומן, פחמימות ומים"
      />

      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="ממוצע קלוריות היום"
            value={avgCalories}
            icon={Flame}
            description="קלוריות ממוצעות"
          />
          <StatsCard
            title="ממוצע חלבון היום"
            value={`${avgProtein}g`}
            icon={Beef}
            description="חלבון ממוצע"
          />
          <StatsCard
            title="ממוצע מים היום"
            value={avgWater}
            icon={Droplet}
            description="כוסות מים ממוצעות"
          />
          <StatsCard
            title="משתמשים פעילים היום"
            value={activeToday}
            icon={TrendingUp}
            description="דיווחו היום"
          />
        </div>

        {/* Today's Stats */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">נתוני היום</h3>
          <DataTable
            columns={[
              {
                key: 'user',
                header: 'משתמש',
                render: (stat) => getUserName(stat),
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
            data={todayStats}
            emptyMessage="אין נתונים להיום"
          />
        </div>

        {/* Recent Stats (30 days) */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">נתוני 30 ימים אחרונים</h3>
          <DataTable
            columns={[
              {
                key: 'date',
                header: 'תאריך',
                render: (stat) => formatDate(stat.date),
              },
              {
                key: 'user',
                header: 'משתמש',
                render: (stat) => getUserName(stat),
              },
              { key: 'calories', header: 'קלוריות' },
              {
                key: 'protein',
                header: 'חלבון (גרם)',
                render: (stat) => Math.round(stat.protein || 0),
              },
              {
                key: 'fat',
                header: 'שומן (גרם)',
                render: (stat) => Math.round(stat.fat || 0),
              },
              {
                key: 'carbs',
                header: 'פחמימות (גרם)',
                render: (stat) => Math.round(stat.carbs || 0),
              },
              { key: 'water', header: 'כוסות מים' },
            ]}
            data={recentStats}
            emptyMessage="אין נתונים"
          />
        </div>
      </div>
    </div>
  );
}

