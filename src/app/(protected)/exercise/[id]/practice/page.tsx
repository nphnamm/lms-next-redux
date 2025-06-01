"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, Clock } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import toast from "react-hot-toast";
import {
  getQuestionsByExerciseId,
  Question,
  Option,
} from "@/store/features/questionSlice";
import { submitExercise } from "@/store/features/exerciseSlice";
import { RootState } from "@/store/store";

interface QuestionSubmission {
  questionId: string;
  isCorrect: boolean;
}

interface ExerciseSubmission {
  exerciseId: string;
  userId: string;
  QuestionSubmissions: QuestionSubmission[];
}

export default function TakeExercisePage() {
  const router = useRouter();
  const params = useParams();
  const exerciseId = params.id as string;
  const dispatch = useAppDispatch();
  const {
    questions,
    loading: questionsLoading,
    error: questionsError,
    success: questionsSuccess,
  } = useAppSelector((state) => state.questions);
  const {
    submission,
    loading: submissionLoading,
    error: submissionError,
    success: submissionSuccess,
  } = useAppSelector((state) => state.exercises);
  const user = useAppSelector((state: RootState) => state.auth.user);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);

  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState<
    boolean | null
  >(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnsweredCurrent = answers[currentQuestion?.id] !== undefined;

  console.log("answers", answers);
  console.log("currentQuestionIndex", currentQuestionIndex);
  console.log("currentQuestion", currentQuestion);
  // console.log("isLastQuestion", isLastQuestion);
  // console.log("hasAnsweredCurrent", hasAnsweredCurrent);
  // console.log("showFeedback", showFeedback);
  // console.log("isCurrentAnswerCorrect", isCurrentAnswerCorrect);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
      setIsCurrentAnswerCorrect(null);
    }
  }, [currentQuestionIndex, questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowFeedback(false);
      setIsCurrentAnswerCorrect(null);
    }
  }, [currentQuestionIndex]);

  const submit = useCallback(async () => {
    try {
      const questionSubmissions: QuestionSubmission[] = questions.map(
        (question) => {
          const selectedOption = question.options.find(
            (opt: Option) => opt.id === answers[question.id]
          );
          return {
            questionId: question.id,
            isCorrect: selectedOption?.isCorrect || false,
          };
        }
      );

      const submissionData: ExerciseSubmission = {
        exerciseId: exerciseId,
        userId: user?.id || "",
        QuestionSubmissions: questionSubmissions,
      };

      const response = await dispatch(submitExercise(submissionData));

      if (!response.payload) {
        throw new Error("Failed to submit exercise");
      }

      const finalScore = calculateScore();
      setScore(finalScore);
      setShowResults(true);
      toast.success(`Your score: ${finalScore.toFixed(1)}%`);
    } catch (error) {
      console.error("Error submitting exercise:", error);
      toast.error("Failed to submit exercise");
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, questions, exerciseId, user?.id, dispatch]);

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
    submit();
  }, [submit]);

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await dispatch(getQuestionsByExerciseId({ exerciseId }));
      if (!response.payload) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.payload;
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions");
    } finally {
      setIsLoading(false);
    }
  }, [exerciseId, dispatch]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        if (
          isLastQuestion &&
          hasAnsweredCurrent &&
          !showResults &&
          !isSubmitting
        ) {
          handleSubmit();
        } else if (hasAnsweredCurrent && !isLastQuestion && !showResults) {
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    currentQuestionIndex,
    hasAnsweredCurrent,
    isLastQuestion,
    showResults,
    isSubmitting,
    handleNext,
    handleSubmit,
  ]);

  const handleAnswer = useCallback(() => {
    setShowFeedback(true);
    setIsAnswering(true);
    if (hasAnsweredCurrent) {
      setTimeout(() => {
        setShowFeedback(false);
        setIsAnswering(false);
        handleNext();
      }, 2000);
    }
    // setShowFeedback(false);
  }, [hasAnsweredCurrent, handleNext]);

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    const selectedOption = currentQuestion.options.find(
      (opt) => opt.id === optionId
    );
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
    setIsCurrentAnswerCorrect(selectedOption?.isCorrect || false);
    // setShowFeedback(true);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question) => {
      const selectedOption = question.options.find(
        (opt: Option) => opt.id === answers[question.id]
      );
      if (selectedOption?.isCorrect) {
        correctAnswers++;
      }
    });
    return (correctAnswers / questions.length) * 100;
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/exercise/${exerciseId}`}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Exercise
        </Link>
        {timeLeft !== null && (
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-5 w-5 mr-2" />
            Time Left: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Practice Exercise
        </h1>
        <p className="text-muted-foreground mt-1">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-medium">
              Question {currentQuestionIndex + 1}
            </h3>
          </div>

          <div className="space-y-4">
            <p className="text-foreground text-lg font-bold">
              {currentQuestion.text}
            </p>

            <div className="space-y-3">
              {currentQuestion.options.map((option: Option) => (
                <div
                  key={option.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    answers[currentQuestion.id] === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  } ${isAnswering ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => {
                    if (!isAnswering) {
                      handleAnswerSelect(currentQuestion.id, option.id);
                    }
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    checked={answers[currentQuestion.id] === option.id}
                    disabled={isAnswering}
                    onChange={() =>
                      handleAnswerSelect(currentQuestion.id, option.id)
                    }
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <span className="ml-3">{option.text}</span>
                  {answers[currentQuestion.id] === option.id &&
                    showFeedback && (
                      <span className="ml-auto">
                        {option.isCorrect ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <span className="text-red-500">✕</span>
                        )}
                      </span>
                    )}
                </div>
              ))}
            </div>

            {/* Feedback Message */}
            {showFeedback && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  isCurrentAnswerCorrect
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-red-500/10 border border-red-500/20"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    isCurrentAnswerCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCurrentAnswerCorrect
                    ? "Correct! Well done!"
                    : "Incorrect. The correct answer is: " +
                      currentQuestion.options.find((opt) => opt.isCorrect)
                        ?.text}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation and Submit Buttons */}
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex gap-4">
          {!isLastQuestion && (
            <button
              type="button"
              onClick={handleAnswer}
              disabled={!hasAnsweredCurrent}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}
          {isLastQuestion && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                isSubmitting || Object.keys(answers).length !== questions.length
              }
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Answers"}
            </button>
          )}
        </div>
      </div>

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 !mt-0">
          <div className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Exercise Results</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                <p className="text-lg">
                  Your Score:{" "}
                  <span className="font-bold">{score.toFixed(1)}%</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {Math.round((score / 100) * questions.length)} out of{" "}
                  {questions.length} correct
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Question Results:</h4>
                {questions.map((question, index) => {
                  const selectedOption = question.options.find(
                    (opt) => opt.id === answers[question.id]
                  );
                  const isCorrect = selectedOption?.isCorrect;

                  return (
                    <div
                      key={question.id}
                      className={`p-4 rounded-lg border ${
                        isCorrect
                          ? "border-green-500/50 bg-green-500/5"
                          : "border-red-500/50 bg-red-500/5"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <p className="font-medium">Question {index + 1}</p>
                          <p className="text-sm text-muted-foreground">
                            {question.text}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {isCorrect ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <span className="text-red-500">✕</span>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium">Your Answer:</p>
                        <p className="text-sm">
                          {selectedOption?.text || "No answer selected"}
                        </p>
                        {!isCorrect && (
                          <>
                            <p className="text-sm font-medium mt-2">
                              Correct Answer:
                            </p>
                            <p className="text-sm text-green-500">
                              {
                                question.options.find((opt) => opt.isCorrect)
                                  ?.text
                              }
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => router.push(`/exercise/${exerciseId}`)}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Back to Exercise
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
