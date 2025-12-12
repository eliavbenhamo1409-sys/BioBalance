import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: user } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }

    // Get user's daily stats
    const { data: stats } = await supabaseAdmin
      .from('daily_stats')
      .select('*')
      .eq('user_id', id)
      .order('date', { ascending: false })
      .limit(30);

    // Get user's meals
    const { data: meals } = await supabaseAdmin
      .from('meals')
      .select('*')
      .eq('user_id', id)
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

    return NextResponse.json({
      user,
      stats: stats || [],
      meals: meals || [],
      avgCalories,
      avgProtein,
      avgWater,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת נתונים' },
      { status: 500 }
    );
  }
}

