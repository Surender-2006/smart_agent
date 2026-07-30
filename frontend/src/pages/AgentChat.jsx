import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Bot, User, ArrowLeft, Zap, Activity, ShieldAlert, Wrench, Leaf, TrendingUp, BarChart3, BrainCircuit } from 'lucide-react';
import axios from 'axios';

const AGENT_CONFIG = {
  'energy-intelligence': {
    name: 'Energy Intelligence Agent',
    subtitle: 'Personal energy usage, bills & savings',
    icon: Zap,
    color: 'text-primary',
    bg: 'bg-primary/20',
    border: 'border-primary/30',
    roles: ['consumer'],
    welcome: 'Hello! I am your Energy Intelligence Agent. I can analyze your electricity usage, explain your bills, predict next month\'s cost, and give personalized saving tips.',
    queries: [
      'What is my electricity usage today?',
      'Show my monthly electricity bill.',
      'Which appliance uses the most electricity?',
      'Predict my next month bill.',
      'Compare my monthly usage.',
      'Give me energy-saving tips.',
    ],
  },
  'grid-operations': {
    name: 'Grid Operations Intelligence Agent',
    subtitle: 'Transformer health, voltage & load monitoring',
    icon: Activity,
    color: 'text-danger',
    bg: 'bg-danger/20',
    border: 'border-danger/30',
    roles: ['grid_operator'],
    welcome: 'Hello, Grid Operator! I am the Grid Operations Intelligence Agent. I monitor transformer health, voltage levels, feeder status, and recommend load balancing actions.',
    queries: [
      'Check all transformers.',
      'Show voltage fluctuations.',
      'Show feeder status.',
      'Suggest load balancing.',
      'Show live grid status.',
      'Check power quality.',
    ],
  },
  'anomaly-detection': {
    name: 'Anomaly Detection Agent',
    subtitle: 'Detect theft, tampering & abnormal behavior',
    icon: ShieldAlert,
    color: 'text-orange-400',
    bg: 'bg-orange-400/20',
    border: 'border-orange-400/30',
    roles: ['eb_officer'],
    welcome: 'Hello, EB Officer! I am the Anomaly Detection Agent. I detect abnormal energy consumption, possible electricity theft, meter tampering, and faulty IoT sensors.',
    queries: [
      'Detect possible electricity theft.',
      'Show abnormal consumption patterns.',
      'Check faulty smart meters.',
      'Detect transformer anomalies.',
      'Show full anomaly report.',
    ],
  },
  'predictive-maintenance': {
    name: 'Predictive Maintenance Agent',
    subtitle: 'Predict failures & maintenance schedules',
    icon: Wrench,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/20',
    border: 'border-yellow-400/30',
    roles: ['grid_operator'],
    welcome: 'Hello, Grid Operator! I am the Predictive Maintenance Agent. I predict transformer failures, calculate health scores, and recommend preventive maintenance schedules.',
    queries: [
      'Predict transformer failure.',
      'Show all transformer health scores.',
      'Show maintenance schedule.',
      'Analyze transformer temperatures.',
      'Check Transformer C health.',
    ],
  },
  'carbon-analytics': {
    name: 'Carbon Analytics Agent',
    subtitle: 'CO₂ emissions, renewable energy & sustainability',
    icon: Leaf,
    color: 'text-success',
    bg: 'bg-success/20',
    border: 'border-success/30',
    roles: ['eb_officer'],
    welcome: 'Hello, EB Officer! I am the Carbon Analytics Agent. I estimate CO₂ emissions, track renewable energy contribution, and generate sustainability reports for the town.',
    queries: [
      'Show CO₂ emissions.',
      'Show renewable energy contribution.',
      'Generate sustainability report.',
      'Compare monthly emissions.',
      'Show zone-wise carbon emissions.',
    ],
  },
  'demand-forecasting': {
    name: 'Demand Forecasting Agent',
    subtitle: 'Predict hourly, daily & monthly demand',
    icon: TrendingUp,
    color: 'text-purple-400',
    bg: 'bg-purple-400/20',
    border: 'border-purple-400/30',
    roles: ['eb_officer', 'grid_operator'],
    welcome: 'Hello! I am the Demand Forecasting Agent. I predict hourly, daily, weekly, and monthly electricity demand, forecast peak hours, and help plan grid capacity.',
    queries: [
      'Predict hourly demand.',
      'Predict weekly demand.',
      'Predict monthly demand.',
      'Predict peak hours.',
      'Forecast transformer load.',
      'Forecast town energy demand.',
    ],
  },
  'smart-decision': {
    name: 'Smart Decision Support Agent',
    subtitle: 'Town-wide analysis & operational recommendations',
    icon: BarChart3,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/20',
    border: 'border-cyan-400/30',
    roles: ['eb_officer'],
    welcome: 'Hello, EB Officer! I am the Smart Decision Support Agent. I analyze town-wide energy consumption, identify high-demand areas, and generate AI-based operational recommendations.',
    queries: [
      'Analyze town energy consumption.',
      'Identify high-demand areas.',
      'Recommend load redistribution.',
      'Recommend resource allocation.',
      'Generate operational recommendations.',
      'Show transformer utilization.',
    ],
  },
  'role-assistant': {
    name: 'Role-Based AI Assistant Agent',
    subtitle: 'Intelligent role-aware conversations',
    icon: BrainCircuit,
    color: 'text-accent',
    bg: 'bg-accent/20',
    border: 'border-accent/30',
    roles: ['consumer', 'eb_officer', 'grid_operator'],
    welcome: 'Hello! I am the Role-Based AI Assistant. I automatically adapt my responses based on your role — Consumer, EB Officer, or Grid Operator. Ask me anything!',
    queries: {
      consumer: ['Show my electricity bill.', 'Show my personal alerts.', 'Give me energy-saving tips.'],
      eb_officer: ['Show consumer statistics.', 'Show IoT device status.', 'Generate town energy report.'],
      grid_operator: ['Check all transformers.', 'Show live grid status.', 'Detect grid faults.'],
    },
  },
};

const AgentChat = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState('eb_officer');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const agent = AGENT_CONFIG[agentId];

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setRole(u.role || 'eb_officer');
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    if (!agent) return;
    setMessages([{
      id: 1,
      sender: 'ai',
      text: agent.welcome,
    }]);
  }, [agentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!agent) {
    return (
      <div className="flex items-center justify-center min-h-[400px] glass rounded-2xl">
        <p className="text-gray-400">Agent not found.</p>
      </div>
    );
  }

  // Role access check
  if (!agent.roles.includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center glass p-8 rounded-2xl">
        <ShieldAlert className="w-12 h-12 text-danger mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-gray-400">The <span className="text-white font-medium">{agent.name}</span> is not available for your role.</p>
        <button onClick={() => navigate('/dashboard/ai-assistant')} className="mt-6 px-5 py-2 bg-primary/20 text-primary border border-primary/30 rounded-xl hover:bg-primary/30 transition-all text-sm">
          Go to AI Assistant
        </button>
      </div>
    );
  }

  const suggestedQueries = Array.isArray(agent.queries)
    ? agent.queries
    : (agent.queries[role] || []);

  const handleSend = async (e, overrideText) => {
    if (e) e.preventDefault();
    const text = overrideText || input;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post('/api/ai/chat', { message: text, role });
      setMessages(prev => [...prev, { id: res.data.id || Date.now() + 1, sender: 'ai', text: res.data.text }]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: 'Unable to reach the agent. Please check your connection.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const AgentIcon = agent.icon;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-0">
      {/* Header */}
      <div className={`glass rounded-t-2xl px-6 py-4 border-b border-white/10 flex items-center gap-4`}>
        <button
          onClick={() => navigate('/dashboard/ai-assistant')}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className={`p-2.5 rounded-xl ${agent.bg} ${agent.border} border`}>
          <AgentIcon className={`w-5 h-5 ${agent.color}`} />
        </div>
        <div>
          <h2 className="text-white font-bold text-base leading-tight">{agent.name}</h2>
          <p className={`text-xs ${agent.color}`}>{agent.subtitle}</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/30 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-success text-xs font-medium">Active</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 glass rounded-none bg-white/[0.02]">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.sender === 'user' ? (
                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
              ) : (
                <div className={`w-8 h-8 rounded-full ${agent.bg} flex items-center justify-center shrink-0`}>
                  <AgentIcon className={`w-4 h-4 ${agent.color}`} />
                </div>
              )}
              <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.sender === 'ai' && (
                  <span className={`text-xs mb-1 font-medium ${agent.color}`}>{agent.name}</span>
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
            <div className="flex gap-3">
              <div className={`w-8 h-8 rounded-full ${agent.bg} flex items-center justify-center shrink-0`}>
                <AgentIcon className={`w-4 h-4 ${agent.color}`} />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/5 flex items-center gap-1">
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
      <div className="glass rounded-b-2xl px-6 py-4 border-t border-white/10">
        {/* Suggested queries */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          {suggestedQueries.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(null, q)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 whitespace-nowrap transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Ask ${agent.name}...`}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
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
    </div>
  );
};

export default AgentChat;
