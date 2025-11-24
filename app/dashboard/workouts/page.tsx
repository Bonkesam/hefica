'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  TrendingUp,
  Dumbbell,
  Play,
  CheckCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  Loader2
} from 'lucide-react';

const workoutTypeColors: Record<string, string> = {
  STRENGTH: 'bg-purple-100 text-purple-700',
  CARDIO: 'bg-red-100 text-red-700',
  FLEXIBILITY: 'bg-blue-100 text-blue-700',
  SPORTS: 'bg-green-100 text-green-700',
  MIXED: 'bg-orange-100 text-orange-700',
  REHABILITATION: 'bg-pink-100 text-pink-700',
};

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.workouts.list();
      setWorkouts(response.workouts || []);
    } catch (err: any) {
      console.error('Failed to fetch workouts:', err);
      setError(err.message || 'Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      await apiClient.workouts.delete(id);
      setWorkouts(workouts.filter(w => w.id !== id));
    } catch (err: any) {
      console.error('Failed to delete workout:', err);
      alert(err.message || 'Failed to delete workout');
    }
  };

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workout.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || workout.workoutType === filterType;
    const matchesActive = !showActiveOnly || workout.isActive;

    return matchesSearch && matchesType && matchesActive;
  });

  const stats = {
    total: workouts.length,
    active: workouts.filter(w => w.isActive).length,
    completed: 0, // TODO: Track completed sessions in the future
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-black mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading workouts...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchWorkouts}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workouts</h1>
            <p className="text-gray-600 mt-1">Manage your workout routines</p>
          </div>
          <Link
            href="/dashboard/workouts/create"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} />
            Create Workout
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Dumbbell className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Workouts</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-sm text-gray-600">Active Plans</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-sm text-gray-600">Sessions Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search workouts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="STRENGTH">Strength</option>
              <option value="CARDIO">Cardio</option>
              <option value="FLEXIBILITY">Flexibility</option>
              <option value="SPORTS">Sports</option>
              <option value="MIXED">Mixed</option>
            </select>
            <button
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showActiveOnly
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showActiveOnly ? 'Active Only' : 'Show All'}
            </button>
          </div>
        </div>

        {/* Workouts List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredWorkouts.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100">
              <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No workouts found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first workout'}
              </p>
              <Link
                href="/dashboard/workouts/create"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all"
              >
                <Plus size={20} />
                Create Workout
              </Link>
            </div>
          ) : (
            filteredWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{workout.name}</h3>
                        {workout.isActive && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{workout.description}</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical size={20} className="text-gray-400" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${workoutTypeColors[workout.workoutType]}`}>
                      {workout.workoutType}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock size={14} />
                      {workout.duration} min
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Dumbbell size={14} />
                      {workout.exercises?.length || 0} exercises
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Start date</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {workout.startDate
                          ? new Date(workout.startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'Not set'}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {workout.endDate
                          ? 'Ended'
                          : workout.isActive
                          ? 'Active'
                          : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                  <Link
                    href={`/dashboard/workouts/${workout.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
                  >
                    <Play size={16} />
                    Start Workout
                  </Link>
                  <Link
                    href={`/dashboard/workouts/${workout.id}/edit`}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={18} className="text-gray-600" />
                  </Link>
                  <button
                    onClick={() => handleDelete(workout.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} className="text-gray-600 hover:text-red-600" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
