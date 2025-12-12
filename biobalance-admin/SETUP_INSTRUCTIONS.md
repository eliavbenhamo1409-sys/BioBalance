# 📋 הוראות הגדרה מהירות - BioBalance Admin

## ✅ מה נבנה?

מערכת ניהול מלאה ומתקדמת ל-BioBalance עם:

### 🎯 תכונות מרכזיות
- ✨ מערכת התחברות מאובטחת (JWT + HttpOnly cookies)
- 📊 לוח בקרה עם סטטיסטיקות בזמן אמת
- 👥 ניהול משתמשים מתקדם + דפי פרופיל
- 📈 ניתוח נתוני תזונה (קלוריות, חלבון, שומן, פחמימות, מים)
- 🍽️ מעקב אחר ארוחות ומתכונים
- 💬 צפייה בשיחות צ'אט עם הבוט
- 🤖 תובנות AI לשיפור המערכת
- ⚙️ עמוד הגדרות מפורט
- 🎨 עיצוב מודרני בעברית עם RTL מלא

### 🏗️ טכנולוגיות
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Supabase (PostgreSQL)
- JWT Authentication
- Recharts (גרפים)
- Lucide React (אייקונים)

---

## 🚀 איך להתחיל?

### שלב 1: מעבר לתיקיית הפרויקט

\`\`\`bash
cd biobalance-admin
\`\`\`

### שלב 2: התקנת תלויות

\`\`\`bash
npm install
\`\`\`

### שלב 3: הגדרת משתני סביבה

**צור קובץ \`.env.local\` בתיקייה \`biobalance-admin\`:**

\`\`\`env
# כניסה למערכת (ערכים קיימים)
ADMIN_USERNAME=ELIAV2610
ADMIN_PASSWORD=Chen2611@

# Supabase - השג מ-https://supabase.com/dashboard/project/_/settings/api
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI (אופציונלי - לתובנות AI מתקדמות)
OPENAI_API_KEY=sk-your-key-here

# JWT Secret (צור מפתח אקראי חזק)
JWT_SECRET=your-random-secret-minimum-32-characters-long
\`\`\`

**איפה למצוא את ערכי Supabase?**
1. לך ל-https://supabase.com/dashboard
2. בחר את הפרויקט BioBalance
3. Settings → API
4. העתק:
   - Project URL → \`SUPABASE_URL\`
   - service_role (secret) → \`SUPABASE_SERVICE_ROLE_KEY\`

**איך ליצור JWT_SECRET?**
\`\`\`bash
# בטרמינל:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

### שלב 4: הרצת השרת

\`\`\`bash
npm run dev
\`\`\`

המערכת תעלה על: **http://localhost:3000**

### שלב 5: כניסה למערכת

1. נווט ל-http://localhost:3000
2. תועבר אוטומטית ל-/login
3. התחבר עם:
   - **שם משתמש:** ELIAV2610
   - **סיסמה:** Chen2611@

---

## 📊 מבנה המסכים

| מסך | נתיב | תיאור |
|-----|------|--------|
| לוח בקרה | `/dashboard` | סטטיסטיקות כלליות ומשתמשים בסיכון |
| משתמשים | `/users` | רשימת כל המשתמשים + חיפוש |
| פרופיל משתמש | `/users/[id]` | נתונים מפורטים של משתמש |
| סטטיסטיקה | `/stats` | נתוני תזונה יומיים |
| ארוחות | `/meals` | כל הארוחות שנשמרו |
| מתכונים | `/recipes` | מתכונים שמורים |
| צ'אטים | `/chats` | שיחות עם הבוט |
| תובנות AI | `/ai-insights` | ניתוח חכם של נתונים |
| הגדרות | `/settings` | הגדרות מערכת |

---

## 🗄️ דרישות מסד נתונים

ודא שיש לך את הטבלאות הבאות ב-Supabase:

### טבלאות נדרשות:
1. **user_profiles** - פרטי משתמשים
2. **daily_stats** - סטטיסטיקה יומית
3. **meals** - ארוחות
4. **saved_recipes** - מתכונים שמורים
5. **chat_messages** - הודעות צ'אט

**אם הטבלאות לא קיימות,** ראה את ה-SQL ב-README.md המלא.

---

## 🚢 פריסה ל-Vercel (Production)

### 1. התקן Vercel CLI

\`\`\`bash
npm install -g vercel
\`\`\`

### 2. התחבר

\`\`\`bash
vercel login
\`\`\`

### 3. פרוס

\`\`\`bash
cd biobalance-admin
vercel --prod
\`\`\`

### 4. הוסף משתני סביבה ב-Vercel

לך ל-**Vercel Dashboard** → הפרויקט → **Settings** → **Environment Variables**

הוסף את כל המשתנים מ-.env.local:
- ADMIN_USERNAME
- ADMIN_PASSWORD
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- JWT_SECRET
- OPENAI_API_KEY (אופציונלי)

**פרוס מחדש אחרי הוספת משתנים:**
\`\`\`bash
vercel --prod
\`\`\`

---

## 🔧 התאמות נפוצות

### שינוי צבע המותג

ערוך את \`globals.css\` או \`tailwind.config.ts\`:
- צבע עיקרי: \`emerald\` (ירוק/מנטה)
- שנה ל-\`blue\`, \`purple\`, \`teal\` וכו'

### שינוי פרטי התחברות

ערוך את \`.env.local\`:
\`\`\`env
ADMIN_USERNAME=your-new-username
ADMIN_PASSWORD=your-new-password
\`\`\`

הפעל מחדש את השרת: \`npm run dev\`

### הוספת עמוד חדש

1. צור \`app/(dashboard)/your-page/page.tsx\`
2. עדכן את \`components/Sidebar.tsx\` עם לינק חדש

---

## ❓ בעיות נפוצות

### ❌ "Repository not found" מ-Supabase
**פתרון:** בדוק ש-SUPABASE_URL ו-SERVICE_ROLE_KEY נכונים

### ❌ "Invalid JWT"
**פתרון:** נקה cookies או התחבר מחדש

### ❌ "Module not found"
**פתרון:** הרץ \`npm install\` שוב

### ❌ עמודים לא נטענים
**פתרון:** ודא שיש חיבור ל-Supabase ושהטבלאות קיימות

---

## 📞 תמיכה

- 📖 **README מלא:** ראה \`README.md\` בתיקייה
- 🐛 **בעיות:** פתח Issue ב-GitHub
- 📧 **שאלות:** צור קשר דרך המייל

---

## ✅ Checklist התקנה

- [ ] התקנתי Node.js 18+
- [ ] הרצתי \`npm install\`
- [ ] יצרתי \`.env.local\` עם כל המשתנים
- [ ] הגדרתי את Supabase credentials
- [ ] יצרתי JWT_SECRET חזק
- [ ] הרצתי \`npm run dev\`
- [ ] נכנסתי בהצלחה למערכת
- [ ] ראיתי את לוח הבקרה

---

**🎉 בהצלחה עם המערכת!**

