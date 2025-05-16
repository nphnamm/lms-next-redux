import { apiClient } from "../utils/api";

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  duration: number;
  order: number;
  videoUrl?: string;
  resources?: string[];
  createdAt: string;
  updatedAt: string;
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

export interface LessonResponse {
  data: {
    lessons?: Lesson[];
    lesson?: Lesson;
    message?: string;
  };
}

const lessonService = {
  async getLessonsByCourse(courseId: string) {
    const response = await apiClient.get<LessonResponse>(
      `/courses/${courseId}/lessons`
    );
    return response;
  },

  async getLessonById(courseId: string, lessonId: string) {
    const response = await apiClient.get<LessonResponse>(
      `/courses/${courseId}/lessons/${lessonId}`
    );
    return response;
  },

  async createLesson(lessonData: FormData) {
    const response = await apiClient.post<LessonResponse>(
      `/lessons`,
      lessonData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  },

  async updateLesson(
    courseId: string,
    lessonId: string,
    lessonData: Partial<Lesson>
  ) {
    const response = await apiClient.put<LessonResponse>(
      `/lessons/${lessonId}`,
      lessonData
    );
    return response;
  },

  async deleteLesson(courseId: string, lessonId: string) {
    const response = await apiClient.delete<LessonResponse>(
      `/courses/${courseId}/lessons/${lessonId}`
    );
    return response;
  },

  // Additional methods for lesson-specific operations
  async reorderLessons(courseId: string, lessonIds: string[]) {
    const response = await apiClient.put<LessonResponse>(
      `/courses/${courseId}/lessons/reorder`,
      {
        lessonIds,
      }
    );
    return response;
  },

  async uploadLessonResource(courseId: string, lessonId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<LessonResponse>(
      `/courses/${courseId}/lessons/${lessonId}/resources`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  },

  async deleteLessonResource(
    courseId: string,
    lessonId: string,
    resourceUrl: string
  ) {
    const response = await apiClient.delete<LessonResponse>(
      `/courses/${courseId}/lessons/${lessonId}/resources`,
      {
        data: { resourceUrl },
      }
    );
    return response;
  },
};

export { lessonService };
