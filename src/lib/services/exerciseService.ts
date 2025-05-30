import { apiClient } from "../utils/api";



export interface Exercise {
  id: string;
  title: string;
  content: string;
  order: number;
  type: number;
  status: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  timeLimit?: number;
  passingScore?: number;
  retryLimit?: number;
  allowPartialCredit?: boolean;
  feedback?: string;
  instructions?: string;
  weight?: number;
  isGraded?: boolean;
  showAnswers?: boolean;
  dueDate?: string;
  hints?: string[];
  averageScore?: number;
  attemptCount?: number;
  questions?: any[];
}

export interface GetLessonIdRequest {
  id: string;
  includeExercise?: boolean;
}

export interface CreateLessonData {
  title: string;
  description: string;
  content: string;
  duration: number;
  order: number;
  videoUrl?: string;
  resources?: File[];
}

// Using type instead of interface to fix linter error
export type UpdateLessonData = Partial<CreateLessonData>;

export interface ExerciseResponse {
  succeeded: boolean;
  message: string | null;
  code: string | null;
  data: Exercise;
  errors: any | null;
  request: any | null;
  returnUrl: string | null;
}

const exerciseService = {
  async createExercise(exerciseData: any) {
    const response = await apiClient.post<ExerciseResponse>(
      `/exercises`,
      exerciseData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  },

  async getExercise(exerciseId: string) {
    const response = await apiClient.get<ExerciseResponse>(
      `/exercises/${exerciseId}`
    );
    return response;
  },

  async updateExercise(exerciseId: string, exerciseData: Partial<Exercise>) {
    const response = await apiClient.put<ExerciseResponse>(
      `/exercises/${exerciseId}`,
      exerciseData
    );
    return response;
  },

  async deleteExercise(exerciseId: string) {
    const response = await apiClient.delete<ExerciseResponse>(
      `/exercises/${exerciseId}`
    );
    return response;
  },

  async submitExercise(data: any) {
    const response = await apiClient.post<ExerciseResponse>(
      `/exercises/submit`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  },

  // Additional methods for lesson-specific operations
};

export { exerciseService };
