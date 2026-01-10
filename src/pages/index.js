import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth } from '@/lib/storage';
import { ROUTES } from '@/lib/constants';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect based on authentication status
    const isAuthenticated = getAuth();
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    } else {
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-indigo-600 mb-4"></i>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}