import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async function admin(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    // Check if user is admin
    const user = await User.findById(req.user.id).select('isAdmin role email');
    console.log('Admin middleware check:', {
      userId: req.user.id,
      userEmail: user?.email,
      isAdmin: user?.isAdmin,
      role: user?.role,
      adminEmails: process.env.ADMIN_EMAILS
    });
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ 
        msg: 'Access denied, not an admin',
        debug: {
          userId: req.user.id,
          userEmail: user?.email,
          isAdmin: user?.isAdmin,
          role: user?.role
        }
      });
    }
    next();
  } catch (err) {
    console.error('Admin middleware error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

