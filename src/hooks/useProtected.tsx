"use client";

import userAuth from "@/hooks/userAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = userAuth();
  const router = useRouter();

  return isAuthenticated ? <>{children}</> : null;
}
