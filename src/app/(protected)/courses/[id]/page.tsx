"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Users,
  Clock,
  BookOpen,
  Edit2,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  status: "published" | "draft";
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  students: number;
  status: "active" | "draft" | "archived";
  duration: string;
  lessons: number;
  thumbnail?: string;
}

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock data - replace with actual API call
  const course: Course = {
    id: params.id,
    title: "Introduction to Web Development",
    description:
      "Learn the basics of web development including HTML, CSS, and JavaScript. This comprehensive course covers everything from basic syntax to advanced concepts.",
    instructor: "John Doe",
    students: 120,
    status: "active",
    duration: "8 weeks",
    lessons: 24,
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80",
  };

  // Mock lessons data - replace with actual API call
  const lessons: Lesson[] = [
    {
      id: "1",
      title: "Introduction to HTML",
      duration: "45 min",
      status: "published",
    },
    {
      id: "2",
      title: "CSS Fundamentals",
      duration: "60 min",
      status: "published",
    },
    {
      id: "3",
      title: "JavaScript Basics",
      duration: "90 min",
      status: "draft",
    },
  ];

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    setIsDeleting(true);
    try {
      // TODO: Implement delete API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/courses");
    } catch (error) {
      console.error("Error deleting course:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/courses"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Courses
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/courses/${params.id}/edit`)}
            className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Course
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center px-4 py-2 text-sm font-medium text-destructive hover:text-destructive/90 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete Course"}
          </button>
        </div>
      </div>

      {/* Course Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {course.title}
            </h1>
            <p className="text-muted-foreground mt-2">{course.description}</p>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center text-muted-foreground">
              <Users className="h-5 w-5 mr-2" />
              {course.students} students
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-5 w-5 mr-2" />
              {course.duration}
            </div>
            <div className="flex items-center text-muted-foreground">
              <BookOpen className="h-5 w-5 mr-2" />
              {course.lessons} lessons
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
              <span className="text-sm font-medium text-foreground">
                {course.instructor
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <span className="ml-3 text-muted-foreground">
              {course.instructor}
            </span>
          </div>
        </div>

        <div className="relative aspect-video rounded-xl overflow-hidden">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-accent flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {/* Lessons Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Lessons</h2>
          <Link
            href={`/courses/${params.id}/lessons/create`}
            className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Lesson
          </Link>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {lesson.duration}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${
                    lesson.status === "published"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                  }`}
                >
                  {lesson.status.charAt(0).toUpperCase() +
                    lesson.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
