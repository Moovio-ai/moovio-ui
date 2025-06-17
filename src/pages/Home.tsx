import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { QuickActionButton } from '../components/QuickActionButton';
import { ApiKeySetup } from '../components/ApiKeySetup';
import { OnboardingModal } from '../components/OnboardingModal';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { UserPreferences } from '../types';
import { apiService } from '../services/api';
import { Sparkles, TrendingUp, MessageCircle, Zap, Play, Search, Star, Heart } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');
  const [isStoringPreferences, setIsStoringPreferences] = useState(false);

  useEffect(() => {
    // Check if this is first visit
    const hasSeenOnboarding = localStorage.getItem('has-seen-onboarding');
    console.log('hasSeenOnboarding:', hasSeenOnboarding);
    
    if (!hasSeenOnboarding) {
      console.log('Setting showWelcome to true');
      setShowWelcome(true);
    } else {
      console.log('User has already seen onboarding');
      // Check if there's a welcome message from onboarding
      const storedWelcomeMessage = localStorage.getItem('onboarding-welcome-message');
      if (storedWelcomeMessage) {
        setWelcomeMessage(storedWelcomeMessage);
      }
    }
  }, []);

  const handleGetStarted = () => {
    console.log('handleGetStarted called');
    setShowWelcome(false);
    
    // Check if API key exists first
    const apiKey = localStorage.getItem('openai-api-key');
    if (!apiKey) {
      setShowApiKeySetup(true);
    } else {
      setShowOnboarding(true);
    }
  };

  const handleQuickAction = (message: string) => {
    // Check if API key exists
    const apiKey = localStorage.getItem('openai-api-key');
    if (!apiKey) {
      setShowApiKeySetup(true);
      return;
    }

    // Navigate to chat with pre-filled message
    navigate('/chat', { state: { initialMessage: message } });
  };

  const handleOnboardingComplete = async (preferences: UserPreferences) => {
    localStorage.setItem('user-preferences', JSON.stringify(preferences));
    localStorage.setItem('has-seen-onboarding', 'true');
    setShowOnboarding(false);
    setIsStoringPreferences(true);

    try {
      // Send preferences to LLM
      const preferencesMessage = `Por favor, armazene minhas preferências: 
Gêneros favoritos: ${preferences.genres.join(', ')}
Atores favoritos: ${preferences.favoriteActors.join(', ')}
Idiomas preferidos: ${preferences.languages.join(', ')}
Frequência de consumo: ${preferences.watchFrequency === 'daily' ? 'Diário' : 
                        preferences.watchFrequency === 'weekly' ? 'Semanal' : 
                        preferences.watchFrequency === 'monthly' ? 'Mensal' : 'Raramente'}`;

      const response = await apiService.sendMessage({
        message: preferencesMessage,
        context: { preferences }
      });

      setWelcomeMessage(response.reply.message);
      localStorage.setItem('onboarding-welcome-message', response.reply.message);
    } catch (error) {
      console.error('Failed to store preferences:', error);
      setWelcomeMessage('Suas preferências foram salvas localmente! Agora posso fazer recomendações personalizadas para você.');
      localStorage.setItem('onboarding-welcome-message', 'Suas preferências foram salvas localmente! Agora posso fazer recomendações personalizadas para você.');
    } finally {
      setIsStoringPreferences(false);
    }
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('has-seen-onboarding', 'true');
    setShowOnboarding(false);
  };

  const handleApiKeySetupClose = () => {
    setShowApiKeySetup(false);
    
    // After API key is set, proceed to onboarding
    const apiKey = localStorage.getItem('openai-api-key');
    if (apiKey) {
      setShowOnboarding(true);
    }
  };

  const quickActions = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      text: "Movie Recommendation",
      description: "Get a personalized movie suggestion",
      onClick: () => handleQuickAction("Recommend a movie for me"),
      accent: "text-pink-400 bg-pink-500/10"
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      text: "TV Show Discovery",
      description: "Find your next binge-worthy series",
      onClick: () => handleQuickAction("Suggest a TV show for me"),
      accent: "text-blue-400 bg-blue-500/10"
    },
    {
      icon: <Search className="w-5 h-5" />,
      text: "What's Trending",
      description: "See what's popular right now",
      onClick: () => handleQuickAction("What's trending right now?"),
      accent: "text-orange-400 bg-orange-500/10"
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      text: "Start Chatting",
      description: "Ask me anything about entertainment",
      onClick: () => navigate('/chat'),
      accent: "text-green-400 bg-green-500/10"
    }
  ];

  console.log('Current state - showWelcome:', showWelcome, 'showOnboarding:', showOnboarding);

  // Show welcome screen if user hasn't seen onboarding
  if (showWelcome) {
    console.log('Rendering WelcomeScreen');
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  console.log('Rendering main home screen');

  return (
    <div className="min-h-screen bg-gradient-to-br from-moovio-darker via-moovio-dark to-moovio-darker flex flex-col">
      {/* Header */}
      <header className="p-6 text-center">
        <h1 className="text-3xl font-bold text-gradient mb-2">Moovio</h1>
        <p className="text-gray-400">Your Personal Movie & TV Assistant</p>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Hero section */}
        <div className="text-center mb-16 max-w-2xl">
          <Avatar size="xl" className="mx-auto mb-8" />
          
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Hi! How can I help you 
            <span className="text-gradient block mt-2">discover amazing content?</span>
          </h2>
          
          {isStoringPreferences ? (
            <div className="bg-moovio-gray/20 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/30 mb-8 animate-fade-in">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-3 h-3 bg-moovio-red rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-moovio-red rounded-full animate-ping"></div>
                </div>
                <p className="text-gray-300 font-medium text-lg">Storing your preferences...</p>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-moovio-red to-pink-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          ) : welcomeMessage ? (
            <div className="bg-moovio-gray/20 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/30 mb-8 animate-fade-in">
              <p className="text-gray-200 leading-relaxed text-lg">
                {welcomeMessage}
              </p>
            </div>
          ) : (
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              I'm here to help you discover amazing movies and TV shows! You can ask me for recommendations, trending content, or anything about entertainment.
            </p>
          )}
        </div>

        {/* Quick action cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-16">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="group relative bg-moovio-gray/30 backdrop-blur-md border border-gray-700/40 rounded-3xl p-8 hover:border-gray-600/60 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-2xl transition-all duration-300 ${action.accent} group-hover:scale-110`}>
                  {action.icon}
                </div>
                
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-white transition-colors duration-300">
                    {action.text}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {action.description}
                  </p>
                </div>
              </div>

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-moovio-red/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="flex items-center gap-8 opacity-30">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-moovio-red"></div>
          <div className="text-gray-500 text-sm">Powered by AI</div>
          <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-moovio-red"></div>
        </div>
      </main>

      {/* Modals */}
      <ApiKeySetup 
        isOpen={showApiKeySetup}
        onClose={handleApiKeySetupClose}
      />
      
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    </div>
  );
};
