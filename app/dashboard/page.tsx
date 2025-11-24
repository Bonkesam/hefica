'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import {
  Calendar,
  Dumbbell,
  Apple,
  Flame,
  Scale,
  Timer,
  Plus,
  TrendingUp,
  ChevronRight,
  Clock
} from 'lucide-react';

// Mock data - will replace with API calls later
const mockData = {
  stats: {
    totalWorkouts: 12,
    totalMeals: 45,
    currentWeight: 75,
    calorieGoal: 2200,
    todayCalories: 1842,
    weeklyWorkouts: 5
  },
  todaysMeals: [
    { id: 1, name: 'Greek Yogurt Bowl', type: 'BREAKFAST', calories: 350, time: '08:00', completed: true },
    { id: 2, name: 'Grilled Chicken Salad', type: 'LUNCH', calories: 520, time: '13:00', completed: true },
    { id: 3, name: 'Protein Shake', type: 'SNACK', calories: 180, time: '16:00', completed: true },
    { id: 4, name: 'Salmon & Vegetables', type: 'DINNER', calories: 620, time: '19:00', completed: false },
  ],
  todaysWorkout: {
    id: 1,
    name: 'Upper Body Strength',
    duration: 45,
    completed: false,
    exercises: [
      { name: 'Bench Press', sets: 3, reps: 12, completed: true },
      { name: 'Dumbbell Rows', sets: 3, reps: 10, completed: true },
      { name: 'Shoulder Press', sets: 3, reps: 12, completed: false },
      { name: 'Bicep Curls', sets: 3, reps: 15, completed: false },
    ]
  },
  recentProgress: [
    { date: '2025-01-23', weight: 75.2, bodyFat: 18 },
    { date: '2025-01-20', weight: 75.5, bodyFat: 18.2 },
    { date: '2025-01-17', weight: 75.8, bodyFat: 18.5 },
  ]
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: number;
  color: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, trend, color, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.opacity = '0';
      cardRef.current.style.transform = 'translateY(20px)';
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          cardRef.current.style.opacity = '1';
          cardRef.current.style.transform = 'translateY(0)';
        }
      }, index * 100);
    }
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-green-100 text-green-700' : trend < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
          }`}>
            <TrendingUp className={`w-3 h-3 mr-1 ${trend < 0 ? 'transform rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

export default function DashboardPage() {
  const { data: session } = useSession();

  const calorieProgress = (mockData.stats.todayCalories / mockData.stats.calorieGoal) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session?.user?.firstName}! 👋
            </h1>
            <p className="text-gray-600 mt-2">Here's your wellness overview for today</p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <div className="flex items-center text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Workouts This Month"
            value={mockData.stats.totalWorkouts}
            icon={Dumbbell}
            color="text-purple-600"
            trend={12}
            index={0}
          />
          <StatCard
            title="Meals Logged"
            value={mockData.stats.totalMeals}
            icon={Apple}
            color="text-green-600"
            trend={8}
            index={1}
          />
          <StatCard
            title="Current Weight"
            value={`${mockData.stats.currentWeight} kg`}
            icon={Scale}
            color="text-blue-600"
            trend={-3}
            index={2}
          />
          <StatCard
            title="Today's Calories"
            value={mockData.stats.todayCalories}
            subtitle={`Goal: ${mockData.stats.calorieGoal}`}
            icon={Flame}
            color="text-orange-600"
            index={3}
          />
        </div>

        {/* Calorie Progress Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Daily Calorie Goal</h3>
            <span className="text-sm font-medium text-gray-600">
              {mockData.stats.todayCalories} / {mockData.stats.calorieGoal} kcal
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(calorieProgress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {calorieProgress >= 100 ? 'Goal reached! 🎉' : `${Math.round(mockData.stats.calorieGoal - mockData.stats.todayCalories)} kcal remaining`}
          </p>
        </div>

        {/* Today's Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Meals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Today's Meals</h2>
                <Link
                  href="/dashboard/nutrition"
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  View All
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {mockData.todaysMeals.map((meal) => (
                <div
                  key={meal.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    meal.completed
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{meal.name}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full capitalize">
                          {meal.type.toLowerCase()}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Flame className="w-3 h-3 mr-1 text-orange-500" />
                          {meal.calories} kcal
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {meal.time}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        meal.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {meal.completed && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Link
                href="/dashboard/nutrition/create"
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-600 hover:text-black border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg transition-all"
              >
                <Plus size={16} />
                Add Meal
              </Link>
            </div>
          </div>

          {/* Today's Workout */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Today's Workout</h2>
                <Link
                  href="/dashboard/workouts"
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  View All
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{mockData.todaysWorkout.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                    <Timer className="w-4 h-4 mr-1 text-purple-600" />
                    {mockData.todaysWorkout.duration} min
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {mockData.todaysWorkout.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      exercise.completed
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {exercise.sets} sets × {exercise.reps} reps
                        </p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          exercise.completed
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {exercise.completed && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/dashboard/workouts/create"
                className="w-full flex items-center justify-center gap-2 py-3 mt-3 text-sm font-medium text-gray-600 hover:text-black border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg transition-all"
              >
                <Plus size={16} />
                Add Workout
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/progress"
            className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-white group"
          >
            <TrendingUp className="w-8 h-8 mb-3" />
            <h3 className="font-bold text-lg mb-1">Track Progress</h3>
            <p className="text-sm text-blue-100">Log your latest measurements</p>
          </Link>
          <Link
            href="/dashboard/exercises"
            className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-white group"
          >
            <Activity className="w-8 h-8 mb-3" />
            <h3 className="font-bold text-lg mb-1">Browse Exercises</h3>
            <p className="text-sm text-purple-100">Explore exercise library</p>
          </Link>
          <Link
            href="/dashboard/reports"
            className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-white group"
          >
            <Apple className="w-8 h-8 mb-3" />
            <h3 className="font-bold text-lg mb-1">View Reports</h3>
            <p className="text-sm text-orange-100">See your analytics</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
