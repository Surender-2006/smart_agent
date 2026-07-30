import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, AlertCircle, CheckCircle, Clock, X, Activity } from 'lucide-react';
import AgentPanel from '../components/AgentPanel';

const faults = [
  { id: 'F-892', equip: 'Transformer C', type: 'Voltage Fluctuation', severity: 'Critical', time: '10 mins ago', status: 'Unresolved', details: 'Input voltage dropped by 18% over a 2-minute window. AI models predict a 85% chance of complete phase loss within 48 hours. Recommend immediate inspection of primary winding.' },
  { id: 'F-891', equip: 'Feeder Line 4', type: 'Phase Overload', severity: 'High', time: '1 hour ago', status: 'In Progress', details: 'Feeder line drawing 35A (Normal is 20A). Overheating detected in thermal sensors. System has been temporarily throttled to 50% capacity.' },
  { id: 'F-890', equip: 'Substation B', type: 'Phase Imbalance', severity: 'Medium', time: '3 hours ago', status: 'Resolved', details: 'Load imbalance detected across Phase L2 and L3. Automated load shedding rebalanced the distribution. Monitored for 2 hours with no recurrence.' },
];

const FaultDetection = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'eb_officer';

  if (role !== 'grid_operator') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center glass p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-gray-400">This page is restricted to Grid Operators for real-time operations.</p>
      </div>
    );
  }

  const [selectedFault, setSelectedFault] = useState(null);
  const [faultList, setFaultList] = useState(faults);
  const [workOrderSuccess, setWorkOrderSuccess] = useState(null);

  const handleGenerateWorkOrder = (faultId) => {
    setFaultList(prev => 
      prev.map(f => f.id === faultId ? { ...f, status: 'In Progress' } : f)
    );
    setWorkOrderSuccess('Work Order Generated! Status updated to In Progress.');
    setTimeout(() => {
      setWorkOrderSuccess(null);
      setSelectedFault(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Fault Detection & Diagnostics</h1>
          <p className="text-gray-400">AI-powered predictive maintenance and real-time alerts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-2xl md:col-span-1 border border-danger/30">
          <div className="flex items-center justify-between mb-4">
             <div className="p-3 bg-danger/20 rounded-xl text-danger"><ShieldAlert className="w-6 h-6 animate-pulse" /></div>
             <span className="text-danger font-bold text-2xl">2</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Critical Faults</h3>
          <p className="text-sm text-gray-400">Requires immediate attention</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-2xl md:col-span-1 border border-warning/30">
          <div className="flex items-center justify-between mb-4">
             <div className="p-3 bg-warning/20 rounded-xl text-warning"><AlertTriangle className="w-6 h-6" /></div>
             <span className="text-warning font-bold text-2xl">5</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Warning Signs</h3>
          <p className="text-sm text-gray-400">Predictive maintenance suggested</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6 rounded-2xl md:col-span-1 border border-success/30">
          <div className="flex items-center justify-between mb-4">
             <div className="p-3 bg-success/20 rounded-xl text-success"><CheckCircle className="w-6 h-6" /></div>
             <span className="text-success font-bold text-2xl">98.5%</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">System Uptime</h3>
          <p className="text-sm text-gray-400">Past 30 days average</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-6">Recent Alerts</h3>
        <div className="space-y-4">
          {faultList.map((fault, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className={`p-3 rounded-full ${fault.severity === 'Critical' ? 'bg-danger/20 text-danger' : fault.severity === 'High' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'}`}>
                  {fault.severity === 'Critical' ? <ShieldAlert className="w-5 h-5" /> : fault.severity === 'High' ? <AlertTriangle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-white font-medium">{fault.equip} - <span className="text-gray-300">{fault.type}</span></h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {fault.time}</span>
                    <span className="text-xs text-gray-500 font-mono">{fault.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 md:ml-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  fault.status === 'Unresolved' ? 'bg-danger/10 text-danger border-danger/30' :
                  fault.status === 'In Progress' ? 'bg-warning/10 text-warning border-warning/30' :
                  'bg-success/10 text-success border-success/30'
                }`}>
                  {fault.status}
                </span>
                <button 
                  onClick={() => {
                    setSelectedFault(fault);
                    setWorkOrderSuccess(null);
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-sm font-medium text-white rounded-lg transition-colors border border-white/10"
                >
                  View Diagnostics
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Diagnostics Modal */}
      <AnimatePresence>
        {selectedFault && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFault(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glass p-8 rounded-2xl border border-white/20 shadow-2xl z-10"
            >
              <button 
                onClick={() => setSelectedFault(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-4 rounded-xl ${selectedFault.severity === 'Critical' ? 'bg-danger/20 text-danger' : selectedFault.severity === 'High' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'}`}>
                  {selectedFault.severity === 'Critical' ? <ShieldAlert className="w-8 h-8" /> : selectedFault.severity === 'High' ? <AlertTriangle className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedFault.equip}</h2>
                  <p className="text-gray-400 text-lg">{selectedFault.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-500 mb-1">Fault ID</p>
                  <p className="font-mono text-white">{selectedFault.id}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-500 mb-1">Time Detected</p>
                  <p className="text-white flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {selectedFault.time}</p>
                </div>
              </div>

              <div className="p-5 bg-white/5 rounded-xl border border-white/10 mb-8">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2"><Activity className="w-5 h-5 text-accent"/> AI Diagnostic Summary</h4>
                <p className="text-gray-300 leading-relaxed">{selectedFault.details}</p>
              </div>

              {workOrderSuccess && (
                <div className="mb-6 p-4 bg-success/20 border border-success/30 text-success rounded-xl text-center font-medium">
                  {workOrderSuccess}
                </div>
              )}
              
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setSelectedFault(null)}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors border border-white/10"
                >
                  Close
                </button>
                <button 
                  onClick={() => handleGenerateWorkOrder(selectedFault.id)}
                  className={`px-6 py-2.5 text-white rounded-xl shadow-lg transition-colors ${selectedFault.severity === 'Critical' ? 'bg-danger hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-primary hover:bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]'}`}
                >
                  Generate Work Order
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* AI Agent Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentPanel
          agentName="Grid Operations Intelligence Agent"
          agentColor="text-danger"
          agentBg="bg-danger/20"
          role="grid_operator"
          suggestedQueries={['Detect transformer faults', 'Show voltage fluctuations', 'Show feeder status', 'Show live grid status']}
          defaultOpen={true}
        />
        <AgentPanel
          agentName="Predictive Maintenance Agent"
          agentColor="text-yellow-400"
          agentBg="bg-yellow-400/20"
          role="grid_operator"
          suggestedQueries={['Predict transformer failure', 'Show all transformer health scores', 'Show maintenance schedule', 'Analyze transformer temperatures']}
        />
      </div>
    </div>
  );
};

export default FaultDetection;
