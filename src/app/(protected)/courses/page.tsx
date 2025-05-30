"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Users,
  Clock,
  BookOpen,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { RootState } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCourses } from "@/store/features/courseSlice";
import { Course } from "@/lib/services/courseService";
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

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  
  const dispatch = useAppDispatch();
  const { courses, loading, error } = useAppSelector(
    (state: RootState) => state.courses
  );
  console.log(courses);
  useEffect(() => {
    dispatch(fetchCourses());
  }, []);

  const handleEdit = (courseId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link component from navigating
    // Navigate to edit page
    window.location.href = `/courses/${courseId}/edit`;
  };

  const handleDeleteClick = (course: Course, e: React.MouseEvent) => {
    e.preventDefault();
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (courseToDelete) {
      try {
        // TODO: Implement delete course action
        console.log("Deleting course:", courseToDelete.id);
        setDeleteDialogOpen(false);
        setCourseToDelete(null);
      } catch (error) {
        console.error("Failed to delete course:", error);
      }
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Course Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and organize your courses
            </p>
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
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="p-2 hover:bg-accent rounded-lg ml-2"
                      >
                        <MoreVertical className="h-5 w-5 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleEdit(course.id, e)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleDeleteClick(course, e)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {course.lessons.length} lessons
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.price} USD
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {course.isPublished ? "Published" : "Draft"}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-sm font-medium text-foreground">
                        {course.title.charAt(0)}
                      </span>
                    </div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                    ${
                      course.isPublished
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {courses.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-accent/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No courses found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{courseToDelete?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 rounded-lg border hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
