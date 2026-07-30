// frontend/src/components/AgentPanel.jsx
// Reusable collapsible AI Agent panel — embeds into any page
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import axios from 'axios';

const AgentPanel = ({ agentName, agentColor = 'text-accent', agentBg = 'bg-accent/20', role, suggestedQueries = [], defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const ask = async (q) => {
    const text = q || query;
    if (!text.trim()) return;
    setQuery('');
    setLoading(true);
    setResponse('');
    try {
      const res = await axios.post('/api/ai/chat', { message: text, role });
      setResponse(res.data.text || '');
    } catch {
      setResponse('Unable to reach the AI agent. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl border border-white/10 overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${agentBg}`}>
            <Bot className={`w-4 h-4 ${agentColor}`} />
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">{agentName}</p>
            <p className={`text-xs ${agentColor}`}>AI Agent — Click to ask</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/10 pt-4 space-y-4">
              {/* Suggested queries */}
              {suggestedQueries.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {suggestedQueries.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => ask(q)}
                      className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition-colors whitespace-nowrap"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Response area */}
              {(loading || response) && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap max-h-72 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Sparkles className={`w-4 h-4 ${agentColor} animate-pulse`} />
                      <span>Agent is thinking...</span>
                    </div>
                  ) : response}
                </div>
              )}

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && ask()}
                  placeholder={`Ask ${agentName}...`}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                />
                <button
                  onClick={() => ask()}
                  disabled={!query.trim() || loading}
                  className="p-2.5 bg-accent hover:bg-cyan-500 text-black rounded-xl transition-all disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentPanel;
