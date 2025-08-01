const ALLOWED_EMAILS = ['danielfdsilva@gmail.com'];

class StatusError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const verifyToken = async (token) => {
  if (!token) {
    throw new StatusError(400, 'Token is required');
  }

  // Fetch user info from Google using the access_token
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

  if (!ALLOWED_EMAILS.includes(userInfo.email)) {
    throw new StatusError(403, 'Email not authorized');
  }

  return {
    email: userInfo.email,
    name: userInfo.name,
    picture: userInfo.picture
  };
};

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  try {
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res
      .status(error.status || 500)
      .json({ error: error.message || 'Internal Server Error' });
  }
};
