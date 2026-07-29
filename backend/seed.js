import { connectDB } from './db.js';
import DeviceModel from './models/device.js';

// Sample device data
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

(async () => {
  try {
    await connectDB();
    // Optional: clear existing devices to avoid duplicates
    await DeviceModel.deleteMany({});
    const result = await DeviceModel.insertMany(sampleDevices);
    console.log('✅ Seeded', result.length, 'devices');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    process.exit(0);
  }
})();
