import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Cloud, Users, Sun, AlertTriangle, ShieldCheck, 
  Zap, Percent, DollarSign, Leaf, Award, Calendar, History 
} from 'lucide-react';
import { 
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

// Data templates for different ranges
const forecastData = {
  '24h': [
    { label: '00:00', actual: 1200, predicted: 1250, predMin: 1150, predMax: 1350 },
    { label: '04:00', actual: 950, predicted: 1000, predMin: 900, predMax: 1100 },
    { label: '08:00', actual: 2100, predicted: 2050, predMin: 1950, predMax: 2150 },
    { label: '12:00', actual: 3400, predicted: 3500, predMin: 3300, predMax: 3700 },
    { label: '16:00', actual: 3100, predicted: 2950, predMin: 2750, predMax: 3150 },
    { label: '20:00', actual: null, predicted: 2400, predMin: 2200, predMax: 2600 },
    { label: '24:00', actual: null, predicted: 1600, predMin: 1450, predMax: 1750 },
  ],
  '7d': [
    { label: 'Mon', actual: 4000, predicted: 4100, predMin: 3900, predMax: 4300 },
    { label: 'Tue', actual: 3000, predicted: 3200, predMin: 3000, predMax: 3400 },
    { label: 'Wed', actual: 2000, predicted: 2300, predMin: 2100, predMax: 2500 },
    { label: 'Thu', actual: 2780, predicted: 2800, predMin: 2600, predMax: 3000 },
    { label: 'Fri', actual: 1890, predicted: 1900, predMin: 1750, predMax: 2050 },
    { label: 'Sat', actual: null, predicted: 1500, predMin: 1350, predMax: 1650 },
    { label: 'Sun', actual: null, predicted: 1400, predMin: 1250, predMax: 1550 },
  ],
  '30d': [
    { label: 'Week 1', actual: 24000, predicted: 24500, predMin: 23500, predMax: 25500 },
    { label: 'Week 2', actual: 26500, predicted: 25800, predMin: 24800, predMax: 26800 },
    { label: 'Week 3', actual: 22000, predicted: 23000, predMin: 22000, predMax: 24000 },
    { label: 'Week 4', actual: null, predicted: 21500, predMin: 20500, predMax: 22500 },
  ]
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const actualData = payload.find(p => p.dataKey === 'actual');
    const predData = payload.find(p => p.dataKey === 'predicted');
    
    const actual = actualData ? actualData.value : null;
    const predicted = predData ? predData.value : null;
    const variance = actual !== null && predicted !== null ? (actual - predicted) : null;
    const variancePct = variance !== null ? ((variance / predicted) * 100).toFixed(1) : null;

    return (
      <div className="glass border border-white/20 p-4 rounded-xl shadow-2xl bg-slate-900/90 text-white min-w-[200px]">
        <p className="font-semibold text-gray-300 border-b border-white/10 pb-1 mb-2">{label}</p>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Actual:</span>
            <span className="font-semibold text-blue-400">{actual !== null ? `${actual.toLocaleString()} kW` : 'N/A'}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Predicted:</span>
            <span className="font-semibold text-cyan-400">{predicted !== null ? `${predicted.toLocaleString()} kW` : 'N/A'}</span>
          </div>
          {variance !== null && (
            <div className="flex justify-between gap-4 border-t border-white/5 pt-1 mt-1">
              <span className="text-gray-400">Variance:</span>
              <span className={`font-semibold ${variance >= 0 ? 'text-danger' : 'text-success'}`}>
                {variance >= 0 ? `+${variance.toLocaleString()}` : variance.toLocaleString()} kW ({variancePct}%)
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const PredictiveAnalytics = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'eb_officer';

  if (role !== 'grid_operator') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center glass p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-gray-400">This page is restricted to Grid Operators for load and failure forecasting.</p>
      </div>
    );
  }

  const [range, setRange] = useState('7d'); // '24h', '7d', '30d'

  const currentData = forecastData[range];

  // Recommendations array with cost/energy savings
  const recommendations = [
    {
      id: 1,
      title: 'Balance Load on Transformer A',
      action: 'Shift 15% load from Transformer A to Transformer D between 5:00 PM - 8:00 PM during peak.',
      energySavings: '320 kWh',
      costSavings: '₹1,200',
      priority: 'High'
    },
    {
      id: 2,
      title: 'Deploy Storage Battery Support',
      action: 'Discharge substation batteries between 5:00 PM - 7:30 PM to offset peak town demand.',
      energySavings: '450 kWh',
      costSavings: '₹850',
      priority: 'High'
    },
    {
      id: 3,
      title: 'Optimize Industrial Feeder Schedule',
      action: 'Shift non-essential industrial load to off-peak night cycles on Feeder 4.',
      energySavings: '180 kWh',
      costSavings: '₹410',
      priority: 'Medium'
    },
    {
      id: 4,
      title: 'Cycle Non-Essential Grid Nodes',
      action: 'Temporarily cycle municipal reserve equipment and backup pumps on weekends.',
      energySavings: '120 kWh',
      costSavings: '₹280',
      priority: 'Low'
    }
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Predictive Analytics</h1>
          <p className="text-gray-400">AI-driven forecasts for town demand, carbon impact, and optimization.</p>
        </div>
        
        {/* Forecast Range Selector */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
          {[
            { id: '24h', label: '24 Hours' },
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setRange(item.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                range === item.id 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Forecast Accuracy', value: '96.4%', icon: Percent, color: 'text-accent', bg: 'bg-accent/10' },
          { title: 'Estimated Energy Cost', value: '$8,420', icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
          { title: 'Carbon Emissions', value: '12.8 Tons', icon: Leaf, color: 'text-success', bg: 'bg-success/10' },
          { title: 'Sustainability Score', value: '88/100', icon: Award, color: 'text-warning', bg: 'bg-warning/10' }
        ].map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass p-5 rounded-2xl border border-white/10 flex items-center justify-between"
          >
            <div>
              <p className="text-gray-400 text-xs font-medium mb-1">{kpi.title}</p>
              <h4 className="text-2xl font-bold text-white">{kpi.value}</h4>
            </div>
            <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
              <kpi.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="lg:col-span-2 glass p-6 rounded-2xl flex flex-col h-[450px]"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" /> Demand Forecast
              </h3>
              <p className="text-xs text-gray-500 mt-1">Showing confidence interval of ±10% on prediction path</p>
            </div>
            <div className="flex items-center gap-2 bg-success/20 text-success border border-success/30 px-3 py-1 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" /> 95% Confidence Band
            </div>
          </div>
          
          <div className="flex-1 w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="bandColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
                <XAxis dataKey="label" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                
                {/* Confidence band */}
                <Area 
                  type="monotone" 
                  dataKey="predMax" 
                  stroke="transparent"
                  fill="url(#bandColor)" 
                  name="Confidence Band"
                />
                <Area 
                  type="monotone" 
                  dataKey="predMin" 
                  stroke="transparent"
                  fill="transparent" 
                  legendType="none"
                />
                
                {/* Actual usage line */}
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#2563EB" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2 }} 
                  activeDot={{ r: 8 }} 
                  name="Actual Usage" 
                />
                
                {/* Predicted line */}
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#06B6D4" 
                  strokeWidth={3} 
                  strokeDasharray="5 5" 
                  dot={{ r: 4, strokeWidth: 2 }} 
                  name="Predicted Usage" 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Side Panel: Correlation Factors & Peak Alert */}
        <div className="flex flex-col gap-6">
          {/* Peak Demand Alert Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-2xl border border-warning/30 bg-warning/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-warning/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-start gap-4">
              <div className="p-3 bg-warning/20 rounded-xl text-warning">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-base">Peak Demand Alert</h4>
                <p className="text-sm text-warning/90 font-medium">Estimated Peak: 12:00 PM - 2:00 PM</p>
                <p className="text-xs text-gray-400 leading-relaxed mt-1">
                  Peak demand of 3,500 kW projected. Activate battery storage by 11:30 AM to offset grid surge charges.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Correlation Factors */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }} 
            className="glass p-6 rounded-2xl flex flex-col gap-5 flex-1"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-primary" /> Correlation Factors
            </h3>
            
            <div className="space-y-4">
              {[
                { title: 'Weather Impact', value: '84%', icon: Sun, color: 'text-warning', bg: 'bg-warning/10', desc: 'Outside high of 35°C increases HVAC cooling demand.' },
                { title: 'Demand Flow', value: '76%', icon: Users, color: 'text-primary', bg: 'bg-primary/10', desc: 'High suburban residential demand shifts load peak.' },
                { title: 'Historical Trend', value: '92%', icon: Calendar, color: 'text-success', bg: 'bg-success/10', desc: 'High correlation with historical Monday cycles.' }
              ].map((factor, idx) => (
                <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-start gap-4">
                  <div className={`p-3 rounded-xl shrink-0 ${factor.bg} ${factor.color}`}>
                    <factor.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-gray-200 font-semibold text-sm">{factor.title}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${factor.bg} ${factor.color}`}>{factor.value}</span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{factor.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Prioritized AI Recommendations */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass p-6 rounded-2xl border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" /> Prioritized AI Optimization Recommendations
          </h3>
          <span className="text-xs text-gray-400 font-mono">Sorted by Cost Benefit</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-5 bg-white/5 rounded-2xl border border-white/10 flex flex-col justify-between hover:bg-white/10 transition-colors duration-300">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    rec.priority === 'High' ? 'bg-danger/20 text-danger border-danger/30' :
                    rec.priority === 'Medium' ? 'bg-warning/20 text-warning border-warning/30' :
                    'bg-success/20 text-success border-success/30'
                  }`}>
                    {rec.priority} Priority
                  </span>
                </div>
                <h4 className="font-bold text-white text-base">{rec.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{rec.action}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-center">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Est. Savings</p>
                  <p className="text-sm font-bold text-success">{rec.energySavings}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Est. Return</p>
                  <p className="text-sm font-bold text-accent">{rec.costSavings}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PredictiveAnalytics;
