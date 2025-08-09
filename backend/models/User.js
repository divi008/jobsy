import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, unique: true, required: true },
  enrollmentNumber: { type: String, unique: true, required: false },
  password: { type: String, required: false },
  tokens: { type: Number, default: 100000 },
  winnings: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  // Streak and login tracking
  streakCount: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastLoginDate: { type: Date },
  // Email verification
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationOtp: { type: String },
  emailVerificationExpiry: { type: Date },
  // Password reset
  resetPasswordOtp: { type: String },
  resetPasswordExpiry: { type: Date },
}, { timestamps: true });

// This "pre-save hook" automatically hashes the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

export default mongoose.model('User', userSchema);