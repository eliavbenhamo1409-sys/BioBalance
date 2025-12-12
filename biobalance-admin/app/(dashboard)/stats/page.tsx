'use client';

import { TopBar } from '@/components/TopBar';
import { StatsCard } from '@/components/StatsCard';
import { DataTable } from '@/components/DataTable';
import { Flame, Beef, Droplet, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatsData {
  todayStats: any[];
  recentStats: any[];
  avgCalories: number;
  avgProtein: number;
  avgWater: number;
  activeToday: number;
}

export default function StatsPage() {
  const [data, setData] = useState<StatsData>({
    todayStats: [],
    recentStats: [],
    avgCalories: 0,
    avgProtein: 0,
    avgWater: 0,
    activeToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('he-IL');
  };

  const getUserName = (stat: any) => {
    return stat.user_profiles?.full_name || stat.user_profiles?.email || 'לא ידוע';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar title="סטטיסטיקה יומית" description="טוען..." />
        <div className="p-8 text-center">טוען נתונים...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="סטטיסטיקה יומית"
        description="סיכומי יום של כל משתמש - קלוריות, חלבון, שומן, פחמימות ומים"
      />

      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="ממוצע קלוריות היום"
            value={data.avgCalories}
            icon={Flame}
            description="קלוריות ממוצעות"
          />
          <StatsCard
            title="ממוצע חלבון היום"
            value={`${data.avgProtein}g`}
            icon={Beef}
            description="חלבון ממוצע"
          />
          <StatsCard
            title="ממוצע מים היום"
            value={data.avgWater}
            icon={Droplet}
            description="כוסות מים ממוצעות"
          />
          <StatsCard
            title="משתמשים פעילים היום"
            value={data.activeToday}
            icon={TrendingUp}
            description="דיווחו היום"
          />
        </div>

        {/* Today's Stats */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">נתוני היום</h3>
          <DataTable
            columns={[
              {
                key: 'user',
                header: 'משתמש',
                render: (stat) => getUserName(stat),
              },
              { key: 'calories', header: 'קלוריות' },
              {
                key: 'protein',
                header: 'חלבון (גרם)',
                render: (stat) => Math.round(stat.protein || 0),
              },
              {
                key: 'carbs',
                header: 'פחמימות (גרם)',
                render: (stat) => Math.round(stat.carbs || 0),
              },
              {
                key: 'fat',
                header: 'שומן (גרם)',
                render: (stat) => Math.round(stat.fat || 0),
              },
              { key: 'water', header: 'כוסות מים' },
            ]}
            data={data.todayStats}
            emptyMessage="אין נתונים להיום"
          />
        </div>

        {/* Recent Stats (30 days) */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">נתוני 30 ימים אחרונים</h3>
          <DataTable
            columns={[
              {
                key: 'date',
                header: 'תאריך',
                render: (stat) => formatDate(stat.date),
              },
              {
                key: 'user',
                header: 'משתמש',
                render: (stat) => getUserName(stat),
              },
              { key: 'calories', header: 'קלוריות' },
              {
                key: 'protein',
                header: 'חלבון (גרם)',
                render: (stat) => Math.round(stat.protein || 0),
              },
              {
                key: 'fat',
                header: 'שומן (גרם)',
                render: (stat) => Math.round(stat.fat || 0),
              },
              {
                key: 'carbs',
                header: 'פחמימות (גרם)',
                render: (stat) => Math.round(stat.carbs || 0),
              },
              { key: 'water', header: 'כוסות מים' },
            ]}
            data={data.recentStats}
            emptyMessage="אין נתונים"
          />
        </div>
      </div>
    </div>
  );
}

