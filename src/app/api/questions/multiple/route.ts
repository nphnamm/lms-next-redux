import { NextResponse } from "next/server";
import { apiClient } from "@/lib/utils/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lessonId, lessonType, questions } = body;

    // Validate required fields
    if (!lessonId || !lessonType || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Format the questions according to the specified structure
    const formattedQuestions = questions.map((question) => ({
      text: question.text,
      options: question.options?.map((option: any) => ({
        text: option.text,
        isCorrect: option.isCorrect,
      })),
    }));

    const response = await apiClient.post("/questions/multiple", {
      lessonId,
      lessonType,
      questions: formattedQuestions,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error creating questions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create questions" },
      { status: 500 }
    );
  }
}
