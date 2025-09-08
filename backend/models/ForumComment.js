import mongoose from 'mongoose';

const ForumCommentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  authorName: { type: String, default: '' },
  authorBranch: { type: String, default: '' },
  authorRollNo: { type: String, default: '' },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

export default mongoose.model('ForumComment', ForumCommentSchema);





