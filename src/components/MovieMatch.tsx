import React from 'react';
import { motion } from 'framer-motion';
import { Popcorn } from 'lucide-react';
import type { Movie } from '../types/movie';
import { Button } from './ui/Button';

interface MovieMatchProps {
  movie: Movie;
  onContinue: () => void;
}

export function MovieMatch({ movie, onContinue }: MovieMatchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/20 to-transparent" />
        <div className="relative p-6 text-center">
          <Popcorn className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-4 text-3xl font-bold text-white">It's a Match!</h2>
          <p className="mt-2 text-gray-300">Everyone liked this movie!</p>
          
          <div className="mt-6 flex gap-6">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-1/3 rounded-lg shadow-xl"
            />
            <div className="flex flex-col items-start text-left">
              <h3 className="text-2xl font-bold text-white">{movie.title}</h3>
              <p className="mt-2 text-sm text-gray-300">{movie.overview}</p>
              <div className="mt-4 flex gap-2">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-red-500/20 px-3 py-1 text-sm text-red-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <Button onClick={onContinue} size="lg">
              Keep Matching
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}