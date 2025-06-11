
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ApiRequest {
  message: string;
  context?: object;
  openaiApiKey?: string;
}

export interface ApiResponse {
  reply: {
    message: string;
    data?: {
      movies?: any[];
      suggestions?: any[];
      recommendationReason?: string;
    };
  };
}

class ApiService {
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    try {
      // Get OpenAI API key from localStorage
      const openaiApiKey = localStorage.getItem('openai-api-key');
      
      const requestBody = {
        ...data,
        openaiApiKey: openaiApiKey || undefined
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      
      // Fallback for demo purposes
      return this.getFallbackResponse(data.message);
    }
  }

  private getFallbackResponse(message: string): ApiResponse {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('recommend') || lowerMessage.includes('movie')) {
      return {
        reply: {
          message: "Based on your preferences, I recommend checking out 'Inception'. It's a mind-bending sci-fi thriller that I think you'll love!",
          data: {
            movies: [{
              id: '1',
              title: 'Inception',
              poster: 'https://images.unsplash.com/photo-1489599038532-1e9d2f3bb1f2?w=300&h=450&fit=crop',
              genre: ['Sci-Fi', 'Thriller'],
              synopsis: 'A skilled thief who enters people\'s dreams to steal secrets gets a chance to have his criminal record erased.',
              rating: 8.8,
              duration: '148 min',
              director: 'Christopher Nolan',
              releaseYear: 2010
            }],
            recommendationReason: "This movie perfectly combines complex storytelling with stunning visuals, making it perfect for viewers who enjoy thought-provoking cinema.",
            suggestions: [
              { icon: '🎬', text: 'Similar sci-fi movies', query: 'Show me more sci-fi movies like Inception' },
              { icon: '⭐', text: 'Christopher Nolan films', query: 'What other Christopher Nolan movies do you recommend?' }
            ]
          }
        }
      };
    }
    
    if (lowerMessage.includes('trending') || lowerMessage.includes('popular')) {
      return {
        reply: {
          message: "Here are the most trending movies and shows right now:",
          data: {
            movies: [
              {
                id: '1',
                title: 'The Matrix',
                poster: 'https://images.unsplash.com/photo-1489599038532-1e9d2f3bb1f2?w=300&h=450&fit=crop',
                genre: ['Action', 'Sci-Fi'],
                synopsis: 'A computer hacker learns about the true nature of reality.',
                rating: 8.7,
                duration: '136 min',
                director: 'The Wachowskis',
                releaseYear: 1999
              },
              {
                id: '2',
                title: 'Dune',
                poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
                genre: ['Adventure', 'Drama'],
                synopsis: 'A noble family becomes embroiled in a war for control over the galaxy.',
                rating: 8.0,
                duration: '155 min',
                director: 'Denis Villeneuve',
                releaseYear: 2021
              },
              {
                id: '3',
                title: 'Interstellar',
                poster: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=450&fit=crop',
                genre: ['Drama', 'Sci-Fi'],
                synopsis: 'A team of explorers travel through a wormhole in space.',
                rating: 8.6,
                duration: '169 min',
                director: 'Christopher Nolan',
                releaseYear: 2014
              }
            ],
            suggestions: [
              { icon: '📺', text: 'Trending TV shows', query: 'What TV shows are trending?' },
              { icon: '🔥', text: 'This week\'s hot picks', query: 'What are this week\'s most popular movies?' }
            ]
          }
        }
      };
    }
    
    return {
      reply: {
        message: "I'm here to help you discover amazing movies and TV shows! You can ask me for recommendations, trending content, or anything about entertainment.",
        data: {
          suggestions: [
            { icon: '🎬', text: 'Recommend a movie', query: 'Recommend a movie for me' },
            { icon: '📺', text: 'Suggest a TV show', query: 'Suggest a TV show for me' },
            { icon: '🔥', text: 'What\'s trending?', query: 'What\'s trending right now?' }
          ]
        }
      }
    };
  }

  async sendMessage(data: ApiRequest): Promise<ApiResponse> {
    return this.makeRequest('/assistant/reply', data);
  }
}

export const apiService = new ApiService();
