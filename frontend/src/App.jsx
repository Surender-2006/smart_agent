import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import EnergyMonitoring from './pages/EnergyMonitoring';
import AIAssistant from './pages/AIAssistant';
import AgentChat from './pages/AgentChat';
import FaultDetection from './pages/FaultDetection';
import CarbonAnalytics from './pages/CarbonAnalytics';
import PredictiveAnalytics from './pages/PredictiveAnalytics';
import IoTDevices from './pages/IoTDevices';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="bg-gradient-premium min-h-screen text-text">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Dashboard Nested Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="energy" element={<EnergyMonitoring />} />
            <Route path="fault" element={<FaultDetection />} />
            <Route path="carbon" element={<CarbonAnalytics />} />
            <Route path="predictions" element={<PredictiveAnalytics />} />
            <Route path="iot" element={<IoTDevices />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="agents/:agentId" element={<AgentChat />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
