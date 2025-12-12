import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export async function GET() {
  try {
    const { data: recipes, error } = await supabaseAdmin
      .from('saved_recipes')
      .select('*, user_profiles(email)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'שגיאה בטעינת מתכונים' },
        { status: 500 }
      );
    }

    // Add user email to each recipe
    const recipesWithEmail = recipes?.map(recipe => ({
      ...recipe,
      user_email: recipe.user_profiles?.email,
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

