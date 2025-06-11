
import React from 'react';
import { Film, Loader2, Mic } from 'lucide-react';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  state?: 'idle' | 'thinking' | 'listening' | 'writing';
}

export const Avatar: React.FC<AvatarProps> = ({ 
  size = 'md', 
  className = '', 
  state = 'idle' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32
  };

  const getStateAnimation = () => {
    switch (state) {
      case 'thinking':
        return 'animate-pulse';
      case 'listening':
        return 'animate-pulse-recording';
      case 'writing':
        return 'animate-bounce';
      default:
        return '';
    }
  };

  const getStateIcon = () => {
    switch (state) {
      case 'thinking':
        return <Loader2 size={iconSizes[size]} className="animate-spin text-white" />;
      case 'listening':
        return <Mic size={iconSizes[size]} className="text-white" />;
      case 'writing':
        return <Film size={iconSizes[size]} className="text-white animate-pulse" />;
      default:
        return <Film size={iconSizes[size]} className="text-white" />;
    }
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-gradient-to-br from-moovio-red via-red-500 to-purple-600
        flex items-center justify-center 
        shadow-lg 
        ${getStateAnimation()}
        relative
        overflow-hidden
        animate-[breathe_3s_ease-in-out_infinite]
        ${className}
      `}
      style={{
        animation: state === 'idle' 
          ? 'breathe 3s ease-in-out infinite' 
          : `breathe 3s ease-in-out infinite, ${getStateAnimation().replace('animate-', '')} 1s ease-in-out infinite`
      }}
    >
      {/* Background pulse effect for thinking state */}
      {state === 'thinking' && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-30 animate-ping" />
      )}
      
      {/* Subtle floating particles effect */}
      <div className="absolute inset-0 rounded-full">
        <div className="absolute top-2 left-2 w-1 h-1 bg-white/40 rounded-full animate-[float_4s_ease-in-out_infinite]" />
        <div className="absolute bottom-3 right-2 w-0.5 h-0.5 bg-white/30 rounded-full animate-[float_6s_ease-in-out_infinite_reverse]" />
      </div>
      
      {/* Main icon */}
      <div className="relative z-10 animate-[iconFloat_2s_ease-in-out_infinite]">
        {getStateIcon()}
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-50" />
      
      {/* Pulsating ring effect */}
      <div className="absolute inset-0 rounded-full border border-white/20 animate-[ringPulse_4s_ease-in-out_infinite]" />
    </div>
  );
};
