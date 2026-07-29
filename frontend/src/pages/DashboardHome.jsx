import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, IndianRupee, TrendingDown, TrendingUp, Server, CloudLightning, Clock, Leaf, Download, History } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { jsPDF } from 'jspdf';

// Base data templates for consumer (household level)
const consumerTodayData = [
  { time: '08:00', usage: 1.2 },
  { time: '09:00', usage: 1.5 },
  { time: '10:00', usage: 1.8 },
  { time: '11:00', usage: 2.1 },
  { time: '12:00', usage: 2.4 },
  { time: '13:00', usage: 2.2 },
  { time: '14:00', usage: 1.9 },
  { time: '15:00', usage: 1.5 },
  { time: '16:00', usage: 1.3 },
  { time: '17:00', usage: 1.6 },
  { time: '18:00', usage: 2.8 },
  { time: '19:00', usage: 3.2 },
  { time: '20:00', usage: 2.9 },
];

const consumerWeekData = [
  { time: 'Mon', usage: 14.5, target: 15.0 },
  { time: 'Tue', usage: 15.2, target: 15.0 },
  { time: 'Wed', usage: 13.8, target: 15.0 },
  { time: 'Thu', usage: 16.1, target: 15.0 },
  { time: 'Fri', usage: 14.9, target: 15.0 },
  { time: 'Sat', usage: 9.8, target: 12.0 },
  { time: 'Sun', usage: 8.5, target: 12.0 },
];

const consumerMonthData = [
  { time: 'Week 1', usage: 98, target: 100 },
  { time: 'Week 2', usage: 92, target: 100 },
  { time: 'Week 3', usage: 104, target: 100 },
  { time: 'Week 4', usage: 88, target: 100 },
];

const consumerKPIs = {
  totalEnergy: 245,
  currentPower: 1.8,
  costSavings: 1470,
  carbonSaved: 0.15,
};

const consumerApplianceData = [
  { name: 'Air Conditioner', value: 42, units: 102.9, cost: 617.40, color: '#3b82f6' },
  { name: 'Refrigerator', value: 18, units: 44.1, cost: 264.60, color: '#10b981' },
  { name: 'Water Heater', value: 15, units: 36.75, cost: 220.50, color: '#f59e0b' },
  { name: 'Television', value: 8, units: 19.6, cost: 117.60, color: '#8b5cf6' },
  { name: 'Lighting', value: 6, units: 14.7, cost: 88.20, color: '#ec4899' },
  { name: 'Ceiling Fan', value: 5, units: 12.25, cost: 73.50, color: '#06b6d4' },
  { name: 'Washing Machine', value: 4, units: 9.8, cost: 58.80, color: '#f43f5e' },
  { name: 'Others', value: 2, units: 4.9, cost: 29.40, color: '#6b7280' },
];

const billingHistoryData = [
  { month: 'June 2026', units: 230, amount: 1380.00, status: 'Paid', date: 'June 08, 2026' },
  { month: 'May 2026', units: 210, amount: 1260.00, status: 'Paid', date: 'May 09, 2026' },
  { month: 'April 2026', units: 195, amount: 1170.00, status: 'Paid', date: 'April 10, 2026' },
];

const gridOperatorKPIs = {
  totalEnergy: 8.1,
  currentPower: 10.0,
  costSavings: 1,
  carbonSaved: 50.02,
};

const gridOperatorTodayData = [
  { time: '08:00', usage: 6.2 },
  { time: '09:00', usage: 7.1 },
  { time: '10:00', usage: 7.8 },
  { time: '11:00', usage: 8.5 },
  { time: '12:00', usage: 9.1 },
  { time: '13:00', usage: 9.5 },
  { time: '14:00', usage: 8.9 },
  { time: '15:00', usage: 8.2 },
  { time: '16:00', usage: 7.8 },
  { time: '17:00', usage: 8.1 },
  { time: '18:00', usage: 9.2 },
  { time: '19:00', usage: 9.8 },
  { time: '20:00', usage: 9.4 },
];

const gridOperatorWeekData = [
  { time: 'Mon', usage: 52.4, target: 55.0 },
  { time: 'Tue', usage: 54.1, target: 55.0 },
  { time: 'Wed', usage: 51.8, target: 55.0 },
  { time: 'Thu', usage: 56.5, target: 55.0 },
  { time: 'Fri', usage: 53.2, target: 55.0 },
  { time: 'Sat', usage: 38.6, target: 40.0 },
  { time: 'Sun', usage: 35.4, target: 40.0 },
];

const gridOperatorMonthData = [
  { time: 'Week 1', usage: 312, target: 350 },
  { time: 'Week 2', usage: 298, target: 350 },
  { time: 'Week 3', usage: 325, target: 350 },
  { time: 'Week 4', usage: 290, target: 350 },
];

// Base data templates
const baseTodayData = [
  { time: '08:00', usage: 1800 },
  { time: '09:00', usage: 2200 },
  { time: '10:00', usage: 2500 },
  { time: '11:00', usage: 2900 },
  { time: '12:00', usage: 3240 },
  { time: '13:00', usage: 3180 },
  { time: '14:00', usage: 3100 },
  { time: '15:00', usage: 2950 },
  { time: '16:00', usage: 2800 },
  { time: '17:00', usage: 2400 },
  { time: '18:00', usage: 2100 },
];

const baseKPIs = {
  totalEnergy: 45.2,
  currentPower: 3240,
  costSavings: 12450,
  carbonSaved: 18.5,
};

const LiveStatCard = ({ title, value, unit, change, icon: Icon, color, delay }) => {
  const isPositive = change > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass p-6 rounded-2xl relative overflow-hidden group"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-${color} group-hover:scale-150 transition-transform duration-500`} />
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {unit && <span className="text-lg font-medium text-gray-400 ml-1">{unit}</span>}
          </h3>
        </div>
        <div className={`p-3 rounded-xl bg-${color}/20 text-${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium flex items-center gap-1 ${isPositive ? 'text-success' : 'text-danger'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? '+' : ''}{change}%
        </span>
          <span className="text-sm text-gray-500">vs last month</span>
      </div>
    </motion.div>
  );
};

const DashboardHome = () => {
  const [timeframe, setTimeframe] = useState('today');
  const [chartData, setChartData] = useState(baseTodayData);
  const [kpis, setKPIs] = useState(baseKPIs);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [expandedInsight, setExpandedInsight] = useState(null);
  const [insightActions, setInsightActions] = useState({ 1: null, 2: null });
  const [role, setRole] = useState('eb_officer');
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setRole(u.role || 'eb_officer');
      } catch (e) {
        console.error('Error parsing user in DashboardHome:', e);
      }
    }
  }, []);

  const fetchData = async () => {
    if (role === 'consumer') {
      // Set consumer-specific static/mock values
      setKPIs(consumerKPIs);
      if (timeframe === 'today') {
        setChartData(consumerTodayData);
      } else if (timeframe === 'week') {
        setChartData(consumerWeekData);
      } else {
        setChartData(consumerMonthData);
      }
      setLastUpdate(new Date());
      return;
    }

    if (role === 'grid_operator') {
      setKPIs(gridOperatorKPIs);
      if (timeframe === 'today') {
        setChartData(gridOperatorTodayData);
      } else if (timeframe === 'week') {
        setChartData(gridOperatorWeekData);
      } else {
        setChartData(gridOperatorMonthData);
      }
      setLastUpdate(new Date());
      return;
    }

    try {
      const response = await axios.get(`/api/dashboard/summary?timeframe=${timeframe}`);
      setKPIs(response.data.kpis);
      setChartData(response.data.chartData);
      setLastUpdate(new Date(response.data.lastUpdate));
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text('EcoGrid AI - Electricity Invoice', 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 20, 35);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 40, 190, 40);
    
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('Consumer & Meter Details:', 20, 52);
    doc.setFontSize(10);
    doc.text(`Consumer ID: CON-9842103`, 20, 60);
    doc.text(`Meter Number: EM-908241`, 20, 66);
    doc.text(`Billing Month: July 2026`, 20, 72);
    
    doc.setFontSize(12);
    doc.text('Reading Details:', 20, 84);
    doc.setFontSize(10);
    doc.text(`Previous Meter Reading: 4,850 kWh`, 20, 92);
    doc.text(`Current Meter Reading: 5,095 kWh`, 20, 98);
    doc.text(`Units Consumed: 245 kWh`, 20, 104);

    doc.setFontSize(12);
    doc.text('Charges Breakdown:', 20, 116);
    doc.setFontSize(10);
    doc.text(`Electricity Charges: Rs. 1,102.50`, 20, 124);
    doc.text(`Fixed Charges: Rs. 150.00`, 20, 130);
    doc.text(`Tax (15%): Rs. 217.50`, 20, 136);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 142, 190, 142);
    
    doc.setFontSize(14);
    doc.text(`Total Bill Amount: Rs. 1,470.00`, 20, 154);
    doc.setFontSize(10);
    doc.text(`Due Date: August 10, 2026`, 20, 162);
    doc.text(`Payment Status: Paid`, 20, 168);
    
    doc.save('EcoGrid_Bill_July_2026.pdf');
  };

  // Fetch data immediately when timeframe changes or role is loaded
  useEffect(() => {
    fetchData();
  }, [timeframe, role]);

  // Live updates — poll every 3 seconds for admin/operator
  useEffect(() => {
    if (role === 'consumer') return;
    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval);
  }, [timeframe, role]);

  const tabs = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
  ];

  const getChartData = () => {
    return chartData;
  };

  const getUnit = () => {
    if (role === 'consumer') {
      if (timeframe === 'today') return 'kW';
      return 'kWh';
    }
    if (role === 'grid_operator') {
      if (timeframe === 'today') return 'MW';
      return 'MWh';
    }
    if (timeframe === 'today') return 'kW';
    return 'kWh';
  };

  const formatValue = (val) => {
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {role === 'consumer' 
              ? 'My Energy Dashboard' 
              : role === 'grid_operator' 
                ? 'Live Grid Status' 
                : 'Town Energy Overview'}
          </h1>
          <p className="text-gray-400">
            {role === 'consumer' 
              ? 'Real-time personal consumption overview and smart energy insights.' 
              : role === 'grid_operator'
                ? 'Real-time transformer monitoring, fault alerts, and load balancing telemetry.'
                : 'Real-time energy monitoring and AI insights across the entire town.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <Clock className="w-4 h-4" />
            <span>{lastUpdate.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-3 glass px-4 py-2 rounded-lg border-primary/30 text-primary">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="font-medium text-sm">
              {role === 'consumer' 
                ? 'Home Power Active' 
                : role === 'grid_operator' 
                  ? 'Live Grid Stabilized' 
                  : 'Town Grid Healthy'}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards — Live updating */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <LiveStatCard 
          title={role === 'consumer' ? 'My Energy Consumption' : role === 'grid_operator' ? 'Cumulative Grid Load' : 'Total Town Energy Consumption'} 
          value={kpis.totalEnergy} 
          unit={role === 'consumer' ? 'kWh' : role === 'grid_operator' ? 'MW' : 'MWh'}
          change={role === 'consumer' ? -8.4 : role === 'grid_operator' ? 2.1 : -12.5} 
          icon={Zap} 
          color="primary"
          delay={0.1}
        />
        <LiveStatCard 
          title={role === 'consumer' ? 'Current House Load' : role === 'grid_operator' ? 'Grid Peak Capacity' : 'Current Town Power Demand'} 
          value={kpis.currentPower} 
          unit={role === 'grid_operator' ? 'MW' : 'kW'}
          change={role === 'consumer' ? -3.1 : role === 'grid_operator' ? 0.0 : -5.2} 
          icon={Activity} 
          color="accent"
          delay={0.2}
        />
        <LiveStatCard 
          title={role === 'consumer' ? 'Estimated Bill Amount' : role === 'grid_operator' ? 'Overloaded Substations' : 'Monthly Energy Cost Savings'} 
          value={role === 'grid_operator' ? kpis.costSavings : `₹${kpis.costSavings.toLocaleString()}`}
          unit={role === 'grid_operator' ? 'Substation' : ''}
          change={role === 'consumer' ? -12.2 : role === 'grid_operator' ? 50.0 : 18.4} 
          icon={role === 'grid_operator' ? Server : IndianRupee} 
          color="success"
          delay={0.3}
        />
        <LiveStatCard 
          title={role === 'consumer' ? 'Carbon Footprint Saved' : role === 'grid_operator' ? 'Grid Frequency Stability' : 'Town Carbon Emission Reduction'} 
          value={kpis.carbonSaved} 
          unit={role === 'grid_operator' ? 'Hz' : 'Tons'}
          change={role === 'consumer' ? 14.5 : role === 'grid_operator' ? 0.04 : 22.1} 
          icon={CloudLightning} 
          color="secondary"
          delay={0.4}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Energy Flow Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 glass p-6 rounded-2xl min-h-[400px] flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-white">
                {role === 'consumer' ? 'Household Power Demand' : 'Town Power Demand'}
              </h3>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-success/10 border border-success/30 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-success text-xs font-medium">LIVE</span>
              </div>
            </div>
            <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTimeframe(tab.key)}
                  className={`px-4 py-1.5 text-sm rounded-md font-medium transition-all ${
                    timeframe === tab.key
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
              key={timeframe}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1 w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                {timeframe === 'today' ? (
                  <AreaChart data={getChartData()}>
                    <defs>
                      <linearGradient id="colorUsageHome" x1="0" y1="0" x2="0" y2="1">
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
                    <Area type="monotone" dataKey="usage" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorUsageHome)" animationDuration={500} />
                  </AreaChart>
                ) : (
                  <BarChart data={getChartData()}>
                    <defs>
                      <linearGradient id="homeBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0.4}/>
                      </linearGradient>
                      <linearGradient id="homeTargetGrad" x1="0" y1="0" x2="0" y2="1">
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
                    <Bar dataKey="usage" fill="url(#homeBarGrad)" radius={[6, 6, 0, 0]} name="Actual" animationDuration={500} />
                    <Bar dataKey="target" fill="url(#homeTargetGrad)" radius={[6, 6, 0, 0]} name="Target" animationDuration={500} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* AI Insight Agent Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass p-6 rounded-2xl min-h-[400px] flex flex-col"
        >
          {role === 'consumer' ? (
            <>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="p-2 rounded-lg bg-accent/20 text-accent">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">AI Home Energy Coach</h3>
                  <p className="text-xs text-accent">Active recommendations</p>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {/* Outage Alert */}
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl hover:border-danger/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-danger shadow-[0_0_8px_rgba(239,68,68,0.8)] shrink-0 animate-pulse" />
                    <div className="w-full">
                      <p className="text-sm text-gray-300 font-semibold">Scheduled Outage Alert</p>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Planned maintenance on your local transformer sector (Zone North) on Friday from 10:00 AM to 12:00 PM.
                      </p>
                      <p className="text-gray-500 text-[10px] mt-2">Just now • EcoGrid Notification</p>
                    </div>
                  </div>
                </div>

                {/* Solar Tip */}
                <div 
                  onClick={() => setExpandedInsight(expandedInsight === 1 ? null : 1)}
                  className={`bg-white/5 border border-white/10 p-4 rounded-xl hover:border-primary/30 transition-colors cursor-pointer ${expandedInsight === 1 ? 'ring-1 ring-primary/40' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(37,99,235,0.8)] shrink-0" />
                    <div className="w-full">
                      <p className="text-sm text-gray-300 font-medium">Solar generation peak starting soon.</p>
                      <AnimatePresence>
                        {expandedInsight === 1 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 space-y-2 pt-3 border-t border-white/5 text-xs text-gray-400 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="text-white font-medium">Recommendation:</p>
                            <p>Utilize peak solar generation by scheduling heavy loads (laundry, EV charging) between 11:00 AM and 2:00 PM to lower grid dependencies and optimize cost.</p>
                            <p className="text-success font-semibold">Estimated savings: ₹65 / cycle</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <p className="text-gray-500 text-[10px] mt-2">15 mins ago • AI Coach {expandedInsight === 1 ? '• Click to collapse' : '• Click to view details'}</p>
                    </div>
                  </div>
                </div>

                {/* Appliance Alert */}
                <div 
                  onClick={() => setExpandedInsight(expandedInsight === 2 ? null : 2)}
                  className={`bg-white/5 border border-white/10 p-4 rounded-xl hover:border-warning/30 transition-colors cursor-pointer ${expandedInsight === 2 ? 'ring-1 ring-warning/40' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-warning shadow-[0_0_8px_rgba(245,158,11,0.8)] shrink-0" />
                    <div className="w-full">
                      <p className="text-sm text-gray-300 font-medium">Abnormal Refrigerator Winding Draw</p>
                      <AnimatePresence>
                        {expandedInsight === 2 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 space-y-2 pt-3 border-t border-white/5 text-xs text-gray-400 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="text-white font-medium">AI Diagnostic:</p>
                            <p>Your refrigerator compressor coil registered a 12% higher peak standby draw than normal. This usually suggests dust buildup on condenser coils or a door seal leak.</p>
                            <p className="text-warning font-semibold">Action: Clean coils and check door seal to save ~₹45/month.</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <p className="text-gray-500 text-[10px] mt-2">1 hr ago • AI Diagnostics {expandedInsight === 2 ? '• Click to collapse' : '• Click to view details'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : role === 'grid_operator' ? (
            <>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="p-2 rounded-lg bg-accent/20 text-accent">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">AI Grid Operations Intelligence Agent (GOIA)</h3>
                  <p className="text-xs text-accent">Active operational monitoring</p>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                
                {/* Operational Insight 1 */}
                <div 
                  onClick={() => setExpandedInsight(expandedInsight === 1 ? null : 1)}
                  className={`bg-white/5 border border-white/10 p-4 rounded-xl hover:border-primary/30 transition-colors cursor-pointer ${expandedInsight === 1 ? 'ring-1 ring-primary/40' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-warning shadow-[0_0_8px_rgba(245,158,11,0.8)] shrink-0" />
                    <div className="w-full">
                      <p className="text-sm text-gray-300 font-medium">Transformer B is operating at 92% capacity.</p>
                      
                      <AnimatePresence>
                        {expandedInsight === 1 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 space-y-3 pt-3 border-t border-white/5 text-xs text-gray-400 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="text-white font-medium mb-1">Reason Breakdown:</p>
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Residential Zone North has higher-than-normal energy demand.</li>
                              <li>Transformer cooling fans operating at maximum load (66°C).</li>
                              <li>Secondary winding phase imbalance registered on grid sector 3.</li>
                            </ul>
                            
                            <div className="flex gap-2 pt-2">
                              {insightActions[1] ? (
                                <span className="text-success font-medium bg-success/10 border border-success/20 px-3 py-1.5 rounded-lg">{insightActions[1]}</span>
                              ) : (
                                <>
                                  <button 
                                    onClick={() => setInsightActions({...insightActions, 1: 'Feeder load shift instructions sent successfully!'})}
                                    className="px-3 py-1.5 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition-colors border border-primary/30"
                                  >
                                    Balance Load
                                  </button>
                                  <button 
                                    onClick={() => setInsightActions({...insightActions, 1: 'Maintenance crew dispatch ticket #9842 logged!'})}
                                    className="px-3 py-1.5 bg-white/5 text-gray-300 hover:text-white rounded-lg transition-colors border border-white/10"
                                  >
                                    Dispatch Crew
                                  </button>
                                </>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <p className="text-gray-500 text-[10px] mt-2">2 mins ago • AI Grid Agent {expandedInsight === 1 ? '• Click to collapse' : '• Click to view details'}</p>
                    </div>
                  </div>
                </div>

                {/* Operational Insight 2 */}
                <div 
                  onClick={() => setExpandedInsight(expandedInsight === 2 ? null : 2)}
                  className={`bg-white/5 border border-white/10 p-4 rounded-xl hover:border-success/30 transition-colors cursor-pointer ${expandedInsight === 2 ? 'ring-1 ring-success/40' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.8)] shrink-0" />
                    <div className="w-full">
                      <p className="text-sm text-gray-300 font-medium">AI recommends shifting 15% load to Transformer D.</p>
                      
                      <AnimatePresence>
                        {expandedInsight === 2 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 space-y-3 pt-3 border-t border-white/5 text-xs text-gray-400 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="text-white font-medium mb-1">Load Balancing Proposal:</p>
                            <p>Divert 15% of peak load to Transformer D (currently at 45% load) during peak hours (5 PM - 8 PM).</p>
                            <p className="text-success font-medium">Est. Grid Relief: ~360 kW peak demand reduction</p>
                            
                            <div className="flex gap-2 pt-2">
                              {insightActions[2] ? (
                                <span className="text-success font-medium bg-success/10 border border-success/20 px-3 py-1.5 rounded-lg">{insightActions[2]}</span>
                              ) : (
                                <>
                                  <button 
                                    onClick={() => setInsightActions({...insightActions, 2: 'Feeder load redirect rules applied successfully!'})}
                                    className="px-3 py-1.5 bg-success/20 text-success hover:bg-success/30 rounded-lg transition-colors border border-success/30"
                                  >
                                    Auto-Shift Load
                                  </button>
                                  <button 
                                    onClick={() => setExpandedInsight(null)}
                                    className="px-3 py-1.5 bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors border border-white/10"
                                  >
                                    Ignore
                                  </button>
                                </>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!expandedInsight && (
                        <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                          {insightActions[2] ? (
                            <span className="text-success text-xs font-medium">{insightActions[2]}</span>
                          ) : (
                            <>
                              <button 
                                onClick={() => setInsightActions({...insightActions, 2: 'Feeder load redirect rules applied successfully!'})}
                                className="text-xs px-3 py-1.5 bg-success/20 text-success hover:bg-success/30 rounded-lg transition-colors border border-success/30"
                              >
                                Auto-Shift Load
                              </button>
                              <button 
                                onClick={() => setExpandedInsight(null)}
                                className="text-xs px-3 py-1.5 bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors border border-white/10"
                              >
                                Ignore
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      <p className="text-gray-500 text-[10px] mt-2">15 mins ago • AI Grid Agent {expandedInsight === 2 ? '• Click to collapse' : '• Click to view details'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Operational Insight 3 */}
                <div 
                  onClick={() => setExpandedInsight(expandedInsight === 3 ? null : 3)}
                  className={`bg-white/5 border border-white/10 p-4 rounded-xl hover:border-accent/30 transition-colors cursor-pointer ${expandedInsight === 3 ? 'ring-1 ring-accent/40' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(6,182,212,0.8)] shrink-0" />
                    <div className="w-full">
                      <p className="text-sm text-gray-300 font-medium">Renewable energy contribution increased by 12%.</p>
                      
                      <AnimatePresence>
                        {expandedInsight === 3 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 space-y-2 pt-3 border-t border-white/5 text-xs text-gray-400 overflow-hidden"
                          >
                            <p className="text-white font-medium mb-1">Grid Output Metrics:</p>
                            <ul className="list-none space-y-1">
                              <li>• Current Solar/Wind Feed: <span className="text-accent font-semibold">1,450 kW</span></li>
                              <li>• Evening peak demand expected at 7 PM.</li>
                              <li>• Storage Charging: Battery storage at <span className="text-success font-semibold">82%</span> capacity</li>
                            </ul>
                            <p className="text-[11px] italic text-gray-500 mt-2">Wind generation yield is higher than normal. Storing excess energy.</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <p className="text-gray-500 text-[10px] mt-2">1 hr ago • AI Grid Agent {expandedInsight === 3 ? '• Click to collapse' : '• Click to view details'}</p>
                    </div>
                  </div>
                </div>

              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="p-2 rounded-lg bg-success/20 text-success">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">AI Town Energy Management Agent (TEMA)</h3>
                  <p className="text-xs text-success">Administrative insights</p>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                
                {/* Admin Insight 1 */}
                <div 
                  onClick={() => setExpandedInsight(expandedInsight === 1 ? null : 1)}
                  className={`bg-white/5 border border-white/10 p-4 rounded-xl hover:border-primary/30 transition-colors cursor-pointer ${expandedInsight === 1 ? 'ring-1 ring-primary/40' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.8)] shrink-0" />
                    <div className="w-full">
                      <p className="text-sm text-gray-300 font-medium">Town energy target achieved: 98% efficiency.</p>
                      <AnimatePresence>
                        {expandedInsight === 1 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 space-y-2 pt-3 border-t border-white/5 text-xs text-gray-400 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="text-white font-medium">Efficiency Analysis:</p>
                            <p>Aggregated town consumption is trending exactly within the July sustainability envelope. Time-of-use peak adjustments have successfully smoothed municipal grid loading.</p>
                            <p className="text-success font-semibold">Overall status: Highly Optimized</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <p className="text-gray-500 text-[10px] mt-2">Just now • AI Management Agent {expandedInsight === 1 ? '• Click to collapse' : '• Click to view details'}</p>
                    </div>
                  </div>
                </div>

                {/* Admin Insight 2 */}
                <div 
                  onClick={() => setExpandedInsight(expandedInsight === 2 ? null : 2)}
                  className={`bg-white/5 border border-white/10 p-4 rounded-xl hover:border-warning/30 transition-colors cursor-pointer ${expandedInsight === 2 ? 'ring-1 ring-warning/40' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-warning shadow-[0_0_8px_rgba(245,158,11,0.8)] shrink-0" />
                    <div className="w-full">
                      <p className="text-sm text-gray-300 font-medium">Smart Meter connectivity at 99.8%.</p>
                      <AnimatePresence>
                        {expandedInsight === 2 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 space-y-2 pt-3 border-t border-white/5 text-xs text-gray-400 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="text-white font-medium">Connectivity Diagnostic:</p>
                            <p>Out of 12,850 smart meters, 24 are reporting offline due to signal noise or battery exhaustion. Recommend logging standard maintenance ticket.</p>
                            
                            <div className="flex gap-2 pt-2">
                              {insightActions[2] ? (
                                <span className="text-success font-medium bg-success/10 border border-success/20 px-3 py-1.5 rounded-lg">{insightActions[2]}</span>
                              ) : (
                                <button 
                                  onClick={() => setInsightActions({...insightActions, 2: 'Maintenance team notified!'})}
                                  className="px-3 py-1.5 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition-colors border border-primary/30"
                                >
                                  Log Maintenance Request
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <p className="text-gray-500 text-[10px] mt-2">15 mins ago • AI Management Agent {expandedInsight === 2 ? '• Click to collapse' : '• Click to view details'}</p>
                    </div>
                  </div>
                </div>

                {/* Admin Insight 3 */}
                <div 
                  onClick={() => setExpandedInsight(expandedInsight === 3 ? null : 3)}
                  className={`bg-white/5 border border-white/10 p-4 rounded-xl hover:border-accent/30 transition-colors cursor-pointer ${expandedInsight === 3 ? 'ring-1 ring-accent/40' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(6,182,212,0.8)] shrink-0" />
                    <div className="w-full">
                      <p className="text-sm text-gray-300 font-medium">Carbon offsets increased by 14% this month.</p>
                      <AnimatePresence>
                        {expandedInsight === 3 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 space-y-2 pt-3 border-t border-white/5 text-xs text-gray-400 overflow-hidden"
                          >
                            <p className="text-white font-medium">Sustainability Summary:</p>
                            <p>Increased solar feed contribution from municipal parks has reduced the town carbon footprint by 5.2 Tons compared to last month.</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <p className="text-gray-500 text-[10px] mt-2">1 hr ago • AI Management Agent {expandedInsight === 3 ? '• Click to collapse' : '• Click to view details'}</p>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Consumer specific sections: My Electricity Bill and Appliance Energy Consumption */}
      {role === 'consumer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          
          {/* Feature 1: My Electricity Bill */}
          <div className="glass p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white">My Electricity Bill</h3>
                <span className="px-3 py-1 bg-success/20 text-success border border-success/30 rounded-full text-xs font-semibold">
                  Paid
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-y-3 text-sm mb-6">
                <div className="text-gray-400">Consumer ID</div>
                <div className="text-white font-medium text-right">CON-9842103</div>
                
                <div className="text-gray-400">Meter Number</div>
                <div className="text-white font-medium text-right">EM-908241</div>
                
                <div className="text-gray-400">Billing Month</div>
                <div className="text-white font-medium text-right">July 2026</div>
                
                <div className="text-gray-400">Previous Meter Reading</div>
                <div className="text-white font-medium text-right">4,850 kWh</div>
                
                <div className="text-gray-400">Current Meter Reading</div>
                <div className="text-white font-medium text-right">5,095 kWh</div>
                
                <div className="text-gray-400">Units Consumed</div>
                <div className="text-accent font-semibold text-right">245 kWh</div>
                
                <div className="text-gray-400">Electricity Charges</div>
                <div className="text-white font-medium text-right">₹1,102.50</div>
                
                <div className="text-gray-400">Fixed Charges</div>
                <div className="text-white font-medium text-right">₹150.00</div>
                
                <div className="text-gray-400">Tax (15%)</div>
                <div className="text-white font-medium text-right">₹217.50</div>
                
                <div className="col-span-2 border-t border-white/5 my-1"></div>
                
                <div className="text-gray-300 font-semibold">Total Bill Amount</div>
                <div className="text-white text-lg font-bold text-right">₹1,470.00</div>
                
                <div className="text-gray-400">Due Date</div>
                <div className="text-white font-medium text-right">August 10, 2026</div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
              <button 
                onClick={handleDownloadPDF}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-primary hover:bg-blue-600 text-white font-medium rounded-xl transition-all shadow-lg text-sm"
              >
                <Download className="w-4 h-4" /> Download Bill (PDF)
              </button>
              <button 
                onClick={() => setShowHistoryModal(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium rounded-xl border border-white/10 transition-all text-sm"
              >
                <History className="w-4 h-4" /> View Billing History
              </button>
            </div>
          </div>

          {/* Feature 2: Appliance Energy Consumption */}
          <div className="glass p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Appliance Energy Consumption</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="h-[200px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={consumerApplianceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {consumerApplianceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#2563EB', borderRadius: '8px', color: '#fff' }}
                        formatter={(value) => [`${value}%`, 'Usage Ratio']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2 overflow-y-auto max-h-[200px] pr-2 text-xs">
                  {consumerApplianceData.map((app, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: app.color }} />
                        <span className="text-gray-300 font-medium">{app.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-bold">{app.value}%</span>
                        <span className="text-gray-500 mx-1">|</span>
                        <span className="text-gray-400">{app.units} kWh</span>
                        <span className="text-gray-500 mx-1">|</span>
                        <span className="text-accent font-semibold">₹{app.cost.toFixed(0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl text-xs text-gray-300 leading-relaxed">
              <span className="font-semibold text-primary block mb-1">AI Recommendation</span>
              Your Air Conditioner consumes approximately 42% of your home's electricity. Reducing AC usage by one hour per day could save approximately ₹350–₹500 every month.
            </div>
          </div>

        </div>
      )}

      {/* Billing History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistoryModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass p-8 rounded-2xl border border-white/20 shadow-2xl z-10"
            >
              <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Billing History</h3>
              
              <div className="space-y-4 mb-6">
                {billingHistoryData.map((bill, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-white font-bold text-base">{bill.month}</p>
                      <p className="text-gray-400 text-xs mt-1">Paid on {bill.date} • {bill.units} kWh</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-extrabold text-lg">₹{bill.amount.toLocaleString()}</p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 bg-success/20 text-success border border-success/30 rounded-full text-xs font-semibold">
                        {bill.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-all text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardHome;
