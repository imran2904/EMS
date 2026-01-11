import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTachometerAlt, faUserPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const router = useRouter();

  // Memoize navigation to prevent re-renders
  const navigation = useMemo(() => [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: faTachometerAlt,
      current: router.pathname === '/dashboard'
    },
    {
      name: 'Add Employee',
      href: '/dashboard/add',
      icon: faUserPlus,
      current: router.pathname === '/dashboard/add' || router.pathname.startsWith('/dashboard/edit')
    }
  ], [router.pathname]);

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0  backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg text-black flex flex-col transition-transform duration-300 
  z-50 max-lg:fixed max-lg:inset-y-0 top-0 left-0
  w-[230px] lg:w-[256px]
  h-screen
  flex-shrink-0
  ${sidebarOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"}
  `}
      >

        <div className="flex relative w-full items-center justify-start h-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUsers} className="text-white text-2xl mr-3" />
            <h1 className="text-white text-nowrap text-base lg:text-lg font-bold">EMS Dashboard</h1>
          </div>
          <button
            className="absolute top-2 right-2 lg:hidden text-white focus:outline-none"
            onClick={() => setSidebarOpen(false)}
          >
           <FontAwesomeIcon icon={faTimes} className="text-xl w-5 h-5" />
          </button>
        </div>

        <nav className=" px-3 py-6">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={()=>setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    item.current
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={item.icon} 
                    className={`mr-3 text-lg ${item.current ? 'text-indigo-600' : 'text-gray-400'}`} 
                  />
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