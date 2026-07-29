import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = 'ecogrid-secret-key-12345';

router.post('/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Simple validation for mock auth
  const token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: '24h' });

  return res.json({
    token,
    user: {
      email,
      role: role || 'student',
      name: email.split('@')[0]
    }
  });
});

export default router;
