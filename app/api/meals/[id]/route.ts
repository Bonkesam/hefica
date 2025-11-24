import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

// GET /api/meals/[id] - Get a single meal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const meal = await prisma.meal.findFirst({
      where: {
        id: params.id,
        mealPlan: {
          userId: session.user.id,
        },
      },
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
    });

    if (!meal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
    }

    return NextResponse.json({ meal }, { status: 200 });
  } catch (error) {
    console.error('Get meal error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meal' },
      { status: 500 }
    );
  }
}

// PUT /api/meals/[id] - Update a meal
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existingMeal = await prisma.meal.findFirst({
      where: {
        id: params.id,
        mealPlan: {
          userId: session.user.id,
        },
      },
    });

    if (!existingMeal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      description,
      mealType,
      scheduledAt,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      completed,
    } = body;

    const meal = await prisma.meal.update({
      where: { id: params.id },
      data: {
        name,
        description,
        mealType,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        calories,
        protein,
        carbs,
        fat,
        fiber,
        completed,
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    return NextResponse.json({ meal }, { status: 200 });
  } catch (error) {
    console.error('Update meal error:', error);
    return NextResponse.json(
      { error: 'Failed to update meal' },
      { status: 500 }
    );
  }
}

// DELETE /api/meals/[id] - Delete a meal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existingMeal = await prisma.meal.findFirst({
      where: {
        id: params.id,
        mealPlan: {
          userId: session.user.id,
        },
      },
    });

    if (!existingMeal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
    }

    await prisma.meal.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Meal deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete meal error:', error);
    return NextResponse.json(
      { error: 'Failed to delete meal' },
      { status: 500 }
    );
  }
}
