"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Upload } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createLesson } from "@/store/features/lessonSlice";
import toast from "react-hot-toast";
import { createQuestions } from "@/store/features/questionSlice";
import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";

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
  order?: number;
}

interface Lesson {
  title: string;
  content: string;
  duration: string;
  order: number;
  lessonId: string;
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

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function CreateExercisePage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] =
    useState<QuestionType | null>(null);
  const [createdLessonId, setCreatedLessonId] = useState<string | null>(null);
  const { lessons, loading, error } = useAppSelector((state) => state.lessons);
  const dispatch = useAppDispatch();
  const [lesson, setLesson] = useState<Lesson>({
    title: "",
    content: "",
    duration: "",
    order: 0,
    lessonId: lessonId,
    isPublished: false,
    type: 0,
    questions: [],
  });
  const [autoIncrementOrder, setAutoIncrementOrder] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedQuestions, setImportedQuestions] = useState<Question[]>([]);
  const [importError, setImportError] = useState<string | null>(null);

  const handleQuestionTypeSelect = (type: QuestionType) => {
    setSelectedQuestionType(type);
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
          : type === "matching"
          ? [{ id: "1", text: "", isCorrect: false }]
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

  const removeQuestion = (questionId: string) => {
    setLesson((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const addOption = (questionId: string) => {
    setLesson((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...(q.options || []),
                {
                  id: Math.random().toString(36).substr(2, 9),
                  text: "",
                  isCorrect: false,
                },
              ],
            }
          : q
      ),
    }));
  };

  const removeOption = (questionId: string, optionId: string) => {
    setLesson((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.filter((opt) => opt.id !== optionId),
            }
          : q
      ),
    }));
  };

  const handleAutoIncrementToggle = (checked: boolean) => {
    setAutoIncrementOrder(checked);
    if (checked) {
      setLesson((prev) => ({
        ...prev,
        questions: prev.questions.map((q) => ({ ...q, order: 0 })),
      }));
    }
  };

  const handleCreateLesson = async () => {
    setIsSubmitting(true);
    try {
      if (createdLessonId) {
        if (lesson.questions.length > 0) {
          await handleCreateQuestions(createdLessonId);
        } else {
          router.push(`/courses/${lessonId}`);
        }
        return;
      }

      const lessonData = {
        title: lesson.title,
        content: lesson.content,
        order: lesson.order,
        courseId: lessonId,
        isPublished: lesson.isPublished,
        type: selectedQuestionType
          ? questionTypeToNumber[selectedQuestionType]
          : 0,
      };

      const createResponse = (await dispatch(createLesson({ lessonData }))) as {
        meta: { requestStatus: string };
        payload: { data: { id: string } };
      };

      if (
        createResponse.meta.requestStatus === "fulfilled" &&
        createResponse.payload?.data?.id
      ) {
        toast.success("Lesson created successfully");
        setCreatedLessonId(createResponse.payload.data.id);
      }

      if (lesson.questions.length > 0) {
        await handleCreateQuestions(createResponse.payload?.data?.id);
      } else {
        setTimeout(() => {
          router.push(`/courses/${lessonId}`);
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast.error("Failed to create lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateQuestions = async (lessonId: string) => {
    try {
      const questionsData = {
        lessonId,
        lessonType: 1,
        questions: lesson.questions.map((q) => ({
          text: q.text,
          options: q.options?.map((opt) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        })),
      };

      const createResponse = (await dispatch(
        createQuestions({ questionsData })
      )) as {
        meta: { requestStatus: string };
        payload: { data: { id: string } };
      };

      if (createResponse.meta.requestStatus === "fulfilled") {
        toast.success("Questions created successfully");
        setCreatedLessonId(createResponse.payload.data.id);
        setTimeout(() => {
          router.push(`/courses/${lessonId}`);
        }, 1000);
      } else {
        toast.error("Failed to create questions");
      }
    } catch (error) {
      console.error("Error creating questions:", error);
      toast.error("Failed to create questions");
    }
  };

  const handleImportQuestions = (jsonString: string) => {
    try {
      const questions = JSON.parse(jsonString);
      if (!Array.isArray(questions)) {
        throw new Error("Imported data must be an array of questions");
      }

      if (!selectedQuestionType) {
        throw new Error("Please select a question type first");
      }

      const validatedQuestions = questions.map((q: any) => {
        if (!q.type || !q.text) {
          throw new Error("Each question must have a type and text");
        }

        if (q.type !== selectedQuestionType) {
          throw new Error(`All questions must be of type "${selectedQuestionType}"`);
        }

        return {
          id: Math.random().toString(36).substr(2, 9),
          type: q.type,
          text: q.text,
          points: q.points || 1,
          options: q.options?.map((opt: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            text: opt.text,
            isCorrect: opt.isCorrect || false,
          })),
          order: q.order || 0,
        };
      });

      setLesson((prev) => ({
        ...prev,
        questions: [...prev.questions, ...validatedQuestions],
      }));
      setImportError(null);
      setIsImportModalOpen(false);
      toast.success("Questions imported successfully");
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Invalid JSON format");
      toast.error("Failed to import questions");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/courses/${lessonId}`}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Course
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Create New Exercise
        </h1>
        <p className="text-muted-foreground mt-1">
          Add questions and content to your exercise
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
              Exercise Title
            </label>
            <input
              type="text"
              id="title"
              value={lesson.title}
              onChange={(e) =>
                setLesson((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter exercise title"
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
              placeholder="Enter exercise content"
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
              disabled={autoIncrementOrder}
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

          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-foreground">
              Publish Exercise
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={lesson.isPublished}
              onClick={() =>
                setLesson((prev) => ({
                  ...prev,
                  isPublished: !prev.isPublished,
                }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                lesson.isPublished ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  lesson.isPublished ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-foreground">
              Auto-increment question order
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={autoIncrementOrder}
              onClick={() => handleAutoIncrementToggle(!autoIncrementOrder)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                autoIncrementOrder ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoIncrementOrder ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
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
            <div className="sticky top-0 z-10 bg-background py-4 border-b border-border">
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(true)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-primary hover:text-primary/90 transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Questions
                </button>
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
                    <div data-color-mode="light">
                      <MDEditor
                        value={question.text}
                        onChange={(val) =>
                          updateQuestion(question.id, { text: val || "" })
                        }
                        height={150}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Order
                    </label>
                    <input
                      type="number"
                      value={question.order ?? 0}
                      onChange={(e) =>
                        updateQuestion(question.id, {
                          order: parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                      required
                      disabled={autoIncrementOrder}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* Question Type Specific Fields */}
                  {(question.type === "multiple-choice" ||
                    question.type === "true-false") && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">
                          Options
                        </label>
                        {question.type === "multiple-choice" && (
                          <button
                            type="button"
                            onClick={() => addOption(question.id)}
                            className="text-sm text-primary hover:text-primary/90"
                          >
                            Add Option
                          </button>
                        )}
                      </div>
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
                            {question.type === "multiple-choice" &&
                              question.options &&
                              question.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeOption(question.id, option.id)
                                  }
                                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
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
                            options: [
                              {
                                id: Math.random().toString(36).substr(2, 9),
                                text: e.target.value,
                                isCorrect: true,
                              },
                            ],
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
                            options: [
                              {
                                id: Math.random().toString(36).substr(2, 9),
                                text: e.target.value,
                                isCorrect: true,
                              },
                            ],
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
            href={`/courses/${lessonId}`}
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
            {isSubmitting ? "Creating..." : "Create Exercise"}
          </button>
        </div>
      </form>

      {/* Import Questions Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Import Questions</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Questions (JSON format)
                </label>
                <p className="text-sm text-muted-foreground">
                  Import questions of type: <span className="font-medium">{selectedQuestionType}</span>
                </p>
                <textarea
                  className="w-full h-64 px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder={`Paste your questions in JSON format here. Example for ${selectedQuestionType}:
[
  {
    "type": "${selectedQuestionType}",
    "text": "Your question here",
    "points": 1,
    "options": [
      {"text": "Option 1", "isCorrect": false},
      {"text": "Option 2", "isCorrect": true}
    ]
  }
]`}
                  onChange={(e) => {
                    try {
                      const questions = JSON.parse(e.target.value);
                      if (Array.isArray(questions)) {
                        setImportedQuestions(questions);
                        setImportError(null);
                      }
                    } catch (error) {
                      setImportError("Invalid JSON format");
                    }
                  }}
                />
                {importError && (
                  <p className="text-sm text-red-500">{importError}</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportError(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleImportQuestions(JSON.stringify(importedQuestions))}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 