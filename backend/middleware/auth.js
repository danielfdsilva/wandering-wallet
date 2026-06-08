import jwt from 'jsonwebtoken';
import { initConfig } from '../config.js';

const { appConfigData } = await initConfig();
const allowedEmails = appConfigData.participants.map(p => p.email);

const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_DURATION = '30d';

class StatusError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const verifyGoogleToken = async (token) => {
  if (!token) {
    throw new StatusError(400, 'Token is required');
  }

  const userInfoRes = await fetch(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!userInfoRes.ok) {
    throw new StatusError(401, 'Failed to fetch user info from Google');
  }

  const userInfo = await userInfoRes.json();

  if (!allowedEmails.includes(userInfo.email)) {
    throw new StatusError(403, 'Email not authorized');
  }

  return {
    email: userInfo.email,
    name: userInfo.name,
    picture: userInfo.picture
  };
};

export const createSessionToken = (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: SESSION_DURATION });
};

export const verifySessionToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    throw new StatusError(401, 'Invalid or expired session');
  }
};

// Keep for backward compat — routes/auth.js calls this
export const verifyToken = verifyGoogleToken;

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  try {
    const user = verifySessionToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(error.status || 401)
      .json({ error: error.message || 'Unauthorized' });
  }
};
