
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon, UserIcon, BotIcon } from './icons';

interface ChatProps {
  history: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatComponent: React.FC<ChatProps> = ({ history, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="mt-8 bg-slate-800 rounded-lg shadow-lg flex flex-col max-h-[600px]">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100">Ask Follow-up Questions</h3>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-6">
          {history.slice(2).map((msg, index) => ( // Slice to hide initial context prompts
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && <BotIcon className="w-8 h-8 flex-shrink-0 text-indigo-400" />}
              <div className={`p-3 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                 <p className="text-sm">{msg.parts[0].text}</p>
              </div>
              {msg.role === 'user' && <UserIcon className="w-8 h-8 flex-shrink-0 text-slate-400" />}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
                <BotIcon className="w-8 h-8 flex-shrink-0 text-indigo-400" />
                <div className="p-3 rounded-lg bg-slate-700 text-slate-200 rounded-bl-none">
                    <div className="flex items-center space-x-2">
                        <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-slate-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Which complaint is most common?"
            className="w-full bg-slate-900 border border-slate-600 rounded-full py-2 pl-4 pr-12 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 p-2 rounded-full text-white hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
