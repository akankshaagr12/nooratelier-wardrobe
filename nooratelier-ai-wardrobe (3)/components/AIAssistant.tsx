
import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useWardrobe } from '../contexts/WardrobeContext';
import { getAIStyleAdvice } from '../services/geminiService';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const AIAssistant: React.FC = () => {
    const { user } = useUser();
    const { items } = useWardrobe();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: `Hi ${user.name || 'there'}! 👋 I'm Noor, your AI style assistant. Ask me anything about fashion, outfit ideas, or how to style your wardrobe items!`,
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: `user_${Date.now()}`,
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const wardrobeContext = items.slice(0, 10).map(item => `${item.name} (${item.category})`).join(', ');
            const userContext = `User: ${user.name}, Body: ${user.measurements.bodyShape}, Skin tone: ${user.colorPreferences.skinTone}`;

            const response = await getAIStyleAdvice(input, userContext, wardrobeContext);

            const assistantMessage: Message = {
                id: `assistant_${Date.now()}`,
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: `error_${Date.now()}`,
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again in a moment! 💫",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Chat Bubble Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-40 size-16 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center transition-all duration-300 hover:scale-110 ${isOpen ? 'rotate-0' : 'animate-bounce'}`}
            >
                <span className="material-symbols-outlined text-2xl">
                    {isOpen ? 'close' : 'auto_awesome'}
                </span>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white dark:bg-background-dark rounded-[2rem] shadow-2xl border border-soft-pink dark:border-white/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="bg-primary px-6 py-4 flex items-center gap-4">
                        <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white">auto_awesome</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-bold">Noor AI</h3>
                            <p className="text-white/70 text-xs">Your personal style assistant</p>
                        </div>
                        <div className="size-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map(message => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                            ? 'bg-primary text-white rounded-br-sm'
                                            : 'bg-soft-pink/50 dark:bg-white/10 text-deep-text dark:text-white rounded-bl-sm'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                    <p className={`text-[10px] mt-1 ${message.role === 'user' ? 'text-white/60' : 'text-muted-text dark:text-white/40'}`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-soft-pink/50 dark:bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                                    <div className="flex gap-1">
                                        <div className="size-2 bg-muted-text/40 rounded-full animate-bounce"></div>
                                        <div className="size-2 bg-muted-text/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="size-2 bg-muted-text/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-soft-pink dark:border-white/10">
                        <div className="flex gap-2">
                            <input
                                className="flex-1 bg-soft-pink/30 dark:bg-white/5 border-none rounded-full px-5 py-3 text-sm text-deep-text dark:text-white focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-muted-text/40"
                                placeholder="Ask about outfit ideas..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={isLoading || !input.trim()}
                                className="size-12 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIAssistant;
