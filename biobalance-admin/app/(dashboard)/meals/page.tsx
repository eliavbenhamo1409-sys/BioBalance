import { TopBar } from '@/components/TopBar';
import { DataTable } from '@/components/DataTable';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export const dynamic = 'force-dynamic';

async function getMealsData() {
  const { data: meals } = await supabaseAdmin
    .from('meals')
    .select('*, user_profiles(email, full_name)')
    .order('created_at', { ascending: false })
    .limit(100);

  return meals || [];
}

export default async function MealsPage() {
  const meals = await getMealsData();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUserName = (meal: any) => {
    return meal.user_profiles?.full_name || meal.user_profiles?.email || 'לא ידוע';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="ארוחות"
        description="רשימת כל הארוחות שנשמרו במערכת"
      />

      <div className="p-8">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{meals.length}</h3>
              <p className="text-gray-600">סה״כ ארוחות במערכת</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl">
              <span className="text-3xl">🍽️</span>
            </div>
          </div>
        </div>

        {/* Meals Table */}
        <DataTable
          columns={[
            {
              key: 'created_at',
              header: 'תאריך ושעה',
              render: (meal) => formatDate(meal.created_at),
            },
            {
              key: 'user',
              header: 'משתמש',
              render: (meal) => getUserName(meal),
            },
            {
              key: 'description',
              header: 'תיאור',
              render: (meal) => (
                <div className="max-w-md truncate">
                  {meal.description || '-'}
                </div>
              ),
            },
            {
              key: 'calories',
              header: 'קלוריות',
              render: (meal) => (
                <span className="font-medium text-orange-600">
                  {meal.calories || 0}
                </span>
              ),
            },
            {
              key: 'protein',
              header: 'חלבון',
              render: (meal) => `${Math.round(meal.protein || 0)}g`,
            },
            {
              key: 'carbs',
              header: 'פחמימות',
              render: (meal) => `${Math.round(meal.carbs || 0)}g`,
            },
            {
              key: 'fat',
              header: 'שומן',
              render: (meal) => `${Math.round(meal.fat || 0)}g`,
            },
          ]}
          data={meals}
          emptyMessage="אין ארוחות במערכת"
        />
      </div>
    </div>
  );
}

