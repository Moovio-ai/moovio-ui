
import React, { useRef } from 'react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MovieCarouselProps {
  movies: Movie[];
  title?: string;
  className?: string;
}

export const MovieCarousel: React.FC<MovieCarouselProps> = ({
  movies,
  title,
  className = ''
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 300;
    const newScrollLeft = scrollRef.current.scrollLeft + 
      (direction === 'left' ? -scrollAmount : scrollAmount);
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  if (!movies.length) return null;

  return (
    <div className={`animate-fade-in ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      )}
      
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/80 backdrop-blur-sm text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/90"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/80 backdrop-blur-sm text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/90"
        >
          <ChevronRight size={20} />
        </button>
        
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none w-48">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
