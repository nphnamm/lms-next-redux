"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { RootState } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createCourse } from "@/store/features/courseSlice";
import toast from "react-hot-toast";

interface CourseFormData {
  title: string;
  description: string;
  price: number;
  instructorId: string;
  image: string;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    price: 0,
    instructorId: user?.id || "",
    image: "",
  });
  const dispatch = useAppDispatch();
  const [isCreateCourseLoading, setIsCreateCourseLoading] = useState(false);
  const { courses, loading, error } = useAppSelector(
    (state: RootState) => state.courses
  );
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "lessons" ? parseInt(value) || 0 : value,
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const removeThumbnail = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement your API call here
      console.log("Form data:", formData);
      const newFormData = new FormData();
      newFormData.append("title", formData.title);
      newFormData.append("description", formData.description);
      newFormData.append("price", formData.price.toString());
      newFormData.append("instructorId", formData.instructorId);
      newFormData.append("image", formData.image);

      dispatch(createCourse(newFormData));
      setIsCreateCourseLoading(true);
      // Simulate API call
      if (!error) {
        toast.success("Course created successfully");
        setTimeout(() => {
          router.push("/courses");
        }, 800);
      }
      // router.push("/courses");
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Error creating course");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/courses"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Courses
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Create New Course
        </h1>
        <p className="text-muted-foreground mt-1">
          Fill in the details to create a new course
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Course Thumbnail
          </label>
          <div className="flex items-center gap-4">
            {formData.image ? (
              <div className="relative">
                <img
                  src={formData.image}
                  alt="Course thumbnail"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>
            )}
            <div className="text-sm text-muted-foreground">
              Recommended size: 800x450px
              <br />
              Max file size: 2MB
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium text-foreground"
          >
            Course Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter course title"
            required
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-foreground"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter course description"
            required
            rows={4}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>

        {/* Duration and Lessons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="price"
              className="text-sm font-medium text-foreground"
            >
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., 8 weeks"
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4">
          <Link
            href="/courses"
            className="px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}
