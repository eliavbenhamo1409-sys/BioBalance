import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export async function GET() {
  try {
    // Get meals
    const { data: meals, error: mealsError } = await supabaseAdmin
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (mealsError) {
      console.error('Supabase error:', mealsError);
      return NextResponse.json({ meals: [] }, { status: 500 });
    }

    // Get unique user IDs
    const userIds = [...new Set(meals?.map(m => m.user_id).filter(Boolean))];
    
    // Get user profiles
    const { data: users } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, full_name')
      .in('id', userIds);

    // Create user map
    const userMap = new Map(users?.map(u => [u.id, u]) || []);

    // Add user info to meals
    const mealsWithUsers = meals?.map(meal => ({
      ...meal,
      user_profiles: userMap.get(meal.user_id),
    })) || [];

    return NextResponse.json({ meals: mealsWithUsers });
  } catch (error) {
    console.error('Error fetching meals:', error);
    return NextResponse.json({ meals: [] }, { status: 500 });
  }
}

