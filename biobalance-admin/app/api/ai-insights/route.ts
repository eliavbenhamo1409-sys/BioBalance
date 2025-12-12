import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export async function POST(request: NextRequest) {
  try {
    const { days, insightType } = await request.json();

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    // Fetch data from database
    const { data: stats } = await supabaseAdmin
      .from('daily_stats')
      .select('*')
      .gte('date', startDateStr);

    const { data: users } = await supabaseAdmin
      .from('user_profiles')
      .select('*');

    const { data: meals } = await supabaseAdmin
      .from('meals')
      .select('*')
      .gte('created_at', startDate.toISOString());

    // Analyze data and generate insights (simplified version without OpenAI)
    const insights = [];
    const suggestions = [];

    // Calculate some basic metrics
    const totalUsers = users?.length || 0;
    const activeUsers = new Set(stats?.map(s => s.user_id)).size;
    const avgCalories = stats?.length
      ? Math.round(stats.reduce((sum, s) => sum + (s.calories || 0), 0) / stats.length)
      : 0;
    const avgProtein = stats?.length
      ? Math.round(stats.reduce((sum, s) => sum + (s.protein || 0), 0) / stats.length)
      : 0;

    const engagementRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

    // Generate insights based on data
    if (engagementRate < 50) {
      insights.push({
        title: 'שיעור מעורבות נמוך',
        description: `רק ${Math.round(engagementRate)}% מהמשתמשים פעילים ב-${days} ימים האחרונים. כדאי לשקול שליחת התראות או תזכורות.`,
        type: 'warning',
      });
      suggestions.push('להוסיף מערכת התראות יומית להזכרת המשתמשים להזין נתונים');
      suggestions.push('ליצור תכונת "רצפי ימים" (streaks) כדי לעודד שימוש קבוע');
    } else {
      insights.push({
        title: 'מעורבות טובה',
        description: `${Math.round(engagementRate)}% מהמשתמשים פעילים - שיעור מעורבות מצוין!`,
        type: 'positive',
      });
    }

    if (avgCalories > 0) {
      insights.push({
        title: 'נתוני קלוריות',
        description: `ממוצע של ${avgCalories} קלוריות ליום. ${avgProtein}g חלבון ממוצע.`,
        type: 'info',
      });
    }

    if (insightType === 'user_experience') {
      suggestions.push('להוסיף גרפים ויזואליים להתקדמות אישית');
      suggestions.push('ליצור דוח שבועי אוטומטי עם סיכום ההישגים');
    } else if (insightType === 'bot_algorithm') {
      suggestions.push('לשפר את דיוק חישוב הקלוריות בהתבסס על נתוני משתמשים');
      suggestions.push('להוסיף המלצות מותאמות אישית בהתבסס על מטרות המשתמש');
    } else if (insightType === 'nutrition_habits') {
      suggestions.push('להוסיף תזכורות לשתיית מים לאורך היום');
      suggestions.push('ליצור ספריית מתכונים מומלצים בהתבסס על מטרות תזונתיות');
    }

    // Always add some general suggestions
    suggestions.push('לשלוח הודעת מוטיבציה למשתמשים שלא הזינו נתונים 3 ימים');
    suggestions.push('להוסיף אפשרות שיתוף הישגים ברשתות חברתיות');

    const summary = `
      ניתוח של ${days} ימים אחרונים מראה ${activeUsers} משתמשים פעילים מתוך ${totalUsers} רשומים.
      שיעור המעורבות הוא ${Math.round(engagementRate)}%.
      ${insightType === 'user_experience' ? 'התמקדות בחווית משתמש יכולה להגדיל את המעורבות.' : ''}
      ${insightType === 'bot_algorithm' ? 'שיפור האלגוריתם יעזור לספק תוצאות מדויקות יותר.' : ''}
      ${insightType === 'nutrition_habits' ? 'עידוד הרגלים בריאים יכול להוביל לתוצאות ארוכות טווח.' : ''}
    `.trim();

    // If OpenAI API key exists, you can call OpenAI here for more sophisticated analysis
    // const openaiKey = process.env.OPENAI_API_KEY;
    // if (openaiKey) {
    //   // Call OpenAI API with the data
    // }

    return NextResponse.json({
      insights,
      suggestions,
      summary,
    });
  } catch (error) {
    console.error('Error in AI insights:', error);
    return NextResponse.json(
      { error: 'שגיאה בניתוח נתונים' },
      { status: 500 }
    );
  }
}

