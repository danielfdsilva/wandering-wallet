import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Verify Google token and return user info if authorized
router.post('/verify-token', async (req, res) => {
  const { token } = req.body;

  try {
    const user = await verifyToken(token);
    res.json({
      user
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res
      .status(error.status || 500)
      .json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;
