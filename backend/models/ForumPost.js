import mongoose from 'mongoose';

const ForumPostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 150, trim: true },
  body: { type: String, default: '' },
  tag: { type: String, enum: ['General', 'Company', 'Branch'], default: 'General' },
  isAnonymous: { type: Boolean, default: false },
  authorName: { type: String, default: '' },
  authorBranch: { type: String, default: '' }, // Store like "B.Tech (Mechanical Engineering)"
  authorRollNo: { type: String, default: '' },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

ForumPostSchema.index({ title: 'text', body: 'text' });

export default mongoose.model('ForumPost', ForumPostSchema);



