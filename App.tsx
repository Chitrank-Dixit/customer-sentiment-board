
import React, { useState, useCallback } from 'react';
// Fix: Import GoogleGenAI class for instantiation and Chat for type annotation.
import { GoogleGenAI, type Chat } from '@google/genai';
import ReviewInput from './components/ReviewInput';
import Dashboard from './components/Dashboard';
import ChatComponent from './components/Chat';
import { analyzeReviews, generateExecutiveSummary } from './services/geminiService';
import type { AnalysisResult, ChatMessage } from './types';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [reviewsText, setReviewsText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const handleAnalyze = useCallback(async () => {
    if (!reviewsText.trim()) {
      setError('Please paste some reviews before analyzing.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setChatHistory([]);
    setChatSession(null);

    try {
      // These can run in parallel
      const [summary, structuredData] = await Promise.all([
        generateExecutiveSummary(reviewsText),
        analyzeReviews(reviewsText),
      ]);
      
      const result: AnalysisResult = { ...structuredData, summary };
      setAnalysisResult(result);
      
      // Initialize chat with context
      // Fix: Instantiate GoogleGenAI directly from the import.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const initialChatHistory = [
        {
          role: 'user',
          parts: [{ text: `Here are the customer reviews I'm analyzing:\n\n${reviewsText}` }],
        },
        {
          role: 'model',
          parts: [{ text: `Understood. I have analyzed the reviews. The sentiment trend data, keywords, and an executive summary have been generated. The summary is: "${summary}". I am ready to answer your questions about this data.` }],
        },
      ];
      
      const newChatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: initialChatHistory,
      });
      setChatSession(newChatSession);
      setChatHistory(initialChatHistory);

    } catch (e: unknown) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred during analysis.');
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [reviewsText]);
  
  const handleSendMessage = useCallback(async (message: string) => {
    if (!chatSession || isChatLoading) return;
    
    setIsChatLoading(true);

    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: message }],
    };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      const result = await chatSession.sendMessage(message);
      const modelResponse = result.text;
      const modelMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: modelResponse }],
      };
      setChatHistory(prev => [...prev, modelMessage]);
    } catch (e) {
      console.error("Chat error:", e);
      const errorMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: 'Sorry, I encountered an error. Please try again.' }],
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  }, [chatSession, isChatLoading]);

  return (
    <div className="min-h-screen flex flex-col antialiased">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <LogoIcon />
              <h1 className="text-xl font-bold text-slate-100">Customer Sentiment Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          <div className="lg:col-span-4 xl:col-span-3">
            <ReviewInput
              reviewsText={reviewsText}
              setReviewsText={setReviewsText}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <Dashboard 
              result={analysisResult} 
              isLoading={isLoading}
              error={error}
            />
            {analysisResult && !isLoading && (
              <ChatComponent 
                history={chatHistory} 
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading} 
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
