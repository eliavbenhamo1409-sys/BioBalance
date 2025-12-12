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
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                איך זה עובד?
              </h3>
              <p className="text-gray-700">
                המערכת משתמשת בבינה מלאכותית כדי לנתח את נתוני המשתמשים ולספק תובנות
                מעמיקות על שימוש באפליקציה, הרגלי תזונה, ודרכים לשיפור חווית המשתמש.
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
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {loading ? 'מנתח נתונים...' : 'נתח נתונים והצג תובנות'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">סיכום</h3>
              <p className="text-gray-700 leading-relaxed">{results.summary}</p>
            </div>

            {/* Insights */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                תובנות מרכזיות
              </h3>
              <div className="space-y-4">
                {results.insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-r-4 ${
                      insight.type === 'positive'
                        ? 'bg-green-50 border-green-500'
                        : insight.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <h4 className="font-bold text-gray-900 mb-2">{insight.title}</h4>
                    <p className="text-gray-700">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-600" />
                המלצות לייעול
              </h3>
              <ul className="space-y-3">
                {results.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 flex-1">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!results && !loading && !error && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              מוכן לניתוח
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              בחר את הגדרות הניתוח ולחץ על הכפתור כדי לקבל תובנות מתקדמות מבינה מלאכותית
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

