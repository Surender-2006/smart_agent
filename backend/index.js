import express from 'express';
import { connectDB } from './db.js';
import healthRouter from './routes/health.js';
import cors from 'cors';
import authRouter from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js';
import devicesRouter from './routes/devices.js';
import aiRouter from './routes/ai.js';
import searchRouter from './routes/search.js';
import orchestrator from './orchestrator.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/devices', devicesRouter);
app.use('/api/ai', aiRouter);
app.use('/api', orchestrator);

import DeviceModel from './models/device.js';

// Auto‑seed sample devices if collection is empty
const seedIfEmpty = async () => {
  try {
    const count = await DeviceModel.countDocuments();
    if (count === 0) {
      const sampleDevices = [
        {
          id: 'TM-001',
          name: 'Solar Panel A',
          type: 'Solar Panel',
          zone: 'North',
          area: 'Main Road',
          houseNumber: '',
          transformer: 'Transformer A',
          lat: 12.97,
          long: 77.59,
          installationDate: '2024-01-15',
          status: 'Online',
          battery: '100%',
          signal: 'Strong',
          location: 'Main Road',
        },
        {
          id: 'TM-002',
          name: 'Wind Turbine B',
          type: 'Wind Turbine',
          zone: 'East',
          area: 'Hill Sector',
          houseNumber: '',
          transformer: 'Transformer B',
          lat: 13.02,
          long: 78.01,
          installationDate: '2023-06-20',
          status: 'Online',
          battery: '95%',
          signal: 'Strong',
          location: 'Hill Sector',
        },
        {
          id: 'TM-003',
          name: 'Smart Meter C',
          type: 'Smart Energy Meter',
          zone: 'South',
          area: 'Residential',
          houseNumber: '12',
          transformer: 'Transformer C',
          lat: 12.85,
          long: 77.45,
          installationDate: '2025-03-10',
          status: 'Online',
          battery: '100%',
          signal: 'Strong',
          location: 'Residential - 12',
        },
        {
          id: 'TM-004',
          name: 'Transformer Monitoring Sensor D',
          type: 'Transformer Monitoring Sensor',
          zone: 'West',
          area: 'Industrial Park',
          houseNumber: '',
          transformer: 'Transformer D',
          lat: 13.10,
          long: 77.80,
          installationDate: '2022-11-05',
          status: 'Online',
          battery: '100%',
          signal: 'Strong',
          location: 'Transformer D',
        },
      ];
      await DeviceModel.insertMany(sampleDevices);
      console.log('✅ Auto‑seeded devices');
    }
  } catch (err) {
    console.error('❌ Auto‑seed error:', err);
  }
};

await connectDB();
await seedIfEmpty();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
