import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export async function GET() {
  try {
    // Check chat_messages
    const { data: messages, error: msgError } = await supabaseAdmin
      .from('chat_messages')
      .select('user_id')
      .limit(10);

    // Check user_profiles  
    const { data: profiles, error: profError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email')
      .limit(10);

    const uniqueUserIds = [...new Set(messages?.map(m => m.user_id))];

    return NextResponse.json({
      chat_messages: {
        count: messages?.length || 0,
        unique_users: uniqueUserIds.length,
        user_ids: uniqueUserIds,
        error: msgError,
      },
      user_profiles: {
        count: profiles?.length || 0,
        profiles: profiles?.map(p => ({ id: p.id, email: p.email })),
        error: profError,
      },
      match: {
        message: uniqueUserIds.length > 0 && profiles 
          ? `${uniqueUserIds.filter(id => profiles.find(p => p.id === id)).length} out of ${uniqueUserIds.length} users have profiles`
          : 'No data to compare'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

