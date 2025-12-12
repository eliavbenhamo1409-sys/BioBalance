import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export async function GET() {
  try {
    // Get all chat messages
    const { data: messages, error: messagesError } = await supabaseAdmin
      .from('chat_messages')
      .select('user_id, created_at')
      .order('created_at', { ascending: false });

    if (messagesError) {
      console.error('Supabase error:', messagesError);
      return NextResponse.json({ users: [] });
    }

    // Get unique user IDs
    const userIds = [...new Set(messages?.map(m => m.user_id).filter(Boolean))];
    
    // Get user profiles
    const { data: users } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email')
      .in('id', userIds);

    // Create user map
    const userEmailMap = new Map(users?.map(u => [u.id, u.email]) || []);

    // Group by user
    const userMap = new Map();
    
    messages?.forEach((msg: any) => {
      if (!userMap.has(msg.user_id)) {
        const userEmail = userEmailMap.get(msg.user_id);
        userMap.set(msg.user_id, {
          user_id: msg.user_id,
          // Show user_id if no email found (for debugging)
          email: userEmail || `משתמש: ${msg.user_id.slice(0, 8)}...`,
          messageCount: 0,
          lastMessage: new Date(msg.created_at).toLocaleDateString('he-IL'),
        });
      }
      userMap.get(msg.user_id).messageCount++;
    });

    const chatUsers = Array.from(userMap.values());

    // Debug logging
    console.log('Chat users found:', chatUsers.length);
    console.log('User IDs from messages:', userIds);
    console.log('User profiles found:', users?.length || 0);

    return NextResponse.json({ users: chatUsers });
  } catch (error) {
    console.error('Error fetching chat users:', error);
    return NextResponse.json({ users: [] });
  }
}

