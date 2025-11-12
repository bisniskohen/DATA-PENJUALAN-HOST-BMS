
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden ${className}`}>
        {title && (
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
        )}
        <div className="p-4 sm:p-6">
            {children}
        </div>
    </div>
  );
};

export default Card;
