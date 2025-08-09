import mongoose from 'mongoose';

const betSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  companyEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyBetEvent', required: true },
  status: { type: String, enum: ['active', 'expired', 'won', 'lost'], default: 'active' }, 
  type: { type: String, enum: ['for', 'against'], required: true },
  amount: { type: Number, required: true },
  stake: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Bet', betSchema);