import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

// GET /api/exercises/[id] - Get a single exercise
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id: params.id },
    });

    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    return NextResponse.json({ exercise }, { status: 200 });
  } catch (error) {
    console.error('Get exercise error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercise' },
      { status: 500 }
    );
  }
}

// PUT /api/exercises/[id] - Update an exercise
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingExercise = await prisma.exercise.findUnique({
      where: { id: params.id },
    });

    if (!existingExercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name, description, category, muscleGroup, equipment, instructions } = body;

    const exercise = await prisma.exercise.update({
      where: { id: params.id },
      data: {
        name,
        description,
        category,
        muscleGroup,
        equipment,
        instructions,
      },
    });

    return NextResponse.json({ exercise }, { status: 200 });
  } catch (error) {
    console.error('Update exercise error:', error);
    return NextResponse.json(
      { error: 'Failed to update exercise' },
      { status: 500 }
    );
  }
}

// DELETE /api/exercises/[id] - Delete an exercise
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingExercise = await prisma.exercise.findUnique({
      where: { id: params.id },
    });

    if (!existingExercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    await prisma.exercise.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Exercise deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete exercise error:', error);
    return NextResponse.json(
      { error: 'Failed to delete exercise' },
      { status: 500 }
    );
  }
}
