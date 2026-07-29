import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Save, Check, Moon, Sun, Monitor, Mail, Smartphone, Globe, Lock, Eye, EyeOff } from 'lucide-react';

const Settings = () => {
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@ecogrid.ai',
    role: 'Campus Manager',
    phone: '+91 98765 43210',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    faultAlerts: true,
    weeklyReport: true,
    energyThreshold: true,
    deviceOffline: true,
  });

  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'English',
    timezone: 'Asia/Kolkata (IST)',
    autoOptimization: true,
    dataRefreshRate: '30',
    dashboardLayout: 'default',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const Toggle = ({ enabled, onChange }) => (
    <button 
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-gray-600'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'left-7' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="space-y-6 pb-10 max-w-4xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account, notifications, and system preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg ${
            saved 
              ? 'bg-success text-white' 
              : 'bg-primary hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
          }`}
        >
          {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Profile Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/20 rounded-lg text-primary"><User className="w-5 h-5" /></div>
          <h3 className="text-lg font-bold text-white">Profile Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input 
              type="text" 
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <input 
              type="email" 
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
            <select 
              value={profile.role}
              onChange={(e) => setProfile({...profile, role: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary [&>option]:bg-slate-900 transition-colors"
            >
              <option value="Campus Manager">Campus Manager</option>
              <option value="Energy Analyst">Energy Analyst</option>
              <option value="Facility Engineer">Facility Engineer</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
            <input 
              type="tel" 
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-400 mb-1">Change Password</label>
          <div className="relative max-w-md">
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary pr-12 transition-colors"
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6 rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-warning/20 rounded-lg text-warning"><Bell className="w-5 h-5" /></div>
          <h3 className="text-lg font-bold text-white">Notification Preferences</h3>
        </div>

        <div className="space-y-4">
          {[
            { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive system alerts via email', icon: Mail },
            { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Receive critical alerts via SMS', icon: Smartphone },
            { key: 'faultAlerts', label: 'Fault Detection Alerts', desc: 'Get notified when faults are detected', icon: Shield },
            { key: 'weeklyReport', label: 'Weekly Summary Report', desc: 'Automated weekly energy report', icon: Mail },
            { key: 'energyThreshold', label: 'Energy Threshold Warnings', desc: 'Alert when usage exceeds set limits', icon: Bell },
            { key: 'deviceOffline', label: 'Device Offline Alerts', desc: 'Notify when IoT devices go offline', icon: Smartphone },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium text-sm">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </div>
              <Toggle enabled={notifications[item.key]} onChange={() => toggleNotification(item.key)} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* System Preferences Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-6 rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent/20 rounded-lg text-accent"><Palette className="w-5 h-5" /></div>
          <h3 className="text-lg font-bold text-white">System Preferences</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Theme</label>
            <div className="flex gap-2">
              {[
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'system', label: 'System', icon: Monitor },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setPreferences({...preferences, theme: t.value})}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    preferences.theme === t.value 
                      ? 'bg-primary/20 border-primary/50 text-primary' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <t.icon className="w-4 h-4" /> {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Language</label>
            <select 
              value={preferences.language}
              onChange={(e) => setPreferences({...preferences, language: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary [&>option]:bg-slate-900 transition-colors"
            >
              <option value="English">English</option>
              <option value="Tamil">Tamil</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Timezone</label>
            <select 
              value={preferences.timezone}
              onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary [&>option]:bg-slate-900 transition-colors"
            >
              <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York (EST)">America/New_York (EST)</option>
              <option value="Europe/London (GMT)">Europe/London (GMT)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Data Refresh Rate</label>
            <select 
              value={preferences.dataRefreshRate}
              onChange={(e) => setPreferences({...preferences, dataRefreshRate: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary [&>option]:bg-slate-900 transition-colors"
            >
              <option value="10">Every 10 seconds</option>
              <option value="30">Every 30 seconds</option>
              <option value="60">Every 1 minute</option>
              <option value="300">Every 5 minutes</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
          <div>
            <p className="text-white font-medium text-sm">Auto-Optimization</p>
            <p className="text-gray-500 text-xs">Allow AI to automatically apply energy optimizations</p>
          </div>
          <Toggle 
            enabled={preferences.autoOptimization} 
            onChange={() => setPreferences({...preferences, autoOptimization: !preferences.autoOptimization})} 
          />
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass p-6 rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-danger/20 rounded-lg text-danger"><Lock className="w-5 h-5" /></div>
          <h3 className="text-lg font-bold text-white">Security & Access</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
            <div>
              <p className="text-white font-medium text-sm">Two-Factor Authentication</p>
              <p className="text-gray-500 text-xs">Add an extra layer of security to your account</p>
            </div>
            <button className="px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors">
              Enable
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
            <div>
              <p className="text-white font-medium text-sm">Active Sessions</p>
              <p className="text-gray-500 text-xs">You are currently logged in from 1 device</p>
            </div>
            <button className="px-4 py-1.5 bg-danger/20 text-danger border border-danger/30 rounded-lg text-sm font-medium hover:bg-danger/30 transition-colors">
              Revoke All
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
            <div>
              <p className="text-white font-medium text-sm">API Access Keys</p>
              <p className="text-gray-500 text-xs">Manage API keys for third-party integrations</p>
            </div>
            <button className="px-4 py-1.5 bg-white/10 text-white border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
              Manage
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
