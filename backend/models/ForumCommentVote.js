import mongoose from 'mongoose';

const ForumCommentVoteSchema = new mongoose.Schema({
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumComment', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['up', 'down'], required: true }
}, { timestamps: true });

ForumCommentVoteSchema.index({ comment: 1, user: 1 }, { unique: true });

export default mongoose.model('ForumCommentVote', ForumCommentVoteSchema);


