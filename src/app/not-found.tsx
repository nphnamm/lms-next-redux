'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F8] dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#1A1A1A] dark:text-white">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-block mt-6 px-6 py-3 bg-[#1A1A1A] text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
} 