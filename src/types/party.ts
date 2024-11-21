export interface Party {
  id: string;
  hostId: string;
  participants: string[];
  selectedServices: string[];
  status: 'waiting' | 'priming' | 'voting' | 'matched';
  matchedMovies: number[];
}

export interface PrimingQuestion {
  id: string;
  question: string;
  multiple: boolean;
  options: {
    text: string;
    value: string;
  }[];
}

export interface PrimingAnswer {
  userId: string;
  questionId: string;
  answers: string[];
}