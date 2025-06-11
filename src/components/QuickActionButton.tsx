
import React from 'react';

interface QuickActionButtonProps {
  icon: string;
  text: string;
  onClick: () => void;
  className?: string;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  text,
  onClick,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        bg-moovio-gray/80
        backdrop-blur-sm
        border border-gray-600/50
        rounded-xl 
        p-4 
        flex 
        flex-col 
        items-center 
        justify-center 
        gap-2 
        hover:bg-moovio-gray-light/80 
        hover:border-moovio-red/50
        transition-all 
        duration-200 
        transform 
        hover:scale-105 
        active:scale-95
        animate-fade-in
        ${className}
      `}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-medium text-center leading-tight text-white">{text}</span>
    </button>
  );
};
