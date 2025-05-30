import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import questionService from "@/lib/services/questionService";

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: string;
  options: Option[];
  order: number;
}

interface QuestionResponse {
  data: Question[];
}

interface ApiResponse<T> {
  data: T;
}

interface QuestionState {
  questions: Question[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: QuestionState = {
  questions: [],
  loading: false,
  error: null,
  success: false,
};

export const createQuestions = createAsyncThunk<
  QuestionResponse,
  { questionsData: any }
>(
  "questions/createQuestions",
  async ({ questionsData }, { rejectWithValue }) => {
    try {
      const response = await questionService.createQuestions(questionsData);
      return response.data as QuestionResponse;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create questions"
      );
    }
  }
);

export const getQuestionsByExerciseId = createAsyncThunk<
  QuestionResponse,
  { exerciseId: string }
>(
  "questions/getQuestionsByExerciseId",
  async ({ exerciseId }, { rejectWithValue }) => {
    try {
      const response = await questionService.getQuestionsByExerciseId(
        exerciseId
      );
      return response.data as QuestionResponse;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch questions"
      );
    }
  }
);

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        createQuestions.fulfilled,
        (state, action: PayloadAction<QuestionResponse>) => {
          state.loading = false;
          state.success = true;
          if (action.payload?.data) {
            state.questions = action.payload.data;
          }
        }
      )
      .addCase(createQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create questions";
        state.success = false;
      })
      .addCase(getQuestionsByExerciseId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        getQuestionsByExerciseId.fulfilled,
        (state, action: PayloadAction<QuestionResponse>) => {
          state.loading = false;
          state.success = true;
          if (action.payload?.data) {
            state.questions = action.payload.data;
          }
        }
      )
      .addCase(getQuestionsByExerciseId.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to get questions";
        state.success = false;
      });
  },
});

export const { clearError, resetSuccess } = questionSlice.actions;
export default questionSlice.reducer;
