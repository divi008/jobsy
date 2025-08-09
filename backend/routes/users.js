import express from 'express';
import User from '../models/User.js';
import Bet from '../models/Bet.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// @route   GET api/users/leaderboard
// @desc    Get top users with computed success/streak
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const userIds = users.map(u => u._id);

    // Compute resolved-bet-based success rate per user
    const stats = await Bet.aggregate([
      { $match: { user: { $in: userIds } } },
      {
        $group: {
          _id: '$user',
          total: { $sum: 1 },
          won: { $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ['$status', 'lost'] }, 1, 0] } },
          expired: { $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] } }
        }
      }
    ]);

    const idToStats = new Map(stats.map(s => [String(s._id), s]));

    const enriched = users.map(u => {
      const s = idToStats.get(String(u._id)) || { won: 0, lost: 0, expired: 0 };
      const resolved = (s.won || 0) + (s.lost || 0) + (s.expired || 0);
      const successRate = resolved > 0 ? (s.won / resolved) * 100 : 0;
      return {
        ...u.toObject(),
        successRate,
        streak: u.streak ?? u.streakCount ?? 0,
      };
    });

    // Keep existing ordering criterion (winnings desc) to avoid UI surprises
    enriched.sort((a, b) => (b.winnings || 0) - (a.winnings || 0));

    res.json(enriched.slice(0, 100));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/profile/:id
// @desc    Get user profile by ID
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/me
// @desc    Get current user's profile with admin flag
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/admin/check
// @desc    Check if current user is admin
router.get('/admin/check', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('isAdmin role');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ isAdmin: Boolean(user.isAdmin) || user.role === 'admin' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/admin/promote/:id
// @desc    Promote a user to admin (admin only)
router.post('/admin/promote/:id', auth, admin, async (req, res) => {
  try {
    const toPromote = await User.findById(req.params.id);
    if (!toPromote) return res.status(404).json({ msg: 'User not found' });
    toPromote.isAdmin = true;
    toPromote.role = 'admin';
    await toPromote.save();
    res.json({ msg: 'Promoted to admin' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DEV ONLY: Promote current user to admin
router.post('/make-admin', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    // Check if user should be admin based on ADMIN_EMAILS
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
    
    const shouldBeAdmin = adminEmails.includes(user.email.toLowerCase());
    
    user.isAdmin = true;
    user.role = 'admin';
    await user.save();
    
    res.json({ 
      msg: 'User promoted to admin', 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        isAdmin: user.isAdmin, 
        tokens: user.tokens 
      },
      adminEmails,
      shouldBeAdmin,
      userEmail: user.email.toLowerCase()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DEV ONLY: Check current user's admin status
router.get('/check-admin-status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
    
    const shouldBeAdmin = adminEmails.includes(user.email.toLowerCase());
    
    res.json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        isAdmin: user.isAdmin,
        role: user.role
      },
      adminEmails,
      shouldBeAdmin,
      userEmail: user.email.toLowerCase(),
      envAdminEmails: process.env.ADMIN_EMAILS
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;