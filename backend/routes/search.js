import { Router } from 'express';

const router = Router();

const searchData = {
  buildings: [
    {
      id: 'transformer-a',
      title: 'Transformer A',
      type: 'building',
      usage: 'Load: 72% | Voltage: 11 kV | Power: 1.8 MW | Temp: 48°C | Status: Healthy',
      description: 'Secondary windings operating at normal parameters. Cooling system inactive.',
      prediction: 'Evening peak load expected at 7 PM. AI recommends shifting 15% load to Transformer D if load exceeds 90%.',
    },
    {
      id: 'transformer-b',
      title: 'Transformer B',
      type: 'building',
      usage: 'Load: 91% | Voltage: 11 kV | Power: 2.4 MW | Temp: 66°C | Status: High Load',
      description: 'High thermal stress detected. Auto-cooling fans active. Monitor oil level.',
      prediction: 'Predicted peak: 2.6 MW at 7:30 PM. AI recommends automatic load shedding on non-essential feeders.',
    },
    {
      id: 'transformer-c',
      title: 'Transformer C',
      type: 'building',
      usage: 'Load: 98% | Voltage: 11 kV | Power: 2.8 MW | Temp: 79°C | Status: Critical',
      description: 'Thermal threshold exceeded. Primary winding phase imbalance detected.',
      prediction: 'Voltage fluctuation registered. Recommending dispatching maintenance crew immediately to avoid outage.',
    },
    {
      id: 'transformer-d',
      title: 'Transformer D',
      type: 'building',
      usage: 'Load: 45% | Voltage: 11 kV | Power: 1.1 MW | Temp: 42°C | Status: Healthy',
      description: 'Grid zone backup transformer online. Idle capacity available.',
      prediction: 'Available to absorb up to 1.2 MW of redirected load from Transformer B or C.',
    }
  ],
  devices: [
    { id: 'SM-101', title: 'SM-101 (Smart Meter)', type: 'device', location: 'Transformer A', status: 'Online', detail: 'Battery: 100%, Signal: Strong, IP: 192.168.1.101' },
    { id: 'HVAC-02', title: 'HVAC-02 (Feeder Controller)', type: 'device', location: 'Transformer C', status: 'Offline', detail: 'Battery: N/A, Signal: Lost, IP: 192.168.1.102' },
    { id: 'LIGHT-45', title: 'LIGHT-45 (Feeder Monitor)', type: 'device', location: 'Substation West', status: 'Online', detail: 'Battery: 85%, Signal: Good, IP: 192.168.1.145' },
    { id: 'SENS-08', title: 'SENS-08 (Temp Sensor)', type: 'device', location: 'Transformer B', status: 'Warning', detail: 'Battery: 15%, Signal: Weak, IP: 192.168.1.108' }
  ],
  faults: [
    { id: 'F-892', title: 'Fault F-892: Voltage Fluctuation', type: 'fault', location: 'Transformer C', status: 'Critical', detail: 'Severity: Critical. Action: Predictive maintenance within 48 hrs.' },
    { id: 'F-743', title: 'Fault F-743: Feeder Controller Offline', type: 'fault', location: 'Transformer C', status: 'High', detail: 'Severity: High. Action: Technician dispatch recommended.' }
  ],
  reports: [
    { id: 'rep-weekly', title: 'Weekly Energy Analytics Report', type: 'report', detail: 'Format: PDF. Generation Date: Today. Covers town-wide grid energy usage breakdown.' },
    { id: 'rep-sustain', title: 'Sustainability Score Report', type: 'report', detail: 'Format: XLSX. Generation Date: Yesterday. Includes carbon footprints and savings.' },
    { id: 'rep-costs', title: 'Cost Savings & Carbon Reduction Report', type: 'report', detail: 'Format: PDF. Generation Date: 3 Days Ago. Details optimization efficiency metrics.' }
  ]
};

router.get('/', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  if (!query) {
    return res.json([]);
  }

  const results = [];

  // Search buildings
  searchData.buildings.forEach(b => {
    if (b.title.toLowerCase().includes(query) || b.description.toLowerCase().includes(query) || b.prediction.toLowerCase().includes(query)) {
      results.push(b);
    }
  });

  // Search devices
  searchData.devices.forEach(d => {
    if (d.title.toLowerCase().includes(query) || d.id.toLowerCase().includes(query) || d.location.toLowerCase().includes(query) || d.status.toLowerCase().includes(query)) {
      results.push(d);
    }
  });

  // Search faults
  searchData.faults.forEach(f => {
    if (f.title.toLowerCase().includes(query) || f.location.toLowerCase().includes(query) || f.status.toLowerCase().includes(query)) {
      results.push(f);
    }
  });

  // Search reports
  searchData.reports.forEach(r => {
    if (r.title.toLowerCase().includes(query) || r.detail.toLowerCase().includes(query)) {
      results.push(r);
    }
  });

  res.json(results);
});

export default router;
