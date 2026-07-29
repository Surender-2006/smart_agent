import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/ping', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status: 'ok', db: dbState });
});

export default router;
