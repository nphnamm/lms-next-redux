"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Upload, X, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { RootState } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createLesson } from "@/store/features/lessonSlice";
import toast from "react-hot-toast";
import { Disclosure, Input } from "@headlessui/react";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface LessonFormData {
  title: string;
  content: string;
  description: string;
  order: number;
  courseId: string;
  isPublished: boolean;
  type: number;
  duration: number;
  videoUrl: string;
  resources: string;
  keywords: string[];
  completionRate: number | null;
  viewCount: number | null;
  notes: string | null;
  isPreview: boolean;
  autoIncrement: boolean;
}

const lessonTypes = [
  { value: 0, label: "Text" },
  { value: 1, label: "Video" },
  { value: 2, label: "Quiz" },
  { value: 3, label: "Assignment" },
  { value: 4, label: "Discussion" },
];

export default function CreateLessonPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const CourseId = params.id as string;
  const [formData, setFormData] = useState<LessonFormData>({
    title: "",
    content: "",
    description: "",
    order: 0,
    courseId: CourseId,
    isPublished: false,
    type: 0,
    duration: 0,
    videoUrl: "",
    resources: "",
    keywords: [],
    completionRate: null,
    viewCount: null,
    notes: null,
    isPreview: false,
    autoIncrement: false,
  });

  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector(
    (state: RootState) => state.lessons
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]:
          type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : type === "number"
            ? Number(value)
            : value,
      };

      // If auto-increment is checked, set order to 0
      if (name === "autoIncrement" && (e.target as HTMLInputElement).checked) {
        newData.order = 0;
      }

      return newData;
    });
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, keywords }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const lessonData = {
      title: formData.title,
      content: formData.content,
      description: formData.description,
      order: formData.order,
      courseId: formData.courseId,
      isPublished: formData.isPublished,
      type: formData.type,
      duration: formData.duration,
      videoUrl: formData.videoUrl,
      resources: formData.resources,
      keywords: formData.keywords,
      completionRate: formData.completionRate,
      viewCount: formData.viewCount,
      notes: formData.notes,
      isPreview: formData.isPreview,
    };

    await dispatch(createLesson({ lessonData }));
  };
  console.log('id',CourseId);
  console.log(loading, error, success);

  useEffect(() => {
    if (loading) {
      toast.loading("Creating lesson...");
      setIsSubmitting(true);
      if(success){
        toast.dismiss();
        setIsSubmitting(false);
      }
    } 
    if (success) {
      toast.success("Lesson created successfully");
      setTimeout(() => {
        router.push(`/courses/${CourseId}`);
      }, 800);
    }

    if (error) {
      toast.error("Error creating lesson");
    }
  }, [success, error, loading]);

  return (
    <div className="w-full mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/courses/${CourseId}/lessons`}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Lessons
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Create New Lesson
        </h1>
        <p className="text-muted-foreground mt-1">
          Fill in the details to create a new lesson
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Required Fields */}
          <div className="space-y-6">
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
                  Lesson Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter lesson title"
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Type */}
              <div className="space-y-2 mb-4">
                <label
                  htmlFor="type"
                  className="text-sm font-medium text-foreground"
                >
                  Lesson Type <span className="text-destructive">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {lessonTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order */}
              <div className="flex flex-col ">
                <div className="flex items-center justify-between space-x-3">
                  <span className="text-sm font-medium text-foreground">
                    Auto-increment lesson order
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.autoIncrement}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        autoIncrement: !prev.autoIncrement,
                        order: !prev.autoIncrement ? 0 : prev.order,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      formData.autoIncrement ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.autoIncrement
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {formData.autoIncrement
                      ? "Order of Lesson will be auto-incremented"
                      : "Order of Lesson will not be auto-incremented"}
                  </p>
                </div>
                <div>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    disabled={formData.autoIncrement}
                    value={formData.autoIncrement ? 0 : formData.order}
                    onChange={handleInputChange}
                    placeholder="Enter lesson order"
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label
                  htmlFor="duration"
                  className="text-sm font-medium text-foreground"
                >
                  Duration (minutes) <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="Enter lesson duration in minutes"
                  required
                  min="0"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Optional Fields */}
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Lesson Description</h2>
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

            {/* Content */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Lesson Content</h2>
              <div data-color-mode="light">
                <MDEditor
                  value={formData.content}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, content: val || "" }))
                  }
                  height={300}
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
                    {/* Video URL */}
                    <div className="space-y-2">
                      <label
                        htmlFor="videoUrl"
                        className="text-sm font-medium text-foreground"
                      >
                        Video URL
                      </label>
                      <input
                        type="url"
                        id="videoUrl"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleInputChange}
                        placeholder="Enter video URL"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    {/* Resources */}
                    <div className="space-y-2">
                      <label
                        htmlFor="resources"
                        className="text-sm font-medium text-foreground"
                      >
                        Resources
                      </label>
                      <input
                        type="text"
                        id="resources"
                        name="resources"
                        value={formData.resources}
                        onChange={handleInputChange}
                        placeholder="Enter resources"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    {/* Keywords */}
                    <div className="space-y-2">
                      <label
                        htmlFor="keywords"
                        className="text-sm font-medium text-foreground"
                      >
                        Keywords
                      </label>
                      <input
                        type="text"
                        id="keywords"
                        name="keywords"
                        value={formData.keywords.join(", ")}
                        onChange={handleKeywordsChange}
                        placeholder="Enter keywords separated by commas"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <label
                        htmlFor="notes"
                        className="text-sm font-medium text-foreground"
                      >
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes || ""}
                        onChange={handleInputChange}
                        placeholder="Enter additional notes"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        rows={3}
                      />
                    </div>

                    {/* Completion Rate */}
                    <div className="space-y-2">
                      <label
                        htmlFor="completionRate"
                        className="text-sm font-medium text-foreground"
                      >
                        Completion Rate (%)
                      </label>
                      <input
                        type="number"
                        id="completionRate"
                        name="completionRate"
                        value={formData.completionRate || ""}
                        onChange={handleInputChange}
                        placeholder="Enter completion rate"
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    {/* View Count */}
                    <div className="space-y-2">
                      <label
                        htmlFor="viewCount"
                        className="text-sm font-medium text-foreground"
                      >
                        View Count
                      </label>
                      <input
                        type="number"
                        id="viewCount"
                        name="viewCount"
                        value={formData.viewCount || ""}
                        onChange={handleInputChange}
                        placeholder="Enter view count"
                        min="0"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isPublished"
                          name="isPublished"
                          checked={formData.isPublished}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50"
                        />
                        <label
                          htmlFor="isPublished"
                          className="text-sm font-medium text-foreground"
                        >
                          Publish Lesson
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isPreview"
                          name="isPreview"
                          checked={formData.isPreview}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50"
                        />
                        <label
                          htmlFor="isPreview"
                          className="text-sm font-medium text-foreground"
                        >
                          Preview Lesson
                        </label>
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
            href={`/courses/${CourseId}/lessons`}
            className="px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
}
