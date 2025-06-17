
import { useCallback, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useSendMessageSSE = ({
    setMessages,
    setIsLoading,
    openaiKey,
}: {
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    openaiKey: string;
}) => {
    const bufferRef = useRef('');
    const esRef = useRef<EventSource | null>(null);

    const isBalanced = (txt: string) => {
        const openPar = (txt.match(/\(/g) ?? []).length;
        const closePar = (txt.match(/\)/g) ?? []).length;
        const openBrk = (txt.match(/\[/g) ?? []).length;
        const closeBrk = (txt.match(/\]/g) ?? []).length;
        return openPar === closePar && openBrk === closeBrk;
    };

    const sendMessageSSE = useCallback(async (content: string, context?: object) => {
        if (!content.trim()) return;

        bufferRef.current = '';

        // Add user message
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Step 1: Initialize SSE session with POST
            const userPreferences = localStorage.getItem('user-preferences');
            const preferences = userPreferences ? JSON.parse(userPreferences) : null;

            await fetch(`${API_BASE_URL}/assistant/sse-init`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    message: content.trim(),
                    openaiApiKey: openaiKey,
                    context: {
                        ...context,
                        preferences,
                    }
                }),
            });

            // Step 2: Start SSE connection
            const es = new EventSource(`${API_BASE_URL}/assistant/sse`, {
                withCredentials: true,
            });
            esRef.current = es;

            es.addEventListener('assistant', (e: MessageEvent) => {
                const raw = e.data;
                if (raw === '[DONE]') {
                    es.close();
                    setIsLoading(false);
                    return;
                }

                let token = '';
                try {
                    token = JSON.parse(raw).choices?.[0]?.delta?.content ?? '';
                } catch {
                    return;
                }
                if (!token) return;

                bufferRef.current += token;
                if (!isBalanced(bufferRef.current)) return;

                const content = bufferRef.current;

                setMessages(prev => {
                    const last = prev.at(-1);
                    if (!last || last.type !== 'assistant') {
                        return [...prev, {
                            id: Date.now().toString(),
                            type: 'assistant',
                            content: content,
                            timestamp: new Date(),
                        }];
                    }
                    return [...prev.slice(0, -1), { ...last, content: content }];
                });
            });

            es.addEventListener('suggestions', (e: MessageEvent) => {
                try {
                    const data = JSON.parse(e.data);
                    if (data.suggestions) {
                        setMessages(prev => {
                            const last = prev.at(-1);
                            if (last && last.type === 'assistant') {
                                return [...prev.slice(0, -1), { 
                                    ...last, 
                                    data: { 
                                        ...last.data, 
                                        suggestions: data.suggestions 
                                    } 
                                }];
                            }
                            return prev;
                        });
                    }
                } catch (err) {
                    console.error('[SSE] Erro ao interpretar sugestões:', err, e.data);
                }
            });

            es.addEventListener('movies', (e: MessageEvent) => {
                try {
                    const data = JSON.parse(e.data);
                    if (data.movies) {
                        setMessages(prev => {
                            const last = prev.at(-1);
                            if (last && last.type === 'assistant') {
                                return [...prev.slice(0, -1), { 
                                    ...last, 
                                    data: { 
                                        ...last.data, 
                                        movies: data.movies,
                                        recommendationReason: data.recommendationReason
                                    } 
                                }];
                            }
                            return prev;
                        });
                    }
                } catch (err) {
                    console.error('[SSE] Erro ao interpretar movies:', err, e.data);
                }
            });

            es.onerror = err => {
                console.error('[SSE] erro =>', err);
                es.close();
                setIsLoading(false);
                setMessages(prev => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        type: 'assistant',
                        content: 'Erro de conexão. Tente novamente.',
                        timestamp: new Date(),
                    },
                ]);
            };

        } catch (error) {
            console.error('Failed to initialize SSE session:', error);
            setIsLoading(false);
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    type: 'assistant',
                    content: 'Erro ao inicializar conexão SSE. Tente novamente.',
                    timestamp: new Date(),
                },
            ]);
        }
    }, [setMessages, setIsLoading, openaiKey]);

    useEffect(() => {
        return () => {
            if (esRef.current) {
                esRef.current.close();
            }
        };
    }, []);

    return sendMessageSSE;
};
