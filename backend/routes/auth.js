import express from 'express';
import {
  verifyToken,
  createSessionToken,
  verifySessionToken
} from '../middleware/auth.js';

const router = express.Router();

router.post('/verify-token', async (req, res) => {
  const { token } = req.body;

  try {
    const user = await verifyToken(token);
    const sessionToken = createSessionToken(user);
    res.json({ user, sessionToken });
  } catch (error) {
    console.error('Authentication error:', error);
    return res
      .status(error.status || 500)
      .json({ error: error.message || 'Internal Server Error' });
  }
});

router.post('/verify-session', (req, res) => {
  const { token } = req.body;

  try {
    const user = verifySessionToken(token);
    res.json({ user });
  } catch (error) {
    return res
      .status(error.status || 401)
      .json({ error: error.message || 'Unauthorized' });
  }
});

export default router;
