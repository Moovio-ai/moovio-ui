export interface Movie {
  id: string;
  title: string;
  poster?: string;
  imageUrl?: string;
  genre: string[] | string;
  synopsis?: string;
  overview?: string;
  rating: number;
  duration?: string;
  director?: string;
  releaseYear?: number;
}

export interface Suggestion {
  icon: string;
  text: string;
  query: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: {
    movies?: Movie[];
    suggestions?: Suggestion[];
    recommendationReason?: string;
  };
}

export interface UserPreferences {
  genres: string[];
  favoriteActors: string[];
  languages: string[];
  watchFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
}

export interface ApiResponse {
  reply: {
    message: string;
    data?: {
      movies?: Movie[];
      suggestions?: Suggestion[];
      recommendationReason?: string;
    };
  };
}

export interface VoiceRecording {
  isRecording: boolean;
  transcript: string;
  duration: number;
}
