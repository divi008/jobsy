import express from 'express';
import CompanyBetEvent from '../models/CompanyBetEvent.js';
import Candidate from '../models/Candidate.js'; // Make sure this is imported
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Bet from '../models/Bet.js';

const router = express.Router();

// @route   GET api/events/active
// @desc    Get all active company betting events
router.get('/active', async (req, res) => {
  try {
    const events = await CompanyBetEvent.find({ status: 'active' })
      .populate('candidates', 'name enrollmentNumber branch course'); // This is the fix
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/expired
// @desc    Get all expired or pending company betting events
router.get('/expired', async (req, res) => {
  try {
    const events = await CompanyBetEvent.find({ status: { $in: ['expired', 'pending'] } })
      .populate('candidates', 'name enrollmentNumber branch course');
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events
// @desc    Get all company betting events
router.get('/', async (req, res) => {
  try {
    const events = await CompanyBetEvent.find()
      .populate('candidates', 'name enrollmentNumber branch course');
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH api/events/:id/flags
// @desc    Admin can mark event as featured/hot or change status/section
router.patch('/:id/flags', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: 'Forbidden' });
    }
    const { isFeatured, isHot, status, liveEventSection } = req.body;
    const update = {};
    if (typeof isFeatured === 'boolean') update.isFeatured = isFeatured;
    if (typeof isHot === 'boolean') update.isHot = isHot;
    if (status) update.status = status;
    if (liveEventSection) update.liveEventSection = liveEventSection;
    const updated = await CompanyBetEvent.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('candidates', 'name enrollmentNumber branch course');

    // If status is set back to active, revert bets won/lost back to active and subtract prior winnings
    if (status === 'active') {
      const bets = await Bet.find({ companyEvent: updated._id, status: { $in: ['won', 'lost', 'expired'] } });
      for (const bet of bets) {
        // If previously won, remove credited winnings
        if (bet.status === 'won') {
          const user = await User.findById(bet.user);
          if (user) {
            const stakeNum = typeof bet.stake === 'string' ? parseFloat(bet.stake.replace('x','')) : Number(bet.stake);
            const winnings = Math.round((stakeNum || 1) * bet.amount);
            user.tokens = Math.max(0, user.tokens - winnings);
            user.winnings = Math.max(0, (user.winnings || 0) - winnings);
            await user.save();
          }
        }
        bet.status = 'active';
        await bet.save();
      }
    }
    res.json(updated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;