import { OAuth2Client } from 'google-auth-library';

const ALLOWED_EMAILS = ['danielfdsilva@gmail.com'];
const client = new OAuth2Client();

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    if (!ALLOWED_EMAILS.includes(email)) {
      return res.status(403).json({ error: 'Email not authorized' });
    }

    req.user = {
      email: email,
      name: payload.name,
      picture: payload.picture
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};
