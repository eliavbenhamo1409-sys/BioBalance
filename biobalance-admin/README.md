# 🏥 BioBalance Admin - מערכת ניהול

מערכת ניהול מתקדמת ל-BioBalance, בנויה עם Next.js 14, TypeScript, TailwindCSS ו-Supabase.

## ✨ תכונות

- 🔐 **מערכת התחברות מאובטחת** - JWT sessions עם הגנת middleware
- 📊 **לוח בקרה מקיף** - סטטיסטיקות ותובנות בזמן אמת
- 👥 **ניהול משתמשים** - צפייה מפורטת בפרופילים והיסטוריה
- 📈 **ניתוח סטטיסטי** - מעקב אחר קלוריות, חלבון, ועוד
- 🍽️ **ניהול ארוחות ומתכונים** - מעקב מלא אחר תזונה
- 💬 **צפייה בשיחות צ'אט** - מעקב אחר אינטראקציות עם הבוט
- 🤖 **תובנות AI** - ניתוח חכם של נתוני המשתמשים
- 🎨 **עיצוב RTL מודרני** - ממשק בעברית עם תמיכה מלאה בימין לשמאל

## 🚀 התקנה והרצה

### דרישות מקדימות

- Node.js 18+ 
- npm או yarn
- חשבון Supabase עם DB מוכן
- (אופציונלי) מפתח OpenAI API

### 1. התקנת תלויות

\`\`\`bash
cd biobalance-admin
npm install
\`\`\`

### 2. הגדרת משתני סביבה

צור קובץ \`.env.local\` בתיקיית הפרויקט:

\`\`\`env
# Admin Authentication
ADMIN_USERNAME=ELIAV2610
ADMIN_PASSWORD=Chen2611@

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI for AI Insights (optional)
OPENAI_API_KEY=sk-your_openai_key_here

# JWT Secret for session cookies (generate a strong random string)
JWT_SECRET=your_random_secret_key_minimum_32_characters_long
\`\`\`

**⚠️ חשוב:**
- אל תשתף את הקובץ \`.env.local\` - הוא ב-gitignore
- השתמש ב-SERVICE_ROLE_KEY רק בצד השרת
- החלף את JWT_SECRET במחרוזת אקראית חזקה

### 3. הכן את Supabase

ודא שיש לך את הטבלאות הבאות ב-Supabase:

#### user_profiles
\`\`\`sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  goal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ
);
\`\`\`

#### daily_stats
\`\`\`sql
CREATE TABLE daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  date DATE,
  calories INTEGER,
  protein NUMERIC,
  fat NUMERIC,
  carbs NUMERIC,
  water INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

#### meals
\`\`\`sql
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  description TEXT,
  calories INTEGER,
  protein NUMERIC,
  fat NUMERIC,
  carbs NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

#### saved_recipes
\`\`\`sql
CREATE TABLE saved_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  title TEXT,
  content TEXT,
  calories INTEGER,
  protein NUMERIC,
  fat NUMERIC,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

#### chat_messages
\`\`\`sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

### 4. הרצת השרת

**פיתוח:**
\`\`\`bash
npm run dev
\`\`\`

השרת יעלה על http://localhost:3000

**Production:**
\`\`\`bash
npm run build
npm start
\`\`\`

### 5. התחברות

נווט ל-http://localhost:3000/login והתחבר עם:
- **שם משתמש:** ELIAV2610
- **סיסמה:** Chen2611@

(או הערכים שהגדרת ב-ENV)

## 📦 מבנה הפרויקט

\`\`\`
biobalance-admin/
├── app/
│   ├── (dashboard)/          # Protected dashboard pages
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── stats/
│   │   ├── meals/
│   │   ├── recipes/
│   │   ├── chats/
│   │   ├── ai-insights/
│   │   ├── settings/
│   │   └── layout.tsx        # Dashboard layout with sidebar
│   ├── api/
│   │   ├── login/
│   │   ├── logout/
│   │   ├── users/
│   │   ├── recipes/
│   │   ├── chats/
│   │   └── ai-insights/
│   ├── login/                # Login page
│   ├── layout.tsx            # Root layout (RTL)
│   └── page.tsx              # Redirects to dashboard
├── components/
│   ├── Sidebar.tsx
│   ├── TopBar.tsx
│   ├── StatsCard.tsx
│   ├── DataTable.tsx
│   ├── LoadingSkeleton.tsx
│   └── EmptyState.tsx
├── lib/
│   ├── supabaseAdminClient.ts  # Supabase client (server-side only)
│   ├── auth.ts                 # JWT auth logic
│   └── analytics.ts            # Data analysis functions
├── middleware.ts              # Route protection
└── .env.local                # Environment variables (don't commit!)
\`\`\`

## 🚢 פריסה ל-Vercel

### 1. התקן Vercel CLI

\`\`\`bash
npm install -g vercel
\`\`\`

### 2. התחבר ל-Vercel

\`\`\`bash
vercel login
\`\`\`

### 3. פרוס

\`\`\`bash
cd biobalance-admin
vercel --prod
\`\`\`

### 4. הגדר משתני סביבה ב-Vercel

לך ל-Vercel Dashboard → הפרויקט שלך → Settings → Environment Variables והוסף:

- \`ADMIN_USERNAME\`
- \`ADMIN_PASSWORD\`
- \`SUPABASE_URL\`
- \`SUPABASE_SERVICE_ROLE_KEY\`
- \`JWT_SECRET\`
- \`OPENAI_API_KEY\` (אופציונלי)

**חשוב:** פרוס מחדש אחרי הוספת משתני הסביבה:
\`\`\`bash
vercel --prod
\`\`\`

## 🎨 התאמה אישית

### שינוי צבעים

ערוך את \`tailwind.config.ts\`:

\`\`\`typescript
theme: {
  extend: {
    colors: {
      emerald: { ... }, // שנה לצבע המותג שלך
    },
  },
}
\`\`\`

### שינוי טקסטים

כל הטקסטים בעברית נמצאים ישירות בקומפוננטות. חפש במחרוזות כמו:
- "לוח בקרה"
- "משתמשים"
- וכו'

### הוספת עמודים

1. צור תיקייה חדשה תחת \`app/(dashboard)/your-page/\`
2. הוסף \`page.tsx\`
3. עדכן את ה-Sidebar ב-\`components/Sidebar.tsx\`

## 🔒 אבטחה

- ✅ JWT sessions עם HttpOnly cookies
- ✅ Middleware להגנה על routes
- ✅ Service Role Key רק בצד השרת
- ✅ ENV variables מחוץ לקוד
- ✅ HTTPS ב-production (Vercel)

## 📝 טיפים

1. **לפני production:** החלף את \`JWT_SECRET\` במפתח חזק וייחודי
2. **Supabase RLS:** הפעל Row Level Security אם צריך אבטחה נוספת
3. **OpenAI:** בלי API key, המערכת תספק ניתוח בסיסי. עם מפתח - ניתוח מתקדם
4. **RTL:** כל המערכת מותאמת לעברית וימין לשמאל
5. **Mobile:** העיצוב responsive ומותאם למובייל

## 🐛 בעיות נפוצות

### "Repository not found" ב-Supabase

ודא שה-\`SUPABASE_URL\` ו-\`SUPABASE_SERVICE_ROLE_KEY\` נכונים.

### "Session expired"

נקה cookies או התחבר מחדש.

### שגיאות TypeScript

הרץ:
\`\`\`bash
npm run build
\`\`\`
לבדיקת שגיאות לפני פריסה.

## 📞 תמיכה

לשאלות או בעיות, צור issue ב-GitHub או צור קשר דרך המייל.

## 📄 רישיון

MIT License - חופשי לשימוש ושינוי.

---

**נבנה עם ❤️ עבור BioBalance**
