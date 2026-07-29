import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Power, Settings2, Sparkles, TrendingDown } from 'lucide-react';

const Optimization = () => {
  const [opts, setOpts] = useState([
    { id: 1, title: 'Dim Corridors B & C', desc: 'No occupancy detected for 30+ mins.', savings: '2.4 kW', auto: true },
    { id: 2, title: 'Increase HVAC Temp by 2°C', desc: 'Outside temperature dropped below 22°C.', savings: '15.6 kW', auto: false },
    { id: 3, title: 'Shutdown Idle Lab Equipment', desc: '14 workstations left powered on in standby.', savings: '4.8 kW', auto: false },
  ]);

  const [controls, setControls] = useState([
    { id: 1, label: 'Smart Lighting Control', status: true, impact: 2.1 },
    { id: 2, label: 'HVAC Occupancy Sync', status: true, impact: 4.5 },
    { id: 3, label: 'Idle Equipment Shutdown', status: false, impact: 3.2 },
    { id: 4, label: 'Peak Load Shaving', status: true, impact: 5.9 },
  ]);

  const handleApply = (id) => {
    setOpts(opts.map(opt => opt.id === id ? { ...opt, auto: true } : opt));
  };

  const handleToggle = (id) => {
    setControls(controls.map(c => c.id === id ? { ...c, status: !c.status } : c));
  };

  const estimatedSavings = controls.filter(c => c.status).reduce((acc, c) => acc + c.impact, 0).toFixed(1);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Smart Automation & Optimization</h1>
          <p className="text-gray-400">AI-generated recommendations to maximize energy efficiency.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success border border-success/30 rounded-lg">
           <Sparkles className="w-5 h-5" />
           <span className="font-medium text-sm">Auto-Optimization Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 glass p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">AI Recommendations</h3>
          <div className="flex-1 space-y-4">
            {opts.map((opt) => (
              <div key={opt.id} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-primary/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                   <div className="p-2 bg-primary/20 rounded-lg text-primary mt-1">
                      <Cpu className="w-5 h-5" />
                   </div>
                   <div>
                     <h4 className="text-white font-medium text-lg">{opt.title}</h4>
                     <p className="text-gray-400 text-sm">{opt.desc}</p>
                     <div className="flex items-center gap-2 mt-2">
                       <span className="text-xs font-medium text-success flex items-center gap-1">
                         <TrendingDown className="w-3 h-3" /> Save {opt.savings}/hr
                       </span>
                       {opt.auto && <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded border border-accent/30">Auto-Applied</span>}
                     </div>
                   </div>
                </div>
                {!opt.auto && (
                  <button 
                    onClick={() => handleApply(opt.id)}
                    className="px-6 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg shadow-md transition-all self-start sm:self-center"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Automation Controls</h3>
          <div className="space-y-6">
            {controls.map((control) => (
              <div key={control.id} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Settings2 className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300 font-medium">{control.label}</span>
                 </div>
                 <button 
                   onClick={() => handleToggle(control.id)}
                   className={`relative w-12 h-6 rounded-full transition-colors ${control.status ? 'bg-primary' : 'bg-gray-600'}`}
                 >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${control.status ? 'left-7' : 'left-1'}`} />
                 </button>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-xl">
             <div className="flex items-center gap-2 mb-2">
                <Power className="w-5 h-5 text-primary" />
                <span className="font-bold text-white">Estimated Monthly Savings</span>
             </div>
             <div className="text-3xl font-extrabold text-primary">{estimatedSavings}%</div>
             <p className="text-xs text-gray-400 mt-1">Based on current automation rules</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Optimization;
