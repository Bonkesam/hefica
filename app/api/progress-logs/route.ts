import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

// GET /api/progress-logs - Get all progress logs for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit');

    const where: any = {
      userId: session.user.id,
    };

    if (type && type !== 'all') {
      where.logType = type;
    }

    if (startDate || endDate) {
      where.logDate = {};
      if (startDate) {
        where.logDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.logDate.lte = new Date(endDate);
      }
    }

    const progressLogs = await prisma.progressLog.findMany({
      where,
      orderBy: {
        logDate: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({ progressLogs }, { status: 200 });
  } catch (error) {
    console.error('Get progress logs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress logs' },
      { status: 500 }
    );
  }
}

// POST /api/progress-logs - Create a new progress log
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { logType, value, unit, notes, logDate } = body;

    // Validation
    if (!logType || value === undefined || !unit) {
      return NextResponse.json(
        { error: 'Log type, value, and unit are required' },
        { status: 400 }
      );
    }

    const progressLog = await prisma.progressLog.create({
      data: {
        logType,
        value,
        unit,
        notes,
        logDate: logDate ? new Date(logDate) : new Date(),
        userId: session.user.id,
      },
    });

    return NextResponse.json({ progressLog }, { status: 201 });
  } catch (error) {
    console.error('Create progress log error:', error);
    return NextResponse.json(
      { error: 'Failed to create progress log' },
      { status: 500 }
    );
  }
}
