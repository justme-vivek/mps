const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — requires a valid token from ANY active account (user or admin).
 * Role is re-read from the database on every request, so a stale token
 * can never grant admin access after the role has been changed.
 */
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Not authorized, account unavailable' });
    }

    // A password change/reset invalidates every token issued before it
    if (
      user.passwordChangedAt &&
      decoded.iat * 1000 < user.passwordChangedAt.getTime()
    ) {
      return res.status(401).json({
        message: 'Your session ended because the password was changed. Please sign in again.',
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

/**
 * adminOnly — must run AFTER protect. Returns 403 for non-admin accounts.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
};

/**
 * optionalAuth — attaches req.user when a valid token is present,
 * otherwise continues as guest. Used on public read endpoints so the
 * app can show favourite states without blocking guests.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (header.startsWith('Bearer ')) {
      const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) req.user = user;
    }
  } catch (error) {
    // invalid/expired token on a public route → treat as guest
  }
  next();
};

module.exports = { protect, adminOnly, optionalAuth };
