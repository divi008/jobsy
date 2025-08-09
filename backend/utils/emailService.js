import nodemailer from 'nodemailer';

// Create transporter with fallback
export const createTransporter = () => {
  // Check if email configuration is available
  const emailPassword = process.env.EMAIL_PASSWORD;
  const emailUser = process.env.EMAIL_USER || 'jobsy.noreply@gmail.com';
  const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const emailPort = process.env.EMAIL_PORT || 587;
  
  console.log('=== EMAIL CONFIG DEBUG ===');
  console.log('EMAIL_PASSWORD:', emailPassword ? '***SET***' : 'NOT SET');
  console.log('EMAIL_USER:', emailUser);
  console.log('EMAIL_HOST:', emailHost);
  console.log('EMAIL_PORT:', emailPort);
  console.log('==========================');
  
  if (!emailPassword) {
    console.warn('EMAIL_PASSWORD not configured. Email functionality will be disabled.');
    return null;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: Number(emailPort),
      secure: false, // TLS on port 587
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    return transporter;
  } catch (error) {
    console.error('Failed to create email transporter:', error);
    return null;
  }
};

// Generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
export const sendVerificationEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();
    
    // For now, let's log the OTP to console for testing
    console.log('=== EMAIL VERIFICATION ===');
    console.log('Email:', email);
    console.log('OTP:', otp);
    console.log('========================');
    
    if (!transporter) {
      console.log('Email service not configured. OTP logged to console for testing.');
      return true; // Return true to avoid blocking the flow
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || 'jobsy.noreply@gmail.com',
      to: email,
      subject: 'Jobsy - Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28c76f, #20c997); padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 2em;">🎯 Jobsy</h1>
            <p style="margin: 10px 0 0 0; font-size: 1.1em;">Email Verification</p>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for signing up with Jobsy! To complete your registration, please verify your email address by entering the following verification code:
            </p>
            <div style="background: #28c76f; color: white; padding: 20px; text-align: center; border-radius: 10px; margin: 25px 0;">
              <h1 style="margin: 0; font-size: 2.5em; letter-spacing: 5px;">${otp}</h1>
              <p style="margin: 10px 0 0 0; font-size: 0.9em;">Verification Code</p>
            </div>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
            </p>
            <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin-top: 25px;">
              <p style="margin: 0; color: #495057; font-size: 0.9em;">
                <strong>Note:</strong> This is an automated email. Please do not reply to this message.
              </p>
            </div>
          </div>
          <div style="background: #343a40; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 0.9em;">© 2024 Jobsy. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to:', email);
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    console.error('Error details:', error.message);
    
    // For testing purposes, still return true so the flow continues
    console.log('Email failed but continuing for testing. OTP logged above.');
    return true;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();
    
    // For now, let's log the OTP to console for testing
    console.log('=== PASSWORD RESET EMAIL ===');
    console.log('Email:', email);
    console.log('OTP:', otp);
    console.log('===========================');
    
    if (!transporter) {
      console.log('Email service not configured. OTP logged to console for testing.');
      return true; // Return true to avoid blocking the flow
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || 'jobsy.noreply@gmail.com',
      to: email,
      subject: 'Jobsy - Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28c76f, #20c997); padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 2em;">🎯 Jobsy</h1>
            <p style="margin: 10px 0 0 0; font-size: 1.1em;">Password Reset</p>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              You requested to reset your password for your Jobsy account. Please use the following verification code to reset your password:
            </p>
            <div style="background: #28c76f; color: white; padding: 20px; text-align: center; border-radius: 10px; margin: 25px 0;">
              <h1 style="margin: 0; font-size: 2.5em; letter-spacing: 5px;">${otp}</h1>
              <p style="margin: 10px 0 0 0; font-size: 0.9em;">Reset Code</p>
            </div>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              This code will expire in 10 minutes. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </p>
            <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin-top: 25px;">
              <p style="margin: 0; color: #495057; font-size: 0.9em;">
                <strong>Security Note:</strong> Never share this code with anyone. Jobsy will never ask for your verification code.
              </p>
            </div>
          </div>
          <div style="background: #343a40; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 0.9em;">© 2024 Jobsy. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', email);
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    return true;
  } catch (error) {
    console.error('Password reset email sending failed:', error);
    console.error('Error details:', error.message);
    
    // For testing purposes, still return true so the flow continues
    console.log('Email failed but continuing for testing. OTP logged above.');
    return true;
  }
}; 