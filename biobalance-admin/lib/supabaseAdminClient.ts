import { createClient } from '@supabase/supabase-js';

// Client זה ישמש רק בצד השרת (Server Components & API Routes)
// הוא משתמש ב-SERVICE_ROLE_KEY שיש לו הרשאות מלאות
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Types for our database tables
export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  goal?: 'cut' | 'bulk' | 'maintain';
  created_at?: string;
  last_active?: string;
}

export interface DailyStat {
  id: string;
  user_id: string;
  date: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  water: number;
  created_at: string;
  updated_at: string;
}

export interface Meal {
  id: string;
  user_id: string;
  description?: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  created_at: string;
}

export interface SavedRecipe {
  id: string;
  user_id: string;
  title: string;
  content: string;
  calories: number;
  protein: number;
  fat: number;
  tags?: string[];
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

