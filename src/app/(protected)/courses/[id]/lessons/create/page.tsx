'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, GripVertical, Save } from 'lucide-react';
import Link from 'next/link';

type QuestionType = 'multiple-choice' | 'true-false' | 'matching' | 'fill-blank' | 'essay';

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
  description: string;
  duration: string;
  questions: Question[];
}

export default function CreateLessonPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lesson, setLesson] = useState<Lesson>({
    title: '',
    description: '',
    duration: '',
    questions: []
  });

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text: '',
      points: 1,
      options: type === 'multiple-choice' ? [
        { id: '1', text: '', isCorrect: false },
        { id: '2', text: '', isCorrect: false },
        { id: '3', text: '', isCorrect: false },
        { id: '4', text: '', isCorrect: false }
      ] : type === 'true-false' ? [
        { id: '1', text: 'True', isCorrect: false },
        { id: '2', text: 'False', isCorrect: false }
      ] : undefined,
      matchingPairs: type === 'matching' ? [
        { id: '1', left: '', right: '' },
        { id: '2', left: '', right: '' }
      ] : undefined
    };
    setLesson(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setLesson(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  const updateOption = (questionId: string, optionId: string, updates: Partial<Option>) => {
    setLesson(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map(opt =>
                opt.id === optionId ? { ...opt, ...updates } : opt
              )
            }
          : q
      )
    }));
  };

  const updateMatchingPair = (questionId: string, pairId: string, updates: Partial<MatchingPair>) => {
    setLesson(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              matchingPairs: q.matchingPairs?.map(pair =>
                pair.id === pairId ? { ...pair, ...updates } : pair
              )
            }
          : q
      )
    }));
  };

  const addMatchingPair = (questionId: string) => {
    setLesson(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              matchingPairs: [
                ...(q.matchingPairs || []),
                { id: Math.random().toString(36).substr(2, 9), left: '', right: '' }
              ]
            }
          : q
      )
    }));
  };

  const removeQuestion = (questionId: string) => {
    setLesson(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to save lesson
      console.log('Lesson data:', lesson);
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/courses/${params.id}`);
    } catch (error) {
      console.error('Error creating lesson:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/courses/${params.id}`}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Course
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Create New Lesson</h1>
        <p className="text-muted-foreground mt-1">Add questions and content to your lesson</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Lesson Title
            </label>
            <input
              type="text"
              id="title"
              value={lesson.title}
              onChange={(e) => setLesson(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter lesson title"
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id="description"
              value={lesson.description}
              onChange={(e) => setLesson(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter lesson description"
              required
              rows={3}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="duration" className="text-sm font-medium text-foreground">
              Duration
            </label>
            <input
              type="text"
              id="duration"
              value={lesson.duration}
              onChange={(e) => setLesson(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 45 minutes"
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Questions</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => addQuestion('multiple-choice')}
                className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/90 transition-colors"
              >
                Multiple Choice
              </button>
              <button
                type="button"
                onClick={() => addQuestion('true-false')}
                className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/90 transition-colors"
              >
                True/False
              </button>
              <button
                type="button"
                onClick={() => addQuestion('matching')}
                className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/90 transition-colors"
              >
                Matching
              </button>
              <button
                type="button"
                onClick={() => addQuestion('fill-blank')}
                className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/90 transition-colors"
              >
                Fill in Blank
              </button>
              <button
                type="button"
                onClick={() => addQuestion('essay')}
                className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/90 transition-colors"
              >
                Essay
              </button>
            </div>
          </div>

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
                      onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
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
                      onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 0 })}
                      min="1"
                      required
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* Question Type Specific Fields */}
                  {(question.type === 'multiple-choice' || question.type === 'true-false') && (
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-foreground">
                        Options
                      </label>
                      <div className="space-y-3">
                        {question.options?.map((option) => (
                          <div key={option.id} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={option.isCorrect}
                              onChange={() => {
                                const updatedOptions = question.options?.map(opt => ({
                                  ...opt,
                                  isCorrect: opt.id === option.id
                                }));
                                updateQuestion(question.id, { options: updatedOptions });
                              }}
                              className="h-4 w-4 text-primary focus:ring-primary"
                            />
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => updateOption(question.id, option.id, { text: e.target.value })}
                              placeholder="Enter option text"
                              required
                              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {question.type === 'matching' && (
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
                          <div key={pair.id} className="flex items-center gap-3">
                            <input
                              type="text"
                              value={pair.left}
                              onChange={(e) => updateMatchingPair(question.id, pair.id, { left: e.target.value })}
                              placeholder="Left item"
                              required
                              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <span className="text-muted-foreground">matches with</span>
                            <input
                              type="text"
                              value={pair.right}
                              onChange={(e) => updateMatchingPair(question.id, pair.id, { right: e.target.value })}
                              placeholder="Right item"
                              required
                              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {question.type === 'fill-blank' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Correct Answer
                      </label>
                      <input
                        type="text"
                        value={question.correctAnswer}
                        onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                        placeholder="Enter the correct answer"
                        required
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  )}

                  {question.type === 'essay' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Sample Answer
                      </label>
                      <textarea
                        value={question.correctAnswer}
                        onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
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
            href={`/courses/${params.id}`}
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
            {isSubmitting ? 'Creating...' : 'Create Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
} 