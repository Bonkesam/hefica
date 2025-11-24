'use client';

import DashboardLayout from '@/components/DashboardLayout';
import {
  FileText,
  TrendingUp,
  Calendar,
  Download,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

// Mock reports data
const mockReports = [
  {
    id: 1,
    type: 'WEEKLY_SUMMARY',
    title: 'Weekly Summary - Jan 18-24',
    date: '2025-01-24',
    description: 'Overview of your activities this week',
    metrics: {
      workouts: 5,
      meals: 21,
      avgCalories: 2150,
      weightChange: -0.5
    }
  },
  {
    id: 2,
    type: 'MONTHLY_SUMMARY',
    title: 'Monthly Summary - January 2025',
    date: '2025-01-24',
    description: 'Complete breakdown of January progress',
    metrics: {
      workouts: 18,
      meals: 95,
      avgCalories: 2100,
      weightChange: -1.2
    }
  },
  {
    id: 3,
    type: 'NUTRITION_BREAKDOWN',
    title: 'Nutrition Analysis - Last 30 Days',
    date: '2025-01-23',
    description: 'Detailed macro and calorie breakdown',
    metrics: {
      avgProtein: 145,
      avgCarbs: 175,
      avgFat: 68,
      compliance: 85
    }
  },
  {
    id: 4,
    type: 'WORKOUT_PERFORMANCE',
    title: 'Workout Performance - January',
    date: '2025-01-22',
    description: 'Strength gains and workout consistency',
    metrics: {
      totalSessions: 18,
      avgDuration: 48,
      consistency: 90,
      prRecords: 3
    }
  },
];

const reportTypeColors: Record<string, string> = {
  WEEKLY_SUMMARY: 'bg-blue-100 text-blue-700',
  MONTHLY_SUMMARY: 'bg-purple-100 text-purple-700',
  PROGRESS_ANALYSIS: 'bg-green-100 text-green-700',
  NUTRITION_BREAKDOWN: 'bg-orange-100 text-orange-700',
  WORKOUT_PERFORMANCE: 'bg-red-100 text-red-700',
  GOAL_TRACKING: 'bg-pink-100 text-pink-700',
};

const reportTypeIcons: Record<string, any> = {
  WEEKLY_SUMMARY: Calendar,
  MONTHLY_SUMMARY: BarChart3,
  PROGRESS_ANALYSIS: TrendingUp,
  NUTRITION_BREAKDOWN: PieChart,
  WORKOUT_PERFORMANCE: Activity,
  GOAL_TRACKING: FileText,
};

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">View insights and track your progress</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Activity className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">18</p>
            <p className="text-sm text-blue-100 mt-1">Workouts This Month</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <PieChart className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">95</p>
            <p className="text-sm text-green-100 mt-1">Meals Logged</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 transform rotate-180" />
            </div>
            <p className="text-3xl font-bold">-1.2kg</p>
            <p className="text-sm text-purple-100 mt-1">Weight Change</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">85%</p>
            <p className="text-sm text-orange-100 mt-1">Goal Compliance</p>
          </div>
        </div>

        {/* Available Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Available Reports</h2>
          </div>
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockReports.map((report) => {
              const Icon = reportTypeIcons[report.type] || FileText;
              return (
                <div
                  key={report.id}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${reportTypeColors[report.type]} bg-opacity-10`}>
                      <Icon className={`w-6 h-6 ${reportTypeColors[report.type].split(' ')[1]}`} />
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download size={20} className="text-gray-400 hover:text-black" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{report.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {Object.entries(report.metrics).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 capitalize mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {typeof value === 'number' && value < 0 ? '' : ''}
                          {value}
                          {key.includes('Change') ? 'kg' : ''}
                          {key.includes('compliance') || key.includes('consistency') ? '%' : ''}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Generated {new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <button className="flex items-center gap-1 text-sm font-medium text-black hover:gap-2 transition-all">
                      View Details
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Generate New Report */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Need a Custom Report?</h3>
              <p className="text-gray-300">Generate reports for any date range or specific metrics</p>
            </div>
            <button className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
