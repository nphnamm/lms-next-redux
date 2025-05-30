import { apiClient } from "@/lib/utils/api";

const questionService = {
  async createQuestions(questionsData: any) {
    const response = await apiClient.post("/questions", questionsData);
    return response;
  },
  async getQuestionsByExerciseId(exerciseId: string) {
    const response = await apiClient.get(`/questions/exercise/${exerciseId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response;
  },
};

export default questionService;
