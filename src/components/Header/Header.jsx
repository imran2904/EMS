import { clearAuth } from '@/lib/storage';
import { showToast } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUserCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function Header({ setSidebarOpen }) {
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    showToast('Logged out successfully', 'success');
    router.push(ROUTES.LOGIN);
  };

  return (
    <header className="sticky w-full top-0 bg-white shadow-sm border-b border-gray-200  z-10">
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors mr-2"
          >
            <FontAwesomeIcon icon={faBars} className="text-lg" />
          </button>
          <h2 className="text-sm sm:text-xl font-semibold text-gray-900 truncate">
            Employee Management System
          </h2>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <div className="hidden sm:flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
            <FontAwesomeIcon icon={faUserCircle} className="text-xl mr-2 text-indigo-600" />
            <span className="font-medium">Admin User</span>
          </div>
          <div className="sm:hidden">
            <FontAwesomeIcon icon={faUserCircle} className="text-xl text-indigo-600" />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}