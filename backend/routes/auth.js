import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { generateOTP, sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService.js';
import { createTransporter } from '../utils/emailService.js'; // Added for test email route

const router = express.Router();

// @route   GET api/auth/test-email
// @desc    Test email service
router.get('/test-email', async (req, res) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      return res.status(500).json({ msg: 'Email service not configured' });
    }

    const testEmail = 'jobsy.noreply@gmail.com'; // Send to yourself for testing
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || 'jobsy.noreply@gmail.com',
      to: testEmail,
      subject: 'Test Email from Jobsy',
      text: 'This is a test email from Jobsy to verify email configuration is working.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28c76f, #20c997); padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 2em;">🎯 Jobsy</h1>
            <p style="margin: 10px 0 0 0; font-size: 1.1em;">Test Email</p>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Email Configuration Test</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              This is a test email to verify that the email configuration is working properly.
            </p>
            <div style="background: #28c76f; color: white; padding: 20px; text-align: center; border-radius: 10px; margin: 25px 0;">
              <h1 style="margin: 0; font-size: 2.5em;">✅ SUCCESS</h1>
              <p style="margin: 10px 0 0 0; font-size: 0.9em;">Email Service Working</p>
            </div>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              If you received this email, your email configuration is working correctly!
            </p>
          </div>
          <div style="background: #343a40; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 0.9em;">© 2024 Jobsy. All rights reserved.</p>
          </div>
        </div>
      `
    });

    console.log('Test email sent successfully');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    
    res.json({ 
      msg: 'Test email sent successfully', 
      messageId: info.messageId,
      response: info.response 
    });
  } catch (error) {
    console.error('Test email failed:', error);
    res.status(500).json({ msg: 'Email test failed: ' + error.message });
  }
});

// @route   POST api/auth/send-verification-email
// @desc    Send email verification OTP
router.post('/send-verification-email', async (req, res) => {
  const { email: rawEmail, enrollmentNumber: rawEnrollment } = req.body;
  
  try {
    const email = (rawEmail || '').trim().toLowerCase();
    const enrollmentNumber = (rawEnrollment || '').trim();
    // Reject non-institute emails up front
    const allowedDomains = ['itbhu.ac.in','iitbhu.ac.in'];
    const emailDomain = (email || '').split('@')[1];
    if (!allowedDomains.includes((emailDomain || '').toLowerCase())) {
      return res.status(400).json({ msg: 'Only institute emails allowed (@itbhu.ac.in or @iitbhu.ac.in)' });
    }

    // Enrollment number collision (if provided) — block if ANY user already has it
    if (enrollmentNumber) {
      const existingEnrollment = await User.findOne({ enrollmentNumber });
      if (existingEnrollment) {
        return res.status(400).json({ msg: 'Enrollment number already exists' });
      }
    }

    // Find existing by email
    let user = await User.findOne({ email });

    // If a full/verified account exists with this email, block before sending OTP
    if (user && (user.isEmailVerified || user.password || user.name)) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    // Prepare OTP
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    if (user) {
      // Update OTP
      user.emailVerificationOtp = otp;
      user.emailVerificationExpiry = expiry;
      if (enrollmentNumber && !user.enrollmentNumber) user.enrollmentNumber = enrollmentNumber;
      await user.save();
    } else {
      // Create minimal temp doc for verification only
      user = new User({
        email,
        enrollmentNumber: enrollmentNumber || undefined,
        isEmailVerified: false,
        emailVerificationOtp: otp,
        emailVerificationExpiry: expiry,
      });
      await user.save();
    }

    const emailSent = await sendVerificationEmail(email, otp);
    if (!emailSent) return res.status(500).json({ msg: 'Failed to send verification email' });

    return res.json({ msg: 'Verification email sent successfully' });
  } catch (err) {
    console.error('send-verification-email error:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/auth/verify-email
// @desc    Verify email with OTP
router.post('/verify-email', async (req, res) => {
  const { email, otp } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    if (!user.emailVerificationOtp || !user.emailVerificationExpiry) {
      return res.status(400).json({ msg: 'No verification OTP found' });
    }

    if (new Date() > user.emailVerificationExpiry) {
      return res.status(400).json({ msg: 'OTP has expired' });
    }

    if (user.emailVerificationOtp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationOtp = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    res.json({ msg: 'Email verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/send-reset-otp
// @desc    Send password reset OTP
router.post('/send-reset-otp', async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found with this email' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user
    user.resetPasswordOtp = otp;
    user.resetPasswordExpiry = expiry;
    await user.save();

    // Send email
    const emailSent = await sendPasswordResetEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ msg: 'Failed to send reset email' });
    }

    res.json({ msg: 'Reset email sent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/reset-password
// @desc    Reset password with OTP
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    if (!user.resetPasswordOtp || !user.resetPasswordExpiry) {
      return res.status(400).json({ msg: 'No reset OTP found' });
    }

    if (new Date() > user.resetPasswordExpiry) {
      return res.status(400).json({ msg: 'OTP has expired' });
    }

    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
  const { name, email, enrollmentNumber, password, isAdmin } = req.body;
  try {
    const allowedDomains = ['itbhu.ac.in','iitbhu.ac.in'];
    const emailDomain = (email || '').split('@')[1];
    if (!allowedDomains.includes((emailDomain || '').toLowerCase())) {
      return res.status(400).json({ msg: 'Only institute emails allowed (@itbhu.ac.in or @iitbhu.ac.in)' });
    }
    // Check if user already exists with this email
    let user = await User.findOne({ email });
    if (user && user.isEmailVerified && user.name) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }
    
    // Check if enrollment number already exists
    if (enrollmentNumber) {
      const existingEnrollment = await User.findOne({ enrollmentNumber });
      if (existingEnrollment) {
        return res.status(400).json({ msg: 'User with this enrollment number already exists' });
      }
    }
    
    // Check if email is verified
    if (user && !user.isEmailVerified) {
      return res.status(400).json({ msg: 'Please verify your email before signing up' });
    }
    
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
    const willBeAdmin = Boolean(isAdmin) || adminEmails.includes(email.toLowerCase());

    if (user) {
      // Update existing user with signup data
      user.name = name;
      user.enrollmentNumber = enrollmentNumber;
      user.password = password;
      user.tokens = 100000;
      user.winnings = 0;
      user.isAdmin = willBeAdmin;
      user.isEmailVerified = true;
    } else {
      // Create new user
      user = new User({ 
        name, 
        email, 
        enrollmentNumber, 
        password, 
        tokens: 100000, 
        winnings: 0, 
        isAdmin: willBeAdmin,
        isEmailVerified: true
      });
    }
    
    // The password will be hashed automatically by the pre-save hook in User.js
    await user.save();

    res.status(201).json({ msg: 'User registered successfully. Please login with your credentials.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token (Login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const allowedDomains = ['itbhu.ac.in','iitbhu.ac.in'];
    const emailDomain = (email || '').split('@')[1];
    if (!allowedDomains.includes((emailDomain || '').toLowerCase())) {
      return res.status(400).json({ msg: 'Only institute emails allowed (@itbhu.ac.in or @iitbhu.ac.in)' });
    }
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    // Only check email verification for new users who haven't completed signup
    if (!user.isEmailVerified && user.name && user.enrollmentNumber && !user.password) {
      return res.status(400).json({ msg: 'Please verify your email before logging in' });
    }

    // Check if user should be admin based on ADMIN_EMAILS
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
    
    if (adminEmails.includes(email.toLowerCase()) && !user.isAdmin) {
      user.isAdmin = true;
      user.role = 'admin';
      await user.save();
    }

    // Handle daily login streaks
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
    let modified = false;
    if (!last) {
      user.streak = 1;
      user.streakCount = 1; // legacy
      user.lastLoginDate = today;
      modified = true;
    } else {
      const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
      const diffDays = Math.floor((today - lastDay) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) {
        // Same day login — keep streak
      } else if (diffDays === 1) {
        user.streak = (user.streak || 0) + 1;
        user.streakCount = (user.streakCount || 0) + 1;
        user.lastLoginDate = today;
        modified = true;
      } else if (diffDays > 1) {
        user.streak = 1;
        user.streakCount = 1;
        user.lastLoginDate = today;
        modified = true;
      }
    }
    if (modified) await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, streak: user.streak, streakCount: user.streakCount });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/auth/me
// @desc    Get logged in user's data
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;