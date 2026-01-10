import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth } from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import Sidebar from './Sidebar';
import Header from './Header';

const BaseLayout = ({ children }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const auth = getAuth();
      if (!auth && router.pathname !== ROUTES.LOGIN) {
        router.push(ROUTES.LOGIN);
      } else {
        setIsAuthenticated(auth);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Pages where sidebar and header should not be rendered
  const noLayoutPages = ['/login', '/'];

  const shouldShowLayout = isAuthenticated && !noLayoutPages.includes(router.pathname);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-indigo-600 mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no layout needed (login page, etc.)
  if (!shouldShowLayout) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  // Dashboard layout with sidebar and header
  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <Header setSidebarOpen={setSidebarOpen} />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
          <div className="p-6 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;