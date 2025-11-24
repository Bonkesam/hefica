import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

// GET /api/workouts - Get all workouts for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const active = searchParams.get('active');

    const where: any = {
      userId: session.user.id,
    };

    if (type && type !== 'all') {
      where.workoutType = type;
    }

    if (active === 'true') {
      where.isActive = true;
    } else if (active === 'false') {
      where.isActive = false;
    }

    const workouts = await prisma.workout.findMany({
      where,
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ workouts }, { status: 200 });
  } catch (error) {
    console.error('Get workouts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}

// POST /api/workouts - Create a new workout
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, workoutType, duration, isActive, startDate, exercises } = body;

    // Validation
    if (!name || !workoutType) {
      return NextResponse.json(
        { error: 'Name and workout type are required' },
        { status: 400 }
      );
    }

    // Create workout
    const workout = await prisma.workout.create({
      data: {
        name,
        description,
        workoutType,
        duration,
        isActive: isActive ?? true,
        startDate: startDate ? new Date(startDate) : new Date(),
        userId: session.user.id,
        exercises: exercises
          ? {
              create: exercises.map((ex: any) => ({
                exerciseId: ex.exerciseId,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight,
                duration: ex.duration,
                distance: ex.distance,
                restTime: ex.restTime,
              })),
            }
          : undefined,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    return NextResponse.json({ workout }, { status: 201 });
  } catch (error) {
    console.error('Create workout error:', error);
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    );
  }
}
