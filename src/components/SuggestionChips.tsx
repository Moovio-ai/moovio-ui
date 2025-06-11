
import React from 'react';
import { icons } from 'lucide-react';
import { Suggestion } from '../types';

interface SuggestionChipsProps {
  suggestions: Suggestion[];
  onSuggestionClick: (query: string) => void;
  className?: string;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  suggestions,
  onSuggestionClick,
  className = ''
}) => {
  if (!suggestions.length) return null;

  return (
    <div className={`flex flex-wrap gap-2 animate-fade-in ${className}`}>
      {suggestions.map((suggestion, index) => {
        // Converter para PascalCase se necessário (ex: "star" -> "Star")
        const iconName = suggestion.icon.charAt(0).toUpperCase() + suggestion.icon.slice(1);
        const IconComponent = icons[iconName as keyof typeof icons];
        
        return (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.query)}
            className="flex items-center gap-2 bg-moovio-gray hover:bg-moovio-gray-light text-white text-sm px-3 py-2 rounded-full transition-colors duration-200 transform hover:scale-105"
          >
            {IconComponent ? (
              <IconComponent size={16} />
            ) : (
              <span>{suggestion.icon}</span>
            )}
            <span>{suggestion.text}</span>
          </button>
        );
      })}
    </div>
  );
};
