import { apiClient } from "../utils/api";

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  duration: number;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  instructor: string;
  price: number;
  duration: number;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  thumbnail: File;
}

// Using type instead of interface to fix linter error
export type UpdateCourseData = Partial<CreateCourseData>;

interface CourseResponse {
  data?: {
    courses?: Course[];
    course?: Course;
    message?: string;
  };
}

const courseService = {
  async getAllCourses() {
    const response = await apiClient.get<CourseResponse>("/courses");
    return response;
  },

  async getCourseById(id: string) {
    const response = await apiClient.get<CourseResponse>(`/courses/${id}`);
    return response;
  },

  async createCourse(courseData: FormData) {
    const response = await apiClient.post<CourseResponse>(
      "/courses",
      courseData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  },

  async updateCourse(id: string, courseData: Partial<Course>) {
    const response = await apiClient.put<CourseResponse>(
      `/courses/${id}`,
      courseData
    );
    return response;
  },

  async deleteCourse(id: string) {
    const response = await apiClient.delete<CourseResponse>(`/courses/${id}`);
    return response;
  },

  // Additional methods for course-specific operations
  async getCoursesByCategory(category: string) {
    const response = await apiClient.get<CourseResponse>(
      `/courses/category/${category}`
    );
    return response;
  },

  async getCoursesByInstructor(instructorId: string) {
    const response = await apiClient.get<CourseResponse>(
      `/courses/instructor/${instructorId}`
    );
    return response;
  },

  async searchCourses(query: string) {
    const response = await apiClient.get<CourseResponse>(
      `/courses/search?q=${encodeURIComponent(query)}`
    );
    return response;
  },
};

export { courseService };
