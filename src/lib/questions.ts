import { PrimingQuestion } from '../types/party';

export const PRIMING_QUESTIONS: PrimingQuestion[] = [
  {
    id: 'genre',
    question: 'What types of movies are you in the mood for?',
    multiple: true,
    options: [
      { text: 'Comedy', value: 'comedy' },
      { text: 'Thriller', value: 'thriller' },
      { text: 'Drama', value: 'drama' },
      { text: 'Action', value: 'action' },
      { text: 'Horror', value: 'horror' },
      { text: 'Romance', value: 'romance' },
      { text: 'Sci-Fi', value: 'science_fiction' },
      { text: 'Fantasy', value: 'fantasy' },
      { text: 'No preference', value: 'any' },
    ],
  },
  {
    id: 'mood',
    question: 'What kind of mood are you looking for?',
    multiple: true,
    options: [
      { text: 'Something light and fun', value: 'light' },
      { text: 'Something thought-provoking', value: 'thoughtful' },
      { text: 'Something intense', value: 'intense' },
      { text: 'Something emotional', value: 'emotional' },
      { text: 'No preference', value: 'any' },
    ],
  },
  {
    id: 'era',
    question: 'Any preferred time period?',
    multiple: true,
    options: [
      { text: 'Classic (pre-1980)', value: 'classic' },
      { text: 'Modern (1980-2010)', value: 'modern' },
      { text: 'Contemporary (2010+)', value: 'contemporary' },
      { text: 'No preference', value: 'any' },
    ],
  },
  {
    id: 'acclaim',
    question: 'What kind of recognition interests you?',
    multiple: true,
    options: [
      { text: 'Award winners', value: 'awarded' },
      { text: 'Critic favorites', value: 'critically_acclaimed' },
      { text: 'Audience favorites', value: 'popular' },
      { text: 'Hidden gems', value: 'hidden' },
      { text: 'No preference', value: 'any' },
    ],
  },
  {
    id: 'length',
    question: 'How long of a movie would you prefer?',
    multiple: true,
    options: [
      { text: 'Short (under 100 minutes)', value: 'short' },
      { text: 'Average (100-130 minutes)', value: 'average' },
      { text: 'Long (over 130 minutes)', value: 'long' },
      { text: 'No preference', value: 'any' },
    ],
  },
  {
    id: 'origin',
    question: 'Any preference for where the movie is from?',
    multiple: true,
    options: [
      { text: 'Hollywood', value: 'hollywood' },
      { text: 'International', value: 'international' },
      { text: 'Independent', value: 'independent' },
      { text: 'No preference', value: 'any' },
    ],
  },
  {
    id: 'style',
    question: 'What style of filmmaking interests you?',
    multiple: true,
    options: [
      { text: 'Action-packed', value: 'action_packed' },
      { text: 'Character-driven', value: 'character_driven' },
      { text: 'Visually stunning', value: 'visual' },
      { text: 'Documentary-style', value: 'documentary' },
      { text: 'No preference', value: 'any' },
    ],
  },
  {
    id: 'lists',
    question: 'Interested in any of these curated lists?',
    multiple: true,
    options: [
      { text: 'AFI Top 100', value: 'afi' },
      { text: 'Oscar Winners', value: 'oscar' },
      { text: 'Film Festival Favorites', value: 'festival' },
      { text: 'No preference', value: 'any' },
    ],
  },
];