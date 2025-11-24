import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const endOfToday = new Date(now.setHours(23, 59, 59, 999));

    // Get workout stats
    const totalWorkouts = await prisma.workout.count({
      where: {
        userId: session.user.id,
        startDate: {
          gte: startOfMonth,
        },
      },
    });

    // Get meal stats
    const totalMeals = await prisma.meal.count({
      where: {
        mealPlan: {
          userId: session.user.id,
        },
        scheduledAt: {
          gte: startOfMonth,
        },
      },
    });

    // Get today's meals
    const todaysMeals = await prisma.meal.findMany({
      where: {
        mealPlan: {
          userId: session.user.id,
          isActive: true,
        },
        scheduledAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    // Calculate today's calories
    const todayCalories = todaysMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);

    // Get latest weight
    const latestWeightLog = await prisma.progressLog.findFirst({
      where: {
        userId: session.user.id,
        logType: 'WEIGHT',
      },
      orderBy: {
        logDate: 'desc',
      },
    });

    // Get user profile for calorie goal
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        weight: true,
        fitnessGoal: true,
      },
    });

    // Default calorie goal (can be calculated based on user profile)
    const calorieGoal = 2200;

    const stats = {
      totalWorkouts,
      totalMeals,
      currentWeight: latestWeightLog?.value || user?.weight || 0,
      todayCalories,
      calorieGoal,
      todaysMeals: todaysMeals.map(meal => ({
        id: meal.id,
        name: meal.name,
        type: meal.mealType,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        scheduledAt: meal.scheduledAt,
        completed: meal.completed,
      })),
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
