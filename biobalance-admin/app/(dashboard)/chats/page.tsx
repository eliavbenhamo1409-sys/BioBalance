'use client';

import { TopBar } from '@/components/TopBar';
import { MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ChatUser {
  user_id: string;
  email: string;
  messageCount: number;
  lastMessage: string;
}

export default function ChatsPage() {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChatUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId]);

  const fetchChatUsers = async () => {
    try {
      const response = await fetch('/api/chats/users');
      const data = await response.json();
      setChatUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching chat users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const response = await fetch(`/api/chats/${userId}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('he-IL', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="שיחות צ'אט"
        description="שיחות המשתמשים עם הבוט"
      />

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Users List */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">משתמשים ({chatUsers.length})</h3>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
              {loading ? (
                <div className="p-8 text-center text-gray-500">טוען...</div>
              ) : chatUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">אין שיחות</div>
              ) : (
                chatUsers.map((user) => (
                  <div
                    key={user.user_id}
                    onClick={() => setSelectedUserId(user.user_id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-emerald-50 transition-colors ${
                      selectedUserId === user.user_id ? 'bg-emerald-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{user.email}</p>
                        <p className="text-sm text-gray-500">{user.messageCount} הודעות</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{user.lastMessage}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
            {selectedUserId ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900">
                    {chatUsers.find(u => u.user_id === selectedUserId)?.email || 'משתמש'}
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.role === 'user' ? 'text-emerald-100' : 'text-gray-500'
                          }`}
                        >
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                בחר משתמש כדי לראות את השיחה
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

