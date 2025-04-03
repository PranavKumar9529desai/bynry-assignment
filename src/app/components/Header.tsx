import React, { useState } from 'react';

interface HeaderProps {
  title: string;
  showNavigation?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showNavigation = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">{title}</h1>
        
        {showNavigation && (
          <div className="relative">
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <nav className={`md:flex ${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:relative right-0 top-10 md:top-0 bg-gray-800 md:bg-transparent shadow-md md:shadow-none rounded-md md:rounded-none z-10`}>
              <ul className="flex flex-col md:flex-row">
                <li className="px-4 py-2 hover:bg-gray-700 md:hover:bg-transparent md:hover:text-gray-300">Home</li>
                <li className="px-4 py-2 hover:bg-gray-700 md:hover:bg-transparent md:hover:text-gray-300">About</li>
                <li className="px-4 py-2 hover:bg-gray-700 md:hover:bg-transparent md:hover:text-gray-300">Contact</li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
