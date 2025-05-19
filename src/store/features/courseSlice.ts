import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { courseService, Course } from "@/lib/services/courseService";

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async () => {
    const response = await courseService.getAllCourses();
    return response.data?.data || [];
  }
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async (id: string) => {
    const response = await courseService.getCourseById(id);
    return response.data?.data;
  }
);

export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (courseData: FormData) => {
    const response = await courseService.createCourse(courseData);
    return response.data?.data;
  }
);

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ id, courseData }: { id: string; courseData: Partial<Course> }) => {
    const response = await courseService.updateCourse(id, courseData);
    return response.data?.data;
  }
);

export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (id: string) => {
    await courseService.deleteCourse(id);
    return id;
  }
);

export const fetchCoursesByCategory = createAsyncThunk(
  "courses/fetchCoursesByCategory",
  async (category: string) => {
    const response = await courseService.getCoursesByCategory(category);
    return response.data?.data || [];
  }
);

export const fetchCoursesByInstructor = createAsyncThunk(
  "courses/fetchCoursesByInstructor",
  async (instructorId: string) => {
    const response = await courseService.getCoursesByInstructor(instructorId);
    return response.data?.data || [];
  }
);

export const searchCourses = createAsyncThunk(
  "courses/searchCourses",
  async (query: string) => {
    const response = await courseService.searchCourses(query);
    return response.data?.data || [];
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload as Course[];
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch courses";
      })
      // Fetch single course
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload || null;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch course";
      })
      // Create course
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.courses.push(action.payload as Course);
        }
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create course";
      })
      // Update course
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.courses.findIndex(
            (course) => course.id === (action.payload as Course).id
          );
          if (index !== -1) {
            state.courses[index] = action.payload as Course;
          }
          if (state.currentCourse?.id === (action.payload as Course).id) {
            state.currentCourse = action.payload as Course;
          }
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update course";
      })
      // Delete course
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter(
          (course) => course.id !== action.payload
        );
        if (state.currentCourse?.id === action.payload) {
          state.currentCourse = null;
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete course";
      })
      // Fetch courses by category
      .addCase(fetchCoursesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload as Course[];
      })
      .addCase(fetchCoursesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch courses by category";
      })
      // Fetch courses by instructor
      .addCase(fetchCoursesByInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursesByInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload as Course[];
      })
      .addCase(fetchCoursesByInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch courses by instructor";
      })
      // Search courses
      .addCase(searchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload as Course[];
      })
      .addCase(searchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to search courses";
      });
  },
});

export const { clearCurrentCourse, clearError } = courseSlice.actions;
export default courseSlice.reducer;
