import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, TreePine, CloudRain, Factory, CloudLightning } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
import AgentPanel from '../components/AgentPanel';

const mockCarbonData = [
  { month: 'Jan', emissions: 120, target: 150 },
  { month: 'Feb', emissions: 110, target: 140 },
  { month: 'Mar', emissions: 95, target: 130 },
  { month: 'Apr', emissions: 105, target: 120 },
  { month: 'May', emissions: 85, target: 110 },
  { month: 'Jun', emissions: 75, target: 100 },
];

const CarbonAnalytics = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'eb_officer';

  if (role !== 'eb_officer') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center glass p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-gray-400">This page is restricted to Electricity Board Officers.</p>
      </div>
    );
  }

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('EcoGrid AI - Carbon Analytics Report', 20, 20);
    
    doc.setFontSize(14);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 20, 30);
    
    doc.setFontSize(12);
    doc.text('Monthly Sustainability Score: A+', 20, 45);
    doc.text('CO2 Emissions Saved: 45.2 Tons', 20, 55);
    doc.text('Tree Equivalent Saved: 1,240 Trees', 20, 65);
    doc.text('Green Energy Ratio: 35%', 20, 75);
    
    doc.text('AI Analysis:', 20, 90);
    doc.setFontSize(10);
    doc.text('The town has successfully reduced its carbon footprint by 12.5% compared to the', 20, 100);
    doc.text('previous quarter. AI-driven grid optimization contributed to 60% of these savings.', 20, 105);
    
    doc.save('carbon_analytics_report.pdf');
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Carbon Analytics</h1>
          <p className="text-gray-400">Track CO₂ emissions and sustainability scores.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-2xl md:col-span-1">
          <div className="p-3 bg-success/20 w-fit rounded-xl mb-4 text-success"><Leaf className="w-6 h-6" /></div>
          <p className="text-gray-400 text-sm mb-1">CO₂ Emissions Saved</p>
          <h3 className="text-3xl font-bold text-white">45.2 Tons</h3>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-2xl md:col-span-1">
          <div className="p-3 bg-primary/20 w-fit rounded-xl mb-4 text-primary"><TreePine className="w-6 h-6" /></div>
          <p className="text-gray-400 text-sm mb-1">Tree Equivalent Saved</p>
          <h3 className="text-3xl font-bold text-white">1,240 Trees</h3>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6 rounded-2xl md:col-span-1">
          <div className="p-3 bg-accent/20 w-fit rounded-xl mb-4 text-accent"><CloudLightning className="w-6 h-6" /></div>
          <p className="text-gray-400 text-sm mb-1">Green Energy Ratio</p>
          <h3 className="text-3xl font-bold text-white">35%</h3>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6 rounded-2xl md:col-span-1 flex flex-col items-center justify-center border border-success/30 relative overflow-hidden">
           <div className="absolute inset-0 bg-success/5" />
           <h4 className="text-success text-sm font-medium mb-1 z-10">Monthly Sustainability Score</h4>
           <div className="text-5xl font-extrabold text-white z-10 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">A+</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass p-6 rounded-2xl h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">Emission Trends (Tons CO₂)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockCarbonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
              <XAxis dataKey="month" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#10B981', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="emissions" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="#0f172a" stroke="#10B981" strokeDasharray="2 2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass p-6 rounded-2xl flex flex-col">
           <h3 className="text-lg font-bold text-white mb-6">Environmental Impact</h3>
           <div className="flex-1 flex items-center justify-center relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
             <div className="text-center z-10">
               <Factory className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
               <p className="text-gray-400">Detailed AI analysis on carbon footprint reduction will appear here.</p>
               <button 
                 onClick={handleGenerateReport}
                 className="mt-6 px-6 py-2 bg-success/20 text-success border border-success/30 hover:bg-success/30 rounded-xl transition-all"
               >
                 Generate Report
               </button>
             </div>
           </div>
        </motion.div>
      </div>
      {/* AI Agent Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentPanel
          agentName="Carbon Analytics Agent"
          agentColor="text-success"
          agentBg="bg-success/20"
          role="eb_officer"
          suggestedQueries={['Show CO₂ emissions', 'Show renewable energy contribution', 'Generate sustainability report', 'Compare monthly emissions', 'Show zone-wise carbon emissions']}
          defaultOpen={true}
        />
        <AgentPanel
          agentName="Smart Decision Support Agent"
          agentColor="text-cyan-400"
          agentBg="bg-cyan-400/20"
          role="eb_officer"
          suggestedQueries={['Suggest methods to reduce carbon emissions', 'Recommend resource allocation', 'Generate operational recommendations']}
        />
      </div>
    </div>
  );
};

export default CarbonAnalytics;
