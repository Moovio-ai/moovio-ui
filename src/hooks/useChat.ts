
import { useState, useCallback } from 'react';
import { ChatMessage, UserPreferences } from '../types';
import { apiService } from '../services/api';
import { useSendMessageSSE } from './useSendMessageSSE';
import { toast } from '@/hooks/use-toast';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [useSSE, setUseSSE] = useState(() => {
    const saved = localStorage.getItem('moovio-use-sse');
    return saved === 'true';
  });

  // Get OpenAI API key for SSE
  const openaiKey = localStorage.getItem('openai-api-key') || '';
  
  const sendMessageSSE = useSendMessageSSE({
    setMessages,
    setIsLoading,
    openaiKey,
  });

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const sendMessageREST = useCallback(async (content: string, context?: object) => {
    if (!content.trim()) return;

    // Add user message
    addMessage({
      type: 'user',
      content: content.trim(),
    });

    setIsLoading(true);

    try {
      const userPreferences = localStorage.getItem('user-preferences');
      const preferences = userPreferences ? JSON.parse(userPreferences) as UserPreferences : null;

      const response = await apiService.sendMessage({
        message: content.trim(),
        context: {
          ...context,
          preferences,
        },
      });

      // Add assistant message
      addMessage({
        type: 'assistant',
        content: response.reply.message,
        data: response.reply.data,
      });

    } catch (error) {
      console.error('Failed to send message:', error);
      
      toast({
        title: "Connection Error",
        description: isOnline 
          ? "Failed to send message. Please try again." 
          : "You're offline. Please check your connection.",
        variant: "destructive",
      });

      addMessage({
        type: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, isOnline]);

  const sendMessage = useCallback(async (content: string, context?: object) => {
    if (useSSE && openaiKey) {
      sendMessageSSE(content, context);
    } else {
      await sendMessageREST(content, context);
    }
  }, [useSSE, openaiKey, sendMessageSSE, sendMessageREST]);

  const toggleSSE = useCallback((enabled: boolean) => {
    setUseSSE(enabled);
    localStorage.setItem('moovio-use-sse', enabled.toString());
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  // Monitor online status
  useState(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  return {
    messages,
    isLoading,
    isOnline,
    useSSE,
    sendMessage,
    clearChat,
    addMessage,
    toggleSSE,
  };
};
