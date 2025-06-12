
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { QuickActionButton } from '../components/QuickActionButton';
import { ApiKeySetup } from '../components/ApiKeySetup';
import { OnboardingModal } from '../components/OnboardingModal';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { UserPreferences } from '../types';
import { apiService } from '../services/api';

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
        {/* Avatar and greeting */}
        <div className="text-center mb-12">
          <Avatar size="xl" className="mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-3">
            Hi! How can I help you today?
          </h2>
          
          {isStoringPreferences ? (
            <div className="bg-moovio-dark/50 rounded-lg p-4 max-w-md mx-auto mb-4">
              <p className="text-gray-300 text-sm">
                Armazenando suas preferências...
              </p>
            </div>
          ) : welcomeMessage ? (
            <div className="bg-moovio-dark/50 rounded-lg p-4 max-w-md mx-auto mb-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                {welcomeMessage}
              </p>
            </div>
          ) : (
            <p className="text-gray-400 max-w-md">
              I'm here to help you discover amazing movies and TV shows based on your preferences.
            </p>
          )}
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <QuickActionButton
            icon="🎬"
            text="Recommend a movie"
            onClick={() => handleQuickAction("Recommend a movie for me")}
          />
          
          <QuickActionButton
            icon="📺"
            text="Suggest a TV show"
            onClick={() => handleQuickAction("Suggest a TV show for me")}
          />
          
          <QuickActionButton
            icon="🔥"
            text="What's trending?"
            onClick={() => handleQuickAction("What's trending right now?")}
          />
          
          <QuickActionButton
            icon="💬"
            text="Type your message"
            onClick={() => navigate('/chat')}
          />
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Powered by AI • Personalized for you
          </p>
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
