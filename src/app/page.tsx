'use client';

import { useAppSelector } from '@/store/hooks';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  // Example React Query usage
  const { data, isLoading } = useQuery({
    queryKey: ['example'],
    queryFn: () => fetch('https://jsonplaceholder.typicode.com/todos/1').then(res => res.json()),
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to Next.js with Redux and React Query</h1>
        
        <div className="bg-white/30 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">React Query Example</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </main>
  );
} 