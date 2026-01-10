import { clearAuth } from '@/lib/storage';
import { showToast } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { useRouter } from 'next/router';

export default function Header({ setSidebarOpen }) {
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    showToast('Logged out successfully', 'success');
    router.push(ROUTES.LOGIN);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <h2 className="ml-4 text-xl font-semibold text-gray-900 lg:ml-0">
            Employee Management System
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
            <i className="fas fa-user-circle text-xl mr-2 text-indigo-600"></i>
            <span className="font-medium">Admin User</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}