"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, BookOpen, Edit2 } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchLessonById } from "@/store/features/lessonSlice";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const Markdown = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  { ssr: false }
);

export default function LessonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  console.log('id', id)
  const dispatch = useAppDispatch();
  const { currentLesson, loading, error } = useAppSelector(
    (state) => state.lessons
  );
  console.log("currentLesson", currentLesson);
  useEffect(() => {
    dispatch(fetchLessonById({ id, includeExercise: true }));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentLesson) {
    return <div>Lesson not found</div>;
  }

  return (
    <div className="w-full mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/courses/${currentLesson.courseId}/lessons`}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Lessons
        </Link>
        <Link
          href={`/courses/${currentLesson.courseId}/lessons/${id}/edit`}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Edit2 className="h-5 w-5 mr-2" />
          Edit Lesson
        </Link>
      </div>
      <div></div>

      {/* Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {currentLesson.title}
            </h1>
            <p className="text-muted-foreground mt-2">
              {currentLesson.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-5 w-5 mr-2" />
              <span>{currentLesson.duration} minutes</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <BookOpen className="h-5 w-5 mr-2" />
              <span>Order: {currentLesson.order}</span>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">Lesson Content</h2>
            <div data-color-mode="light">
              <Markdown source={currentLesson.content} />
            </div>
          </div>

          {/* Video Section */}
          {currentLesson.videoUrl && (
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Video</h2>
              <div className="aspect-video">
                <iframe
                  src={currentLesson.videoUrl}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Resources Section */}
          {currentLesson.resources && currentLesson.resources.length > 0 && (
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Resources</h2>
              <div className="space-y-2">
                {currentLesson.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Resource {index + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Exercises Section */}
          {currentLesson.exercises && currentLesson.exercises.length > 0 && (
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Exercises</h2>
                <Link
                  href={`/lesson/${currentLesson.id}/exercise/create`}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Create Exercise
                </Link>
              </div>
              <div className="space-y-4">
                {currentLesson.exercises.map((exercise) => (
                  <div key={exercise.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium">{exercise.title}</h3>
                      <span className="text-sm text-muted-foreground">
                        {exercise.type}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">{exercise.content}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      {exercise.timeLimit && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{exercise.timeLimit} minutes</span>
                        </div>
                      )}
                      {exercise.passingScore && (
                        <div>
                          <span>Passing Score: {exercise.passingScore}%</span>
                        </div>
                      )}
                      {exercise.retryLimit !== null && (
                        <div>
                          <span>Retry Limit: {exercise.retryLimit}</span>
                        </div>
                      )}
                      {exercise.attemptCount !== undefined && (
                        <div>
                          <span>Attempts: {exercise.attemptCount}</span>
                        </div>
                      )}
                      {exercise.averageScore !== undefined && (
                        <div>
                          <span>Average Score: {exercise.averageScore}%</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {exercise.instructions && (
                          <button
                            className="text-sm text-primary hover:underline flex items-center"
                            onClick={() => alert(exercise.instructions)}
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            View Instructions
                          </button>
                        )}
                        {exercise.hints && exercise.hints.length > 0 && (
                          <button
                            className="text-sm text-primary hover:underline flex items-center"
                            onClick={() => alert(exercise.hints?.join('\n'))}
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            View Hints
                          </button>
                        )}
                      </div>
                      <Link
                        href={`/exercise/${exercise.id}/practice`}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Take Practice
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Lesson Status */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">Lesson Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Published</span>
                <span
                  className={
                    currentLesson.isPublished
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {currentLesson.isPublished ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Completion Rate</span>
                <span>{currentLesson.completionRate || 0}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">View Count</span>
                <span>{currentLesson.viewCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {currentLesson.notes && (
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Notes</h2>
              <p className="text-muted-foreground">{currentLesson.notes}</p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
