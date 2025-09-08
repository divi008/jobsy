import mongoose from 'mongoose';

const ForumVoteSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['up', 'down'], required: true }
}, { timestamps: true });

ForumVoteSchema.index({ post: 1, user: 1 }, { unique: true });

export default mongoose.model('ForumVote', ForumVoteSchema);


