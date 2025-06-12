import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Mic, Loader2, Menu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useChat } from '../hooks/useChat';
import { ChatMessage } from '../types';
import { Avatar } from '../components/Avatar';
import { MovieCard } from '../components/MovieCard';
import { MovieCarousel } from '../components/MovieCarousel';
import { SuggestionChips } from '../components/SuggestionChips';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { ApiKeySetup } from '../components/ApiKeySetup';
import { HeaderMenu } from '../components/HeaderMenu';

export const Chat: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { messages, isLoading, sendMessage } = useChat();
  const [inputValue, setInputValue] = useState('');
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasProcessedInitialMessage = useRef(false);

  // Handle initial message from navigation state
  useEffect(() => {
    const initialMessage = location.state?.initialMessage;
    if (initialMessage && !hasProcessedInitialMessage.current) {
      hasProcessedInitialMessage.current = true;
      sendMessage(initialMessage);
    }
  }, [location.state, sendMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue('');
    await sendMessage(message);
  };

  const handleSuggestionClick = async (query: string) => {
    await sendMessage(query);
  };

  const handleVoiceTranscript = async (transcript: string) => {
    await sendMessage(transcript);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMenuAction = async (action: string) => {
    let message = '';
    
    switch (action) {
      case 'lists':
        message = 'Quais são as minhas listas de filmes e séries?';
        break;
      case 'preferences':
        message = 'Quais são as minhas preferências de filmes e séries?';
        break;
    }
    
    if (message) {
      await sendMessage(message);
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.type === 'user';
    
    return (
      <div key={message.id} className={`w-full animate-fade-in ${isUser ? 'bg-transparent' : 'bg-moovio-gray/20'}`}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
              <Avatar size="sm" className="flex-shrink-0 mt-1" state="idle" />
            )}
            
            <div className={`flex-1 max-w-none ${isUser ? 'flex flex-col items-end' : ''}`}>
              <div className={`
                ${isUser 
                  ? 'bg-moovio-red text-white rounded-2xl rounded-br-md px-5 py-3 max-w-2xl' 
                  : 'text-gray-100 max-w-full'
                }
              `}>
                {isUser ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown 
                      components={{
                        p: ({children}) => <p className="mb-3 text-gray-100 leading-7 text-[15px]">{children}</p>,
                        strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
                        em: ({children}) => <em className="italic text-gray-200">{children}</em>,
                        ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-100 ml-4">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-100 ml-4">{children}</ol>,
                        li: ({children}) => <li className="text-[15px] leading-6">{children}</li>,
                        code: ({children}) => <code className="bg-moovio-gray px-2 py-1 rounded text-sm text-gray-200 font-mono">{children}</code>,
                        pre: ({children}) => <pre className="bg-moovio-gray p-4 rounded-lg text-sm overflow-x-auto font-mono border border-gray-600">{children}</pre>,
                        h1: ({children}) => <h1 className="text-xl font-semibold text-white mb-3 mt-6 first:mt-0">{children}</h1>,
                        h2: ({children}) => <h2 className="text-lg font-semibold text-white mb-3 mt-5">{children}</h2>,
                        h3: ({children}) => <h3 className="text-base font-semibold text-white mb-2 mt-4">{children}</h3>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
              
              {/* Render movie recommendation */}
              {!isUser && message.data?.movies && message.data.movies.length === 1 && (
                <div className="mt-4 max-w-full">
                  <MovieCard 
                    movie={message.data.movies[0]} 
                    showReason={!!message.data.recommendationReason}
                    reason={message.data.recommendationReason}
                  />
                </div>
              )}
              
              {/* Render movie carousel for multiple movies */}
              {!isUser && message.data?.movies && message.data.movies.length > 1 && (
                <div className="mt-4 w-full">
                  <MovieCarousel movies={message.data.movies} />
                </div>
              )}
              
              {/* Render suggestions */}
              {!isUser && message.data?.suggestions && (
                <div className="mt-4">
                  <SuggestionChips 
                    suggestions={message.data.suggestions}
                    onSuggestionClick={handleSuggestionClick}
                  />
                </div>
              )}
            </div>
            
            {isUser && (
              <div className="w-8 h-8 rounded-full bg-moovio-red flex items-center justify-center text-white text-sm font-medium flex-shrink-0 mt-1">
                U
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-moovio-darker flex flex-col w-full">
      {/* Header */}
      <header className="bg-moovio-dark border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-moovio-gray rounded-lg transition-colors duration-200"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            
            <Avatar size="sm" state="idle" />
            
            <div>
              <h1 className="text-white font-semibold">Moovio</h1>
              <p className="text-gray-400 text-sm">Your AI Assistant</p>
            </div>
          </div>
          
          <HeaderMenu onAction={handleMenuAction} />
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        {messages.length === 0 && (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <Avatar size="lg" className="mx-auto mb-6" state="idle" />
            <h2 className="text-2xl font-semibold text-white mb-3">
              Ready to help!
            </h2>
            <p className="text-gray-400 max-w-md mx-auto text-base leading-relaxed">
              Ask me anything about movies and TV shows. I can recommend content, tell you what's trending, or just chat about entertainment!
            </p>
          </div>
        )}
        
        {messages.map(renderMessage)}
        
        {isLoading && (
          <div className="w-full bg-moovio-gray/20">
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="flex gap-4 animate-fade-in">
                <Avatar size="sm" className="flex-shrink-0 mt-1" state="thinking" />
                <div className="flex items-center gap-3 text-gray-300">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-[15px]">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Input area */}
      <footer className="bg-moovio-dark border-t border-gray-800 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about movies and shows..."
                className="w-full bg-moovio-gray border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-moovio-red focus:outline-none transition-colors duration-200 text-[15px] resize-none"
                disabled={isLoading}
              />
            </div>
            
            <button
              onClick={() => setShowVoiceRecorder(true)}
              className="p-3 bg-moovio-gray hover:bg-moovio-gray-light text-white rounded-xl transition-colors duration-200 flex-shrink-0"
              disabled={isLoading}
            >
              <Mic size={18} />
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`p-3 rounded-xl transition-colors duration-200 flex-shrink-0 ${
                inputValue.trim() && !isLoading
                  ? 'bg-moovio-red hover:bg-moovio-red-dark text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </footer>

      {/* Voice Recorder Modal */}
      <VoiceRecorder
        isOpen={showVoiceRecorder}
        onClose={() => setShowVoiceRecorder(false)}
        onTranscriptComplete={handleVoiceTranscript}
      />

      {/* API Key Setup Modal */}
      <ApiKeySetup 
        isOpen={showApiKeySetup}
        onClose={() => setShowApiKeySetup(false)}
      />
    </div>
  );
};
