import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import courseReducer from "./features/courseSlice";
import lessonReducer from "./features/lessonSlice";
import questionReducer from "./features/questionSlice";
import exerciseReducer from "./features/exerciseSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    lessons: lessonReducer,
    questions: questionReducer,
    exercises: exerciseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
