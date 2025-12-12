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

    const { data: chatMessages } = await supabaseAdmin
      .from('chat_messages')
      .select('*')
      .gte('created_at', startDate.toISOString());

    // Calculate comprehensive metrics
    const totalUsers = users?.length || 0;
    const activeUsers = new Set(stats?.map(s => s.user_id)).size;
    const avgCalories = stats?.length
      ? Math.round(stats.reduce((sum, s) => sum + (s.calories || 0), 0) / stats.length)
      : 0;
    const avgProtein = stats?.length
      ? Math.round(stats.reduce((sum, s) => sum + (s.protein || 0), 0) / stats.length)
      : 0;
    const avgWater = stats?.length
      ? Math.round(stats.reduce((sum, s) => sum + (s.water || 0), 0) / stats.length)
      : 0;

    const engagementRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
    const avgMealsPerUser = activeUsers > 0 ? (meals?.length || 0) / activeUsers : 0;
    const chatEngagement = totalUsers > 0 ? (chatMessages?.length || 0) / totalUsers : 0;

    // Advanced AI Analysis with OpenAI O1
    const insights = [];
    const suggestions = [];
    let summary = '';

    // Check if OpenAI is available
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (openaiKey && openaiKey !== 'your_openai_key_here') {
      try {
        // Prepare detailed data summary for AI
        const dataContext = {
          period: `${days} days`,
          users: { total: totalUsers, active: activeUsers, engagementRate: Math.round(engagementRate) },
          nutrition: { avgCalories, avgProtein, avgWater },
          behavior: { avgMealsPerUser: Math.round(avgMealsPerUser * 10) / 10, chatEngagement: Math.round(chatEngagement * 10) / 10 },
          insightType,
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'o1-preview', // Using O1 model for deeper thinking
            messages: [
              {
                role: 'user',
                content: `You are a business intelligence analyst for BioBalance, a nutrition tracking app. Analyze the following data and provide actionable insights.

Data Summary (${days} days):
- Total Users: ${totalUsers}
- Active Users: ${activeUsers} (${Math.round(engagementRate)}% engagement)
- Avg Calories/Day: ${avgCalories}
- Avg Protein/Day: ${avgProtein}g
- Avg Water/Day: ${avgWater} cups
- Avg Meals Logged: ${Math.round(avgMealsPerUser * 10) / 10} per active user
- Chat Messages: ${chatMessages?.length || 0} (${Math.round(chatEngagement * 10) / 10} per user)

Focus Area: ${insightType === 'user_experience' ? 'User Experience Optimization' : insightType === 'bot_algorithm' ? 'AI Bot Algorithm Improvement' : 'Nutrition Habits Enhancement'}

Provide:
1. Three key insights (each with a title and detailed description)
2. Five specific, actionable suggestions for improvement

Format as JSON:
{
  "insights": [{"title": "", "description": "", "type": "positive|warning|info"}],
  "suggestions": [""],
  "summary": "executive summary in Hebrew"
}`,
              },
            ],
          }),
        });

        if (response.ok) {
          const aiData = await response.json();
          const aiResponse = JSON.parse(aiData.choices[0].message.content);
          return NextResponse.json(aiResponse);
        }
      } catch (aiError) {
        console.error('OpenAI error:', aiError);
        // Fall back to rule-based insights
      }
    }

    // Rule-based insights (fallback or when OpenAI not available)
    if (engagementRate < 40) {
      insights.push({
        title: 'שיעור מעורבות נמוך קריטי',
        description: `שיעור מעורבות של ${Math.round(engagementRate)}% מצביע על בעיה משמעותית בשימור משתמשים. יש לטפל מיידית בחווית המשתמש ובמערכת התזכורות.`,
        type: 'warning',
      });
      suggestions.push('מערכת התראות חכמה מבוססת ML להתאמת תזמון התזכורות למשתמש');
      suggestions.push('Onboarding משופר עם הדרכה אינטראקטיבית ב-3 ימים הראשונים');
      suggestions.push('Gamification עם משימות יומיות ותגמולים');
    } else if (engagementRate < 60) {
      insights.push({
        title: 'פוטנציאל לשיפור מעורבות',
        description: `שיעור מעורבות ${Math.round(engagementRate)}% הוא סולידי אך ניתן להגיע ל-70%+ עם אופטימיזציות ממוקדות.`,
        type: 'info',
      });
      suggestions.push('A/B testing על זמני שליחת התראות למציאת הזמן האופטימלי');
      suggestions.push('תכונת Social Proof - הצגת הישגי משתמשים אחרים');
    } else {
      insights.push({
        title: 'מעורבות מצוינת',
        description: `שיעור מעורבות של ${Math.round(engagementRate)}% מעיד על חוויית משתמש איכותית. יש להמשיך לשמר את הרמה הזו.`,
        type: 'positive',
      });
      suggestions.push('תוכנית Referral לגיוס משתמשים נוספים דרך משתמשים פעילים');
    }

    if (avgMealsPerUser < 2) {
      insights.push({
        title: 'תיעוד ארוחות נמוך',
        description: `ממוצע של ${Math.round(avgMealsPerUser * 10) / 10} ארוחות ליום למשתמש פעיל. היעד: 3-4 ארוחות ביום לדיוק תזונתי מקסימלי.`,
        type: 'warning',
      });
      suggestions.push('Quick-log templates לארוחות נפוצות (ארוחת בוקר, צהריים, ערב)');
      suggestions.push('OCR סריקת תוויות מזון לקלט מהיר');
    }

    if (chatEngagement < 1) {
      insights.push({
        title: 'שימוש נמוך בצ\'אט בוט',
        description: `ממוצע ${Math.round(chatEngagement * 10) / 10} הודעות למשתמש. יש לשפר את החשיפה והערך של הבוט.`,
        type: 'info',
      });
      suggestions.push('Proactive bot messages - הבוט יוזם שיחה עם טיפים מבוססי נתונים');
      suggestions.push('Quick Actions בצ\'אט - כפתורים מהירים לפעולות נפוצות');
    }

    suggestions.push('דוח שבועי אוטומטי במייל עם תרשימים והתקדמות');
    suggestions.push('Integration עם Apple Health / Google Fit לסנכרון אוטומטי');

    summary = `ניתוח ${days} ימים: ${activeUsers}/${totalUsers} משתמשים פעילים (${Math.round(engagementRate)}%). ממוצע יומי: ${avgCalories} קלוריות, ${avgProtein}g חלבון, ${avgWater} כוסות מים. ${avgMealsPerUser < 2 ? 'יש לשפר תיעוד ארוחות.' : ''} ${engagementRate < 50 ? 'דרוש שיפור במעורבות משתמשים.' : 'מעורבות טובה - להמשיך ולשמר.'}`;

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

