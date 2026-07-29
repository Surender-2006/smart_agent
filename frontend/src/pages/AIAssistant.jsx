import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, BrainCircuit, Activity, Zap, Leaf } from 'lucide-react';
import axios from 'axios';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      type: 'orchestrator',
      text: 'Hello! I am the AI Grid Intelligence Agent. I can provide insights on energy usage, detect faults, and optimize your grid. How can I assist you today?',
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [role, setRole] = useState('eb_officer');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        const userRole = u.role || 'eb_officer';
        setRole(userRole);
        
        let welcomeText = 'Hello! I am the AI Grid Intelligence Agent. I can provide insights on energy usage, detect faults, and optimize your grid. How can I assist you today?';
        if (userRole === 'consumer') {
          welcomeText = 'Hello! I am your AI Home Energy Coach. I can provide insights on your personal household energy usage, connection status, monthly bills, and customized saving tips. How can I assist you today?';
        } else if (userRole === 'grid_operator') {
          welcomeText = 'Hello! I am the AI Grid Operations Assistant. I can provide transformer performance checks, overload diagnostics, feeder statuses, and load balancing suggestions. How can I assist you today?';
        }
        
        setMessages([
          {
            id: 1,
            sender: 'ai',
            type: 'orchestrator',
            text: welcomeText,
          }
        ]);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessageText = input;
    const newMsg = { id: Date.now(), sender: 'user', text: userMessageText };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('/api/ai/chat', { message: userMessageText, role });
      setMessages((prev) => [
        ...prev,
        {
          id: response.data.id,
          sender: 'ai',
          type: response.data.type,
          text: response.data.text
        }
      ]);
    } catch (err) {
      console.error('Error communicating with AI agent:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          type: 'orchestrator',
          text: 'Sorry, I encountered an error communicating with the backend. Please check your connection.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const agentConfig = {
    orchestrator: { icon: BrainCircuit, color: 'text-accent', bg: 'bg-accent/20', name: 'AI Grid Intelligence Agent' },
    energy: { icon: Zap, color: 'text-primary', bg: 'bg-primary/20', name: 'Energy Monitoring Agent' },
    fault: { icon: Activity, color: 'text-danger', bg: 'bg-danger/20', name: 'Fault Detection Agent' },
    carbon: { icon: Leaf, color: 'text-success', bg: 'bg-success/20', name: 'Carbon Footprint Agent' },
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Left Panel: Workflow / History */}
      <div className="w-1/3 hidden lg:flex flex-col gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-6 rounded-2xl flex-1 flex flex-col"
        >
          <h3 className="text-lg font-bold text-white mb-6">Multi-Agent Workflow</h3>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* Simple Animated Workflow visualization */}
            <div className="w-full flex justify-center mb-8">
              <div className="p-4 rounded-full bg-accent/20 border border-accent/50 animate-pulse z-10">
                <BrainCircuit className="w-8 h-8 text-accent" />
              </div>
            </div>
            
            {/* Connecting lines */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[80%] w-px h-16 bg-gradient-to-b from-accent to-transparent z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-48 h-px bg-white/20 z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-[6rem] h-8 w-px bg-white/20 z-0" />
            <div className="absolute top-1/2 left-1/2 translate-x-[6rem] h-8 w-px bg-white/20 z-0" />
            
            <div className="w-full flex justify-between px-8 mt-12 z-10">
               <div className="p-3 rounded-full bg-primary/20 border border-primary/50">
                  <Zap className="w-5 h-5 text-primary" />
               </div>
               <div className="p-3 rounded-full bg-danger/20 border border-danger/50">
                  <Activity className="w-5 h-5 text-danger" />
               </div>
               <div className="p-3 rounded-full bg-success/20 border border-success/50">
                  <Leaf className="w-5 h-5 text-success" />
               </div>
            </div>
            <p className="text-gray-400 text-sm mt-12 text-center">
              The AI Grid Intelligence Agent delegates tasks to specialized AI agents in real-time.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Panel: Chat Interface */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 glass rounded-2xl flex flex-col overflow-hidden"
      >
        <div className="p-4 border-b border-white/10 bg-white/5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-accent" /> EcoGrid AI Assistant
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.sender === 'user' ? (
                  <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                ) : (
                  <div className={`w-8 h-8 rounded-full ${agentConfig[msg.type].bg} flex items-center justify-center shrink-0`}>
                    {React.createElement(agentConfig[msg.type].icon, { className: `w-4 h-4 ${agentConfig[msg.type].color}` })}
                  </div>
                )}
                
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.sender === 'ai' && (
                    <span className={`text-xs mb-1 font-medium ${agentConfig[msg.type].color}`}>
                      {agentConfig[msg.type].name}
                    </span>
                  )}
                  <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-sm' 
                      : 'bg-white/10 text-gray-200 border border-white/5 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="flex gap-3 max-w-[80%]">
                 <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-accent" />
                 </div>
                 <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/5 rounded-tl-sm flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                 </div>
               </div>
             </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-white/5">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
              {(role === 'consumer' ? [
                'What is my electricity usage today?',
                'Show my monthly electricity bill.',
                'How can I reduce my electricity bill?',
                'Show my appliance energy consumption.',
                'Is there a scheduled power outage in my area?',
                'Give me personalized energy-saving tips.'
              ] : role === 'grid_operator' ? [
                'Check all transformers',
                'Show overloaded transformers',
                'Detect transformer faults',
                'Predict evening peak demand',
                'Suggest load redistribution',
                'Show live grid status'
              ] : [
                "Show today's town energy consumption",
                'Which zone consumed the most electricity?',
                'Show transformer performance',
                'Show total active consumers',
                'Show carbon reduction statistics',
                'Which transformer requires maintenance?'
              ]).map((prompt, idx) => (
               <button 
                  key={idx} 
                  onClick={() => setInput(prompt)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 whitespace-nowrap transition-colors"
               >
                 {prompt}
               </button>
             ))}
           </div>
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the EcoGrid AI anything..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-3 bg-accent hover:bg-cyan-500 text-black rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AIAssistant;
