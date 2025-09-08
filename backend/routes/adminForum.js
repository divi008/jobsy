import express from 'express';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import ForumPost from '../models/ForumPost.js';
import ForumComment from '../models/ForumComment.js';
import ForumReport from '../models/ForumReport.js';
import User from '../models/User.js';

const router = express.Router();

// List reports with filters
router.get('/reports', auth, admin, async (req, res) => {
  try {
    const { type, status, from, to, q } = req.query;
    const find = {};
    if (type && ['post','comment'].includes(type)) find.targetType = type;
    if (status && ['pending','resolved'].includes(status)) find.status = status;
    if (from || to) {
      find.createdAt = {};
      if (from) find.createdAt.$gte = new Date(from);
      if (to) find.createdAt.$lte = new Date(to);
    }
    if (q) {
      // search by reason
      find.reason = { $regex: q, $options: 'i' };
    }
    const reports = await ForumReport.find(find).sort({ createdAt: -1 }).lean();
    res.json(reports);
  } catch (e) { res.status(500).json({ msg: 'Failed to fetch reports' }); }
});

router.post('/reports/:id/resolve', auth, admin, async (req, res) => {
  try {
    const report = await ForumReport.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true });
    if (!report) return res.status(404).json({ msg: 'Not found' });
    res.json(report);
  } catch (e) { res.status(500).json({ msg: 'Failed to resolve report' }); }
});

router.delete('/forum/posts/:id', auth, admin, async (req, res) => {
  try {
    await ForumPost.findByIdAndDelete(req.params.id);
    await ForumComment.deleteMany({ post: req.params.id });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ msg: 'Failed to delete post' }); }
});

router.delete('/forum/comments/:id', auth, admin, async (req, res) => {
  try {
    const comment = await ForumComment.findById(req.params.id);
    if (comment) {
      await comment.deleteOne();
      await ForumPost.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });
    }
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ msg: 'Failed to delete comment' }); }
});

router.post('/users/:id/ban', auth, admin, async (req, res) => {
  try {
    const { type, reason = '' } = req.body; // 'confession' | 'comment' | 'both'
    if (!['confession','comment','both'].includes(type)) return res.status(400).json({ msg: 'Invalid ban type' });
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true, banType: type, banReason: reason }, { new: true });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (e) { res.status(500).json({ msg: 'Failed to ban user' }); }
});

router.post('/users/:id/unban', auth, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false, banType: null, banReason: '' }, { new: true });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (e) { res.status(500).json({ msg: 'Failed to unban user' }); }
});

// Fetch target details for viewing in admin
router.get('/forum/post/:id', auth, admin, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ msg: 'Not found' });
    res.json(post);
  } catch (e) { res.status(500).json({ msg: 'Failed to fetch post' }); }
});

router.get('/forum/comment/:id', auth, admin, async (req, res) => {
  try {
    const comment = await ForumComment.findById(req.params.id).lean();
    if (!comment) return res.status(404).json({ msg: 'Not found' });
    res.json(comment);
  } catch (e) { res.status(500).json({ msg: 'Failed to fetch comment' }); }
});

export default router;


