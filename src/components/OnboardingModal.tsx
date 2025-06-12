
import React, { useState } from 'react';
import { UserPreferences } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (preferences: UserPreferences) => void;
  onSkip: () => void;
}

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'Horror', 'Music', 'Mystery',
  'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
];

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Japanese', 'Korean', 'Chinese', 'Hindi', 'Russian', 'Arabic'
];

const FAMOUS_ACTORS = [
  'Ryan Gosling', 'Emma Stone', 'Leonardo DiCaprio', 'Margot Robbie',
  'Ryan Reynolds', 'Scarlett Johansson', 'Dwayne Johnson', 'Jennifer Lawrence',
  'Chris Evans', 'Zendaya', 'Tom Holland', 'Anne Hathaway',
  'Will Smith', 'Gal Gadot', 'Chris Hemsworth', 'Natalie Portman',
  'Robert Downey Jr.', 'Emma Watson', 'Brad Pitt', 'Angelina Jolie'
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onSkip
}) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<UserPreferences>({
    genres: [],
    favoriteActors: [],
    languages: ['English'],
    watchFrequency: 'weekly'
  });

  const [actorInput, setActorInput] = useState('');

  const totalSteps = 4;

  const handleGenreToggle = (genre: string) => {
    setPreferences(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setPreferences(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleAddActor = (actorName?: string) => {
    const actor = actorName || actorInput.trim();
    if (actor && !preferences.favoriteActors.includes(actor)) {
      setPreferences(prev => ({
        ...prev,
        favoriteActors: [...prev.favoriteActors, actor]
      }));
      if (!actorName) {
        setActorInput('');
      }
    }
  };

  const handleRemoveActor = (actor: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteActors: prev.favoriteActors.filter(a => a !== actor)
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-moovio-dark rounded-2xl p-6 w-full max-w-lg animate-slide-up">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Moovio!</h2>
          <p className="text-gray-400">Let's personalize your experience</p>
          
          {/* Progress bar */}
          <div className="flex gap-2 mt-4 justify-center">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-colors duration-200 ${
                  index + 1 <= step ? 'bg-moovio-red' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="min-h-[300px]">
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">What genres do you enjoy?</h3>
              <div className="grid grid-cols-2 gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`p-3 rounded-lg text-sm transition-colors duration-200 ${
                      preferences.genres.includes(genre)
                        ? 'bg-moovio-red text-white'
                        : 'bg-moovio-gray text-gray-300 hover:bg-moovio-gray-light'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Favorite actors/actresses?</h3>
              
              {/* Input field */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={actorInput}
                    onChange={(e) => setActorInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddActor()}
                    placeholder="Enter actor name..."
                    className="flex-1 bg-moovio-gray border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-moovio-red focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddActor()}
                    className="netflix-button px-4"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Famous actors suggestions */}
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">Popular actors:</p>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {FAMOUS_ACTORS.filter(actor => !preferences.favoriteActors.includes(actor)).map((actor) => (
                    <button
                      key={actor}
                      onClick={() => handleAddActor(actor)}
                      className="text-left p-2 rounded-lg text-sm bg-moovio-gray text-gray-300 hover:bg-moovio-gray-light transition-colors duration-200"
                    >
                      {actor}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Selected actors */}
              <div className="flex flex-wrap gap-2">
                {preferences.favoriteActors.map((actor) => (
                  <span
                    key={actor}
                    className="bg-moovio-red text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {actor}
                    <button
                      onClick={() => handleRemoveActor(actor)}
                      className="hover:text-red-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Preferred languages?</h3>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((language) => (
                  <button
                    key={language}
                    onClick={() => handleLanguageToggle(language)}
                    className={`p-3 rounded-lg text-sm transition-colors duration-200 ${
                      preferences.languages.includes(language)
                        ? 'bg-moovio-red text-white'
                        : 'bg-moovio-gray text-gray-300 hover:bg-moovio-gray-light'
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">How often do you watch movies/shows?</h3>
              <div className="space-y-3">
                {[
                  { value: 'daily', label: 'Daily - I love entertainment!' },
                  { value: 'weekly', label: 'Weekly - Regular viewer' },
                  { value: 'monthly', label: 'Monthly - Occasional viewer' },
                  { value: 'rarely', label: 'Rarely - Special occasions only' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPreferences(prev => ({ 
                      ...prev, 
                      watchFrequency: option.value as UserPreferences['watchFrequency']
                    }))}
                    className={`w-full p-4 rounded-lg text-left transition-colors duration-200 ${
                      preferences.watchFrequency === option.value
                        ? 'bg-moovio-red text-white'
                        : 'bg-moovio-gray text-gray-300 hover:bg-moovio-gray-light'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            Skip for now
          </button>
          
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="bg-moovio-gray hover:bg-moovio-gray-light text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="netflix-button px-6 py-2"
            >
              {step === totalSteps ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
