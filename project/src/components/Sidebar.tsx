import React from 'react';
import { X, LayoutDashboard, Users, ClipboardList, BarChart } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigation = [
    { name: 'Panel Principal', href: '/', icon: LayoutDashboard },
    { name: 'Grupos', href: '/groups', icon: Users },
    { name: 'Tomar Asistencia', href: '/attendance', icon: ClipboardList },
    { name: 'Reportes', href: '/reports', icon: BarChart },
  ];

  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <h2 className="text-xl font-semibold text-blue-700">Menú</h2>
          <button
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="px-2 py-4 h-full">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) => 
                    `flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="hidden md:flex md:flex-shrink-0">
        <div className="w-64 flex flex-col border-r">
          <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
            <ul className="px-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => 
                      `flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};