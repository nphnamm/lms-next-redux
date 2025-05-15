'use client';

import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { BookOpen, GraduationCap, Calendar, MessageSquare } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAppSelector((state: RootState) => state.auth);

  const stats = [
    {
      title: 'Active Courses',
      value: '3',
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      title: 'Completed Lessons',
      value: '12',
      icon: GraduationCap,
      color: 'bg-green-500',
    },
    {
      title: 'Upcoming Sessions',
      value: '2',
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      title: 'Unread Messages',
      value: '5',
      icon: MessageSquare,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">Welcome back, {user?.name || 'User'}!</h1>
        <p className="text-gray-500">Here's what's happening with your courses today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">Completed Lesson {item}</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Upcoming Sessions</h2>
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">Web Development Workshop</p>
                  <p className="text-xs text-gray-500">Tomorrow at 10:00 AM</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700">
                Join
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 