'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import {
  Plus,
  Search,
  Calendar,
  Flame,
  TrendingUp,
  Apple,
  Clock,
  CheckCircle,
  Edit2,
  Trash2,
  ChevronRight
} from 'lucide-react';

// Mock nutrition data
const mockMealPlans = [
  {
    id: 1,
    name: 'Balanced Diet Plan',
    description: 'High protein, moderate carbs',
    isActive: true,
    startDate: '2025-01-20',
    mealCount: 28,
    avgCalories: 2100,
    protein: 150,
    carbs: 180,
    fat: 70,
  },
  {
    id: 2,
    name: 'Cutting Phase',
    description: 'Low carb, calorie deficit',
    isActive: false,
    startDate: '2025-01-01',
    endDate: '2025-01-19',
    mealCount: 19,
    avgCalories: 1800,
    protein: 140,
    carbs: 120,
    fat: 60,
  },
];

const mockTodayMeals = [
  {
    id: 1,
    name: 'Oatmeal with Berries',
    type: 'BREAKFAST',
    time: '08:00',
    calories: 380,
    protein: 12,
    carbs: 65,
    fat: 8,
    completed: true,
  },
  {
    id: 2,
    name: 'Chicken & Rice Bowl',
    type: 'LUNCH',
    time: '13:00',
    calories: 520,
    protein: 45,
    carbs: 60,
    fat: 12,
    completed: true,
  },
  {
    id: 3,
    name: 'Protein Shake',
    type: 'SNACK',
    time: '16:00',
    calories: 180,
    protein: 25,
    carbs: 15,
    fat: 3,
    completed: false,
  },
  {
    id: 4,
    name: 'Grilled Salmon & Veggies',
    type: 'DINNER',
    time: '19:00',
    calories: 550,
    protein: 48,
    carbs: 35,
    fat: 25,
    completed: false,
  },
];

const mealTypeColors: Record<string, string> = {
  BREAKFAST: 'bg-yellow-100 text-yellow-700',
  LUNCH: 'bg-orange-100 text-orange-700',
  DINNER: 'bg-red-100 text-red-700',
  SNACK: 'bg-green-100 text-green-700',
  PRE_WORKOUT: 'bg-blue-100 text-blue-700',
  POST_WORKOUT: 'bg-purple-100 text-purple-700',
};

export default function NutritionPage() {
  const [activeTab, setActiveTab] = useState<'today' | 'plans'>('today');

  const todayTotals = mockTodayMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const calorieGoal = 2200;
  const calorieProgress = (todayTotals.calories / calorieGoal) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nutrition</h1>
            <p className="text-gray-600 mt-1">Track your meals and nutrition</p>
          </div>
          <Link
            href="/dashboard/nutrition/create"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} />
            Add Meal
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'today'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Today's Meals
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'plans'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Meal Plans
          </button>
        </div>

        {activeTab === 'today' && (
          <>
            {/* Today's Macros */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Flame className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-sm text-gray-600">Calories</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{todayTotals.calories}</p>
                <p className="text-xs text-gray-500 mt-1">/ {calorieGoal} kcal</p>
                <div className="h-2 bg-gray-100 rounded-full mt-3">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all"
                    style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-sm text-gray-600">Protein</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{todayTotals.protein}g</p>
                <p className="text-xs text-gray-500 mt-1">Target: 150g</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Apple className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Carbs</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{todayTotals.carbs}g</p>
                <p className="text-xs text-gray-500 mt-1">Target: 180g</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-yellow-600" />
                  </div>
                  <p className="text-sm text-gray-600">Fat</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{todayTotals.fat}g</p>
                <p className="text-xs text-gray-500 mt-1">Target: 70g</p>
              </div>
            </div>

            {/* Today's Meals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Today's Meals</h2>
              </div>
              <div className="p-6 space-y-4">
                {mockTodayMeals.map((meal) => (
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
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{meal.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${mealTypeColors[meal.type]}`}>
                            {meal.type.toLowerCase().replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {meal.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame size={14} className="text-orange-500" />
                            {meal.calories} kcal
                          </span>
                          <span>P: {meal.protein}g</span>
                          <span>C: {meal.carbs}g</span>
                          <span>F: {meal.fat}g</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit2 size={18} className="text-gray-600" />
                        </button>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            meal.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {meal.completed && (
                            <CheckCircle size={14} className="text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockMealPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                        {plan.isActive && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Avg Calories</p>
                      <p className="text-lg font-bold text-gray-900">{plan.avgCalories}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Meals</p>
                      <p className="text-lg font-bold text-gray-900">{plan.mealCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-lg font-bold text-gray-900">
                        {plan.endDate
                          ? `${Math.ceil((new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (1000 * 60 * 60 * 24))} days`
                          : 'Ongoing'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 text-sm text-gray-600 pb-4 border-b border-gray-100">
                    <span>P: {plan.protein}g</span>
                    <span>•</span>
                    <span>C: {plan.carbs}g</span>
                    <span>•</span>
                    <span>F: {plan.fat}g</span>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                  <Link
                    href={`/dashboard/nutrition/${plan.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
                  >
                    View Plan
                  </Link>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <Edit2 size={18} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} className="text-gray-600 hover:text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
