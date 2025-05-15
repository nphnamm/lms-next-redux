'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import userAuth from '@/hooks/userAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getMe } from '@/store/features/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const isAuthenticated = userAuth();
  const dispatch = useAppDispatch();

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
} 