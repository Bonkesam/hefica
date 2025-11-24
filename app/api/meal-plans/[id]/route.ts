import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

// GET /api/meal-plans/[id] - Get a single meal plan
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        meals: {
          include: {
            ingredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    });

    if (!mealPlan) {
      return NextResponse.json({ error: 'Meal plan not found' }, { status: 404 });
    }

    return NextResponse.json({ mealPlan }, { status: 200 });
  } catch (error) {
    console.error('Get meal plan error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meal plan' },
      { status: 500 }
    );
  }
}

// PUT /api/meal-plans/[id] - Update a meal plan
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
    const existingMealPlan = await prisma.mealPlan.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingMealPlan) {
      return NextResponse.json({ error: 'Meal plan not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name, description, isActive, endDate } = body;

    // If setting as active, deactivate other meal plans
    if (isActive && !existingMealPlan.isActive) {
      await prisma.mealPlan.updateMany({
        where: {
          userId: session.user.id,
          isActive: true,
          id: {
            not: params.id,
          },
        },
        data: {
          isActive: false,
        },
      });
    }

    const mealPlan = await prisma.mealPlan.update({
      where: { id: params.id },
      data: {
        name,
        description,
        isActive,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        meals: true,
      },
    });

    return NextResponse.json({ mealPlan }, { status: 200 });
  } catch (error) {
    console.error('Update meal plan error:', error);
    return NextResponse.json(
      { error: 'Failed to update meal plan' },
      { status: 500 }
    );
  }
}

// DELETE /api/meal-plans/[id] - Delete a meal plan
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
    const existingMealPlan = await prisma.mealPlan.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingMealPlan) {
      return NextResponse.json({ error: 'Meal plan not found' }, { status: 404 });
    }

    await prisma.mealPlan.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Meal plan deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete meal plan error:', error);
    return NextResponse.json(
      { error: 'Failed to delete meal plan' },
      { status: 500 }
    );
  }
}
