'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Plus,
  Scale,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  Heart,
  Moon,
  Smile
} from 'lucide-react';

// Mock progress data
const mockProgressLogs = [
  { id: 1, date: '2025-01-24', type: 'WEIGHT', value: 75, unit: 'kg' },
  { id: 2, date: '2025-01-24', type: 'BODY_FAT', value: 18, unit: '%' },
  { id: 3, date: '2025-01-21', type: 'WEIGHT', value: 75.3, unit: 'kg' },
  { id: 4, date: '2025-01-21', type: 'BODY_FAT', value: 18.2, unit: '%' },
  { id: 5, date: '2025-01-17', type: 'WEIGHT', value: 75.8, unit: 'kg' },
  { id: 6, date: '2025-01-17', type: 'BODY_FAT', value: 18.5, unit: '%' },
  { id: 7, date: '2025-01-14', type: 'WEIGHT', value: 76.2, unit: 'kg' },
  { id: 8, date: '2025-01-10', type: 'WEIGHT', value: 76.5, unit: 'kg' },
];

const progressTypes = [
  { id: 'WEIGHT', label: 'Weight', icon: Scale, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { id: 'BODY_FAT', label: 'Body Fat', icon: TrendingDown, color: 'text-red-600', bgColor: 'bg-red-100' },
  { id: 'MUSCLE_MASS', label: 'Muscle Mass', icon: Activity, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { id: 'MEASUREMENTS', label: 'Measurements', icon: Activity, color: 'text-green-600', bgColor: 'bg-green-100' },
  { id: 'ENERGY_LEVEL', label: 'Energy Level', icon: Heart, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { id: 'SLEEP_QUALITY', label: 'Sleep Quality', icon: Moon, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  { id: 'MOOD', label: 'Mood', icon: Smile, color: 'text-pink-600', bgColor: 'bg-pink-100' },
];

export default function ProgressPage() {
  const [selectedType, setSelectedType] = useState('WEIGHT');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredLogs = mockProgressLogs.filter(log => log.type === selectedType);
  const latestLog = filteredLogs[0];
  const previousLog = filteredLogs[1];

  const change = latestLog && previousLog ? latestLog.value - previousLog.value : 0;
  const changePercent = previousLog ? ((change / previousLog.value) * 100).toFixed(1) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
            <p className="text-gray-600 mt-1">Monitor your fitness journey</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} />
            Log Progress
          </button>
        </div>

        {/* Progress Type Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {progressTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-black bg-black text-white shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-white' : type.color}`} />
                <p className={`text-xs font-medium text-center ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                  {type.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Current Stats */}
        {latestLog && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600 mb-2">Current</p>
              <p className="text-4xl font-bold text-gray-900">
                {latestLog.value}
                <span className="text-xl text-gray-500 ml-2">{latestLog.unit}</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                As of {new Date(latestLog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600 mb-2">Change</p>
              <div className="flex items-center gap-2">
                <p className={`text-4xl font-bold ${change < 0 ? 'text-green-600' : change > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {change > 0 ? '+' : ''}{change.toFixed(1)}
                </p>
                {change !== 0 && (
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                    change < 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {change < 0 ? <TrendingDown size={14} className="mr-1" /> : <TrendingUp size={14} className="mr-1" />}
                    {Math.abs(Number(changePercent))}%
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">Since last log</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600 mb-2">Goal</p>
              <p className="text-4xl font-bold text-gray-900">
                70
                <span className="text-xl text-gray-500 ml-2">kg</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">Target weight</p>
            </div>
          </div>
        )}

        {/* Progress Chart Placeholder */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Progress Over Time</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Chart visualization coming soon</p>
              <p className="text-gray-400 text-xs mt-1">Will show trend over time</p>
            </div>
          </div>
        </div>

        {/* Progress Log History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Log History</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {filteredLogs.map((log, index) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg">
                      <Calendar size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {log.value} {log.unit}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(log.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  {index < filteredLogs.length - 1 && (
                    <div className="flex items-center gap-2">
                      {log.value < filteredLogs[index + 1].value ? (
                        <TrendingDown className="text-green-600" size={20} />
                      ) : log.value > filteredLogs[index + 1].value ? (
                        <TrendingUp className="text-red-600" size={20} />
                      ) : null}
                      <span className="text-sm text-gray-600">
                        {(log.value - filteredLogs[index + 1].value).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
