import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { generateAIAdvisorResponse, ChatMessage } from '../../services/aiAdvisorService';
import { CARS_DATA } from '../../data/cars';
import { Bot, X, Send, Sparkles, Car, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIAdvisorDrawer: React.FC = () => {
  const { isAIAdvisorOpen, setIsAIAdvisorOpen, userProfile } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: `Hello! I am your **DriveIQ Autonomous AI Advisor**. I analyze vehicle specs, fuel economics, safety ratings, and resale data to give you factual car buying guidance.\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  if (!isAIAdvisorOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate AI response
    setTimeout(() => {
      const { responseText, suggestedCarIds } = generateAIAdvisorResponse(query, userProfile);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedCars: suggestedCarIds
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 400);
  };

  const samplePrompts = [
    'Best automatic SUV under ₹15 Lakhs?',
    'Creta vs Seltos comparison',
    'Is EV worth it for 1,500 km/month?',
    'Which variant has ADAS and sunroof?'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  DriveIQ AI Advisor
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ONLINE
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Context-Aware Automotive Engine</p>
              </div>
            </div>
            <button
              onClick={() => setIsAIAdvisorOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none shadow-lg shadow-cyan-900/30'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none shadow-md'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Suggested Car Cards */}
                {msg.suggestedCars && msg.suggestedCars.length > 0 && (
                  <div className="mt-3 w-full space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      Suggested Vehicles:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.suggestedCars.map(carId => {
                        const car = CARS_DATA.find(c => c.id === carId);
                        if (!car) return null;

                        return (
                          <div
                            key={car.id}
                            onClick={() => {
                              setIsAIAdvisorOpen(false);
                              navigate(`/cars/${car.id}`);
                            }}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <img src={car.image} alt={car.name} className="w-10 h-8 rounded object-cover" />
                              <div>
                                <h5 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                                  {car.name}
                                </h5>
                                <p className="text-[10px] text-slate-400">
                                  ₹{car.startingPriceLakhs}L – ₹{car.maxPriceLakhs}L • {car.ncapRating}-Star Safety
                                </p>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
          </div>

          {/* Quick Prompts Ticker */}
          <div className="p-2 bg-slate-950/40 border-t border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-800 text-cyan-300 hover:bg-slate-700 whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask AI Advisor about cars, specs, fuel costs..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold transition-all shadow-lg shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
