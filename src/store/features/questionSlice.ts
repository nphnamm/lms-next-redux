import { createAsyncThunk } from "@reduxjs/toolkit";
import questionService from "@/lib/services/questionService";

export const createQuestions = createAsyncThunk(
  "questions/createQuestions",
  async ({ questionsData }: { questionsData: any }) => {
    const response = await questionService.createQuestions(questionsData);
    return response.data;
  }
);
