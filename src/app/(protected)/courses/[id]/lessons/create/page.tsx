"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, GripVertical, Save } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createLesson } from "@/store/features/lessonSlice";
import toast from "react-hot-toast";

type QuestionType =
  | "multiple-choice"
  | "true-false"
  | "matching"
  | "fill-blank"
  | "text";

interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  options?: Option[];
  matchingPairs?: MatchingPair[];
  correctAnswer?: string;
}

interface Lesson {
  title: string;
  content: string;
  duration: string;
  order: number;
  courseId: string;
  isPublished: boolean;
  type: number;
  questions: Question[];
}

const questionTypeToNumber = {
  "multiple-choice": 3,
  "true-false": 1,
  matching: 4,
  "fill-blank": 2,
  text: 0,
} as const;

export default function CreateLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const CourseId = unwrappedParams.id;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] =
    useState<QuestionType | null>(null);
  const [createdLessonId, setCreatedLessonId] = useState<string | null>(null);
  const { lessons, isLoading, error } = useAppSelector(
    (state) => state.lessons
  );
  const dispatch = useAppDispatch();
  const [lesson, setLesson] = useState<Lesson>({
    title: "",
    content: "",
    duration: "",
    order: 0,
    courseId: CourseId,
    isPublished: false,
    type: 0,
    questions: [],
  });

  const handleQuestionTypeSelect = (type: QuestionType) => {
    setSelectedQuestionType(type);
    // Clear existing questions when switching types
    setLesson((prev) => ({
      ...prev,
      questions: [],
    }));
  };

  const addQuestion = (type: QuestionType) => {
    if (type !== selectedQuestionType) return;

    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text: "",
      points: 1,
      options:
        type === "multiple-choice"
          ? [
              { id: "1", text: "", isCorrect: false },
              { id: "2", text: "", isCorrect: false },
              { id: "3", text: "", isCorrect: false },
              { id: "4", text: "", isCorrect: false },
            ]
          : type === "true-false"
          ? [
              { id: "1", text: "True", isCorrect: false },
              { id: "2", text: "False", isCorrect: false },
            ]
          : undefined,
      matchingPairs:
        type === "matching"
          ? [
              { id: "1", left: "", right: "" },
              { id: "2", left: "", right: "" },
            ]
          : undefined,
    };
    setLesson((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setLesson((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    }));
  };

  const updateOption = (
    questionId: string,
    optionId: string,
    updates: Partial<Option>
  ) => {
    setLesson((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((opt) =>
                opt.id === optionId ? { ...opt, ...updates } : opt
              ),
            }
          : q
      ),
    }));
  };

  const updateMatchingPair = (
    questionId: string,
    pairId: string,
    updates: Partial<MatchingPair>
  ) => {
    setLesson((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              matchingPairs: q.matchingPairs?.map((pair) =>
                pair.id === pairId ? { ...pair, ...updates } : pair
              ),
            }
          : q
      ),
    }));
  };

  const addMatchingPair = (questionId: string) => {
    setLesson((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              matchingPairs: [
                ...(q.matchingPairs || []),
                {
                  id: Math.random().toString(36).substr(2, 9),
                  left: "",
                  right: "",
                },
              ],
            }
          : q
      ),
    }));
  };

  const removeQuestion = (questionId: string) => {
    setLesson((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const handleCreateLesson = async () => {
    setIsSubmitting(true);
    try {
      const lessonData = {
        title: lesson.title,
        content: lesson.content,
        order: lesson.order,
        courseId: lesson.courseId,
        isPublished: lesson.isPublished,
        type: selectedQuestionType
          ? questionTypeToNumber[selectedQuestionType]
          : 0,
      };
      console.log("lessonData", lessonData);

      const response = await dispatch(createLesson({ lessonData }));
      console.log("response", response);
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("Lesson created successfully");
        setCreatedLessonId(response.payload.id);
      }
      // If there are questions, create them
      if (lesson.questions.length > 0) {
        await handleCreateQuestions(response.payload.id);
      } else {
        setTimeout(() => {
          router.push(`/courses/${CourseId}`);
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating lesson:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateQuestions = async (lessonId: string) => {
    try {
      const questionsData = {
        lessonId,
        lessonType: selectedQuestionType
          ? questionTypeToNumber[selectedQuestionType]
          : 0,
        questions: lesson.questions.map((q) => ({
          text: q.text,
          options: q.options?.map((opt) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
          matchingPairs: q.matchingPairs?.map((pair) => ({
            left: pair.left,
            right: pair.right,
          })),
          correctAnswer: q.correctAnswer,
        })),
      };

      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionsData),
      });

      if (!response.ok) {
        throw new Error("Failed to create questions");
      }

      router.push(`/courses/${CourseId}`);
    } catch (error) {
      console.error("Error creating questions:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/courses/${CourseId}`}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Course
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Create New Lesson
        </h1>
        <p className="text-muted-foreground mt-1">
          Add questions and content to your lesson
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateLesson();
        }}
        className="space-y-8"
      >
        {/* Basic Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-foreground"
            >
              Lesson Title
            </label>
            <input
              type="text"
              id="title"
              value={lesson.title}
              onChange={(e) =>
                setLesson((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter lesson title"
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-foreground"
            >
              Description
            </label>
            <textarea
              id="description"
              value={lesson.content}
              onChange={(e) =>
                setLesson((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="Enter lesson content"
              required
              rows={3}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="order"
              className="text-sm font-medium text-foreground"
            >
              Order
            </label>
            <input
              type="number"
              id="order"
              value={lesson.order}
              onChange={(e) =>
                setLesson((prev) => ({
                  ...prev,
                  order: parseInt(e.target.value) || 0,
                }))
              }
              min="0"
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={lesson.isPublished}
              onChange={(e) =>
                setLesson((prev) => ({
                  ...prev,
                  isPublished: e.target.checked,
                }))
              }
              className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
            />
            <label
              htmlFor="isPublished"
              className="text-sm font-medium text-foreground"
            >
              Publish Lesson
            </label>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Questions</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuestionTypeSelect("text")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedQuestionType === "text"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Text
              </button>
              <button
                type="button"
                onClick={() => handleQuestionTypeSelect("true-false")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedQuestionType === "true-false"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                True/False
              </button>
              <button
                type="button"
                onClick={() => handleQuestionTypeSelect("fill-blank")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedQuestionType === "fill-blank"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Fill in Blank
              </button>
              <button
                type="button"
                onClick={() => handleQuestionTypeSelect("matching")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedQuestionType === "matching"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Matching
              </button>
              <button
                type="button"
                onClick={() => handleQuestionTypeSelect("multiple-choice")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedQuestionType === "multiple-choice"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Multiple Choice
              </button>
            </div>
          </div>

          {selectedQuestionType && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => addQuestion(selectedQuestionType)}
                className="flex items-center px-4 py-2 text-sm font-medium text-primary hover:text-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add{" "}
                {selectedQuestionType.charAt(0).toUpperCase() +
                  selectedQuestionType.slice(1)}{" "}
                Question
              </button>
            </div>
          )}

          <div className="space-y-6">
            {lesson.questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-card border border-border rounded-lg p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Question {index + 1}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Question Text
                    </label>
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) =>
                        updateQuestion(question.id, { text: e.target.value })
                      }
                      placeholder="Enter your question"
                      required
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Points
                    </label>
                    <input
                      type="number"
                      value={question.points}
                      onChange={(e) =>
                        updateQuestion(question.id, {
                          points: parseInt(e.target.value) || 0,
                        })
                      }
                      min="1"
                      required
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* Question Type Specific Fields */}
                  {(question.type === "multiple-choice" ||
                    question.type === "true-false") && (
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-foreground">
                        Options
                      </label>
                      <div className="space-y-3">
                        {question.options?.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center gap-3"
                          >
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={option.isCorrect}
                              onChange={() => {
                                const updatedOptions = question.options?.map(
                                  (opt) => ({
                                    ...opt,
                                    isCorrect: opt.id === option.id,
                                  })
                                );
                                updateQuestion(question.id, {
                                  options: updatedOptions,
                                });
                              }}
                              className="h-4 w-4 text-primary focus:ring-primary"
                            />
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) =>
                                updateOption(question.id, option.id, {
                                  text: e.target.value,
                                })
                              }
                              placeholder="Enter option text"
                              required
                              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {question.type === "matching" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">
                          Matching Pairs
                        </label>
                        <button
                          type="button"
                          onClick={() => addMatchingPair(question.id)}
                          className="text-sm text-primary hover:text-primary/90"
                        >
                          Add Pair
                        </button>
                      </div>
                      <div className="space-y-3">
                        {question.matchingPairs?.map((pair) => (
                          <div
                            key={pair.id}
                            className="flex items-center gap-3"
                          >
                            <input
                              type="text"
                              value={pair.left}
                              onChange={(e) =>
                                updateMatchingPair(question.id, pair.id, {
                                  left: e.target.value,
                                })
                              }
                              placeholder="Left item"
                              required
                              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <span className="text-muted-foreground">
                              matches with
                            </span>
                            <input
                              type="text"
                              value={pair.right}
                              onChange={(e) =>
                                updateMatchingPair(question.id, pair.id, {
                                  right: e.target.value,
                                })
                              }
                              placeholder="Right item"
                              required
                              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {question.type === "fill-blank" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Correct Answer
                      </label>
                      <input
                        type="text"
                        value={question.correctAnswer}
                        onChange={(e) =>
                          updateQuestion(question.id, {
                            correctAnswer: e.target.value,
                          })
                        }
                        placeholder="Enter the correct answer"
                        required
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  )}

                  {question.type === "text" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Sample Answer
                      </label>
                      <textarea
                        value={question.correctAnswer}
                        onChange={(e) =>
                          updateQuestion(question.id, {
                            correctAnswer: e.target.value,
                          })
                        }
                        placeholder="Enter a sample answer"
                        rows={4}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4">
          <Link
            href={`/courses/${CourseId}`}
            className="px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5 mr-2" />
            {isSubmitting ? "Creating..." : "Create Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
}
