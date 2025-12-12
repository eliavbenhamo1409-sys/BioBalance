import { NextResponse } from 'next/server';
import { getOverallStats, getAtRiskUsers } from '@/lib/analytics';

export async function GET() {
  try {
    const stats = await getOverallStats();
    const atRiskUsers = await getAtRiskUsers();

    return NextResponse.json({
      stats,
      atRiskUsers,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      {
        stats: {
          totalUsers: 0,
          activeUsersToday: 0,
          avgCalories: 0,
          avgProtein: 0,
          avgWater: 0,
        },
        atRiskUsers: [],
      },
      { status: 500 }
    );
  }
}

