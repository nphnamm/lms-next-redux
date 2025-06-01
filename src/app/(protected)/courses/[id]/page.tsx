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
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchCourseById } from "@/store/features/courseSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Course, Lesson } from "@/lib/services/courseService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteLesson } from "@/store/features/lessonSlice";
import toast from "react-hot-toast";

export default function CourseDetailPage() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const params = useParams();
  const CourseId = params.id;
  const { currentCourse } = useAppSelector((state) => state.courses);
  const {currentLesson} = useAppSelector((state)=>state.lessons);
  const [lessons,setLessons] = useState<Lesson[]>([]);
  const {loading,error,success} = useAppSelector((state)=>state.lessons);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCourseById({ id: CourseId as string, includeLessons: true }));
  }, [CourseId, dispatch]);

  useEffect(() => {

    setCourse(currentCourse as Course);
    setLessons(currentCourse?.lessons as Lesson[]);

  }, [currentCourse,lessons]);
  
  console.log("courseDetails", currentCourse);
  const [course, setCourse] = useState<Course>();
  const [lessonId, setLessonId] = useState<string>("");
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

  const handleLessonDelete = async (lessonId: string) => {
    setLessonId(lessonId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    dispatch(deleteLesson({lessonId:lessonId}))
  };

  useEffect(() => {
    if (success) {
      dispatch(fetchCourseById({ id: CourseId as string, includeLessons: true }));
      setIsDeleteDialogOpen(false);
      setLessonToDelete(null);
      toast.success('Lesson deleted successfully');
    }
  }, [success]);

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

              {course?.lessons?.length ? (
                <span className="text-green-500">
                  {course?.lessons?.length} lessons
                </span>
              ) : (
                <span className="text-red-500">No lessons</span>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center"></div>
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
                <div 
                  className="flex items-center gap-4 flex-1 cursor-pointer"
                  onClick={() => router.push(`/lesson/${lesson.id}`)}
                >
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
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent">
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/courses/${params.id}/lessons/${lesson.id}/edit`)}
                      className="cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleLessonDelete(lesson.id)}
                      className="cursor-pointer text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lesson</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{lessonToDelete?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
