"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Exercise } from "@/lib/services/exerciseService";
import { exerciseService } from "@/lib/services/exerciseService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  InfoIcon,
  ClockIcon,
  AwardIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  BrainIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  LightbulbIcon,
  Target
} from "lucide-react";
import { motion } from "framer-motion";

export default function ExerciseDetailsPage() {
  const { id } = useParams();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setLoading(true);
        const response = await exerciseService.getExercise(id as string);
        setExercise(response.data.data);
      } catch (err) {
        setError("Failed to load exercise details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExercise();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Card className="border-none shadow-lg bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
          <CardHeader>
            <Skeleton className="h-12 w-[300px]" />
            <div className="flex gap-4 mt-4">
              <Skeleton className="h-8 w-[150px]" />
              <Skeleton className="h-8 w-[150px]" />
              <Skeleton className="h-8 w-[150px]" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="animate-in slide-in-from-top-2">
          <AlertTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Error
          </AlertTitle>
          <AlertDescription>
            {error || "Exercise not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalQuestions = exercise.questions?.length || 0;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedOptions(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  return (
    <div className="container mx-auto py-8 space-y-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-none shadow-xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
          <CardHeader className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  {exercise.title}
                </CardTitle>
                <CardDescription className="text-xl text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                    Master the concepts through practice
                  </span>
                </CardDescription>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <BrainIcon className="h-12 w-12 text-primary opacity-80" />
              </motion.div>
            </div>
            
            <div className="flex gap-4 flex-wrap">
              {exercise.timeLimit && (
                <Badge variant="secondary" className="px-6 py-3 text-base rounded-xl hover:bg-primary/20 transition-colors duration-300">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  {exercise.timeLimit} minutes
                </Badge>
              )}
              {exercise.passingScore && (
                <Badge variant="secondary" className="px-6 py-3 text-base rounded-xl hover:bg-primary/20 transition-colors duration-300">
                  <AwardIcon className="w-5 h-5 mr-2" />
                  Pass: {exercise.passingScore}%
                </Badge>
              )}
              <Badge variant="secondary" className="px-6 py-3 text-base rounded-xl hover:bg-primary/20 transition-colors duration-300">
                <BookOpenIcon className="w-5 h-5 mr-2" />
                {totalQuestions} Questions
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {exercise.instructions && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Alert className="bg-primary/5 border-primary/20 backdrop-blur-sm">
                  <InfoIcon className="h-6 w-6 text-primary" />
                  <AlertTitle className="text-xl font-semibold mb-2">Instructions</AlertTitle>
                  <AlertDescription className="text-muted-foreground text-lg">
                    {exercise.instructions}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="text-base font-medium">Progress</span>
                <span className="text-base font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground leading-relaxed text-lg">{exercise.content}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <ScrollArea className="space-y-6">
        {exercise.questions?.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`mb-6 border-none shadow-lg transition-all duration-300 ${
                index === currentQuestionIndex 
                  ? 'ring-2 ring-primary/20 shadow-primary/10' 
                  : 'opacity-70 hover:opacity-100'
              } bg-gradient-to-br from-background to-background/80 backdrop-blur-sm`}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-semibold flex items-center gap-3">
                    <span className="bg-primary/10 text-primary rounded-lg px-3 py-1">
                      {index + 1}/{totalQuestions}
                    </span>
                    Question {index + 1}
                  </CardTitle>
                  {question.points && (
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      {question.points} points
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-xl font-medium text-foreground/90">{question.text}</p>
                
                {question.options && (
                  <div className="space-y-4">
                    {question.options.map((option: any, optionIndex: number) => (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleOptionSelect(index, optionIndex)}
                        className={`w-full text-left p-6 rounded-xl border-2 
                          ${selectedOptions[index] === optionIndex 
                            ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
                            : 'border-muted hover:border-primary/50 hover:bg-primary/5'
                          } 
                          transition-all duration-200 flex items-center justify-between group`}
                      >
                        <span className="text-lg">{option.text}</span>
                        <ChevronRightIcon 
                          className={`w-5 h-5 transition-all duration-200 
                            ${selectedOptions[index] === optionIndex 
                              ? 'opacity-100 text-primary' 
                              : 'opacity-0 group-hover:opacity-100'
                            }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                )}

                {question.matchingPairs && (
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      {question.matchingPairs.map((pair: any, idx: any) => (
                        <motion.div
                          key={`left-${idx}`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="p-6 rounded-xl border-2 border-muted hover:border-primary/50 hover:bg-primary/5 
                            transition-all duration-200 text-lg shadow-sm hover:shadow-md"
                        >
                          {pair.left}
                        </motion.div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {question.matchingPairs.map((pair: any, idx: any) => (
                        <motion.div
                          key={`right-${idx}`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="p-6 rounded-xl border-2 border-muted hover:border-primary/50 hover:bg-primary/5 
                            transition-all duration-200 text-lg shadow-sm hover:shadow-md"
                        >
                          {pair.right}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </ScrollArea>

      <motion.div 
        className="flex justify-between items-center pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 text-base px-6 py-6 rounded-xl hover:bg-primary/5"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Previous
        </Button>
        <Button
          onClick={() => setCurrentQuestionIndex(Math.min(totalQuestions - 1, currentQuestionIndex + 1))}
          disabled={currentQuestionIndex === totalQuestions - 1}
          className="flex items-center gap-2 text-base px-6 py-6 rounded-xl bg-primary/90 hover:bg-primary"
        >
          Next
          <ArrowRightIcon className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
} 