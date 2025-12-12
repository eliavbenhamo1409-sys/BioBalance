'use client';

import { TopBar } from '@/components/TopBar';
import { Sparkles, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface Insight {
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'info';
}

interface AIResponse {
  insights: Insight[];
  suggestions: string[];
  summary: string;
}

export default function AIInsightsPage() {
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState<number>(30);
  const [insightType, setInsightType] = useState<string>('user_experience');
  const [results, setResults] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string>('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days, insightType }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || 'שגיאה בניתוח');
      }
    } catch (err) {
      setError('שגיאה בחיבור לשרת');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="תובנות בינה מלאכותית"
        description="ניתוח נתונים מתקדם באמצעות AI לשיפור המערכת"
      />

      <div className="p-8">
        {/* Info Card */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-600 p-3 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                ניתוח מתקדם מבוסס AI
              </h3>
              <p className="text-slate-300 font-medium">
                המערכת משתמשת במודל O1 של OpenAI לניתוח עמוק של נתוני המשתמשים,
                זיהוי מגמות והמלצות אסטרטגיות לשיפור המוצר והעסק.
              </p>
            </div>
          </div>
        </div>

        {/* Analysis Form */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">הגדרות ניתוח</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                טווח זמן
              </label>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              >
                <option value={7}>7 ימים אחרונים</option>
                <option value={30}>30 ימים אחרונים</option>
                <option value={90}>90 ימים אחרונים</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                סוג התובנות
              </label>
              <select
                value={insightType}
                onChange={(e) => setInsightType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              >
                <option value="user_experience">שיפור חוויית משתמש</option>
                <option value="bot_algorithm">שיפור אלגוריתם הבוט</option>
                <option value="nutrition_habits">שיפור תזונה והרגלים</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-slate-700"
          >
            <Sparkles className="w-5 h-5" />
            {loading ? 'מנתח נתונים...' : 'הפעל ניתוח AI'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-r-4 border-red-600 text-red-800 px-6 py-4 rounded-lg mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-xl p-6 border-l-4 border-emerald-600 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide">סיכום מנהלים</h3>
              <p className="text-slate-700 leading-relaxed font-medium">{results.summary}</p>
            </div>

            {/* Insights */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3 uppercase tracking-wide">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                תובנות אסטרטגיות
              </h3>
              <div className="space-y-4">
                {results.insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-5 rounded-lg border-r-4 ${
                      insight.type === 'positive'
                        ? 'bg-green-50 border-green-600'
                        : insight.type === 'warning'
                        ? 'bg-amber-50 border-amber-600'
                        : 'bg-blue-50 border-blue-600'
                    }`}
                  >
                    <h4 className="font-bold text-slate-900 mb-2 text-lg">{insight.title}</h4>
                    <p className="text-slate-700 font-medium leading-relaxed">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3 uppercase tracking-wide">
                <Users className="w-6 h-6 text-slate-700" />
                תוכנית פעולה
              </h3>
              <ul className="space-y-4">
                {results.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-lg transition-colors">
                    <span className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-slate-700 flex-1 font-medium leading-relaxed">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!results && !loading && !error && (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-12 text-center border border-slate-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-lg mb-4">
              <Sparkles className="w-8 h-8 text-emerald-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              מערכת ניתוח מתקדמת
            </h3>
            <p className="text-slate-600 max-w-md mx-auto font-medium">
              הגדר פרמטרי ניתוח והפעל את מנוע ה-AI לקבלת תובנות עסקיות מעמיקות
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

