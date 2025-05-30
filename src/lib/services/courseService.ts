import { apiClient } from "../utils/api";

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  isPublished: boolean;
  imageUrl: string;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  price: number;
  instructorId: string;
  image?: File;
  level: number;
  category: string;
  tags?: string[];
  prerequisites?: string[];
  rating: number;
  totalEnrollments: number;
  syllabus?: string;
  learningObjectives?: string;
  requirements?: string;
  targetAudience?: string;
}

// Using type instead of interface to fix linter error
export type UpdateCourseData = Partial<CreateCourseData>;

export interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
  type: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetCourseRequest {
  includeLessons: boolean;
  id: string;
}

interface CourseDetails {
  succeeded: boolean;
  message: string | null;
  code: string | null;
  data: Course;
  errors: null;
  request: null;
  returnUrl: null;
}

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

  async getCourseById(getCourseRequest: GetCourseRequest) {
    const response = await apiClient.patch<CourseDetails>(
      `/courses`,
      getCourseRequest
    );
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
