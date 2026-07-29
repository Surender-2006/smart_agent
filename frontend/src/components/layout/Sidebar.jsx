import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Leaf, 
  TrendingUp, 
  Wifi, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/energy', label: 'Energy Monitoring', icon: Activity },
  { path: '/dashboard/fault', label: 'Fault Detection', icon: ShieldCheck },
  { path: '/dashboard/carbon', label: 'Carbon Analytics', icon: Leaf },
  { path: '/dashboard/predictions', label: 'Predictions', icon: TrendingUp },
  { path: '/dashboard/iot', label: 'IoT Devices', icon: Wifi },
  { path: '/dashboard/reports', label: 'Reports', icon: FileText },
  { path: '/dashboard/ai-assistant', label: 'AI Assistant', icon: MessageSquare },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('eb_officer');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setRole(u.role || 'eb_officer');
      } catch (e) {
        console.error('Error parsing user in Sidebar:', e);
      }
    }
  }, []);

  const filteredNavItems = navItems.filter(item => {
    if (role === 'consumer') {
      return item.path === '/dashboard' || item.path === '/dashboard/ai-assistant';
    }
    if (role === 'grid_operator') {
      return item.path !== '/dashboard/reports' && item.path !== '/dashboard/carbon';
    }
    if (role === 'eb_officer') {
      return item.path !== '/dashboard/fault' && item.path !== '/dashboard/predictions';
    }
    return true;
  });

  return (
    <div className="w-64 h-full glass rounded-none border-t-0 border-l-0 border-b-0 flex flex-col z-20">
      <div 
        onClick={() => navigate('/')} 
        className="p-6 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <Zap className="w-8 h-8 text-primary animate-energy-pulse" />
        <span className="text-xl font-bold text-white tracking-wider">EcoGrid <span className="text-accent">AI</span></span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(37,99,235,0.15)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-white'}`} />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <motion.div layoutId="active-indicator" className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/10 flex flex-col gap-2">
        <button 
          onClick={() => navigate('/dashboard/settings')}
          className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </button>
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-3 px-4 py-2 text-danger hover:bg-danger/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
