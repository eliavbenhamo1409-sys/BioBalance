import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export async function GET() {
  try {
    const { data: meals, error } = await supabaseAdmin
      .from('meals')
      .select('*, user_profiles(email, full_name)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ meals: [] }, { status: 500 });
    }

    return NextResponse.json({ meals: meals || [] });
  } catch (error) {
    console.error('Error fetching meals:', error);
    return NextResponse.json({ meals: [] }, { status: 500 });
  }
}

