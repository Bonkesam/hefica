import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

// GET /api/workouts/[id] - Get a single workout
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workout = await prisma.workout.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    if (!workout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    return NextResponse.json({ workout }, { status: 200 });
  } catch (error) {
    console.error('Get workout error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout' },
      { status: 500 }
    );
  }
}

// PUT /api/workouts/[id] - Update a workout
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
    const existingWorkout = await prisma.workout.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingWorkout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name, description, workoutType, duration, isActive, endDate } = body;

    const workout = await prisma.workout.update({
      where: { id: params.id },
      data: {
        name,
        description,
        workoutType,
        duration,
        isActive,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    return NextResponse.json({ workout }, { status: 200 });
  } catch (error) {
    console.error('Update workout error:', error);
    return NextResponse.json(
      { error: 'Failed to update workout' },
      { status: 500 }
    );
  }
}

// DELETE /api/workouts/[id] - Delete a workout
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
    const existingWorkout = await prisma.workout.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingWorkout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    await prisma.workout.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Workout deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete workout error:', error);
    return NextResponse.json(
      { error: 'Failed to delete workout' },
      { status: 500 }
    );
  }
}
