import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

const Button: React.FC<ButtonProps> = ({ 
  text, 
  onClick, 
  variant = 'primary' 
}) => {
  const getButtonStyles = (): string => {
    const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500`;
      case 'secondary':
        return `${baseStyles} bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500`;
      case 'outline':
        return `${baseStyles} border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500`;
      default:
        return `${baseStyles} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500`;
    }
  };

  return (
    <button 
      className={getButtonStyles()}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
