import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { lessonService, Lesson, GetLessonIdRequest   } from "@/lib/services/lessonService";

interface LessonResponse {
  data: {
    lesson?: Lesson;
    lessons?: Lesson[];
  };
}

interface LessonState {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: LessonState = {
  lessons: [],
  currentLesson: null,
  loading: false,
  success: false,
  error: null,
};

// Async thunks
export const fetchLessonsByCourse = createAsyncThunk(
  "lessons/fetchLessonsByCourse",
  async (courseId: string) => {
    const response = await lessonService.getLessonsByCourse(courseId);
    return (response as LessonResponse).data?.lessons || [];
  }
);

export const fetchLessonById = createAsyncThunk(
  "lessons/fetchLessonById",
  async (getLessonIdRequest: GetLessonIdRequest) => {
    const response = await lessonService.getLessonById(getLessonIdRequest);
    return response.data;
  }
);

export const createLesson = createAsyncThunk(
  "lessons/createLesson",
  async ({ lessonData }: { lessonData: any }) => {
    const response = await lessonService.createLesson(lessonData);
    return (response as unknown as { data: { data: Lesson } }).data.data;
  }
);

export const updateLesson = createAsyncThunk(
  "lessons/updateLesson",
  async ({
    courseId,
    lessonId,
    lessonData,
  }: {
    courseId: string;
    lessonId: string;
    lessonData: Partial<Lesson>;
  }) => {
    const response = await lessonService.updateLesson(
      courseId,
      lessonId,
      lessonData
    );
    return (response as LessonResponse).data?.lesson;
  }
);

export const deleteLesson = createAsyncThunk(
  "lessons/deleteLesson",
  async ({ lessonId }: { lessonId: string }) => {
    const response = await lessonService.deleteLesson(lessonId);
    return (response as LessonResponse).data?.lesson;
  }
);

export const reorderLessons = createAsyncThunk(
  "lessons/reorderLessons",
  async ({
    courseId,
    lessonIds,
  }: {
    courseId: string;
    lessonIds: string[];
  }) => {
    const response = await lessonService.reorderLessons(courseId, lessonIds);
    return (response as LessonResponse).data?.lessons || [];
  }
);

export const uploadLessonResource = createAsyncThunk(
  "lessons/uploadLessonResource",
  async ({
    courseId,
    lessonId,
    file,
  }: {
    courseId: string;
    lessonId: string;
    file: File;
  }) => {
    const response = await lessonService.uploadLessonResource(
      courseId,
      lessonId,
      file
    );
    return (response as LessonResponse).data?.lesson;
  }
);

export const deleteLessonResource = createAsyncThunk(
  "lessons/deleteLessonResource",
  async ({
    courseId,
    lessonId,
    resourceUrl,
  }: {
    courseId: string;
    lessonId: string;
    resourceUrl: string;
  }) => {
    await lessonService.deleteLessonResource(courseId,lessonId,resourceUrl);
    return { lessonId, resourceUrl };
  }
);

const lessonSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {
    clearCurrentLesson: (state) => {
      state.currentLesson = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch lessons by course
      .addCase(fetchLessonsByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonsByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(fetchLessonsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch lessons";
      })
      // Fetch single lesson
      .addCase(fetchLessonById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLesson = action.payload.data || null;
        console.log("currentLesson", action.payload);
      })
      .addCase(fetchLessonById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch lesson";
      })
      // Create lesson
      .addCase(createLesson.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.lessons.push(action.payload);
          state.success = true;
          state.error = null;
        }
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create lesson";
      })
      // Update lesson
      .addCase(updateLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.lessons.findIndex(
            (lesson) => lesson.id === action.payload?.id
          );
          if (index !== -1) {
            state.lessons[index] = action.payload;
          }
          if (state.currentLesson?.id === action.payload.id) {
            state.currentLesson = action.payload;
          }
        }
      })
      .addCase(updateLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update lesson";
      })
      // Delete lesson
      .addCase(deleteLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.lessons = state.lessons.filter(
          (lesson) => lesson.id !== action.payload?.id
        );
        if (state.currentLesson?.id === action.payload?.id) {
          state.currentLesson = null;
        }
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete lesson";
      })
      // Reorder lessons
      .addCase(reorderLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reorderLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(reorderLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to reorder lessons";
      })
      // Upload lesson resource
      .addCase(uploadLessonResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadLessonResource.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.lessons.findIndex(
            (lesson) => lesson.id === action.payload?.id
          );
          if (index !== -1) {
            state.lessons[index] = action.payload;
          }
          if (state.currentLesson?.id === action.payload.id) {
            state.currentLesson = action.payload;
          }
        }
      })
      .addCase(uploadLessonResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to upload resource";
      })
      // Delete lesson resource
      .addCase(deleteLessonResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLessonResource.fulfilled, (state, action) => {
        state.loading = false;
        const lesson = state.lessons.find(
          (l) => l.id === action.payload.lessonId
        );
        if (lesson) {
          lesson.resources = lesson.resources?.filter(
            (r) => r !== action.payload.resourceUrl
          );
        }
        if (state.currentLesson?.id === action.payload.lessonId) {
          state.currentLesson.resources = state.currentLesson.resources?.filter(
            (r) => r !== action.payload.resourceUrl
          );
        }
      })
      .addCase(deleteLessonResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete resource";
      });
  },
});

export const { clearCurrentLesson, clearError } = lessonSlice.actions;
export default lessonSlice.reducer;
