import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export async function GET() {
  try {
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

    return NextResponse.json({
      todayStats: todayStats || [],
      recentStats: recentStats || [],
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

