const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // For local dev/demo simplicity without mandatory token header block:
    req.user = { uid: 'farmer_demo_123', email: 'farmer@agri.org', name: 'Ramesh Kumar' };
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No authentication token provided' });
  }

  // Set mock user from token or default
  req.user = { uid: 'farmer_' + token.substring(0, 8), email: 'farmer@agri.org', name: 'Ramesh Kumar' };
  next();
};

module.exports = authMiddleware;
