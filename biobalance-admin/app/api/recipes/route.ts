import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export async function GET() {
  try {
    // Get recipes
    const { data: recipes, error: recipesError } = await supabaseAdmin
      .from('saved_recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (recipesError) {
      console.error('Supabase error:', recipesError);
      return NextResponse.json(
        { error: 'שגיאה בטעינת מתכונים' },
        { status: 500 }
      );
    }

    // Get unique user IDs
    const userIds = [...new Set(recipes?.map(r => r.user_id).filter(Boolean))];
    
    // Get user profiles
    const { data: users } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email')
      .in('id', userIds);

    // Create user map
    const userMap = new Map(users?.map(u => [u.id, u.email]) || []);

    // Add user email to each recipe
    const recipesWithEmail = recipes?.map(recipe => ({
      ...recipe,
      user_email: userMap.get(recipe.user_id) || 'לא ידוע',
    })) || [];

    return NextResponse.json({ recipes: recipesWithEmail });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת מתכונים' },
      { status: 500 }
    );
  }
}

