import express from 'express';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import CompanyBetEvent from '../models/CompanyBetEvent.js';
import User from '../models/User.js';
import Candidate from '../models/Candidate.js';
import Bet from '../models/Bet.js';

const router = express.Router();

// Create new company event (admin only)
router.post('/companies', auth, admin, async (req, res) => {
  try {
    const { companyName, companyLogo, jobProfile, status, expiresAt, candidates, liveEventSection } = req.body;
    const event = await CompanyBetEvent.create({
      companyName,
      companyLogo,
      jobProfile,
      status: status || 'active',
      expiresAt,
      candidates: candidates || [],
      liveEventSection: liveEventSection || 'misc'
    });

    // Ensure each candidate has this event in shortlistedIn
    if (Array.isArray(candidates) && candidates.length > 0) {
      await Candidate.updateMany(
        { _id: { $in: candidates } },
        { $addToSet: { shortlistedIn: event._id } }
      );
    }

    const populated = await event.populate('candidates', 'name enrollmentNumber branch course');
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update company event (admin only)
router.put('/companies/:id', auth, admin, async (req, res) => {
  try {
    const update = req.body || {};
    const updated = await CompanyBetEvent.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('candidates', 'name enrollmentNumber branch course');
    if (!updated) return res.status(404).json({ msg: 'Company event not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Resolve bets for an event (admin only)
router.post('/resolve/:eventId', auth, admin, async (req, res) => {
  try {
    const { winningCandidateIds } = req.body; // array of ObjectId strings
    const event = await CompanyBetEvent.findById(req.params.eventId);
    if (!event) return res.status(404).json({ msg: 'Company event not found' });

    // 1) Store winning candidates and mark event expired
    event.winningCandidates = winningCandidateIds || [];
    event.status = 'expired';
    await event.save();

    // 2) Fetch all bets for this event
    const bets = await Bet.find({ companyEvent: event._id });

    const updatedBets = [];
    const updatedUsers = new Set();

    // 3) Iterate and mark won/lost, and pay out winnings
    for (const bet of bets) {
      const isWinner = winningCandidateIds?.some(id => id.toString() === bet.candidate.toString());
      if (isWinner && (bet.status === 'active' || bet.status === 'expired')) {
        const stakeNum = typeof bet.stake === 'string' ? parseFloat(bet.stake.replace('x','')) : Number(bet.stake);
        const winnings = Math.round((stakeNum || 1) * bet.amount);
        bet.status = 'won';
        await bet.save();

        const user = await User.findById(bet.user);
        if (user) {
          user.tokens += winnings; // add payout
          user.winnings = (user.winnings || 0) + winnings;
          await user.save();
          updatedUsers.add(String(user._id));
        }
      } else if (bet.status === 'active') {
        bet.status = 'lost';
        await bet.save();
      }
      updatedBets.push(bet);
    }

    const users = await User.find({ _id: { $in: Array.from(updatedUsers) } }).select('name tokens winnings');

    res.json({ msg: 'Event resolved', eventId: event._id, winningCandidateIds, bets: updatedBets, users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Re-settle an expired event with new winners
router.post('/events/:eventId/update-results', auth, admin, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { winningCandidateIds } = req.body; // array of ids
    if (!Array.isArray(winningCandidateIds)) {
      return res.status(400).json({ msg: 'winningCandidateIds must be an array' });
    }

    const event = await CompanyBetEvent.findById(eventId);
    if (!event) return res.status(404).json({ msg: 'Company event not found' });

    // 1) Fetch all bets for this event
    const bets = await Bet.find({ companyEvent: event._id });

    // 2) Revert old outcomes
    for (const bet of bets) {
      if (bet.status === 'won') {
        const user = await User.findById(bet.user);
        if (user) {
          const stakeNum = typeof bet.stake === 'string' ? parseFloat(bet.stake.replace('x','')) : Number(bet.stake);
          const payout = Math.round((stakeNum || 1) * bet.amount);
          user.tokens = Math.max(0, user.tokens - payout);
          user.winnings = Math.max(0, (user.winnings || 0) - payout);
          await user.save();
        }
      }
      // reset to active so we can re-judge
      bet.status = 'active';
      await bet.save();
    }

    // 3) Update event winners
    event.winningCandidates = winningCandidateIds;
    await event.save();

    // 4) Apply new outcomes
    const winners = new Set(winningCandidateIds.map(id => String(id)));
    const updatedUsers = new Set();
    for (const bet of bets) {
      const isWinner = winners.has(String(bet.candidate));
      if (isWinner) {
        bet.status = 'won';
        const user = await User.findById(bet.user);
        if (user) {
          const stakeNum = typeof bet.stake === 'string' ? parseFloat(bet.stake.replace('x','')) : Number(bet.stake);
          const payout = Math.round((stakeNum || 1) * bet.amount);
          user.tokens += payout;
          user.winnings = (user.winnings || 0) + payout;
          await user.save();
          updatedUsers.add(String(user._id));
        }
      } else {
        bet.status = 'lost';
      }
      await bet.save();
    }

    const users = await User.find({ _id: { $in: Array.from(updatedUsers) } }).select('name tokens winnings');
    res.json({ ok: true, eventId: event._id, winningCandidateIds, users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete a company and its bets (admin only)
router.delete('/companies/:id', auth, admin, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await CompanyBetEvent.findById(eventId);
    if (!event) return res.status(404).json({ msg: 'Company event not found' });
    await Bet.deleteMany({ companyEvent: event._id });
    // Decrement shortlistedIn counts for candidates in this event
    if (Array.isArray(event.candidates) && event.candidates.length > 0) {
      await Candidate.updateMany(
        { _id: { $in: event.candidates } },
        { $pull: { shortlistedIn: event._id } }
      );
    }
    await CompanyBetEvent.findByIdAndDelete(event._id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// List all candidates for admin
router.get('/candidates', auth, admin, async (req, res) => {
  try {
    const candidates = await Candidate.find().populate('shortlistedIn', '_id companyName');
    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update a candidate (admin only)
router.put('/candidates/:id', auth, admin, async (req, res) => {
  try {
    const cand = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cand) return res.status(404).json({ msg: 'Candidate not found' });
    res.json(cand);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete a candidate (admin only)
router.delete('/candidates/:id', auth, admin, async (req, res) => {
  try {
    const cand = await Candidate.findByIdAndDelete(req.params.id);
    if (!cand) return res.status(404).json({ msg: 'Candidate not found' });
    // Optionally, pull from events' candidates arrays
    await CompanyBetEvent.updateMany({}, { $pull: { candidates: cand._id } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// List all users for admin (without passwords)
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Batch set featured companies for carousel (admin only)
router.post('/feature', auth, admin, async (req, res) => {
  try {
    const { featuredIds } = req.body; // array of company event ids
    if (!Array.isArray(featuredIds)) {
      return res.status(400).json({ msg: 'featuredIds must be an array' });
    }
    await CompanyBetEvent.updateMany({}, { $set: { isFeatured: false } });
    if (featuredIds.length > 0) {
      await CompanyBetEvent.updateMany({ _id: { $in: featuredIds } }, { $set: { isFeatured: true } });
    }
    const updated = await CompanyBetEvent.find();
    res.json({ ok: true, featuredIds, total: updated.length });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Add a candidate to a company event shortlist
router.post('/companies/:id/candidates', auth, admin, async (req, res) => {
  try {
    const event = await CompanyBetEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Company event not found' });
    const { candidateId, enrollmentNumber, name, course, branch } = req.body;

    let candidate;
    if (candidateId) {
      candidate = await Candidate.findById(candidateId);
    } else if (enrollmentNumber) {
      candidate = await Candidate.findOne({ enrollmentNumber });
      if (!candidate) {
        if (!name || !course || !branch) return res.status(400).json({ msg: 'Provide name, course, branch to create a candidate' });
        candidate = await Candidate.create({ name, enrollmentNumber, course, branch, shortlistedIn: [] });
      } else {
        // Update existing data
        if (name) candidate.name = name;
        if (course) candidate.course = course;
        if (branch) candidate.branch = branch;
      }
    } else {
      return res.status(400).json({ msg: 'candidateId or enrollmentNumber is required' });
    }

    if (!candidate) return res.status(404).json({ msg: 'Candidate not found' });

    // Save candidate updates
    await candidate.save();

    // Attach to event if not already
    const already = event.candidates.some(id => String(id) === String(candidate._id));
    if (!already) {
      event.candidates.push(candidate._id);
      await event.save();
    }

    // Ensure candidate.shortlistedIn contains this event
    if (!candidate.shortlistedIn) candidate.shortlistedIn = [];
    if (!candidate.shortlistedIn.some(eid => String(eid) === String(event._id))) {
      candidate.shortlistedIn.push(event._id);
      await candidate.save();
    }

    const populated = await CompanyBetEvent.findById(event._id).populate('candidates', 'name enrollmentNumber branch course');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Remove a candidate from a company event shortlist
router.delete('/companies/:id/candidates/:candidateId', auth, admin, async (req, res) => {
  try {
    const event = await CompanyBetEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Company event not found' });
    const { candidateId } = req.params;
    event.candidates = event.candidates.filter(id => String(id) !== String(candidateId));
    await event.save();
    const populated = await CompanyBetEvent.findById(event._id).populate('candidates', 'name enrollmentNumber branch course');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update a candidate profile and optional default stakes within an event
router.put('/companies/:id/candidates/:candidateId', auth, admin, async (req, res) => {
  try {
    const { id, candidateId } = req.params;
    const { name, enrollmentNumber, branch, course, stakes } = req.body;
    const event = await CompanyBetEvent.findById(id);
    if (!event) return res.status(404).json({ msg: 'Company event not found' });
    const cand = await Candidate.findById(candidateId);
    if (!cand) return res.status(404).json({ msg: 'Candidate not found' });

    if (name) cand.name = name;
    if (enrollmentNumber) cand.enrollmentNumber = enrollmentNumber;
    if (branch) cand.branch = branch;
    if (course) cand.course = course;
    await cand.save();

    if (stakes && (stakes.for || stakes.against)) {
      if (!event.stakesByCandidate) event.stakesByCandidate = new Map();
      event.stakesByCandidate.set(String(candidateId), {
        for: stakes.for || '2.00',
        against: stakes.against || '2.00'
      });
      await event.save();
    }

    const populated = await CompanyBetEvent.findById(id).populate('candidates', 'name enrollmentNumber branch course');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update a candidate's shortlist
router.put('/candidates/:id/shortlist', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { companyIds } = req.body;
    
    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ msg: 'Candidate not found' });

    // Update candidate's shortlistedIn
    candidate.shortlistedIn = companyIds || [];
    await candidate.save();

    // Update all companies to include/remove this candidate
    const allCompanies = await CompanyBetEvent.find();
    
    for (const company of allCompanies) {
      const isShortlisted = companyIds.includes(String(company._id));
      const hasCandidate = company.candidates.some(c => String(c) === String(candidate._id));
      
      if (isShortlisted && !hasCandidate) {
        // Add candidate to company
        company.candidates.push(candidate._id);
        await company.save();
      } else if (!isShortlisted && hasCandidate) {
        // Remove candidate from company
        company.candidates = company.candidates.filter(c => String(c) !== String(candidate._id));
        await company.save();
      }
    }

    const updatedCandidate = await Candidate.findById(id).populate('shortlistedIn', '_id companyName');
    res.json(updatedCandidate);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;

