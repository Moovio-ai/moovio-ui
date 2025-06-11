
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Key } from 'lucide-react';

interface ApiKeySetupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(apiKey.startsWith('sk-') && apiKey.length > 20);
  }, [apiKey]);

  const handleSave = () => {
    if (isValid) {
      localStorage.setItem('openai-api-key', apiKey);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-moovio-dark rounded-2xl p-6 w-full max-w-md animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-moovio-red rounded-full flex items-center justify-center mx-auto mb-4">
            <Key size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">OpenAI API Key Required</h3>
          <p className="text-gray-400 text-sm">
            To use Moovio's AI features, please enter your OpenAI API key. This key will be stored locally and securely.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-moovio-gray border border-gray-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:border-moovio-red focus:outline-none transition-colors duration-200"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {!isValid && apiKey && (
            <p className="text-red-400 text-sm mt-2">
              Please enter a valid OpenAI API key (starts with sk-)
            </p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSave}
            disabled={!isValid}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isValid
                ? 'netflix-button'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Save API Key
          </button>
          
          <div className="text-center">
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-moovio-red hover:text-red-400 text-sm transition-colors duration-200"
            >
              Get your API key from OpenAI
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
