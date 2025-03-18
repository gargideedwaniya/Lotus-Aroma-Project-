import React from 'react';
import { Link } from 'wouter';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  textColor?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  showText = true,
  textColor = 'text-primary',
  className = ''
}) => {
  // Size mapping
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-10 w-10',
    large: 'h-12 w-12'
  };

  // Text size mapping
  const textSizes = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  };

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <svg 
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg"
          className="fill-current text-primary"
        >
          {/* Stylized lotus flower */}
          <path d="M50,10 C45,25 30,35 15,35 C30,45 35,65 50,90 C65,65 70,45 85,35 C70,35 55,25 50,10 Z" />
          <circle cx="50" cy="40" r="8" className="fill-white" />
          <path d="M42,35 C46,39 54,39 58,35 C54,45 46,45 42,35 Z" className="fill-white" />
        </svg>
      </div>
      
      {showText && (
        <span className={`font-serif font-bold ${textSizes[size]} ${textColor}`}>
          Lotus Aroma
        </span>
      )}
    </Link>
  );
};

export default Logo;