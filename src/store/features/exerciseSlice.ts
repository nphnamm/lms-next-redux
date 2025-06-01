import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { exerciseService } from '@/lib/services/exerciseService';

export interface Exercise {
  id: string;
  title: string;
  content?: string;
  order: number;
  lessonId: string;
  isPublished: boolean;
  type: number;
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
}

interface QuestionSubmission {
  questionId: string;
  isCorrect: boolean;
}

interface ExerciseSubmission {
  exerciseId: string;
  userId: string;
  QuestionSubmissions: QuestionSubmission[];
}

interface ExerciseState {
  exercises: Exercise[];
  currentExercise: Exercise | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  submission: {
    loading: boolean;
    error: string | null;
    success: boolean;
    data: any | null;
  };
}

const initialState: ExerciseState = {
  exercises: [],
  currentExercise: null,
  loading: false,
  error: null,
  success: false,
  submission: {
    loading: false,
    error: null,
    success: false,
    data: null,
  },
};

export const createExercise = createAsyncThunk(
  'exercises/create',
  async (exerciseData: Omit<Exercise, 'id'>, { rejectWithValue }) => {
    try {
      const response = await exerciseService.createExercise(exerciseData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create exercise');
    }
  }
);

export const updateExercise = createAsyncThunk(
  'exercises/update',
  async ({ id, exerciseData }: { id: string; exerciseData: Partial<Exercise> }, { rejectWithValue }) => {
    try {
      const response = await exerciseService.updateExercise(id, exerciseData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update exercise');
    }
  }
);

export const getExercise = createAsyncThunk(
  'exercises/get',
  async (exerciseId: string, { rejectWithValue }) => {
    try {
      const response = await exerciseService.getExercise(exerciseId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch exercise');
    }
  }
);

export const submitExercise = createAsyncThunk(
  'exercises/submit',
  async (submissionData: ExerciseSubmission, { rejectWithValue }) => {
    try {
      const response = await exerciseService.submitExercise(submissionData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit exercise');
    }
  }
);

export const deleteExercise = createAsyncThunk(
  'exercises/delete',
  async (exerciseId: string, { rejectWithValue }) => {
    try {
      const response = await exerciseService.deleteExercise(exerciseId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete exercise');
    }
  }
);

const exerciseSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    setCurrentExercise: (state, action: PayloadAction<Exercise | null>) => {
      state.currentExercise = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    resetSubmission: (state) => {
      state.submission = {
        loading: false,
        error: null,
        success: false,
        data: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Exercise
      .addCase(createExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExercise.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.currentExercise = action.payload.data as unknown as Exercise;
          state.success = true;
        }
      })
      .addCase(createExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Exercise
      .addCase(getExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExercise.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.currentExercise = action.payload.data as unknown as Exercise;
        }
      })
      .addCase(getExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Exercise
      .addCase(updateExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExercise.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.currentExercise = action.payload.data as unknown as Exercise;
          state.success = true;
        }
      })
      .addCase(updateExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Submit Exercise
      .addCase(submitExercise.pending, (state) => {
        state.submission.loading = true;
        state.submission.error = null;
        state.submission.success = false;
      })
      .addCase(submitExercise.fulfilled, (state, action) => {
        state.submission.loading = false;
        state.submission.success = true;
        state.submission.data = action.payload;
      })
      .addCase(submitExercise.rejected, (state, action) => {
        state.submission.loading = false;
        state.submission.error = action.payload as string;
        state.submission.success = false;
      })
      // Delete Exercise
      .addCase(deleteExercise.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteExercise.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentExercise, clearError, resetSuccess, resetSubmission } = exerciseSlice.actions;
export default exerciseSlice.reducer; 