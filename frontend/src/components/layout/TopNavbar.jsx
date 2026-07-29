import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, User, Settings, LogOut, X, ChevronRight, AlertTriangle, Zap, ShieldCheck, Cpu, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const notifications = [
  { id: 1, type: 'warning', title: 'High Load Alert', desc: 'Transformer B is operating at 92% capacity.', time: '2 mins ago', read: false },
  { id: 2, type: 'danger', title: 'Fault Detected', desc: 'Voltage fluctuation in Transformer C.', time: '15 mins ago', read: false },
  { id: 3, type: 'success', title: 'Optimization Applied', desc: 'Feeder line optimization applied — saving 12 kW/hr.', time: '1 hr ago', read: true },
  { id: 4, type: 'info', title: 'Weekly Report Ready', desc: 'Your energy analytics report is ready to download.', time: '3 hrs ago', read: true },
];

const TopNavbar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [notifList, setNotifList] = useState(notifications);

  const [currentUser, setCurrentUser] = useState({ 
    name: 'Admin User', 
    role: 'eb_officer', 
    email: 'admin@ecogrid.ai',
    displayRole: 'Grid Operations Manager'
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        let displayRole = 'Grid Operations Manager';
        if (u.role === 'consumer') displayRole = 'Residential Consumer';
        if (u.role === 'grid_operator') displayRole = 'Grid Operator';
        if (u.role === 'eb_officer') displayRole = 'Electricity Board Officer';
        
        setCurrentUser({
          name: u.name || 'Admin User',
          role: u.role || 'eb_officer',
          email: u.email || 'admin@ecogrid.ai',
          displayRole
        });
      } catch (e) {
        console.error('Error parsing user in TopNavbar:', e);
      }
    }
  }, []);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const notifRef = useRef(null);
  const adminRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (adminRef.current && !adminRef.current.contains(e.target)) setShowAdminMenu(false);
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) setShowResults(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (val) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(val)}`);
      setSearchResults(response.data);
      setShowResults(true);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const unreadCount = notifList.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifList(notifList.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="h-20 glass rounded-none border-t-0 border-l-0 border-r-0 border-b border-white/10 flex items-center justify-between px-6 z-10">
      
      {/* Global Search */}
      <div className="flex-1 max-w-xl relative animate-fadeIn" ref={searchContainerRef}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => { if (searchQuery) setShowResults(true); }}
            className="block w-full pl-10 pr-10 py-2 border border-white/10 rounded-full leading-5 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/10 sm:text-sm transition-all"
            placeholder="Search transformer, feeder, zone, outage, or report..."
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setSearchResults([]); }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {showResults && searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 mt-2 w-full bg-slate-900 border border-white/20 shadow-2xl rounded-2xl overflow-hidden z-50 max-h-96 overflow-y-auto"
            >
              <div className="p-3 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Search Results</span>
                <span className="text-xs text-gray-500">{searchResults.length} found</span>
              </div>
              <div className="divide-y divide-white/5">
                {searchResults.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-sm">
                    No results found for "{searchQuery}"
                  </div>
                ) : (
                  searchResults.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-white/5 transition-colors">
                      {item.type === 'building' && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-white flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                              {item.title}
                            </span>
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">Transformer</span>
                          </div>
                          <div className="space-y-2 mt-2 pl-4">
                            <div className="flex items-start gap-2 text-xs text-gray-300">
                              <Zap className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                              <div>
                                <span className="text-gray-400 font-medium">Current Usage:</span> {item.usage}
                              </div>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-gray-300">
                              <span className="w-3.5 h-3.5 shrink-0 text-center font-bold text-gray-400">ℹ️</span>
                              <div>
                                <span className="text-gray-400 font-medium">Status:</span> {item.description}
                              </div>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-blue-300 bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                              <span className="w-3.5 h-3.5 shrink-0 text-center font-bold text-blue-400">🤖</span>
                              <div>
                                <span className="text-blue-400 font-medium">Prediction:</span> {item.prediction}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {item.type === 'device' && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-white flex items-center gap-2">
                              <Cpu className="w-4 h-4 text-cyan-400" />
                              {item.title}
                            </span>
                            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-medium">IoT Device</span>
                          </div>
                          <div className="pl-6 text-xs text-gray-400 space-y-1">
                            <div>Location: <span className="text-white">{item.location}</span></div>
                            <div>Status: <span className={item.status === 'Online' ? 'text-success font-medium' : item.status === 'Warning' ? 'text-warning font-medium' : 'text-danger font-medium'}>{item.status}</span></div>
                            <div>Details: <span className="text-gray-300">{item.detail}</span></div>
                          </div>
                        </div>
                      )}

                      {item.type === 'fault' && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-white flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-danger animate-pulse" />
                              {item.title}
                            </span>
                            <span className="text-xs bg-danger/20 text-danger px-2 py-0.5 rounded-full font-medium">System Fault</span>
                          </div>
                          <div className="pl-6 text-xs text-gray-400 space-y-1">
                            <div>Location: <span className="text-white">{item.location}</span></div>
                            <div>Severity: <span className="text-danger font-semibold">{item.status}</span></div>
                            <div>Action Plan: <span className="text-gray-300">{item.detail}</span></div>
                          </div>
                        </div>
                      )}

                      {item.type === 'report' && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-white flex items-center gap-2">
                              <FileText className="w-4 h-4 text-success" />
                              {item.title}
                            </span>
                            <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full font-medium">Report</span>
                          </div>
                          <div className="pl-6 text-xs text-gray-400">
                            <div>Details: <span className="text-gray-300">{item.detail}</span></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-4">

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowAdminMenu(false); }}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full animate-ping"></span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
              </>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-96 bg-slate-900 border border-white/20 shadow-2xl rounded-2xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <h3 className="text-white font-bold">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-primary hover:text-blue-400 transition-colors">
                        Mark all read
                      </button>
                    )}
                    <button onClick={() => setShowNotifications(false)} className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifList.map((notif) => (
                    <div key={notif.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                          notif.type === 'warning' ? 'bg-warning' :
                          notif.type === 'danger' ? 'bg-danger' :
                          notif.type === 'success' ? 'bg-success' : 'bg-primary'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{notif.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{notif.desc}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                        {!notif.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/10">
                  <button 
                    onClick={() => { navigate('/dashboard/reports'); setShowNotifications(false); }}
                    className="w-full text-center text-sm text-primary hover:text-blue-400 font-medium transition-colors"
                  >
                    View All Notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        <div className="h-8 w-px bg-white/10 mx-2"></div>

        {/* Admin Panel */}
        <div className="relative" ref={adminRef}>
          <button 
            onClick={() => { setShowAdminMenu(!showAdminMenu); setShowNotifications(false); }}
            className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-white leading-tight">{currentUser.name}</span>
              <span className="text-xs text-gray-400 leading-tight">{currentUser.displayRole}</span>
            </div>
          </button>

          <AnimatePresence>
            {showAdminMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-14 w-64 bg-slate-900 border border-white/20 shadow-2xl rounded-2xl overflow-hidden z-50"
              >
                {/* Profile Header */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{currentUser.name}</p>
                      <p className="text-gray-400 text-xs">{currentUser.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <button 
                    onClick={() => { navigate('/dashboard/settings'); setShowAdminMenu(false); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </button>
                  <button 
                    onClick={() => { navigate('/dashboard'); setShowAdminMenu(false); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4" />
                      <span>Dashboard</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </button>
                  <button 
                    onClick={() => { navigate('/dashboard/reports'); setShowAdminMenu(false); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Reports</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Logout */}
                <div className="p-2 border-t border-white/10">
                  <button 
                    onClick={() => { navigate('/login'); setShowAdminMenu(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-danger hover:bg-danger/10 rounded-xl transition-all text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
