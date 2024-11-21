import { create } from 'zustand';
import type { Movie } from '../types/movie';
import { generateMovieList, getMovieDetails } from '../lib/tmdb';

interface MovieState {
  movies: Movie[];
  seenMovies: Set<number>;
  approvedMovies: Map<number, Set<string>>;
  matchedMovies: Movie[];
  isLoading: boolean;
  error: string | null;
  initializeMovies: (
    preferences: Record<string, string[]>,
    services: string[],
    userCount: number
  ) => Promise<void>;
  getCurrentMovie: () => Movie | null;
  approveMovie: (movieId: number, userId: string) => void;
  rejectMovie: (movieId: number, userId: string) => void;
  getNextMovie: (userId: string) => Movie | null;
  checkForMatches: () => Movie[];
  getMovieCount: () => number;
  getApprovedMovies: (userId: string) => Movie[];
}

export const useMovieStore = create<MovieState>((set, get) => ({
  movies: [],
  seenMovies: new Set<number>(),
  approvedMovies: new Map<number, Set<string>>(),
  matchedMovies: [],
  isLoading: false,
  error: null,

  initializeMovies: async (preferences, services, userCount) => {
    set({ isLoading: true, error: null });
    try {
      const movies = await generateMovieList(preferences, services, userCount * 25);
      
      // Fetch full details for each movie
      const moviesWithDetails = await Promise.all(
        movies.map(movie => getMovieDetails(movie.id))
      );
      
      set({ 
        movies: moviesWithDetails,
        seenMovies: new Set(),
        approvedMovies: new Map(),
        isLoading: false 
      });
    } catch (error) {
      console.error('Failed to load movies:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load movies. Please try again.',
        isLoading: false 
      });
    }
  },

  getCurrentMovie: () => {
    const { movies, seenMovies } = get();
    return movies.find(movie => !seenMovies.has(movie.id)) || null;
  },

  approveMovie: (movieId: number, userId: string) => {
    set((state) => {
      const approvedMovies = new Map(state.approvedMovies);
      const userSet = approvedMovies.get(movieId) || new Set<string>();
      userSet.add(userId);
      approvedMovies.set(movieId, userSet);
      const seenMovies = new Set(state.seenMovies).add(movieId);
      return { approvedMovies, seenMovies };
    });
  },

  rejectMovie: (movieId: number, userId: string) => {
    set((state) => ({
      seenMovies: new Set(state.seenMovies).add(movieId)
    }));
  },

  getNextMovie: (userId: string) => {
    const { movies, seenMovies, approvedMovies, matchedMovies } = get();
    
    // Filter out matched movies
    const matchedIds = new Set(matchedMovies.map(m => m.id));
    
    // First try to find a movie approved by others but not seen by this user
    for (const [movieId, approvers] of approvedMovies.entries()) {
      if (!seenMovies.has(movieId) && !approvers.has(userId) && !matchedIds.has(movieId)) {
        const movie = movies.find(m => m.id === movieId);
        if (movie) return movie;
      }
    }

    // If no approved movies are available, find the next unseen movie
    return movies.find(movie => 
      !seenMovies.has(movie.id) && !matchedIds.has(movie.id)
    ) || null;
  },

  checkForMatches: () => {
    const { movies, approvedMovies, matchedMovies } = get();
    const newMatches: Movie[] = [];

    for (const [movieId, approvers] of approvedMovies.entries()) {
      if (approvers.size >= 2) {
        const movie = movies.find(m => m.id === movieId);
        if (movie && !matchedMovies.some(m => m.id === movie.id)) {
          newMatches.push(movie);
        }
      }
    }

    if (newMatches.length > 0) {
      set(state => ({
        matchedMovies: [...state.matchedMovies, ...newMatches]
      }));
    }

    return newMatches;
  },

  getMovieCount: () => {
    const { seenMovies } = get();
    return seenMovies.size;
  },

  getApprovedMovies: (userId: string) => {
    const { movies, approvedMovies } = get();
    const userApproved: Movie[] = [];

    for (const [movieId, approvers] of approvedMovies.entries()) {
      if (approvers.has(userId)) {
        const movie = movies.find(m => m.id === movieId);
        if (movie) userApproved.push(movie);
      }
    }

    return userApproved;
  },
}));