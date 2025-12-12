import { supabaseAdmin } from './supabaseAdminClient';

// חישוב סטטיסטיקות כלליות
export async function getOverallStats() {
  try {
    // ספירת משתמשים רשומים
    const { count: totalUsers } = await supabaseAdmin
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });

    // משתמשים פעילים היום
    const today = new Date().toISOString().split('T')[0];
    const { data: activeToday } = await supabaseAdmin
      .from('daily_stats')
      .select('user_id')
      .eq('date', today);

    const activeUsersToday = new Set(activeToday?.map(s => s.user_id)).size;

    // ממוצע קלוריות היום
    const { data: todayStats } = await supabaseAdmin
      .from('daily_stats')
      .select('calories, protein, water')
      .eq('date', today);

    const avgCalories = todayStats?.length
      ? Math.round(todayStats.reduce((sum, s) => sum + (s.calories || 0), 0) / todayStats.length)
      : 0;

    const avgProtein = todayStats?.length
      ? Math.round(todayStats.reduce((sum, s) => sum + (s.protein || 0), 0) / todayStats.length)
      : 0;

    const avgWater = todayStats?.length
      ? Math.round(todayStats.reduce((sum, s) => sum + (s.water || 0), 0) / todayStats.length)
      : 0;

    return {
      totalUsers: totalUsers || 0,
      activeUsersToday,
      avgCalories,
      avgProtein,
      avgWater,
    };
  } catch (error) {
    console.error('Error fetching overall stats:', error);
    return {
      totalUsers: 0,
      activeUsersToday: 0,
      avgCalories: 0,
      avgProtein: 0,
      avgWater: 0,
    };
  }
}

// נתונים להיסטוריית פעילות (30 ימים אחרונים)
export async function getActivityHistory(days: number = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data } = await supabaseAdmin
      .from('daily_stats')
      .select('date, user_id')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    // קבץ לפי תאריך
    const grouped = data?.reduce((acc: any, item) => {
      if (!acc[item.date]) {
        acc[item.date] = new Set();
      }
      acc[item.date].add(item.user_id);
      return acc;
    }, {});

    const result = Object.entries(grouped || {}).map(([date, users]: [string, any]) => ({
      date,
      activeUsers: users.size,
    }));

    return result;
  } catch (error) {
    console.error('Error fetching activity history:', error);
    return [];
  }
}

// משתמשים בסיכון לנטישה
export async function getAtRiskUsers(inactiveDays: number = 3) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

    // קבל את כל המשתמשים
    const { data: allUsers } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, full_name');

    if (!allUsers) return [];

    // קבל משתמשים שדיווחו לאחרונה
    const { data: recentActivity } = await supabaseAdmin
      .from('daily_stats')
      .select('user_id')
      .gte('date', cutoffDateStr);

    const activeUserIds = new Set(recentActivity?.map(s => s.user_id));

    // סנן משתמשים שלא פעילים
    const atRisk = allUsers.filter(user => !activeUserIds.has(user.id));

    return atRisk;
  } catch (error) {
    console.error('Error fetching at-risk users:', error);
    return [];
  }
}

