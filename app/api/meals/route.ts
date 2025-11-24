import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

// GET /api/meals - Get meals (optionally filtered by meal plan or date)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mealPlanId = searchParams.get('mealPlanId');
    const date = searchParams.get('date');
    const type = searchParams.get('type');

    const where: any = {
      mealPlan: {
        userId: session.user.id,
      },
    };

    if (mealPlanId) {
      where.mealPlanId = mealPlanId;
    }

    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

      where.scheduledAt = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (type && type !== 'all') {
      where.mealType = type;
    }

    const meals = await prisma.meal.findMany({
      where,
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        mealPlan: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    return NextResponse.json({ meals }, { status: 200 });
  } catch (error) {
    console.error('Get meals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meals' },
      { status: 500 }
    );
  }
}

// POST /api/meals - Create a new meal
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      mealType,
      mealPlanId,
      scheduledAt,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      ingredients,
    } = body;

    // Validation
    if (!name || !mealType || !mealPlanId) {
      return NextResponse.json(
        { error: 'Name, meal type, and meal plan are required' },
        { status: 400 }
      );
    }

    // Verify meal plan ownership
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        id: mealPlanId,
        userId: session.user.id,
      },
    });

    if (!mealPlan) {
      return NextResponse.json(
        { error: 'Meal plan not found' },
        { status: 404 }
      );
    }

    const meal = await prisma.meal.create({
      data: {
        name,
        description,
        mealType,
        mealPlanId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
        calories,
        protein,
        carbs,
        fat,
        fiber,
        ingredients: ingredients
          ? {
              create: ingredients.map((ing: any) => ({
                ingredientId: ing.ingredientId,
                quantity: ing.quantity,
              })),
            }
          : undefined,
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    return NextResponse.json({ meal }, { status: 201 });
  } catch (error) {
    console.error('Create meal error:', error);
    return NextResponse.json(
      { error: 'Failed to create meal' },
      { status: 500 }
    );
  }
}
