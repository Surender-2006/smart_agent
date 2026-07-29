import { Router } from 'express';
import DeviceModel from '../models/device.js';

const router = Router();

// Convert a Mongoose document into the shape expected by the frontend
const toDeviceDTO = (doc) => ({
  id: doc.id,
  name: doc.name,
  type: doc.type,
  zone: doc.zone,
  area: doc.area,
  houseNumber: doc.houseNumber,
  transformer: doc.transformer,
  lat: doc.lat,
  long: doc.long,
  installationDate: doc.installationDate,
  status: doc.status,
  battery: doc.battery,
  signal: doc.signal,
  location: doc.location,
});

// ---------------------------------------------------------------------
// GET all devices
// ---------------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const docs = await DeviceModel.find();
    res.json(docs.map(toDeviceDTO));
  } catch (err) {
    console.error('❌ Device fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// ---------------------------------------------------------------------
// CREATE a new device
// ---------------------------------------------------------------------
router.post('/', async (req, res) => {
  const {
    name,
    type,
    zone,
    area,
    houseNumber,
    transformer,
    lat,
    long,
    installationDate,
    status,
    battery,
    signal,
  } = req.body;

  // Simple ID generation – replace with a proper scheme if needed
  const id = `TM-0${Math.floor(Math.random() * 1000)}`;

  // Build a readable location string
  let location = area;
  if (houseNumber) {
    location = `${area} - ${houseNumber}`;
  } else if (type === 'Transformer Monitoring Sensor') {
    location = transformer;
  }

  const newDevice = new DeviceModel({
    id,
    name: name || `Device ${id}`,
    type: type || 'Smart Energy Meter',
    zone: zone || 'Zone West',
    area: area || 'Main Road',
    houseNumber: houseNumber || '',
    transformer: transformer || 'Transformer A',
    lat: lat || 12.97,
    long: long || 77.59,
    installationDate: installationDate || new Date().toISOString().split('T')[0],
    status: status || 'Online',
    battery: battery || '100%',
    signal: signal || 'Strong',
    location,
  });

  try {
    const saved = await newDevice.save();
    res.status(201).json(toDeviceDTO(saved));
  } catch (err) {
    console.error('❌ Device save error:', err);
    res.status(500).json({ error: 'Failed to save device' });
  }
});

// ---------------------------------------------------------------------
// RESTART a device (updates status, battery, signal)
// ---------------------------------------------------------------------
router.post('/:id/restart', async (req, res) => {
  const { id } = req.params;
  try {
    const device = await DeviceModel.findOne({ id });
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    device.status = 'Online';
    if (!device.battery || device.battery === 'N/A' || parseInt(device.battery) < 50) {
      device.battery = '100%';
    }
    device.signal = 'Strong';
    await device.save();
    res.json({ message: `Device ${id} restarted successfully`, device: toDeviceDTO(device) });
  } catch (err) {
    console.error('❌ Restart error:', err);
    res.status(500).json({ error: 'Failed to restart device' });
  }
});

export default router;
