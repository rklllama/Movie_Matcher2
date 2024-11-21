import axios from 'axios';
import type { Movie } from '../types/movie';

const TMDB_API_KEY = 'd9b715ea724d41f76d10fe12a3996aa8';
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Convert streaming service IDs to TMDB provider IDs
const PROVIDER_MAP: Record<string, string> = {
  netflix: '8',
  prime: '9',
  hulu: '15',
  disney: '337',
};

const GENRE_MAP: Record<string, string> = {
  action: '28',
  comedy: '35',
  drama: '18',
  horror: '27',
  romance: '10749',
  'science_fiction': '878',
  fantasy: '14',
  thriller: '53',
};

export const getMovieDetails = async (movieId: number): Promise<Movie> => {
  const response = await tmdbApi.get(`/movie/${movieId}`, {
    params: {
      append_to_response: 'watch/providers,credits,release_dates',
    },
  });
  return response.data;
};

export const discoverMovies = async (params: Record<string, any>): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        ...params,
        'vote_count.gte': 100,
        include_adult: false,
        with_watch_providers: params.with_watch_providers,
        watch_region: 'US',
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Failed to fetch movies from TMDB');
  }
};

export const generateMovieList = async (
  preferences: Record<string, string[]>,
  services: string[],
  minCount: number
): Promise<Movie[]> => {
  const allMovies: Movie[] = [];
  const seenIds = new Set<number>();
  const minMovies = Math.max(minCount, 10);

  // Convert streaming services to TMDB provider IDs
  const providerIds = services
    .map(service => PROVIDER_MAP[service])
    .filter(Boolean);

  // Create parameter sets based on preferences with weights
  const paramSets: Array<{ params: Record<string, any>; weight: number }> = [];

  // Base parameters
  const baseParams: Record<string, any> = {
    'vote_average.gte': 6,
    'vote_count.gte': 100,
  };

  if (providerIds.length > 0) {
    baseParams.with_watch_providers = providerIds.join('|');
  }

  // Add genre-specific parameters with high weight
  if (preferences.genre?.length && !preferences.genre.includes('any')) {
    const genreIds = preferences.genre
      .map(genre => GENRE_MAP[genre])
      .filter(Boolean);
    
    if (genreIds.length) {
      paramSets.push({
        params: {
          ...baseParams,
          with_genres: genreIds.join('|'),
          sort_by: 'vote_average.desc',
        },
        weight: 3,
      });
    }
  }

  // Add era-specific parameters
  if (preferences.era?.length && !preferences.era.includes('any')) {
    if (preferences.era.includes('classic')) {
      paramSets.push({
        params: {
          ...baseParams,
          'primary_release_date.lte': '1980-12-31',
        },
        weight: 2,
      });
    }
    if (preferences.era.includes('modern')) {
      paramSets.push({
        params: {
          ...baseParams,
          'primary_release_date.gte': '1980-01-01',
          'primary_release_date.lte': '2010-12-31',
        },
        weight: 2,
      });
    }
    if (preferences.era.includes('contemporary')) {
      paramSets.push({
        params: {
          ...baseParams,
          'primary_release_date.gte': '2010-01-01',
        },
        weight: 2,
      });
    }
  }

  // Add mood-specific parameters
  if (preferences.mood?.length && !preferences.mood.includes('any')) {
    if (preferences.mood.includes('light')) {
      paramSets.push({
        params: {
          ...baseParams,
          with_genres: '35,10751', // Comedy and Family
        },
        weight: 2,
      });
    }
    if (preferences.mood.includes('intense')) {
      paramSets.push({
        params: {
          ...baseParams,
          with_genres: '28,53,27', // Action, Thriller, Horror
        },
        weight: 2,
      });
    }
    if (preferences.mood.includes('thoughtful')) {
      paramSets.push({
        params: {
          ...baseParams,
          with_genres: '18,99', // Drama, Documentary
          'vote_average.gte': 7.5,
        },
        weight: 2,
      });
    }
  }

  // Add default parameter set with lower weight
  paramSets.push({
    params: {
      ...baseParams,
      sort_by: 'popularity.desc',
    },
    weight: 1,
  });

  // Fetch movies for each parameter set
  for (const { params, weight } of paramSets) {
    try {
      const [page1, page2] = await Promise.all([
        discoverMovies({ ...params, page: 1 }),
        discoverMovies({ ...params, page: 2 }),
      ]);

      // Add movies according to weight
      [...page1, ...page2].forEach(movie => {
        if (!seenIds.has(movie.id)) {
          seenIds.add(movie.id);
          // Add the movie multiple times based on weight
          for (let i = 0; i < weight; i++) {
            allMovies.push(movie);
          }
        }
      });
    } catch (error) {
      console.error('Error fetching movies for params:', params, error);
    }
  }

  if (allMovies.length === 0) {
    throw new Error('Could not fetch any movies. Please try again.');
  }

  // Shuffle and deduplicate movies
  const shuffled = [...allMovies]
    .sort(() => Math.random() - 0.5)
    .filter((movie, index, self) => 
      index === self.findIndex((m) => m.id === movie.id)
    );

  return shuffled.slice(0, Math.min(500, Math.max(minMovies, 200)));
};