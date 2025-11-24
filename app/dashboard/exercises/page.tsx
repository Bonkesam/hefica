'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Search,
  Filter,
  Dumbbell,
  Activity,
  Heart,
  Zap,
  Target,
  ChevronRight
} from 'lucide-react';

// Mock exercise data
const mockExercises = [
  {
    id: 1,
    name: 'Bench Press',
    category: 'CHEST',
    muscleGroup: ['CHEST', 'TRICEPS'],
    equipment: 'BARBELL',
    instructions: 'Lie on bench, lower bar to chest, press up to starting position',
  },
  {
    id: 2,
    name: 'Squats',
    category: 'LEGS',
    muscleGroup: ['QUADRICEPS', 'GLUTES', 'HAMSTRINGS'],
    equipment: 'BARBELL',
    instructions: 'Stand with bar on shoulders, squat down keeping back straight, drive up',
  },
  {
    id: 3,
    name: 'Pull-ups',
    category: 'BACK',
    muscleGroup: ['BACK', 'BICEPS'],
    equipment: 'PULL_UP_BAR',
    instructions: 'Hang from bar, pull body up until chin over bar, lower with control',
  },
  {
    id: 4,
    name: 'Running',
    category: 'CARDIO',
    muscleGroup: ['CARDIO'],
    equipment: 'CARDIO_MACHINE',
    instructions: 'Maintain steady pace, breathe rhythmically',
  },
  {
    id: 5,
    name: 'Plank',
    category: 'CORE',
    muscleGroup: ['CORE'],
    equipment: 'BODYWEIGHT',
    instructions: 'Hold body straight in push-up position, engage core',
  },
  {
    id: 6,
    name: 'Shoulder Press',
    category: 'SHOULDERS',
    muscleGroup: ['SHOULDERS', 'TRICEPS'],
    equipment: 'DUMBBELLS',
    instructions: 'Press dumbbells overhead from shoulder height',
  },
];

const categoryColors: Record<string, string> = {
  CHEST: 'bg-purple-100 text-purple-700',
  BACK: 'bg-blue-100 text-blue-700',
  SHOULDERS: 'bg-orange-100 text-orange-700',
  ARMS: 'bg-pink-100 text-pink-700',
  LEGS: 'bg-green-100 text-green-700',
  CORE: 'bg-yellow-100 text-yellow-700',
  CARDIO: 'bg-red-100 text-red-700',
  FLEXIBILITY: 'bg-indigo-100 text-indigo-700',
  FULL_BODY: 'bg-gray-100 text-gray-700',
};

const categoryIcons: Record<string, any> = {
  CHEST: Heart,
  BACK: Activity,
  SHOULDERS: Target,
  ARMS: Zap,
  LEGS: Dumbbell,
  CORE: Target,
  CARDIO: Activity,
  FLEXIBILITY: Zap,
  FULL_BODY: Dumbbell,
};

export default function ExercisesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredExercises = mockExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || exercise.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(mockExercises.map(e => e.category)))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exercise Library</h1>
          <p className="text-gray-600 mt-1">Browse and explore exercises for your workouts</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent capitalize"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.toLowerCase().replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => {
            const Icon = categoryIcons[exercise.category] || Dumbbell;
            return (
              <div
                key={exercise.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden group cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${categoryColors[exercise.category]} bg-opacity-10`}>
                      <Icon className={`w-6 h-6 ${categoryColors[exercise.category].split(' ')[1]}`} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[exercise.category]}`}>
                      {exercise.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{exercise.name}</h3>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {exercise.muscleGroup.map((muscle, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {muscle.toLowerCase()}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                    {exercise.instructions}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Dumbbell size={14} />
                    <span className="capitalize">{exercise.equipment.toLowerCase().replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between group-hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-700">View Details</span>
                  <ChevronRight size={18} className="text-gray-400 group-hover:text-black transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No exercises found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
