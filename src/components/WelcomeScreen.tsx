
import React from 'react';
import { Avatar } from './Avatar';
import { Sparkles, TrendingUp, Heart, Users } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const features = [
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Discover Trending Content",
    description: "Stay up to date with what's hot in movies and TV shows worldwide"
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Personalized Recommendations",
    description: "Get AI-powered suggestions tailored to your unique taste and preferences"
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Save Your Favorites",
    description: "Create and manage your personal watchlists and favorite collections"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Smart Discovery",
    description: "Find hidden gems and explore new genres based on your viewing history"
  }
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
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
            Welcome to the Future of
            <span className="text-gradient block">Entertainment Discovery</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Meet your AI-powered entertainment companion that understands your taste, 
            discovers amazing content, and helps you never run out of great things to watch.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-moovio-gray/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-moovio-red/30 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-moovio-red/20 rounded-xl text-moovio-red group-hover:bg-moovio-red group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button
            onClick={onGetStarted}
            className="netflix-button px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Get Started
          </button>
          <p className="text-gray-500 text-sm mt-4">
            Personalize your experience in just 2 minutes
          </p>
        </div>

        {/* Bottom decoration */}
        <div className="mt-16 flex items-center gap-8 opacity-30">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-moovio-red"></div>
          <div className="text-gray-500 text-sm">Powered by AI</div>
          <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-moovio-red"></div>
        </div>
      </main>
    </div>
  );
};
