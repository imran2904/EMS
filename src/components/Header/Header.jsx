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
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-3"
          >
            <FontAwesomeIcon 
              icon={faBars} 
              style={{ width: '20px', height: '20px' }}
            />
          </button>
          <h2 className="text-sm sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
            Employee Management System
          </h2>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="hidden sm:flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
            <FontAwesomeIcon 
              icon={faUserCircle} 
              className="text-indigo-600 mr-2" 
              style={{ width: '20px', height: '20px' }}
            />
            <span className="font-medium">Admin User</span>
          </div>
     
          
          <button
            onClick={handleLogout}
            className="flex items-center px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg border border-gray-200 transition-colors"
          >
            <FontAwesomeIcon 
              icon={faSignOutAlt} 
              className="sm:mr-2" 
              style={{ width: '16px', height: '16px' }}
            />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}