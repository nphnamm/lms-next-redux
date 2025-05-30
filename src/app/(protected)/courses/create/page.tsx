"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { RootState } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createCourse } from "@/store/features/courseSlice";
import toast from "react-hot-toast";
import { Disclosure } from "@headlessui/react";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface CourseFormData {
  title: string;
  description: string;
  price: number;
  instructorId: string;
  image: File | null;
  level: number;
  category: number;
  tags: string[];
  prerequisites: string[];
  rating: number;
  totalEnrollments: number;
  syllabus: string;
  learningObjectives: string;
  requirements: string;
  targetAudience: string;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    price: 0,
    instructorId: user?.id || "",
    image: null,
    level: 1,
    category: 1,
    tags: [],
    prerequisites: [],
    rating: 0,
    totalEnrollments: 0,
    syllabus: "",
    learningObjectives: "",
    requirements: "",
    targetAudience: "",
  });
  const dispatch = useAppDispatch();
  const [isCreateCourseLoading, setIsCreateCourseLoading] = useState(false);
  const { courses, loading, error, success } = useAppSelector(
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
        image: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const removeThumbnail = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setPreviewImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newFormData = new FormData();
      newFormData.append("title", formData.title);
      newFormData.append("description", formData.description);
      newFormData.append("price", formData.price.toString());
      newFormData.append("instructorId", formData.instructorId);
      if (formData.image) {
        newFormData.append("image", formData.image);
      }
      newFormData.append("level", formData.level.toString());
      newFormData.append("category", formData.category.toString());
      newFormData.append("tags", JSON.stringify(formData.tags));

      // Only append prerequisites if there are any
      if (formData.prerequisites.length > 0) {
        newFormData.append(
          "prerequisites",
          JSON.stringify(formData.prerequisites)
        );
      }

      newFormData.append("rating", formData.rating.toString());
      newFormData.append(
        "totalEnrollments",
        formData.totalEnrollments.toString()
      );
      newFormData.append("syllabus", formData.syllabus);
      newFormData.append("learningObjectives", formData.learningObjectives);
      newFormData.append("requirements", formData.requirements);
      newFormData.append("targetAudience", formData.targetAudience);

      dispatch(createCourse(newFormData));

      console.log("success", success);
      console.log("loading", loading);
      console.log("error", error);

      setIsCreateCourseLoading(true);
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Error creating course");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    if (success) {
      toast.success("Course created successfully");
      setTimeout(() => {
        router.push("/courses");
      }, 800);
    }
    if (loading) {
      toast.loading("Creating course...");
      setIsSubmitting(true);
    } else {
      setTimeout(() => {
        toast.dismiss();
        setIsSubmitting(false);
      }, 1500);
    }
    if (error) {
      toast.error("Error creating course");
    }
  }, [success, error, loading]);

  return (
    <div className="w-full mx-auto space-y-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Required Fields */}
          <div className="space-y-6">
            {/* Thumbnail Upload */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Course Thumbnail</h2>
              <div className="flex items-center gap-4">
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={previewImage || URL.createObjectURL(formData.image)}
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
                    <span className="text-sm text-muted-foreground">
                      Upload
                    </span>
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
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">
                Required Information
              </h2>

              {/* Title */}
              <div className="space-y-2 mb-4">
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-foreground"
                >
                  Course Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter course title"
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Price */}
              <div className="space-y-2 mb-4">
                <label
                  htmlFor="price"
                  className="text-sm font-medium text-foreground"
                >
                  Price <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter course price"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Level */}
              <div className="space-y-2 mb-4">
                <label
                  htmlFor="level"
                  className="text-sm font-medium text-foreground"
                >
                  Level <span className="text-destructive">*</span>
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value={1}>Beginner</option>
                  <option value={2}>Intermediate</option>
                  <option value={3}>Advanced</option>
                </select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-foreground"
                >
                  Category <span className="text-destructive">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value={1}>Programming</option>
                  <option value={2}>Design</option>
                  <option value={3}>Business</option>
                  <option value={4}>Marketing</option>
                  <option value={5}>Music</option>
                  <option value={6}>Photography</option>
                  <option value={7}>Health</option>
                  <option value={8}>Fitness</option>
                  <option value={9}>Language</option>
                  <option value={10}>Science</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column - Optional Fields */}
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Course Description</h2>
              <div data-color-mode="light">
                <MDEditor
                  value={formData.description}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, description: val || "" }))
                  }
                  height={200}
                />
              </div>
            </div>

            {/* Additional Information */}
            <Disclosure defaultOpen={false}>
              {({ open }) => (
                <div className="bg-card rounded-lg border border-border">
                  <Disclosure.Button className="w-full px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      Additional Information
                    </h2>
                    {open ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-6 pb-6 space-y-4">
                    {/* Tags */}
                    <div className="space-y-2">
                      <label
                        htmlFor="tags"
                        className="text-sm font-medium text-foreground"
                      >
                        Tags
                      </label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags.join(", ")}
                        onChange={(e) => {
                          const tags = e.target.value
                            .split(",")
                            .map((tag) => tag.trim());
                          setFormData((prev) => ({ ...prev, tags }));
                        }}
                        placeholder="Enter tags separated by commas"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    {/* Prerequisites */}
                    <div className="space-y-2">
                      <label
                        htmlFor="prerequisites"
                        className="text-sm font-medium text-foreground"
                      >
                        Prerequisites
                      </label>
                      <input
                        type="text"
                        id="prerequisites"
                        name="prerequisites"
                        value={formData.prerequisites.join(", ")}
                        onChange={(e) => {
                          const prerequisites = e.target.value
                            .split(",")
                            .map((prereq) => prereq.trim())
                            .filter((prereq) =>
                              prereq.match(
                                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
                              )
                            );
                          setFormData((prev) => ({ ...prev, prerequisites }));
                        }}
                        placeholder="Enter prerequisite course IDs (UUIDs) separated by commas"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <p className="text-sm text-muted-foreground">
                        Enter the UUIDs of prerequisite courses, separated by
                        commas
                      </p>
                    </div>
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>

            {/* Course Content */}
            <Disclosure defaultOpen={false}>
              {({ open }) => (
                <div className="bg-card rounded-lg border border-border">
                  <Disclosure.Button className="w-full px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Course Content</h2>
                    {open ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-6 pb-6 space-y-4">
                    {/* Syllabus */}
                    <div className="space-y-2">
                      <label
                        htmlFor="syllabus"
                        className="text-sm font-medium text-foreground"
                      >
                        Syllabus
                      </label>
                      <div data-color-mode="light">
                        <MDEditor
                          value={formData.syllabus}
                          onChange={(val) =>
                            setFormData((prev) => ({
                              ...prev,
                              syllabus: val || "",
                            }))
                          }
                          height={200}
                        />
                      </div>
                    </div>

                    {/* Learning Objectives */}
                    <div className="space-y-2">
                      <label
                        htmlFor="learningObjectives"
                        className="text-sm font-medium text-foreground"
                      >
                        Learning Objectives
                      </label>
                      <div data-color-mode="light">
                        <MDEditor
                          value={formData.learningObjectives}
                          onChange={(val) =>
                            setFormData((prev) => ({
                              ...prev,
                              learningObjectives: val || "",
                            }))
                          }
                          height={200}
                        />
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-2">
                      <label
                        htmlFor="requirements"
                        className="text-sm font-medium text-foreground"
                      >
                        Requirements
                      </label>
                      <div data-color-mode="light">
                        <MDEditor
                          value={formData.requirements}
                          onChange={(val) =>
                            setFormData((prev) => ({
                              ...prev,
                              requirements: val || "",
                            }))
                          }
                          height={200}
                        />
                      </div>
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-2">
                      <label
                        htmlFor="targetAudience"
                        className="text-sm font-medium text-foreground"
                      >
                        Target Audience
                      </label>
                      <div data-color-mode="light">
                        <MDEditor
                          value={formData.targetAudience}
                          onChange={(val) =>
                            setFormData((prev) => ({
                              ...prev,
                              targetAudience: val || "",
                            }))
                          }
                          height={200}
                        />
                      </div>
                    </div>
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
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
            disabled={isSubmitting || loading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}
