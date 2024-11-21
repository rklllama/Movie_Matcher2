import React from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Clock, Star, Globe, Film } from 'lucide-react';
import type { Movie } from '../types/movie';
import { Button } from './ui/Button';

interface MovieCardProps {
  movie: Movie;
  onVote: (approved: boolean) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onVote }) => {
  const controls = useAnimation();
  const [startX, setStartX] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = (_: any, info: PanInfo) => {
    setStartX(info.point.x);
    setIsDragging(true);
  };

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const deltaX = info.point.x - startX;
    if (Math.abs(deltaX) > 100) {
      await controls.start({ 
        x: deltaX > 0 ? 500 : -500, 
        opacity: 0,
        transition: { duration: 0.2 } 
      });
      onVote(deltaX > 0);
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
    setIsDragging(false);
  };

  // Get US certification
  const certification = movie.release_dates?.results
    ?.find(r => r.iso_3166_1 === 'US')
    ?.release_dates?.[0]?.certification || 'NR';

  return (
    <motion.div
      className="relative w-full max-w-3xl"
      animate={controls}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ touchAction: 'none' }}
    >
      <div className="h-[600px] overflow-hidden rounded-xl bg-gray-900 shadow-xl">
        <div className="flex h-full flex-col md:flex-row">
          <div className="relative h-[300px] w-full md:h-full md:w-[300px]">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="flex flex-1 flex-col justify-between p-6">
            <div>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">{movie.title}</h3>
                  {certification && (
                    <span className="rounded-md bg-gray-800 px-2 py-1 text-sm font-medium text-gray-300">
                      {certification}
                    </span>
                  )}
                </div>
                
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-300">
                  {movie.release_date && (
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  )}
                  {movie.runtime && (
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {movie.runtime}m
                    </span>
                  )}
                  {movie.vote_average && (
                    <span className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500" />
                      {movie.vote_average.toFixed(1)} (TMDB)
                    </span>
                  )}
                  {movie.production_countries?.[0]?.iso_3166_1 && (
                    <span className="flex items-center gap-1">
                      <Globe size={16} />
                      {movie.production_countries[0].iso_3166_1}
                    </span>
                  )}
                </div>
              </div>

              <p className="mb-4 text-sm text-gray-300">{movie.overview}</p>

              {movie.genres && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full bg-red-500/20 px-3 py-1 text-sm text-red-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {movie.production_companies?.[0] && (
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                  <Film size={16} />
                  {movie.production_companies[0].name}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button
                onClick={() => onVote(false)}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <ThumbsDown size={20} /> Nope
              </Button>
              <Button
                onClick={() => onVote(true)}
                variant="primary"
                className="flex items-center gap-2"
              >
                <ThumbsUp size={20} /> Like
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isDragging && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4">
          <div className="rounded-full bg-gray-900/80 p-4">
            <ThumbsDown size={32} className="text-red-500" />
          </div>
          <div className="rounded-full bg-gray-900/80 p-4">
            <ThumbsUp size={32} className="text-green-500" />
          </div>
        </div>
      )}
    </motion.div>
  );
};