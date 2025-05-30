"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Upload, X, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { RootState } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createLesson } from "@/store/features/lessonSlice";
import toast from "react-hot-toast";
import { Disclosure, Input } from "@headlessui/react";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface LessonFormData {
  title: string;
  content: string;
  description: string;
  order: number;
  courseId: string;
  isPublished: boolean;
  type: number;
  duration: number;
  videoUrl: string;
  resources: string;
  keywords: string[];
  completionRate: number | null;
  viewCount: number | null;
  notes: string | null;
  isPreview: boolean;
  autoIncrement: boolean;
}

const lessonTypes = [
  { value: 0, label: "Text" },
  { value: 1, label: "Video" },
  { value: 2, label: "Quiz" },
  { value: 3, label: "Assignment" },
  { value: 4, label: "Discussion" },
];

export default function UpdateLessonPage() {
  

  return (
    <div className="w-full mx-auto space-y-8">


    </div>
  );
}
