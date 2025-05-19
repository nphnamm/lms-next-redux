import { apiClient } from "@/lib/utils/api";

const questionService = {
  async createQuestions(questionsData: any) {
    const response = await apiClient.post("/questions/multiple", questionsData);
    return response;
  },
};

export default questionService;
