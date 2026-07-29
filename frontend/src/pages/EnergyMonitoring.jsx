import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Zap, Server, TrendingUp, TrendingDown, Clock } from 'lucide-react';

// Base data templates
const baseTodayData = [
  { time: '00:00', usage: 1200 },
  { time: '02:00', usage: 1050 },
  { time: '04:00', usage: 900 },
  { time: '06:00', usage: 1400 },
  { time: '08:00', usage: 2800 },
  { time: '10:00', usage: 3200 },
  { time: '12:00', usage: 3500 },
  { time: '14:00', usage: 3400 },
  { time: '16:00', usage: 3100 },
  { time: '18:00', usage: 2600 },
  { time: '20:00', usage: 2200 },
  { time: '22:00', usage: 1600 },
  { time: '23:59', usage: 1400 },
];

const baseWeekData = [
  { time: 'Mon', usage: 68400, target: 72000 },
  { time: 'Tue', usage: 71200, target: 72000 },
  { time: 'Wed', usage: 65800, target: 72000 },
  { time: 'Thu', usage: 74100, target: 72000 },
  { time: 'Fri', usage: 69500, target: 72000 },
  { time: 'Sat', usage: 42000, target: 50000 },
  { time: 'Sun', usage: 38600, target: 50000 },
];

const baseMonthData = [
  { time: 'Week 1', usage: 412000, target: 450000 },
  { time: 'Week 2', usage: 398000, target: 450000 },
  { time: 'Week 3', usage: 425000, target: 450000 },
  { time: 'Week 4', usage: 380000, target: 450000 },
];

const baseSubsystems = [
  { name: 'Residential Zone', baseUsage: 1450, status: 'High', color: 'warning' },
  { name: 'Commercial District', baseUsage: 620, status: 'Optimal', color: 'success' },
  { name: 'Industrial Park', baseUsage: 890, status: 'Critical', color: 'danger' },
  { name: 'Municipal Grid', baseUsage: 280, status: 'Optimal', color: 'success' },
];

// Helper to add random fluctuation
const fluctuate = (value, range) => {
  return Math.max(0, Math.round(value + (Math.random() - 0.5) * range));
};

const EnergyMonitoring = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'eb_officer';

  if (role === 'consumer') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center glass p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-gray-400">Residential consumers do not have access to town-wide grid analytics.</p>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('today');
  const [todayData, setTodayData] = useState(baseTodayData);
  const [weekData, setWeekData] = useState(baseWeekData);
  const [monthData, setMonthData] = useState(baseMonthData);
  const [subsystems, setSubsystems] = useState(baseSubsystems);
  const [totalPower, setTotalPower] = useState(3240);
  const [peakPower, setPeakPower] = useState(3500);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Live data simulation — updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate today's data
      setTodayData(prev => prev.map(point => ({
        ...point,
        usage: fluctuate(point.usage, 200),
      })));

      // Fluctuate week data
      setWeekData(prev => prev.map(point => ({
        ...point,
        usage: fluctuate(point.usage, 3000),
      })));

      // Fluctuate month data
      setMonthData(prev => prev.map(point => ({
        ...point,
        usage: fluctuate(point.usage, 15000),
      })));

      // Fluctuate subsystems
      setSubsystems(prev => prev.map(sys => {
        const newUsage = fluctuate(sys.baseUsage, 100);
        let newStatus = 'Optimal';
        let newColor = 'success';
        if (newUsage > sys.baseUsage * 1.1) { newStatus = 'Critical'; newColor = 'danger'; }
        else if (newUsage > sys.baseUsage * 0.95) { newStatus = 'High'; newColor = 'warning'; }
        return { ...sys, currentUsage: newUsage, status: newStatus, color: newColor };
      }));

      // Update total power
      setTotalPower(fluctuate(3240, 300));
      setPeakPower(prev => Math.max(prev, fluctuate(3500, 100)));
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
  ];

  const getChartData = () => {
    if (activeTab === 'today') return todayData;
    if (activeTab === 'week') return weekData;
    return monthData;
  };

  const getUnit = () => {
    if (activeTab === 'today') return 'kW';
    if (activeTab === 'week') return 'kWh';
    return 'kWh';
  };

  const formatValue = (val) => {
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val;
  };

  const powerChange = ((totalPower - 3240) / 3240 * 100).toFixed(1);
  const isUp = powerChange > 0;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Energy Monitoring</h1>
          <p className="text-gray-400">Real-time electricity tracking with predictive load detection.</p>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <Clock className="w-4 h-4" />
          <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Live Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          key={totalPower}
          initial={{ scale: 1.02 }} 
          animate={{ scale: 1 }}
          className="glass p-5 rounded-2xl border border-primary/20"
        >
          <p className="text-gray-400 text-sm mb-1">Current Load</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold text-white">{totalPower.toLocaleString()}</span>
            <span className="text-primary font-medium mb-1">kW</span>
          </div>
          <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${isUp ? 'text-danger' : 'text-success'}`}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(powerChange)}% from baseline
          </div>
        </motion.div>

        <div className="glass p-5 rounded-2xl border border-accent/20">
          <p className="text-gray-400 text-sm mb-1">Peak Today</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold text-white">{peakPower.toLocaleString()}</span>
            <span className="text-accent font-medium mb-1">kW</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Recorded at 2:00 PM</p>
        </div>

        <div className="glass p-5 rounded-2xl border border-success/20">
          <p className="text-gray-400 text-sm mb-1">Energy Saved Today</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold text-white">142</span>
            <span className="text-success font-medium mb-1">kWh</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Via AI optimization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 glass p-6 rounded-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Town Load Profile
            </h3>
            <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-1.5 text-sm rounded-md font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-[350px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === 'today' ? (
                  <AreaChart data={getChartData()}>
                    <defs>
                      <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
                    <XAxis dataKey="time" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#2563EB', borderRadius: '8px', color: '#fff' }}
                      formatter={(value) => [`${value.toLocaleString()} kW`, 'Usage']}
                    />
                    <Area type="monotone" dataKey="usage" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" animationDuration={500} />
                  </AreaChart>
                ) : (
                  <BarChart data={getChartData()}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0.4}/>
                      </linearGradient>
                      <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.6}/>
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
                    <XAxis dataKey="time" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={formatValue} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#2563EB', borderRadius: '8px', color: '#fff' }}
                      formatter={(value) => [`${value.toLocaleString()} ${getUnit()}`, '']}
                    />
                    <Bar dataKey="usage" fill="url(#barGrad)" radius={[6, 6, 0, 0]} name="Actual" animationDuration={500} />
                    <Bar dataKey="target" fill="url(#targetGrad)" radius={[6, 6, 0, 0]} name="Target" animationDuration={500} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Real-time Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass p-6 rounded-2xl flex flex-col gap-6"
        >
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-accent" /> Active Feeders/Zones
            </h3>
            <div className="space-y-4">
              {subsystems.map((sys, idx) => (
                <motion.div 
                  key={idx}
                  animate={{ opacity: [0.9, 1] }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <Server className={`w-4 h-4 text-${sys.color}`} />
                    <span className="text-gray-300 text-sm font-medium">{sys.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-sm">
                      {(sys.currentUsage || sys.baseUsage).toLocaleString()} kW
                    </p>
                    <p className={`text-xs text-${sys.color}`}>{sys.status}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Live Indicator */}
          <div className="mt-auto p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-sm font-bold">Live Feed Active</span>
            </div>
            <p className="text-xs text-gray-400">Data refreshes every 3 seconds from town IoT sensors.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnergyMonitoring;

