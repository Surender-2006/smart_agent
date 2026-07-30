import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Battery, Radio, AlertTriangle, X, Activity, Server, MapPin } from 'lucide-react';
import axios from 'axios';
import AgentPanel from '../components/AgentPanel';

const IoTDevices = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'eb_officer';

  if (role === 'consumer') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center glass p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-gray-400">Residential consumers do not have access to IoT management dashboards.</p>
      </div>
    );
  }

  const [deviceList, setDeviceList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [mode, setMode] = useState('house'); // 'house' or 'transformer'

  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'Smart Energy Meter',
    zone: 'Zone North',
    area: '',
    houseNumber: '',
    transformer: 'Transformer A',
    lat: '12.9716',
    long: '77.5946',
    installationDate: new Date().toISOString().split('T')[0],
    status: 'Online',
    battery: '100%',
    signal: 'Strong'
  });

  const fetchDevices = async () => {
    try {
      const response = await axios.get('/api/devices');
      setDeviceList(response.data);
      if (selectedDevice) {
        const updated = response.data.find(d => d.id === selectedDevice.id);
        if (updated) setSelectedDevice(updated);
      }
    } catch (err) {
      console.error('Error fetching devices:', err);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleAddDevice = async (e) => {
    e.preventDefault();
    if (!newDevice.name || !newDevice.area) return;
    
    try {
      await axios.post('/api/devices', {
        ...newDevice,
        lat: parseFloat(newDevice.lat),
        long: parseFloat(newDevice.long)
      });
      setShowAddModal(false);
      setNewDevice({
        name: '',
        type: 'Smart Energy Meter',
        zone: 'Zone North',
        area: '',
        houseNumber: '',
        transformer: 'Transformer A',
        lat: '12.9716',
        long: '77.5946',
        installationDate: new Date().toISOString().split('T')[0],
        status: 'Online',
        battery: '100%',
        signal: 'Strong'
      });
      fetchDevices();
    } catch (err) {
      console.error('Error adding device:', err);
    }
  };

  const handleRestartDevice = async (id) => {
    try {
      const response = await axios.post(`/api/devices/${id}/restart`);
      fetchDevices();
      setSelectedDevice(response.data.device);
    } catch (err) {
      console.error('Error restarting device:', err);
    }
  };

  // Filter devices based on current mode
  const filteredDevices = deviceList.filter(device => {
    const isTransformerSensor = 
      device.type === 'Transformer Monitoring Sensor' || 
      device.location === 'Transformer A' || 
      device.location === 'Transformer B' || 
      device.location === 'Transformer C' || 
      device.location === 'Transformer D' || 
      device.location === 'Transformer E';
      
    if (mode === 'house') {
      return !isTransformerSensor;
    } else {
      return isTransformerSensor;
    }
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">IoT Device Management</h1>
          <p className="text-gray-400">Live status of IoT devices deployed across the town's electrical distribution network.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Top-Level Mode Selector Switch */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
            <button
              onClick={() => setMode('house')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === 'house' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              House Usage
            </button>
            <button
              onClick={() => setMode('transformer')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === 'transformer' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Transformer Usage
            </button>
          </div>
          {role === 'eb_officer' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              Add Device
            </button>
          )}
        </div>
      </div>

      <div className="glass p-6 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm">
                <th className="pb-3 px-4 font-medium">Device ID</th>
                <th className="pb-3 px-4 font-medium">
                  {mode === 'house' ? 'Smart Meter' : 'Transformer Monitoring Sensor'}
                </th>
                <th className="pb-3 px-4 font-medium">
                  {mode === 'house' ? 'House Location' : 'Transformer Name'}
                </th>
                <th className="pb-3 px-4 font-medium">Status</th>
                <th className="pb-3 px-4 font-medium">Battery</th>
                <th className="pb-3 px-4 font-medium">Signal</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((device, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={device.id || idx} 
                  onClick={() => setSelectedDevice(device)}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-4 font-medium text-white">{device.id}</td>
                  <td className="py-4 px-4 text-gray-300">{device.type}</td>
                  <td className="py-4 px-4 text-gray-300">{device.location}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      device.status === 'Online' ? 'bg-success/20 text-success border-success/30' :
                      device.status === 'Offline' ? 'bg-danger/20 text-danger border-danger/30' :
                      'bg-warning/20 text-warning border-warning/30'
                    }`}>
                      {device.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    <div className="flex items-center gap-2">
                       <Battery className={`w-4 h-4 ${parseInt(device.battery) < 30 ? 'text-danger animate-pulse' : 'text-gray-400'}`} /> {device.battery}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    <div className="flex items-center gap-2">
                       <Radio className="w-4 h-4 text-gray-400" /> {device.signal}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Device Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl glass p-8 rounded-2xl border border-white/20 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-6">Add New IoT Device</h2>
              
              <form onSubmit={handleAddDevice} className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Device ID</label>
                    <input 
                      type="text" 
                      value="Auto Generated"
                      disabled
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gray-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Device Name</label>
                    <input 
                      type="text" 
                      value={newDevice.name}
                      onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                      placeholder="e.g. Residential Meter 103"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Device Type</label>
                    <select 
                      value={newDevice.type}
                      onChange={(e) => setNewDevice({...newDevice, type: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary [&>option]:bg-slate-900"
                    >
                      <option value="Smart Energy Meter">Smart Energy Meter</option>
                      <option value="Transformer Monitoring Sensor">Transformer Monitoring Sensor</option>
                      <option value="Voltage Sensor">Voltage Sensor</option>
                      <option value="Current Sensor">Current Sensor</option>
                      <option value="Temperature Sensor">Temperature Sensor</option>
                      <option value="Power Quality Sensor">Power Quality Sensor</option>
                      <option value="Distribution Line Sensor">Distribution Line Sensor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Town Zone</label>
                    <input 
                      type="text" 
                      value={newDevice.zone}
                      onChange={(e) => setNewDevice({...newDevice, zone: e.target.value})}
                      placeholder="e.g. Zone North"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Area / Street Name</label>
                    <input 
                      type="text" 
                      value={newDevice.area}
                      onChange={(e) => setNewDevice({...newDevice, area: e.target.value})}
                      placeholder="e.g. North Street"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">House (Opt.)</label>
                    <input 
                      type="text" 
                      value={newDevice.houseNumber}
                      onChange={(e) => setNewDevice({...newDevice, houseNumber: e.target.value})}
                      placeholder="House 103"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Transformer Assignment</label>
                    <select 
                      value={newDevice.transformer}
                      onChange={(e) => setNewDevice({...newDevice, transformer: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary [&>option]:bg-slate-900"
                    >
                      <option value="Transformer A">Transformer A</option>
                      <option value="Transformer B">Transformer B</option>
                      <option value="Transformer C">Transformer C</option>
                      <option value="Transformer D">Transformer D</option>
                      <option value="Transformer E">Transformer E</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Installation Date</label>
                    <input 
                      type="date" 
                      value={newDevice.installationDate}
                      onChange={(e) => setNewDevice({...newDevice, installationDate: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Latitude</label>
                    <input 
                      type="text" 
                      value={newDevice.lat}
                      onChange={(e) => setNewDevice({...newDevice, lat: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Longitude</label>
                    <input 
                      type="text" 
                      value={newDevice.long}
                      onChange={(e) => setNewDevice({...newDevice, long: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                    <select 
                      value={newDevice.status}
                      onChange={(e) => setNewDevice({...newDevice, status: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary [&>option]:bg-slate-900"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Warning">Warning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Battery Level</label>
                    <input 
                      type="text" 
                      value={newDevice.battery}
                      onChange={(e) => setNewDevice({...newDevice, battery: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Signal Strength</label>
                    <input 
                      type="text" 
                      value={newDevice.signal}
                      onChange={(e) => setNewDevice({...newDevice, signal: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg shadow-lg transition-colors"
                  >
                    Provision Device
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Device Details Modal */}
      <AnimatePresence>
        {selectedDevice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDevice(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass p-8 rounded-2xl border border-white/20 shadow-2xl z-10"
            >
              <button 
                onClick={() => setSelectedDevice(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary/20 text-primary rounded-xl">
                  <Server className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedDevice.id}</h2>
                  <p className="text-gray-400">{selectedDevice.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-left">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${
                      selectedDevice.status === 'Online' ? 'bg-success/20 text-success border-success/30' :
                      selectedDevice.status === 'Offline' ? 'bg-danger/20 text-danger border-danger/30' :
                      'bg-warning/20 text-warning border-warning/30'
                    }`}>
                      {selectedDevice.status}
                  </span>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-white flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400"/> {selectedDevice.location}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-500 mb-1">Transformer</p>
                  <p className="text-white font-medium">{selectedDevice.transformer}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-500 mb-1">Town Zone</p>
                  <p className="text-white font-medium">{selectedDevice.zone || 'Zone North'}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-500 mb-1">Battery Level</p>
                  <p className="text-white flex items-center gap-1"><Battery className="w-4 h-4 text-primary"/> {selectedDevice.battery}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-500 mb-1">Signal Strength</p>
                  <p className="text-white flex items-center gap-1"><Radio className="w-4 h-4 text-success"/> {selectedDevice.signal}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                <button 
                  onClick={() => setSelectedDevice(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
                >
                  Close
                </button>
                <button 
                  onClick={() => handleRestartDevice(selectedDevice.id)}
                  className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg transition-colors"
                >
                  Restart Device
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* AI Agent Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {role === 'eb_officer' && (
          <AgentPanel
            agentName="Anomaly Detection Agent"
            agentColor="text-orange-400"
            agentBg="bg-orange-400/20"
            role={role}
            suggestedQueries={['Detect possible electricity theft', 'Check faulty smart meters', 'Show abnormal consumption patterns', 'Show full anomaly report']}
            defaultOpen={true}
          />
        )}
        {role === 'eb_officer' && (
          <AgentPanel
            agentName="Smart Decision Support Agent"
            agentColor="text-cyan-400"
            agentBg="bg-cyan-400/20"
            role={role}
            suggestedQueries={['Show IoT device status', 'Show consumer statistics', 'Recommend resource allocation']}
          />
        )}
        {role === 'grid_operator' && (
          <AgentPanel
            agentName="Anomaly Detection Agent"
            agentColor="text-orange-400"
            agentBg="bg-orange-400/20"
            role={role}
            suggestedQueries={['Detect transformer anomalies', 'Check faulty IoT sensors', 'Show full anomaly report']}
            defaultOpen={true}
          />
        )}
        {role === 'grid_operator' && (
          <AgentPanel
            agentName="Grid Operations Intelligence Agent"
            agentColor="text-danger"
            agentBg="bg-danger/20"
            role={role}
            suggestedQueries={['Show live grid status', 'Check power quality', 'Show feeder status']}
          />
        )}
      </div>
    </div>
  );
};

export default IoTDevices;
