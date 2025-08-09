import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  enrollmentNumber: { type: String, required: true, unique: true },
  course: { type: String, required: true },
  branch: { type: String, required: true },
  shortlistedIn: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CompanyBetEvent' }]
}, { timestamps: true });

export default mongoose.model('Candidate', candidateSchema); 