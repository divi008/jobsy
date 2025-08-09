import express from 'express';
import Bet from '../models/Bet.js';
import CompanyBetEvent from '../models/CompanyBetEvent.js';
import Candidate from '../models/Candidate.js';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET api/bets/user/:userId
// @desc    Get all bets for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const bets = await Bet.find({ user: req.params.userId })
      .populate({
        path: 'companyEvent',
        select: 'companyName'
      })
      .populate({
        path: 'candidate',
        select: 'name'
      });

    if (!bets) {
      return res.status(404).json({ msg: 'No bets found for this user' });
    }

    res.json(bets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.get('/', async (req, res) => {
  try {
    const bets = await Bet.find()
      .populate('user', 'name')
      .populate('candidate', 'name')
      .populate('companyEvent', 'companyName');
    res.json(bets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// Make sure auth middleware is imported

// @route   POST api/bets
// @desc    Create a new bet
// @access  Private
// @route   POST api/bets
// @desc    Create new bets
// @access  Private
router.post('/', auth, async (req, res) => {
  // Get the details of the bets from the frontend modal
  const { betsToPlace, totalBetAmount } = req.body;
  try {
    // Find the user placing the bet from the auth token
    const user = await User.findById(req.user.id);

    // Check if user has enough tokens
    if (user.tokens < totalBetAmount) {
      return res.status(400).json({ msg: 'Not enough tokens' });
    }

    // 1. Deduct tokens from the user
    user.tokens -= totalBetAmount;
    
    // 2. Format the bets with the correct user ID
    const newBetDocuments = betsToPlace.map(bet => ({
      ...bet,
      user: req.user.id
    }));
    
    // 3. Save the new bets to the database
    const newBets = await Bet.insertMany(newBetDocuments);
    
    // 4. Save the user's updated token count
    await user.save();

    // 5. Send back the updated user and the new bets
    res.status(201).json({ user, newBets });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   GET /api/bets/active
// @desc    Get all active bets
router.get('/active', async (req, res) => {
  try {
    const activeBets = await Bet.find({ status: 'active' })
      .populate('user', 'name')
      .populate('candidate', 'name enrollmentNumber')
      .populate('companyEvent', 'companyName jobProfile');
      console.log(`DEBUG: Found ${activeBets.length} active bets in the database.`);
    res.json(activeBets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/bets/expired
// @desc    Get all expired or pending bets (includes resolved won/lost)
router.get('/expired', async (req, res) => {
  try {
    const expiredBets = await Bet.find({ status: { $in: ['expired', 'pending', 'won', 'lost'] } })
      .populate('user', 'name')
      .populate('candidate', 'name enrollmentNumber')
      .populate('companyEvent', 'companyName jobProfile');
    res.json(expiredBets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
export default router;