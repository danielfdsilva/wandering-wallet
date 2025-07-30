import express from 'express';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const client = new OAuth2Client();

// Verify Google token and return user info if authorized
router.post('/verify-token', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    if (payload.email !== 'danielfdsilva@gmail.com') {
      return res.status(403).json({ error: 'Email not authorized' });
    }

    res.json({
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
