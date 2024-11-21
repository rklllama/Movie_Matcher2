export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface StreamingProvider {
  id: number;
  name: string;
  logo_path: string;
}

export interface MovieVote {
  movieId: number;
  approved: boolean;
  userId: string;
}