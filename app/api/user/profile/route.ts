import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

// GET /api/user/profile - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        age: true,
        height: true,
        weight: true,
        gender: true,
        activityLevel: true,
        fitnessGoal: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile - Update current user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      age,
      height,
      weight,
      gender,
      activityLevel,
      fitnessGoal,
    } = body;

    // Validation
    if (age !== undefined && (age < 13 || age > 120)) {
      return NextResponse.json(
        { error: 'Age must be between 13 and 120' },
        { status: 400 }
      );
    }

    if (height !== undefined && (height < 50 || height > 300)) {
      return NextResponse.json(
        { error: 'Height must be between 50 and 300 cm' },
        { status: 400 }
      );
    }

    if (weight !== undefined && (weight < 20 || weight > 500)) {
      return NextResponse.json(
        { error: 'Weight must be between 20 and 500 kg' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName,
        lastName,
        age,
        height,
        weight,
        gender,
        activityLevel,
        fitnessGoal,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        age: true,
        height: true,
        weight: true,
        gender: true,
        activityLevel: true,
        fitnessGoal: true,
      },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
