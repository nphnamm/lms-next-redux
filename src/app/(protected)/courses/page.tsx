'use client';

import { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Users, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  students: number;
  status: 'active' | 'draft' | 'archived';
  duration?: string;
  lessons?: number;
}

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Mock data - replace with actual data from your API
  const courses: Course[] = [
    {
      id: '1',
      title: 'Introduction to Web Development',
      description: 'Learn the basics of web development including HTML, CSS, and JavaScript',
      instructor: 'John Doe',
      students: 120,
      status: 'active',
      duration: '8 weeks',
      lessons: 24
    },
    {
      id: '2',
      title: 'Advanced React Patterns',
      description: 'Master advanced React patterns and best practices',
      instructor: 'Jane Smith',
      students: 85,
      status: 'active',
      duration: '6 weeks',
      lessons: 18
    },
    {
      id: '3',
      title: 'Data Structures and Algorithms',
      description: 'Comprehensive guide to data structures and algorithms',
      instructor: 'Mike Johnson',
      students: 150,
      status: 'draft',
      duration: '12 weeks',
      lessons: 36
    },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Course Management</h1>
          <p className="text-muted-foreground mt-1">Manage and organize your courses</p>
        </div>
        <Link
          href="/courses/create"
          className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Course
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm min-w-[200px]"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: Implement course actions menu
                  }}
                  className="p-2 hover:bg-accent rounded-lg ml-2"
                >
                  <MoreVertical className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  {course.students} students
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.duration}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {course.lessons} lessons
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-sm font-medium text-foreground">
                      {course.instructor.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">{course.instructor}</span>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                  ${course.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                    course.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' : 
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'}`}>
                  {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-accent/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
} 