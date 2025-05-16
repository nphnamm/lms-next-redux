"use client";

import userAuth from "@/hooks/userAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface useAuthenticatedProps {
  children: React.ReactNode;
}

export default function UseAuthenticated({ children }: useAuthenticatedProps) {
  const isAuthenticated = userAuth();
  const router = useRouter();
  console.log("isAuthenticated", isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, []);
  return !isAuthenticated ? <>{children}</> : null;
}
