import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export async function GET() {
  try {
    // Get all chat messages with user profiles
    const { data: messages, error } = await supabaseAdmin
      .from('chat_messages')
      .select('user_id, created_at, user_profiles(email)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ users: [] });
    }

    // Group by user
    const userMap = new Map();
    
    messages?.forEach((msg: any) => {
      if (!userMap.has(msg.user_id)) {
        userMap.set(msg.user_id, {
          user_id: msg.user_id,
          email: msg.user_profiles?.email || 'לא ידוע',
          messageCount: 0,
          lastMessage: new Date(msg.created_at).toLocaleDateString('he-IL'),
        });
      }
      userMap.get(msg.user_id).messageCount++;
    });

    const users = Array.from(userMap.values());

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching chat users:', error);
    return NextResponse.json({ users: [] });
  }
}

