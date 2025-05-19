"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { useQuery } from "@tanstack/react-query";
import { fetchCourseById } from "@/store/features/courseSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Course, Lesson } from "@/lib/services/courseService";




export default function CourseDetailPage(
 ) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const CourseId = params.id;
  const { currentCourse } = useAppSelector((state) => state.courses);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCourseById(CourseId as string));
  }, [CourseId, dispatch]);

  useEffect(() => {
    setCourse(currentCourse as Course);
    setLessons(currentCourse?.lessons as Lesson[]);
  }, [currentCourse]);
  console.log("courseDetails", currentCourse);
  const [course, setCourse] = useState<Course>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  // Mock data - replace with actual API call


  // Mock lessons data - replace with actual API call


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
              {course?.title}
            </h1>
            <p className="text-muted-foreground mt-2">{course?.description}</p>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center text-muted-foreground">
              <Users className="h-5 w-5 mr-2" />

            </div>
            <div className="flex items-center text-muted-foreground">
              <BookOpen className="h-5 w-5 mr-2" />
              {course?.lessons.length} lessons
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">

            </div>
          </div>
        </div>

        <div className="relative aspect-video rounded-xl overflow-hidden">
          {course?.imageUrl ? (
            <img
              src={course?.imageUrl}
              alt={course?.title}
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
            {lessons?.map((lesson) => (
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
                      {lesson.content}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
