import { TopBar } from '@/components/TopBar';
import { Shield, Database, Palette, Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="הגדרות"
        description="הגדרות מערכת וניהול"
      />

      <div className="p-8">
        <div className="space-y-6">
          {/* Security Settings */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-100 p-3 rounded-xl">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">אבטחה</h3>
                <p className="text-sm text-gray-600">הגדרות אבטחה וגישה</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">שם משתמש</span>
                  <span className="text-gray-600">{process.env.ADMIN_USERNAME || 'לא הוגדר'}</span>
                </div>
                <p className="text-sm text-gray-500">
                  ניתן לשנות ב-.env.local - משתנה ADMIN_USERNAME
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">סיסמה</span>
                  <span className="text-gray-600">••••••••</span>
                </div>
                <p className="text-sm text-gray-500">
                  ניתן לשנות ב-.env.local - משתנה ADMIN_PASSWORD
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-700">
                  💡 <strong>טיפ:</strong> כדי לשנות את פרטי ההתחברות, ערוך את קובץ .env.local והפעל מחדש את השרת
                </p>
              </div>
            </div>
          </div>

          {/* Database Settings */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Database className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">מסד נתונים</h3>
                <p className="text-sm text-gray-600">חיבור ל-Supabase</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Supabase URL</span>
                  <span className="text-gray-600 text-sm">
                    {process.env.SUPABASE_URL ? '✅ מוגדר' : '❌ לא מוגדר'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  SUPABASE_URL - כתובת פרויקט ה-Supabase שלך
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Service Role Key</span>
                  <span className="text-gray-600 text-sm">
                    {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ מוגדר' : '❌ לא מוגדר'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  SUPABASE_SERVICE_ROLE_KEY - מפתח עם הרשאות מלאות
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-sm text-yellow-700">
                  ⚠️ <strong>חשוב:</strong> השתמש ב-SERVICE_ROLE_KEY רק בצד השרת. אל תחשוף אותו לקוד Client.
                </p>
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">בינה מלאכותית</h3>
                <p className="text-sm text-gray-600">הגדרות AI</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">OpenAI API Key</span>
                  <span className="text-gray-600 text-sm">
                    {process.env.OPENAI_API_KEY ? '✅ מוגדר' : '❌ לא מוגדר'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  OPENAI_API_KEY - מפתח API לשימוש בתובנות AI (אופציונלי)
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-700">
                  💡 <strong>לידע:</strong> גם ללא מפתח OpenAI, המערכת תספק ניתוח בסיסי. עם מפתח API ניתן לקבל תובנות מתקדמות יותר.
                </p>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">מידע מערכת</h3>
                <p className="text-sm text-gray-600">פרטי גרסה וסביבה</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">סביבה</p>
                <p className="font-medium text-gray-900">
                  {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">גרסה</p>
                <p className="font-medium text-gray-900">1.0.0</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Next.js</p>
                <p className="font-medium text-gray-900">14+</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">כיוון</p>
                <p className="font-medium text-gray-900">RTL (ימין לשמאל)</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">הוראות שימוש</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">1.</span>
                <span>ודא שכל משתני הסביבה מוגדרים ב-.env.local</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">2.</span>
                <span>הפעל את השרת עם npm run dev (פיתוח) או npm run build && npm start (production)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">3.</span>
                <span>פרוס ל-Vercel עם vercel --prod</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">4.</span>
                <span>הגדר את משתני הסביבה גם ב-Vercel Dashboard</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

