import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

// GET /api/progress-logs/[id] - Get a single progress log
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const progressLog = await prisma.progressLog.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!progressLog) {
      return NextResponse.json({ error: 'Progress log not found' }, { status: 404 });
    }

    return NextResponse.json({ progressLog }, { status: 200 });
  } catch (error) {
    console.error('Get progress log error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress log' },
      { status: 500 }
    );
  }
}

// PUT /api/progress-logs/[id] - Update a progress log
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
    const existingLog = await prisma.progressLog.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingLog) {
      return NextResponse.json({ error: 'Progress log not found' }, { status: 404 });
    }

    const body = await request.json();
    const { logType, value, unit, notes, logDate } = body;

    const progressLog = await prisma.progressLog.update({
      where: { id: params.id },
      data: {
        logType,
        value,
        unit,
        notes,
        logDate: logDate ? new Date(logDate) : undefined,
      },
    });

    return NextResponse.json({ progressLog }, { status: 200 });
  } catch (error) {
    console.error('Update progress log error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress log' },
      { status: 500 }
    );
  }
}

// DELETE /api/progress-logs/[id] - Delete a progress log
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
    const existingLog = await prisma.progressLog.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingLog) {
      return NextResponse.json({ error: 'Progress log not found' }, { status: 404 });
    }

    await prisma.progressLog.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Progress log deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete progress log error:', error);
    return NextResponse.json(
      { error: 'Failed to delete progress log' },
      { status: 500 }
    );
  }
}
