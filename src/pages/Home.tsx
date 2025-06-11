
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { QuickActionButton } from '../components/QuickActionButton';
import { ApiKeySetup } from '../components/ApiKeySetup';
import { OnboardingModal } from '../components/OnboardingModal';
import { UserPreferences } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if this is first visit
    const hasSeenOnboarding = localStorage.getItem('has-seen-onboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

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

  const handleOnboardingComplete = (preferences: UserPreferences) => {
    localStorage.setItem('user-preferences', JSON.stringify(preferences));
    localStorage.setItem('has-seen-onboarding', 'true');
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('has-seen-onboarding', 'true');
    setShowOnboarding(false);
  };

  const handleApiKeySetupClose = () => {
    setShowApiKeySetup(false);
  };

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
          <p className="text-gray-400 max-w-md">
            I'm here to help you discover amazing movies and TV shows based on your preferences.
          </p>
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
