import express from 'express';
import Candidate from '../models/Candidate.js';

const router = express.Router();

// @route   GET api/candidates
// @desc    Get all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().populate('shortlistedIn', '_id companyName');
    res.json(candidates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/candidates
// @desc    Create or update a candidate by enrollmentNumber
router.post('/', async (req, res) => {
  try {
    const { name, enrollmentNumber, course, branch } = req.body;
    if (!name || !enrollmentNumber || !course || !branch) {
      return res.status(400).json({ msg: 'name, enrollmentNumber, course and branch are required' });
    }
    let candidate = await Candidate.findOne({ enrollmentNumber });
    if (candidate) {
      candidate.name = name;
      candidate.course = course;
      candidate.branch = branch;
      await candidate.save();
      return res.json(candidate);
    }
    candidate = await Candidate.create({ name, enrollmentNumber, course, branch, shortlistedIn: [] });
    res.status(201).json(candidate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/candidates/lookup
// @desc    Lookup candidates by enrollment numbers
router.post('/lookup', async (req, res) => {
  try {
    const { enrollments, enrollmentNumber } = req.body;
    
    // Handle single enrollment lookup
    if (enrollmentNumber) {
      const candidate = await Candidate.findOne({ enrollmentNumber });
      return res.json(candidate);
    }
    
    // Handle multiple enrollment lookup
    if (enrollments && Array.isArray(enrollments)) {
      const list = await Candidate.find({ enrollmentNumber: { $in: enrollments } });
      return res.json(list);
    }
    
    res.status(400).json({ msg: 'enrollmentNumber or enrollments array is required' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;