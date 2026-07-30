import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Activity, ShieldAlert, Wrench, Leaf, TrendingUp, BarChart3, BrainCircuit, ArrowRight, Bot } from 'lucide-react';

const ALL_AGENTS = {
  'energy-intelligence': {
    name: 'Energy Intelligence Agent',
    subtitle: 'Analyze usage, bills, appliances & savings',
    icon: Zap,
    color: 'text-primary',
    bg: 'bg-primary/20',
    border: 'border-primary/30',
    glow: 'shadow-[0_0_20px_rgba(37,99,235,0.2)]',
    roles: ['consumer'],
    capabilities: ['Daily & monthly usage analysis', 'Bill explanation & prediction', 'Appliance-wise consumption', 'Personalized saving tips'],
  },
  'grid-operations': {
    name: 'Grid Operations Intelligence Agent',
    subtitle: 'Monitor transformers, voltage & load',
    icon: Activity,
    color: 'text-danger',
    bg: 'bg-danger/20',
    border: 'border-danger/30',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]',
    roles: ['grid_operator'],
    capabilities: ['Live transformer health', 'Voltage & current monitoring', 'Feeder status', 'Load balancing recommendations'],
  },
  'anomaly-detection': {
    name: 'Anomaly Detection Agent',
    subtitle: 'Detect theft, tampering & abnormal behavior',
    icon: ShieldAlert,
    color: 'text-orange-400',
    bg: 'bg-orange-400/20',
    border: 'border-orange-400/30',
    glow: 'shadow-[0_0_20px_rgba(251,146,60,0.2)]',
    roles: ['eb_officer'],
    capabilities: ['Abnormal consumption detection', 'Electricity theft indicators', 'Meter tampering alerts', 'Faulty IoT sensor detection'],
  },
  'predictive-maintenance': {
    name: 'Predictive Maintenance Agent',
    subtitle: 'Predict failures before they occur',
    icon: Wrench,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/20',
    border: 'border-yellow-400/30',
    glow: 'shadow-[0_0_20px_rgba(250,204,21,0.2)]',
    roles: ['grid_operator'],
    capabilities: ['Transformer failure prediction', 'Health score calculation', 'Maintenance scheduling', 'Temperature & load analysis'],
  },
  'carbon-analytics': {
    name: 'Carbon Analytics Agent',
    subtitle: 'CO₂ emissions & sustainability reports',
    icon: Leaf,
    color: 'text-success',
    bg: 'bg-success/20',
    border: 'border-success/30',
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.2)]',
    roles: ['eb_officer'],
    capabilities: ['CO₂ emission estimation', 'Renewable energy tracking', 'Monthly emission comparison', 'Sustainability reports'],
  },
  'demand-forecasting': {
    name: 'Demand Forecasting Agent',
    subtitle: 'Predict hourly, daily & monthly demand',
    icon: TrendingUp,
    color: 'text-purple-400',
    bg: 'bg-purple-400/20',
    border: 'border-purple-400/30',
    glow: 'shadow-[0_0_20px_rgba(192,132,252,0.2)]',
    roles: ['eb_officer', 'grid_operator'],
    capabilities: ['Hourly & daily forecasts', 'Peak hour prediction', 'Transformer load forecast', 'Town energy demand forecast'],
  },
  'smart-decision': {
    name: 'Smart Decision Support Agent',
    subtitle: 'Town-wide analysis & AI recommendations',
    icon: BarChart3,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/20',
    border: 'border-cyan-400/30',
    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.2)]',
    roles: ['eb_officer'],
    capabilities: ['Town energy analysis', 'High-demand area identification', 'Load redistribution advice', 'Resource allocation recommendations'],
  },
  'role-assistant': {
    name: 'Role-Based AI Assistant',
    subtitle: 'Intelligent role-aware conversations',
    icon: BrainCircuit,
    color: 'text-accent',
    bg: 'bg-accent/20',
    border: 'border-accent/30',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    roles: ['consumer', 'eb_officer', 'grid_operator'],
    capabilities: ['Role-aware responses', 'General energy queries', 'Smart Town information', 'Guided assistance'],
  },
};

const ROLE_LABELS = {
  consumer: 'Consumer',
  eb_officer: 'EB Officer',
  grid_operator: 'Grid Operator',
};

const AIAssistant = () => {
  const [role, setRole] = useState('eb_officer');
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setRole(u.role || 'eb_officer');
      } catch (_) {}
    }
  }, []);

  const myAgents = Object.entries(ALL_AGENTS).filter(([, a]) => a.roles.includes(role));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Bot className="w-8 h-8 text-accent" /> Multi-Agent AI System
          </h1>
          <p className="text-gray-400">
            Select an AI agent below to open its dedicated chat. Each agent is specialized for your role as a <span className="text-white font-medium">{ROLE_LABELS[role]}</span>.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-accent/30">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-accent text-sm font-medium">{myAgents.length} Agents Available</span>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {myAgents.map(([agentId, agent], idx) => {
          const AgentIcon = agent.icon;
          return (
            <motion.div
              key={agentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              onClick={() => navigate(`/dashboard/agents/${agentId}`)}
              className={`glass p-6 rounded-2xl border ${agent.border} cursor-pointer hover:bg-white/5 transition-all duration-300 group ${agent.glow} hover:scale-[1.02]`}
            >
              {/* Icon + Name */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${agent.bg} border ${agent.border}`}>
                  <AgentIcon className={`w-6 h-6 ${agent.color}`} />
                </div>
                <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors`}>
                  <ArrowRight className={`w-4 h-4 ${agent.color} group-hover:translate-x-0.5 transition-transform`} />
                </div>
              </div>

              <h3 className="text-white font-bold text-base mb-1 leading-tight">{agent.name}</h3>
              <p className={`text-xs ${agent.color} mb-4`}>{agent.subtitle}</p>

              {/* Capabilities */}
              <ul className="space-y-1.5">
                {agent.capabilities.map((cap, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                    <div className={`w-1.5 h-1.5 rounded-full ${agent.bg} border ${agent.border} shrink-0`} />
                    {cap}
                  </li>
                ))}
              </ul>

              {/* Open Chat button */}
              <div className={`mt-5 pt-4 border-t border-white/10 flex items-center justify-between`}>
                <span className="text-xs text-gray-500">Click to open chat</span>
                <span className={`text-xs font-semibold ${agent.color} flex items-center gap-1`}>
                  Open Chat <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AIAssistant;
