
import React from 'react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  showReason?: boolean;
  reason?: string;
  className?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  showReason = false,
  reason,
  className = ''
}) => {
  // Handle both string and array formats for genres
  const genreArray = Array.isArray(movie.genre) 
    ? movie.genre 
    : (movie.genre ? movie.genre.split(', ') : []);

  return (
    <div className={`bg-moovio-gray rounded-xl overflow-hidden shadow-lg animate-fade-in ${className}`}>
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={movie.poster || movie.imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-yellow-400 text-sm font-medium">★ {movie.rating}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{movie.title}</h3>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {genreArray.slice(0, 2).map((g, index) => (
            <span
              key={index}
              className="bg-moovio-red/20 text-moovio-red text-xs px-2 py-1 rounded-full"
            >
              {g}
            </span>
          ))}
        </div>
        
        <p className="text-gray-300 text-sm mb-3 line-clamp-3">{movie.synopsis || movie.overview}</p>
        
        <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
          <span>{movie.duration}</span>
          <span>{movie.releaseYear}</span>
        </div>
        
        <div className="text-xs text-gray-400 mb-3">
          <span>Directed by {movie.director}</span>
        </div>
        
        {showReason && reason && (
          <div className="border-t border-gray-600 pt-3 mt-3">
            <p className="text-sm text-gray-300">
              <span className="text-moovio-red font-medium">Why this movie: </span>
              {reason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
