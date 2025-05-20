import React from 'react';
import { Menu, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white shadow-sm h-16">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <button 
            className="flex items-center space-x-2 text-blue-700 font-bold text-xl"
            onClick={() => navigate('/')}
          >
            <span>Control de Asistencia</span>
          </button>
        </div>
        
        <div className="flex items-center">
          <button className="flex items-center text-gray-600 hover:text-gray-800">
            <UserCircle className="h-8 w-8" />
          </button>
        </div>
      </div>
    </header>
  );
};