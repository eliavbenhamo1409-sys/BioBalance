import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get today's stats
    const { data: todayStats } = await supabaseAdmin
      .from('daily_stats')
      .select('*')
      .eq('date', today)
      .order('calories', { ascending: false });

    // Get recent stats (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { data: recentStats } = await supabaseAdmin
      .from('daily_stats')
      .select('*')
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('date', { ascending: false })
      .limit(100);

    // Get unique user IDs from both datasets
    const allStats = [...(todayStats || []), ...(recentStats || [])];
    const userIds = [...new Set(allStats.map(s => s.user_id).filter(Boolean))];
    
    // Get user profiles
    const { data: users } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, full_name')
      .in('id', userIds);

    // Create user map
    const userMap = new Map(users?.map(u => [u.id, u]) || []);

    // Add user info to stats
    const todayStatsWithUsers = todayStats?.map(stat => ({
      ...stat,
      user_profiles: userMap.get(stat.user_id),
    })) || [];

    const recentStatsWithUsers = recentStats?.map(stat => ({
      ...stat,
      user_profiles: userMap.get(stat.user_id),
    })) || [];

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

    return NextResponse.json({
      todayStats: todayStatsWithUsers,
      recentStats: recentStatsWithUsers,
      avgCalories,
      avgProtein,
      avgWater,
      activeToday: todayStats?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      {
        todayStats: [],
        recentStats: [],
        avgCalories: 0,
        avgProtein: 0,
        avgWater: 0,
        activeToday: 0,
      },
      { status: 500 }
    );
  }
}

