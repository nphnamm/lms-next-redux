"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { Course } from "@/lib/services/courseService";

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const courseId = params.id as string;
  console.log(courseId);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    isPublished: false,
  });

  const { courses } = useAppSelector((state: RootState) => state.courses);
  
  useEffect(() => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        price: course.price,
        isPublished: course.isPublished,
      });
    }
  }, [courseId, courses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement update course action
      console.log("Updating course:", { id: courseId, ...formData });
      router.push("/courses");
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Course</h1>
        <p className="text-muted-foreground mt-1">Update your course details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border bg-card text-foreground"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 rounded-lg border bg-card text-foreground"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price (USD)
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
              className="w-full px-4 py-2 rounded-lg border bg-card text-foreground"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="isPublished"
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) =>
                setFormData({ ...formData, isPublished: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="isPublished" className="text-sm font-medium">
              Published
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg border hover:bg-accent"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
} 