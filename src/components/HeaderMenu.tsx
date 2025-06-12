
import React, { useState, useRef, useEffect } from 'react';
import { Menu, List, Settings } from 'lucide-react';

interface HeaderMenuProps {
  onAction: (action: string) => void;
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (action: string) => {
    onAction(action);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-moovio-gray rounded-lg transition-colors duration-200"
        aria-label="Menu"
      >
        <Menu size={20} className="text-white" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-moovio-dark border border-gray-600 rounded-lg shadow-lg z-20">
          <div className="py-2">
            <button
              onClick={() => handleMenuClick('lists')}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-moovio-gray transition-colors duration-200 text-left"
            >
              <List size={18} className="text-gray-400" />
              <span className="text-sm">Minhas Listas</span>
            </button>
            
            <button
              onClick={() => handleMenuClick('preferences')}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-moovio-gray transition-colors duration-200 text-left"
            >
              <Settings size={18} className="text-gray-400" />
              <span className="text-sm">Minhas Preferências</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
