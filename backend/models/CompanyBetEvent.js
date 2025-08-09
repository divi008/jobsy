import mongoose from 'mongoose';

const companyBetEventSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  companyLogo: { type: String },
  jobProfile: { type: String, required: true },
  status: {
    type: String,
    enum: ['active', 'pending', 'expired'],
    default: 'active',
  },
  expiresAt: { type: Date, required: true },
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
  winningCandidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
  liveEventSection: { type: String },
  isFeatured: { type: Boolean, default: false },
  isHot: { type: Boolean, default: false },
  stakesByCandidate: {
    type: Map,
    of: new mongoose.Schema({ for: { type: String }, against: { type: String } }, { _id: false }),
    default: undefined
  }
}, { timestamps: true });

export default mongoose.model('CompanyBetEvent', companyBetEventSchema); 