import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const router = useRouter();

  // Memoize navigation to prevent re-renders
  const navigation = useMemo(() => [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'fas fa-tachometer-alt',
      current: router.pathname === '/dashboard'
    },
    {
      name: 'Add Employee',
      href: '/dashboard/add',
      icon: 'fas fa-user-plus',
      current: router.pathname === '/dashboard/add' || router.pathname.startsWith('/dashboard/edit')
    }
  ], [router.pathname]);

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col lg:w-64`}>
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 flex-shrink-0">
          <div className="flex items-center">
            <i className="fas fa-users text-white text-2xl mr-3"></i>
            <h1 className="text-white text-lg font-bold">EMS Dashboard</h1>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    item.current
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <i className={`${item.icon} mr-3 text-lg ${item.current ? 'text-indigo-600' : 'text-gray-400'}`}></i>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}