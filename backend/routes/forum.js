import express from 'express';
import auth from '../middleware/auth.js';
import banCheck from '../middleware/banCheck.js';
import ForumPost from '../models/ForumPost.js';
import ForumComment from '../models/ForumComment.js';
import ForumVote from '../models/ForumVote.js';
import ForumCommentVote from '../models/ForumCommentVote.js';
import ForumReport from '../models/ForumReport.js';

const router = express.Router();

// Helper to get vote score
function score(up, down) { return (up || 0) - (down || 0); }

// Create post
router.post('/posts', auth, banCheck('confession'), async (req, res) => {
  try {
    const { title, body = '', tag = 'General', isAnonymous = false, authorName = '', authorBranch = '', authorRollNo = '' } = req.body;
    if (!title || title.length > 150) return res.status(400).json({ msg: 'Invalid title' });
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ msg: 'Auth user missing' });
    const post = await ForumPost.create({
      user: userId,
      title: title.trim(),
      body,
      tag,
      isAnonymous,
      authorName: isAnonymous ? '' : authorName,
      authorBranch: isAnonymous ? '' : authorBranch,
      authorRollNo: isAnonymous ? '' : authorRollNo
    });
    return res.json(post);
  } catch (e) {
    return res.status(500).json({ msg: 'Failed to create post' });
  }
});

// List posts with sorting/filter/search/pagination
router.get('/posts', auth, async (req, res) => {
  try {
    const { sort = 'upvotes', filter, search, page = 1, limit = 10, branch, company, role } = req.query;
    const q = {};
    if (filter && ['General','Company','Branch'].includes(filter)) q.tag = filter;
    if (search) q.$text = { $search: search };
    if (branch) q.authorBranch = branch;
    if (company) q.body = q.body ? { ...q.body, $regex: company, $options: 'i' } : { $regex: company, $options: 'i' };
    if (role) q.body = q.body ? { ...q.body, $regex: role, $options: 'i' } : { $regex: role, $options: 'i' };

    let cursor = ForumPost.find(q);
    if (sort === 'newest') {
      cursor = cursor.sort({ createdAt: -1 });
    } else if (sort === 'comments') {
      cursor = cursor.sort({ commentCount: -1, createdAt: -1 });
    } else {
      cursor = cursor.sort({ upvotes: -1, downvotes: 1, createdAt: -1 });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const posts = await cursor.skip(skip).limit(Number(limit)).lean();
    return res.json(posts);
  } catch (e) {
    return res.status(500).json({ msg: 'Failed to fetch posts' });
  }
});

// Post detail + comments (basic, newest first)
router.get('/posts/:id', auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ msg: 'Not found' });
    const { commentSort = 'newest', page = 1, limit = 20 } = req.query;
    let cFind = ForumComment.find({ post: post._id });
    if (commentSort === 'oldest') cFind = cFind.sort({ createdAt: 1 });
    else if (commentSort === 'top') cFind = cFind.sort({ upvotes: -1, downvotes: 1, createdAt: -1 });
    else cFind = cFind.sort({ createdAt: -1 });
    const skip = (Number(page) - 1) * Number(limit);
    const comments = await cFind.skip(skip).limit(Number(limit)).lean();
    return res.json({ post, comments });
  } catch (e) {
    return res.status(500).json({ msg: 'Failed to fetch post' });
  }
});

// Upvote/downvote post (toggle)
router.post('/posts/:id/upvote', auth, async (req, res) => {
  try {
    const { type } = req.body; // 'up' | 'down' | 'clear'
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Not found' });

    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ msg: 'Auth user missing' });
    const existing = await ForumVote.findOne({ post: post._id, user: userId });
    if (type === 'clear') {
      if (existing) {
        await existing.deleteOne();
        if (existing.type === 'up') post.upvotes -= 1; else post.downvotes -= 1;
      }
    } else if (type === 'up' || type === 'down') {
      if (!existing) {
        await ForumVote.create({ post: post._id, user: userId, type });
        if (type === 'up') post.upvotes += 1; else post.downvotes += 1;
      } else if (existing.type !== type) {
        // switch
        if (existing.type === 'up') { post.upvotes -= 1; post.downvotes += 1; }
        else { post.downvotes -= 1; post.upvotes += 1; }
        existing.type = type; await existing.save();
      } // same type -> no change
    }
    await post.save();
    return res.json({ upvotes: post.upvotes, downvotes: post.downvotes, score: score(post.upvotes, post.downvotes) });
  } catch (e) {
    return res.status(500).json({ msg: 'Failed to vote' });
  }
});

// Add comment
router.post('/posts/:id/comments', auth, banCheck('comment'), async (req, res) => {
  try {
    const { body, isAnonymous = false, authorName = '', authorBranch = '', authorRollNo = '' } = req.body;
    if (!body || !body.trim()) return res.status(400).json({ msg: 'Body required' });
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Not found' });
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ msg: 'Auth user missing' });
    const comment = await ForumComment.create({
      post: post._id,
      user: userId,
      body: body.trim(),
      isAnonymous,
      authorName: isAnonymous ? '' : authorName,
      authorBranch: isAnonymous ? '' : authorBranch,
      authorRollNo: isAnonymous ? '' : authorRollNo
    });
    post.commentCount += 1; await post.save();
    return res.json(comment);
  } catch (e) {
    return res.status(500).json({ msg: 'Failed to add comment' });
  }
});

// Vote comment
router.post('/comments/:id/upvote', auth, async (req, res) => {
  try {
    const { type } = req.body; // 'up' | 'down' | 'clear'
    const comment = await ForumComment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Not found' });
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ msg: 'Auth user missing' });
    const existing = await ForumCommentVote.findOne({ comment: comment._id, user: userId });
    if (type === 'clear') {
      if (existing) {
        await existing.deleteOne();
        if (existing.type === 'up') comment.upvotes -= 1; else comment.downvotes -= 1;
      }
    } else if (type === 'up' || type === 'down') {
      if (!existing) {
        await ForumCommentVote.create({ comment: comment._id, user: userId, type });
        if (type === 'up') comment.upvotes += 1; else comment.downvotes += 1;
      } else if (existing.type !== type) {
        if (existing.type === 'up') { comment.upvotes -= 1; comment.downvotes += 1; }
        else { comment.downvotes -= 1; comment.upvotes += 1; }
        existing.type = type; await existing.save();
      }
    }
    await comment.save();
    return res.json({ upvotes: comment.upvotes, downvotes: comment.downvotes, score: score(comment.upvotes, comment.downvotes) });
  } catch (e) {
    return res.status(500).json({ msg: 'Failed to vote comment' });
  }
});

// Report post/comment
router.post('/report', auth, async (req, res) => {
  try {
    const { targetType, targetId, reason } = req.body;
    if (!['post','comment'].includes(targetType)) return res.status(400).json({ msg: 'Invalid target' });
    if (!reason || !reason.trim()) return res.status(400).json({ msg: 'Reason required' });
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ msg: 'Auth user missing' });
    const report = await ForumReport.create({ reporter: userId, targetType, targetId, reason: reason.trim() });
    return res.json(report);
  } catch (e) {
    return res.status(500).json({ msg: 'Failed to submit report' });
  }
});

// Delete own post (or admin)
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ msg: 'Auth user missing' });
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Not found' });
    if (String(post.user) !== String(userId)) return res.status(403).json({ msg: 'Not authorized to delete this post' });
    await ForumComment.deleteMany({ post: post._id });
    await ForumVote.deleteMany({ post: post._id });
    await ForumReport.deleteMany({ targetType: 'post', targetId: String(post._id) });
    await post.deleteOne();
    return res.json({ ok: true });
  } catch (e) { return res.status(500).json({ msg: 'Failed to delete post' }); }
});

// Delete own comment (or admin)
router.delete('/comments/:id', auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ msg: 'Auth user missing' });
    const comment = await ForumComment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Not found' });
    if (String(comment.user) !== String(userId)) return res.status(403).json({ msg: 'Not authorized to delete this comment' });
    await ForumCommentVote.deleteMany({ comment: comment._id });
    await ForumReport.deleteMany({ targetType: 'comment', targetId: String(comment._id) });
    await comment.deleteOne();
    await ForumPost.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });
    return res.json({ ok: true });
  } catch (e) { return res.status(500).json({ msg: 'Failed to delete comment' }); }
});

export default router;



