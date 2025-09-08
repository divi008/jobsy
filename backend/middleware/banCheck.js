export default function banCheck(action) {
  // action: 'confession' | 'comment'
  return (req, res, next) => {
    try {
      const user = req.user; // set by auth middleware
      if (!user) return res.status(401).json({ msg: 'Unauthorized' });

      // Admin bypass
      if (user.role === 'admin') return next();

      const isBanned = user.isBanned;
      const banType = user.banType;

      if (!isBanned) return next();

      const blocked = banType === 'both' || banType === action;
      if (blocked) {
        return res.status(403).json({ msg: 'You have been banned from posting. Please contact jobsy.noreply@gmail.com for appeal.' });
      }

      return next();
    } catch (e) {
      return res.status(500).json({ msg: 'Ban check failed' });
    }
  }
}





