import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Brain, Leaf, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, desc, delay, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    onClick={onClick}
    className="glass p-6 rounded-2xl flex flex-col items-start gap-4 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
  >
    <div className="p-3 bg-primary/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-8 h-8 text-accent" />
    </div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-gray-400">{desc}</p>
    <span className="text-primary text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      Open <ArrowRight className="w-4 h-4" />
    </span>
  </motion.div>
);

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      {/* Animated Background Particles / Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center opacity-30">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px] translate-x-[200px]"
        />
      </div>

      {/* Navbar placeholder */}
      <nav className="relative z-10 flex justify-between items-center p-6 lg:px-16">
        <div className="flex items-center gap-2">
          <Zap className="w-8 h-8 text-primary animate-energy-pulse" />
          <span className="text-2xl font-bold tracking-wider text-white">EcoGrid <span className="text-accent">AI</span></span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/login')} className="px-5 py-2 rounded-full font-medium text-white hover:text-accent transition-colors">
            Login
          </button>
          <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-primary hover:bg-blue-600 rounded-full font-medium text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all">
            Live Dashboard
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center text-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/30 text-accent mb-8"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
          v2.0 Multi-Agent System Live
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight"
        >
          AI-Powered <br className="hidden md:block" />
          <span className="text-gradient">Smart Energy</span> Management
        </motion.h1>



        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-primary hover:bg-blue-600 rounded-full font-bold text-white text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.6)] hover:scale-105 transition-all"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/dashboard/ai-assistant')}
            className="px-8 py-4 glass-button rounded-full font-bold text-white text-lg flex items-center justify-center gap-2 hover:scale-105 transition-all"
          >
            <Brain className="w-5 h-5 text-accent" /> Explore AI Agents
          </button>
        </motion.div>
      </main>

      {/* Feature Cards Section */}
      <section className="relative z-10 px-6 lg:px-16 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <FeatureCard 
            icon={Activity} 
            title="Live Energy Monitoring" 
            desc="Real-time electricity tracking with heatmaps and transformer-wise analytics."
            delay={0.8}
            onClick={() => navigate('/dashboard/energy')}
          />
          <FeatureCard 
            icon={ShieldCheck} 
            title="AI Fault Detection" 
            desc="Predictive maintenance and anomaly detection to prevent power failures."
            delay={1.0}
            onClick={() => navigate('/dashboard/fault')}
          />
          <FeatureCard 
            icon={Leaf} 
            title="Carbon Analytics" 
            desc="Track CO₂ emissions and automatically generate sustainability reports."
            delay={1.2}
            onClick={() => navigate('/dashboard/carbon')}
          />
          <FeatureCard 
            icon={Cpu} 
            title="Smart Automation" 
            desc="Occupancy-based HVAC and lighting control to maximize efficiency."
            delay={1.4}
            onClick={() => navigate('/dashboard/ai-assistant')}
          />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
