// backend/routes/ai.js
import { Router } from 'express';
import { processRequest } from '../orchestratorService.js';

const router = Router();

router.post('/chat', async (req, res) => {
  const { message, role } = req.body;
  if (!message) return res.status(400).json({ error: 'Message content is required' });

  try {
    const result = await processRequest({ role: role || 'eb_officer', query: message });
    res.json(result);
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
