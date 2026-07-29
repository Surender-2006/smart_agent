import { Router } from 'express';

const router = Router();

// Base data templates
const baseTodayData = [
  { time: '08:00', usage: 1800 },
  { time: '09:00', usage: 2200 },
  { time: '10:00', usage: 2500 },
  { time: '11:00', usage: 2900 },
  { time: '12:00', usage: 3240 },
  { time: '13:00', usage: 3180 },
  { time: '14:00', usage: 3100 },
  { time: '15:00', usage: 2950 },
  { time: '16:00', usage: 2800 },
  { time: '17:00', usage: 2400 },
  { time: '18:00', usage: 2100 },
];

const baseWeekData = [
  { time: 'Mon', usage: 15200, target: 16000 },
  { time: 'Tue', usage: 16800, target: 16000 },
  { time: 'Wed', usage: 14500, target: 16000 },
  { time: 'Thu', usage: 17100, target: 16000 },
  { time: 'Fri', usage: 18900, target: 16000 },
  { time: 'Sat', usage: 9800, target: 10000 },
  { time: 'Sun', usage: 8400, target: 10000 },
];

const baseMonthData = [
  { time: 'Week 1', usage: 112000, target: 120000 },
  { time: 'Week 2', usage: 108000, target: 120000 },
  { time: 'Week 3', usage: 115000, target: 120000 },
  { time: 'Week 4', usage: 105000, target: 120000 },
];

// Helper functions for live fluctuations
const fluctuate = (value, range) => Math.max(0, +(value + (Math.random() - 0.5) * range).toFixed(1));
const fluctuateInt = (value, range) => Math.max(0, Math.round(value + (Math.random() - 0.5) * range));

router.get('/summary', (req, res) => {
  const timeframe = req.query.timeframe || 'today';

  let chartData = baseTodayData;
  if (timeframe === 'week') {
    chartData = baseWeekData.map(p => ({ ...p, usage: fluctuateInt(p.usage, 1200) }));
  } else if (timeframe === 'month') {
    chartData = baseMonthData.map(p => ({ ...p, usage: fluctuateInt(p.usage, 8000) }));
  } else {
    chartData = baseTodayData.map(p => ({ ...p, usage: fluctuateInt(p.usage, 300) }));
  }

  res.json({
    kpis: {
      totalEnergy: fluctuate(45.2, 3),
      currentPower: fluctuateInt(3240, 400),
      costSavings: fluctuateInt(12450, 800),
      carbonSaved: fluctuate(18.5, 1.5),
    },
    chartData,
    lastUpdate: new Date().toISOString()
  });
});

export default router;
