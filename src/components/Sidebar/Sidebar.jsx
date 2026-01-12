import { useRouter } from 'next/router';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTachometerAlt, faUserPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const router = useRouter();

  const navigation = [
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
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:z-30
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header */}
        <div className="h-16 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between px-4">
          <div className="flex items-center">
            <FontAwesomeIcon 
              icon={faUsers} 
              className="text-white mr-3" 
              style={{ width: '24px', height: '24px' }}
            />
            <h1 className="text-white font-bold text-lg">EMS Dashboard</h1>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-white hover:bg-opacity-20 p-2 rounded"
          >
            <FontAwesomeIcon 
              icon={faTimes} 
              style={{ width: '20px', height: '20px' }}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-4 py-3 rounded-lg text-sm font-medium
                    transition-colors duration-200
                    ${item.current 
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <FontAwesomeIcon 
                    icon={item.icon} 
                    className={`mr-3 ${item.current ? 'text-indigo-600' : 'text-gray-400'}`}
                    style={{ width: '18px', height: '18px' }}
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