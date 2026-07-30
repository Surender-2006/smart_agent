import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Activity, ShieldCheck, Leaf, TrendingUp,
  Wifi, FileText, Settings, LogOut, Zap, ChevronDown, ChevronUp,
  BrainCircuit, ShieldAlert, Wrench, BarChart3, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Pages per role
const PAGE_NAV = {
  consumer: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ],
  eb_officer: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/energy', label: 'Energy Monitoring', icon: Activity },
    { path: '/dashboard/carbon', label: 'Carbon Analytics', icon: Leaf },
    { path: '/dashboard/iot', label: 'IoT Devices', icon: Wifi },
    { path: '/dashboard/reports', label: 'Reports', icon: FileText },
  ],
  grid_operator: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/energy', label: 'Energy Monitoring', icon: Activity },
    { path: '/dashboard/fault', label: 'Fault Detection', icon: ShieldCheck },
    { path: '/dashboard/predictions', label: 'Predictions', icon: TrendingUp },
    { path: '/dashboard/iot', label: 'IoT Devices', icon: Wifi },
  ],
};

// Agents per role — each gets its own chat page
const AGENT_NAV = {
  consumer: [
    { agentId: 'energy-intelligence', label: 'Energy Intelligence', icon: Zap, color: 'text-primary' },
    { agentId: 'role-assistant', label: 'AI Assistant', icon: BrainCircuit, color: 'text-accent' },
  ],
  eb_officer: [
    { agentId: 'anomaly-detection', label: 'Anomaly Detection', icon: ShieldAlert, color: 'text-orange-400' },
    { agentId: 'carbon-analytics', label: 'Carbon Analytics', icon: Leaf, color: 'text-success' },
    { agentId: 'demand-forecasting', label: 'Demand Forecasting', icon: TrendingUp, color: 'text-purple-400' },
    { agentId: 'smart-decision', label: 'Smart Decision', icon: BarChart3, color: 'text-cyan-400' },
    { agentId: 'role-assistant', label: 'AI Assistant', icon: BrainCircuit, color: 'text-accent' },
  ],
  grid_operator: [
    { agentId: 'grid-operations', label: 'Grid Operations', icon: Activity, color: 'text-danger' },
    { agentId: 'predictive-maintenance', label: 'Predictive Maint.', icon: Wrench, color: 'text-yellow-400' },
    { agentId: 'demand-forecasting', label: 'Demand Forecasting', icon: TrendingUp, color: 'text-purple-400' },
    { agentId: 'role-assistant', label: 'AI Assistant', icon: BrainCircuit, color: 'text-accent' },
  ],
};

const NavItem = ({ path, label, icon: Icon, end }) => (
  <NavLink
    to={path}
    end={end}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${
        isActive
          ? 'bg-primary/20 text-primary border border-primary/30'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-white'}`} />
        <span className="font-medium text-sm truncate">{label}</span>
        {isActive && <motion.div layoutId="page-indicator" className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />}
      </>
    )}
  </NavLink>
);

const AgentNavItem = ({ agentId, label, icon: Icon, color }) => (
  <NavLink
    to={`/dashboard/agents/${agentId}`}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${
        isActive
          ? `bg-white/10 border border-white/20`
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <Icon className={`w-4 h-4 shrink-0 ${isActive ? color : 'text-gray-500 group-hover:' + color}`} />
        <span className={`font-medium text-sm truncate ${isActive ? 'text-white' : ''}`}>{label}</span>
        {isActive && <motion.div layoutId="agent-indicator" className="absolute left-0 w-1 h-5 bg-accent rounded-r-full" />}
      </>
    )}
  </NavLink>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('eb_officer');
  const [agentsOpen, setAgentsOpen] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setRole(u.role || 'eb_officer');
      } catch (e) {}
    }
  }, []);

  const pages = PAGE_NAV[role] || PAGE_NAV.eb_officer;
  const agents = AGENT_NAV[role] || [];

  return (
    <div className="w-64 h-full glass rounded-none border-t-0 border-l-0 border-b-0 flex flex-col z-20">
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        className="p-5 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
      >
        <Zap className="w-7 h-7 text-primary animate-energy-pulse" />
        <span className="text-xl font-bold text-white tracking-wider">EcoGrid <span className="text-accent">AI</span></span>
      </div>

      <div className="flex-1 overflow-y-auto py-2 flex flex-col px-3 gap-0.5">
        {/* Pages section */}
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-4 py-2">Pages</p>
        {pages.map(item => (
          <NavItem key={item.path} {...item} end={item.path === '/dashboard'} />
        ))}

        {/* AI Agents section */}
        <button
          onClick={() => setAgentsOpen(o => !o)}
          className="flex items-center justify-between px-4 py-2 mt-3 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <p className="text-[10px] font-semibold uppercase tracking-widest">AI Agents</p>
          </div>
          {agentsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <AnimatePresence>
          {agentsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden flex flex-col gap-0.5"
            >
              {agents.map(agent => (
                <AgentNavItem key={agent.agentId} {...agent} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom */}
      <div className="p-3 border-t border-white/10 flex flex-col gap-1 shrink-0">
        <button
          onClick={() => navigate('/dashboard/settings')}
          className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <Settings className="w-4 h-4" />
          <span className="font-medium text-sm">Settings</span>
        </button>
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-3 px-4 py-2 text-danger hover:bg-danger/10 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
