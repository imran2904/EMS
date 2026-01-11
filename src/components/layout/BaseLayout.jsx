import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth } from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

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

  const noLayoutPages = ['/login', '/'];
  const shouldShowLayout = isAuthenticated && !noLayoutPages.includes(router.pathname);

  // Add/remove dashboard-layout class to body
  useEffect(() => {
    if (shouldShowLayout) {
      document.body.classList.add('dashboard-layout');
    } else {
      document.body.classList.remove('dashboard-layout');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('dashboard-layout');
    };
  }, [shouldShowLayout]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-indigo-600 mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!shouldShowLayout) {
    return (
      <div className="min-h-screen bg-gray-50" style={{ overflow: 'auto', height: 'auto' }}>
        {children}
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Right side */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* ONLY MAIN will scroll */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );

};

export default BaseLayout;