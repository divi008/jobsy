import axios from 'axios';
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from "react-router-dom";
import HomePage from "./HomePage";
import HeaderNav from "./HeaderNav";
import DropdownMenu from './DropdownMenu';
import MyBets from "./MyBets";
import ActiveBets from "./ActiveBets";
import PageLayout from "./PageLayout";
import UserProfilePage from "./UserProfilePage";
import Shortlists from "./Shortlists";
import ExpiredBets from "./ExpiredBets";
import Leaderboard from "./Leaderboard";
import AdminPanel from "./AdminPanel";
import PlacementData from "./PlacementData";
import { mockUsers } from "./mockUsers";
import { motion } from "framer-motion";
// Remove: import UserGuide from "./UserGuide";
const setAuthToken = token => {
  if (token) {
    // Apply the token to every request header
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    // Delete the token from the header
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

function LandingPage({ loadUser }) {
  const [activeTab, setActiveTab] = useState("login");
  const [showResetModal, setShowResetModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    enrollmentNumber: '',
    password: '',
    confirmPassword: ''
  });

  const { name, email, enrollmentNumber, password, confirmPassword } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const onSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === 'signup' && password !== confirmPassword) {
      return alert('Passwords do not match');
    }
    
    if (activeTab === 'signup' && !isEmailVerified) {
      return alert('Please verify your email first');
    }
    
    if (activeTab === 'signup' && (!name || !enrollmentNumber || !email || !password)) {
      return alert('Please fill in all required fields');
    }
    
    setIsLoading(true);
    const url = activeTab === 'login' ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/signup';
    const body = activeTab === 'login' ? { email, password } : { name, email, enrollmentNumber, password };
    
    try {
      const res = await axios.post(url, body);
      
      if (activeTab === 'signup') {
        // After successful signup, redirect to login
        alert('Signup successful! Please login with your credentials.');
        setActiveTab('login');
        setFormData({ name: '', email: '', enrollmentNumber: '', password: '', confirmPassword: '' });
        setIsEmailVerified(false);
      } else {
        // Login successful
        localStorage.setItem('token', res.data.token);
        await loadUser();
        setShowWelcomeModal(true);
      }
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Error: ' + (err.response ? err.response.data.msg : 'An error occurred.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async () => {
    if (!email) {
      alert('Please enter an email address first');
      return;
    }
    
    if (activeTab === 'signup' && !enrollmentNumber) {
      alert('Please enter an enrollment number first');
      return;
    }
    
    setIsLoading(true);
    try {
      const payload = { email };
      if (activeTab === 'signup' && enrollmentNumber) {
        payload.enrollmentNumber = enrollmentNumber;
      }
      
      const response = await axios.post('http://localhost:5000/api/auth/send-verification-email', payload);
      if (response.data && response.data.msg) {
        alert(response.data.msg + '\n\nFor testing: Check the backend console for the OTP.');
      } else {
        alert('Verification email sent! Please check your inbox.\n\nFor testing: Check the backend console for the OTP.');
      }
      setShowEmailVerificationModal(true);
    } catch (err) {
      let errorMsg = 'Failed to send verification email';
      if (err.response && err.response.data && err.response.data.msg) {
        errorMsg = err.response.data.msg;
      } else if (err.message) {
        errorMsg = err.message;
      }
      alert('Error: ' + errorMsg + '\n\nFor testing: Check the backend console for the OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert('Please enter the OTP');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-email', { email, otp });
      setIsEmailVerified(true);
      setShowEmailVerificationModal(false);
      setShowOtpModal(false);
      if (response.data && response.data.msg) {
        alert(response.data.msg);
      } else {
        alert('Email verified successfully!');
      }
    } catch (err) {
      let errorMsg = 'Invalid OTP';
      if (err.response && err.response.data && err.response.data.msg) {
        errorMsg = err.response.data.msg;
      } else if (err.message) {
        errorMsg = err.message;
      }
      alert('Error: ' + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResetOtp = async () => {
    if (!resetEmail) {
      alert('Please enter an email address');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/send-reset-otp', { email: resetEmail });
      setShowOtpModal(true);
      if (response.data && response.data.msg) {
        alert(response.data.msg + '\n\nFor testing: Check the backend console for the OTP.');
      } else {
        alert('Reset OTP sent! Please check your inbox.\n\nFor testing: Check the backend console for the OTP.');
      }
    } catch (err) {
      let errorMsg = 'Failed to send reset OTP';
      if (err.response && err.response.data && err.response.data.msg) {
        errorMsg = err.response.data.msg;
      } else if (err.message) {
        errorMsg = err.message;
      }
      alert('Error: ' + errorMsg + '\n\nFor testing: Check the backend console for the OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetOtp || !newPassword || !confirmNewPassword) {
      alert('Please fill in all fields');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email: resetEmail,
        otp: resetOtp,
        newPassword
      });
      if (response.data && response.data.msg) {
        alert(response.data.msg);
      } else {
        alert('Password reset successfully! Please login with your new password.');
      }
      setShowResetModal(false);
      setShowOtpModal(false);
      setResetEmail('');
      setResetOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      let errorMsg = 'Failed to reset password';
      if (err.response && err.response.data && err.response.data.msg) {
        errorMsg = err.response.data.msg;
      } else if (err.message) {
        errorMsg = err.message;
      }
      alert('Error: ' + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStarted = () => {
    setShowWelcomeModal(false);
    window.location.href = "/home";
  };


  return (
    <>
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-2xl transition-all duration-300 transform scale-95 hover:scale-100 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 text-2xl font-bold hover:text-gray-700"
              onClick={() => setShowWelcomeModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-green-600 mb-6 flex items-center gap-2 transition-all duration-700 ease-out animate-fade-in-down">
              Welcome to<span className="text-green-600"> Jobsy</span> <span role="img" aria-label="target">🎯</span>
            </h2>
            <div className="overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
              <div className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>Quick Navigation</span>
                <span className="text-base text-gray-500 font-normal">(Available in navbar/hamburger menu)</span>
              </div>
              <ul className="text-slate-700 text-base space-y-4 mb-8">
                <li>
                  <span className="font-bold text-pink-500">📋 See Shortlists</span>
                  <ul className="list-disc ml-6 text-slate-600">
                    <li>View all shortlists across active companies</li>
                    <li>Filter candidates by branch</li>
                    <li>Quick search via enrollment number or name</li>
                    <li>Track total shortlists of Students in real-time</li>
                  </ul>
                </li>
                <li>
                  <span className="font-bold text-green-500">📈 Predict & Win</span>
                  <ul className="list-disc ml-6 text-slate-600">
                    <li>Start with 100000 welcome tokens</li>
                    <li>Place strategic bets on placement outcomes - bet "For" or "Against"</li>
                    <li>Watch stake multipliers update in real-time based on community betting</li>
                    <li>Track your winning streak and climb our dynamic leaderboard</li>
                  </ul>
                </li>
              </ul>
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-400 text-2xl">🎯</span>
                    <span className="text-xl font-bold text-green-400">How It Works</span>
                  </div>
                  <ul className="list-disc ml-8 text-slate-700 space-y-1">
                    <li><span className="font-bold">Connect & Start:</span> Sign up with your IIT BHU email and get 100000 tokens instantly</li>
                    <li><span className="font-bold">Choose & Bet:</span> Browse active drives and place strategic bets with dynamic stake multipliers</li>
                    <li><span className="font-bold">Track & Win:</span> Monitor results live, collect winnings, and climb the leaderboard</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-400 text-2xl">🔍</span>
                    <span className="text-xl font-bold text-green-400">Pro Tips</span>
                  </div>
                  <ul className="list-disc ml-8 text-slate-700 space-y-1">
                    <li>Keep an eye on multipliers - they update automatically based on betting patterns</li>
                    <li>Higher multipliers = bigger potential returns</li>
                  </ul>
                </div>
              </div>
            </div>
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-full text-lg transition mt-8"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md transition-all duration-300 transform scale-95 hover:scale-100 relative z-10">
            <button
              className="absolute top-4 right-4 text-gray-400 text-2xl font-bold hover:text-gray-700"
              onClick={() => setShowResetModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-green-600 mb-6">Reset Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-base text-gray-700 mb-2">Email</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    className="flex-1 px-4 py-2 rounded bg-slate-100 text-gray-900 border border-slate-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
                    placeholder="valar.morghulis.got21@itbhu.ac.in"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 rounded transition"
                    onClick={handleSendResetOtp}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </div>
              {showOtpModal && (
                <>
                  <div>
                    <label className="block text-base text-gray-700 mb-2">OTP</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded bg-slate-100 text-gray-900 border border-slate-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
                      placeholder="Enter OTP"
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
                      required
                      minLength="6"
                      maxLength="6"
                    />
                  </div>
                  <div>
                    <label className="block text-base text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded bg-slate-100 text-gray-900 border border-slate-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength="6"
                    />
                  </div>
                  <div>
                    <label className="block text-base text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded bg-slate-100 text-gray-900 border border-slate-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                      minLength="6"
                    />
                  </div>
                  <button
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
                    onClick={handleResetPassword}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Email Verification Modal */}
      {showEmailVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md transition-all duration-300 transform scale-95 hover:scale-100 relative z-10">
            <button
              className="absolute top-4 right-4 text-gray-400 text-2xl font-bold hover:text-gray-700"
              onClick={() => setShowEmailVerificationModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-green-600 mb-6">Verify Your Email</h2>
            <p className="text-gray-700 mb-4">We sent a verification code to {email}. Please enter it below to verify your email address.</p>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded bg-slate-100 text-gray-900 border border-slate-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                minLength="6"
                maxLength="6"
              />
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 rounded transition"
                onClick={handleVerifyOtp}
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Removed duplicate OTP-only modal to avoid confusion */}
      {/* Main Content (always rendered) */}
      <div className="min-h-screen w-full flex items-center justify-center bg-[linear-gradient(135deg,_#f8fafc,_#e2f7e1)]">
        <motion.div
          className="relative z-10 flex flex-col md:flex-row gap-16 w-full max-w-7xl px-6 items-start"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.18 } },
            hidden: {}
          }}
        >
          {/* Login/Sign Up Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className={`flex-1 max-w-full md:max-w-[48%] bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] px-12 py-10 flex flex-col justify-center overflow-auto transition-all duration-500 ${
              activeTab === "signup" ? "min-h-[650px]" : "min-h-[400px]"
            } hover:shadow-[0_0_24px_4px_rgba(34,197,94,0.15)]`}
          >
            {/* Logo and Heading */}
            <div className="flex items-center justify-center mb-6 gap-4">
              <img src="pngkey.com-poker-chips-png-594513.png" alt="Jobsy Logo" className="w-16 h-16 rounded-full shadow-lg" />
              <h1 className="text-4xl font-bold text-green-600 drop-shadow-lg">Jobsy</h1>
            </div>
            <p className="text-center text-gray-700 mt-2 text-lg font-medium break-words">
              Placement Data that Works for You | Real-Time Insights, Smart Predictions!
            </p>
            {/* Tabs */}
            <div className="flex justify-center mb-4 gap-6 mt-6">
              <button
                className={`font-semibold px-6 pb-1 text-lg border-b-2 transition-colors duration-200 ${
                  activeTab === "login" ? "text-green-600 border-green-600" : "text-gray-700 border-transparent"
                }`}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button
                className={`font-semibold px-6 pb-1 text-lg border-b-2 transition-colors duration-200 ${
                  activeTab === "signup" ? "text-green-600 border-green-600" : "text-gray-700 border-transparent"
                }`}
                onClick={() => setActiveTab("signup")}
              >
                Sign Up
              </button>
            </div>
            {/* Form */}
            <form className="space-y-5" onSubmit={onSubmit}>
  {activeTab === "signup" && (
    <>
      <div>
        <label className="block text-base text-slate-400 mb-2">Full Name</label>
        <input
          type="text"
          className="w-full px-5 py-3 rounded-md bg-slate-100 border border-slate-300 shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none text-slate-900 text-base transition-all duration-200"
          placeholder="Jon Snow"
          name="name"
          value={name}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <label className="block text-base text-slate-400 mb-2">Enrollment Number</label>
        <input
          type="text"
          className="w-full px-5 py-3 rounded-md bg-slate-100 border border-slate-300 shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none text-slate-900 text-base transition-all duration-200"
          placeholder="12345678"
          name="enrollmentNumber"
          value={enrollmentNumber}
          onChange={onChange}
          required
        />
      </div>
    </>
  )}
  <div>
    <label className="block text-base text-slate-400 mb-2">Email</label>
    <div className="flex gap-2">
      <input
        type="email"
        className="flex-1 px-5 py-3 rounded-md bg-slate-100 border border-slate-300 shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none text-slate-900 text-base transition-all duration-200"
        placeholder="valar.morghulis.got21@itbhu.ac.in"
        name="email"
        value={email}
        onChange={onChange}
        required
      />
      {activeTab === "signup" && (
        <button
          type="button"
          className={`font-semibold px-4 rounded-md shadow transition ${
            isEmailVerified 
              ? 'bg-green-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          onClick={handleEmailVerification}
          disabled={isLoading || isEmailVerified}
        >
          {isLoading ? 'Verifying...' : isEmailVerified ? '✓ Verified' : 'Verify Email'}
        </button>
      )}
    </div>
    {activeTab === "signup" && isEmailVerified && (
      <p className="text-green-600 text-sm mt-1">✓ Email verified successfully!</p>
    )}
  </div>
  <div>
    <label className="block text-base text-slate-400 mb-2">Password</label>
    <input
      type="password"
      className="w-full px-5 py-3 rounded-md bg-slate-100 border border-slate-300 shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none text-slate-900 text-base transition-all duration-200"
      placeholder="********"
      name="password"
      value={password}
      onChange={onChange}
      required
      minLength="6"
    />
  </div>
  {activeTab === "signup" && (
    <div>
      <label className="block text-base text-slate-400 mb-2">Confirm Password</label>
      <input
        type="password"
        className="w-full px-5 py-3 rounded-md bg-slate-100 border border-slate-300 shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none text-slate-900 text-base transition-all duration-200"
        placeholder="Confirm your password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={onChange}
        required
        minLength="6"
      />
    </div>
  )}
  <button
    type="submit"
    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
    disabled={isLoading}
  >
    {isLoading ? 'Loading...' : activeTab === "login" ? "Login" : "Sign Up"}
  </button>
</form>
            <div className="flex justify-end mt-3">
              <a
                href="#"
                className="text-green-600 text-base hover:underline"
                onClick={e => { e.preventDefault(); setShowResetModal(true); }}
              >
                Forgot Password?
              </a>
            </div>
          </motion.div>
          {/* How It Works Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="flex-1 max-w-full md:max-w-[48%] bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] px-12 py-10 flex flex-col justify-center overflow-auto transition-all duration-300 hover:shadow-[0_0_24px_4px_rgba(34,197,94,0.15)] h-[600px]"
          >
            <h2 className="text-4xl font-bold text-green-600 mb-6 drop-shadow-lg">How It Works ?</h2>
            <ol className="space-y-5 text-slate-500 text-base break-words">
              <li className="flex items-start">
                <span className="bg-gradient-to-tr from-green-500 to-green-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mr-6 text-2xl shadow-lg">1</span>
                <span>
                  Sign up with your IIT BHU email to receive 100000 welcome tokens - your gateway to predicting placement outcomes for your peers.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-gradient-to-tr from-green-500 to-green-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mr-6 text-2xl shadow-lg">2</span>
                <span>
                  Scroll through real-time shortlists and upcoming interviews across top companies. Candidate details appear as new rounds go live.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-gradient-to-tr from-green-500 to-green-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mr-6 text-2xl shadow-lg">3</span>
                <span>
                  Place your bets 'For' or 'Against' each candidate's final selection. Stake multipliers adjust in real-time based on betting patterns.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-gradient-to-tr from-green-500 to-green-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mr-6 text-2xl shadow-lg">4</span>
                <span>
                  Watch as results unfold in real-time. Win instantly when results are announced, with automatic token redistribution.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-gradient-to-tr from-green-500 to-green-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mr-6 text-2xl shadow-lg">5</span>
                <span>
                  Compete on leaderboards with tokens, success rates, streaks, and analyze risky betters' profiles.
                </span>
              </li>
            </ol>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="w-full flex justify-center mt-10">
      <div className="w-full flex items-center gap-2 px-8 py-3 text-gray-300 bg-transparent text-sm" style={{borderTop: '1px solid #232b3a'}}>
        <svg className="w-5 h-5 text-[#28c76f] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#28c76f" strokeWidth="2" fill="none"/><path d="M12 16v-4" stroke="#28c76f" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="8" r="1" fill="#28c76f"/></svg>
        <span>For entertainment only. Not affiliated with IIT BHU or placement cells. Any resemblance to persons or events is coincidental. No real job predictions or monetary rewards. Participation is purely for fun—please enjoy responsibly.</span>
      </div>
    </footer>
  );
}

// Redesigned UserProfile page to match the homepage/screenshot exactly
function UserProfile({ user, bets, onUserGuide, headerUser }) {
  const [filter, setFilter] = React.useState('all');
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef();
  const navigate = useNavigate();

  React.useEffect(() => {
    function handleClick(e) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  function handleLogout() {
    setMenuOpen(false);
    navigate('/');
  }

  // Use real bets from props
  const normalizedBets = React.useMemo(() => (Array.isArray(bets) ? bets.map(b => ({...b, status: (b.status||'').toLowerCase()})) : []), [bets]);
  const filteredBets = filter === 'all' ? normalizedBets : filter === 'expired' ? normalizedBets.filter(b => ['expired','won','lost'].includes(b.status)) : normalizedBets.filter(b => b.status === filter);
  const totalBets = normalizedBets.length;
  const activeBets = normalizedBets.filter(b => b.status === 'active').length;
  const resolved = normalizedBets.filter(b => ['won','lost','expired'].includes(b.status));
  const won = resolved.filter(b => b.status === 'won').length;
  const successRate = resolved.length > 0 ? (won / resolved.length) * 100 : 0;

  // Derive initials and enrollment from user if available
  const initials = user.initials || user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  const enrollment = user.enrollmentNumber || user.id;
  const tokens = user.tokens || 0;
  const streak = (user.streak ?? user.streakCount) || 0;
  if (!user) {return <PageLayout><div>Loading user data...</div></PageLayout>;} // Safety check 

  return (
    <PageLayout user={headerUser} onUserGuide={onUserGuide}>
      {/* Main Profile Content - now full width with header alignment */}
      <div className="w-full mt-8">
        <div className="bg-[linear-gradient(to_top_right,_#181a1b_80%,_#28c76f_20%,_#181a1b_100%)] backdrop-blur-md border border-white/10 shadow-md rounded-2xl px-8 py-8 md:py-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 mb-8 relative w-full">
          <div className="flex-shrink-0 flex flex-col items-center md:items-start">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#28c76f] flex items-center justify-center text-3xl md:text-4xl font-bold text-white shadow-lg mb-2 md:mb-0">{initials}</div>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center md:items-start w-full">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl md:text-3xl font-bold text-[#28c76f]">{user.name}</span>
            </div>
            <div className="text-gray-900 text-base md:text-lg mb-1">{user.email}</div>
            <div className="text-gray-900 text-base md:text-lg mb-1">Enrollment No: <span className="font-semibold">{enrollment}</span></div>
            <div className="text-gray-500 text-sm md:text-base mb-4">{tokens.toLocaleString()} Tokens</div>
            <div className="flex items-center justify-between w-full mb-1 mt-2">
              <span className="text-gray-500 text-sm font-semibold">Success Rate</span>
              <span className="bg-[#e2f7e1] text-[#28c76f] text-xs font-bold px-3 py-1 rounded-full">{successRate.toFixed(2)}%</span>
            </div>
            {/* Success Rate Bar inside profile card */}
            <div className="w-full h-2 rounded-full bg-red-200 relative overflow-hidden mb-2">
              <div className="absolute left-0 top-0 h-full bg-[#28c76f]" style={{ width: `${successRate}%` }}></div>
              <div className="absolute right-0 top-0 h-full bg-red-500" style={{ width: `${100-successRate}%` }}></div>
            </div>
          </div>
        </div>
        {/* Stat Cards - solid dark background, green border, matches Hot Bets */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 w-full">
          {/* Total Bets */}
          <div className="relative rounded-2xl bg-[#181f1f] border-2 border-[#28c76f]/80 p-8 flex flex-col items-start justify-between w-full transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:border-[#28c76f] group overflow-hidden">
            <span className="text-gray-200 text-base mb-2 flex items-center gap-2 text-left">Total Bets</span>
            <span className="text-2xl font-bold text-white text-left">{totalBets}</span>
            <span className="absolute top-4 right-4">
              {/* Yellow target icon */}
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#facc15" strokeWidth="2"><circle cx="12" cy="12" r="10" stroke="#facc15" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="6" stroke="#facc15" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="2" fill="#facc15"/></svg>
            </span>
          </div>
          {/* No. of Active Bets */}
          <div className="relative rounded-2xl bg-[#181f1f] border-2 border-[#28c76f]/80 p-8 flex flex-col items-start justify-between w-full transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:border-[#28c76f] group overflow-hidden">
            <span className="text-gray-200 text-base mb-2 flex items-center gap-2 text-left">No. of Active Bets</span>
            <span className="text-2xl font-bold text-white text-left">{activeBets}</span>
            <span className="absolute top-4 right-4">
              {/* History icon */}
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#facc15" strokeWidth="2"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 12 3v9z"/></svg>
            </span>
          </div>
          {/* Streak */}
          <div className="relative rounded-2xl bg-[#181f1f] border-2 border-[#28c76f]/80 p-8 flex flex-col items-start justify-between w-full transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:border-[#28c76f] group overflow-hidden">
            <span className="text-gray-200 text-base mb-2 flex items-center gap-2 text-left">Streak</span>
            <span className="text-2xl font-bold text-white text-left">{streak}</span>
            <span className="absolute top-4 right-4">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#facc15" strokeWidth="2"><path d="M3 17l6-6 4 4 8-8" stroke="#facc15" strokeWidth="2" fill="none"/><circle cx="9" cy="11" r="1.5" fill="#facc15"/><circle cx="13" cy="15" r="1.5" fill="#facc15"/><circle cx="19" cy="9" r="1.5" fill="#facc15"/></svg>
            </span>
          </div>
          {/* Success */}
          <div className="relative rounded-2xl bg-[#181f1f] border-2 border-[#28c76f]/80 p-8 flex flex-col items-start justify-between w-full transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:border-[#28c76f] group overflow-hidden">
            <span className="text-gray-200 text-base mb-2 flex items-center gap-2 text-left">Success</span>
            <span className="text-2xl font-bold text-emerald-200 text-left">{successRate.toFixed(2)}%</span>
            <span className="absolute top-4 right-4">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#facc15" strokeWidth="2"><path d="M8 21h8" stroke="#facc15" strokeWidth="2"/><path d="M12 17v4" stroke="#facc15" strokeWidth="2"/><path d="M7 4h10v4a5 5 0 0 1-10 0V4z" stroke="#facc15" strokeWidth="2" fill="none"/><path d="M17 4a5 5 0 0 0 5 5" stroke="#facc15" strokeWidth="2"/><path d="M7 4a5 5 0 0 1-5 5" stroke="#facc15" strokeWidth="2"/></svg>
            </span>
          </div>
        </div>
        {/* Betting History Table - full width, no max-w, no mx-auto, white border, thinner lines, radial bg */}
        <div className="relative rounded-2xl bg-white/80 border-2 border-white shadow-[0_0_10px_#28c76f11] p-8 w-full overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.25)_0%,_rgba(255,255,255,0)_80%)]" />
          {/* Filter Bar */}
          <div className="flex items-center bg-[#e2f7e1]/40 rounded-full p-1 w-fit mb-6 mx-auto gap-2 shadow-inner">
            <button
              onClick={() => setFilter('all')}
              className={`px-7 py-2 rounded-full font-semibold text-base transition-all duration-200 focus:outline-none
                ${filter === 'all'
                  ? 'bg-[#28c76f] text-white shadow-md'
                  : 'bg-transparent text-[#28c76f] hover:bg-[#e2f7e1] hover:text-[#1a2232]'}
              `}
            >All</button>
            <button
              onClick={() => setFilter('active')}
              className={`px-7 py-2 rounded-full font-semibold text-base transition-all duration-200 focus:outline-none
                ${filter === 'active'
                  ? 'bg-[#28c76f] text-white shadow-md'
                  : 'bg-transparent text-[#28c76f] hover:bg-[#e2f7e1] hover:text-[#1a2232]'}
              `}
            >Active</button>
            <button
              onClick={() => setFilter('expired')}
              className={`px-7 py-2 rounded-full font-semibold text-base transition-all duration-200 focus:outline-none
                ${filter === 'expired'
                  ? 'bg-[#28c76f] text-white shadow-md'
                  : 'bg-transparent text-[#28c76f] hover:bg-[#e2f7e1] hover:text-[#1a2232]'}
              `}
            >Expired</button>
          </div>
          <div className="text-xl font-bold text-[#28c76f] mb-4">Betting History</div>
          <div className="overflow-x-auto">
            {filteredBets.length === 0 ? (
              <div className="text-center text-gray-400 py-12 text-lg font-semibold">Nothing to show</div>
            ) : (
              <table className="min-w-full text-left text-gray-900">
                <thead>
                  <tr className="border-b-2 border-white">
                    <th className="py-2 px-6 text-[#28c76f] font-semibold">Company</th>
                    <th className="py-2 px-6 text-[#28c76f] font-semibold">Type</th>
                    <th className="py-2 px-6 text-[#28c76f] font-semibold">Amount</th>
                    <th className="py-2 px-6 text-[#28c76f] font-semibold">Stake</th>
                    <th className="py-2 px-6 text-[#28c76f] font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBets.map((bet, idx) => (
                    <tr key={idx} className="border-b-2 border-white">
                      <td className="py-2 px-6">{bet.companyEvent?.companyName || bet.company || '—'}</td>
                      <td className="py-2 px-6">
                        {bet.type === 'for' || bet.type === '👍' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-up w-4 h-4 sm:w-5 sm:h-5 text-blue-500"><path d="M7 10v12"></path><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"></path></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-down w-4 h-4 sm:w-5 sm:h-5 text-red-500"><path d="M17 14V2"></path><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"></path></svg>
                        )}
                      </td>
                      <td className="py-2 px-6">{bet.amount}</td>
                      <td className="py-2 px-6">{bet.stake}</td>
                      <td className="py-2 px-6">
                        <span className={`px-2 py-1 rounded text-xs ${bet.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-900'}`}>{bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function UserProfileWrapper(props) {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState({ user: null, bets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [userRes, betsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/profile/${userId}`),
          axios.get(`http://localhost:5000/api/bets/user/${userId}`)
        ]);
        setProfileData({ user: userRes.data, bets: betsRes.data });
      } catch (err) {
        setError("Could not load user profile.");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchProfileData();
  }, [userId]);

  if (loading) return <PageLayout user={props.user}><div>Loading Profile...</div></PageLayout>;
  if (error || !profileData.user) return <PageLayout user={props.user}><div>{error || "User not found."}</div></PageLayout>;

  return <UserProfile {...props} user={profileData.user} bets={profileData.bets} headerUser={props.user} />;
}


export default function App() {
  const [user, setUser] = useState(null);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me');
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const [showUserGuideModal, setShowUserGuideModal] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const announcements = [ 'Placement Season Surprise: Bet Big, Win Bigger!', 'Write a mail to us jobsy.noreply@gmail.com', 'All the best for placements!' ];
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    if (!showAnnouncement) return;
    const interval = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        setAnnouncementIdx(idx => (idx + 1) % announcements.length);
        setIsSliding(false);
      }, 350);
    }, 4000);
    return () => clearInterval(interval);
  }, [showAnnouncement, announcements.length]);

  // User Guide modal content (copied from HomePage)
  const userGuideContent = (
    <>
      <h2 className="text-3xl font-bold text-green-600 mb-6 flex items-center gap-2 transition-all duration-700 ease-out animate-fade-in-down">
        Welcome to<span className="text-green-600"> Jobsy</span> <span role="img" aria-label="target">🎯</span>
      </h2>
      <div className="overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
        <div className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>Quick Navigation</span>
          <span className="text-base text-gray-500 font-normal">(Available in navbar/hamburger menu)</span>
        </div>
        <ul className="text-slate-700 text-base space-y-4 mb-8">
          <li>
            <span className="font-bold text-pink-500">📋 See Shortlists</span>
            <ul className="list-disc ml-6 text-slate-500">
              <li>View all shortlists across active companies</li>
              <li>Filter candidates by branch</li>
              <li>Quick search via enrollment number or name</li>
              <li>Track total shortlists of Students in real-time</li>
            </ul>
          </li>
          <li>
            <span className="font-bold text-green-500">📈 Predict & Win</span>
            <ul className="list-disc ml-6 text-slate-500">
              <li>Start with 100000 welcome tokens</li>
              <li>Place strategic bets on placement outcomes - bet "For" or "Against"</li>
              <li>Watch stake multipliers update in real-time based on community betting</li>
              <li>Track your winning streak and climb our dynamic leaderboard</li>
            </ul>
          </li>
        </ul>
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-500 text-2xl">🎯</span>
              <span className="text-xl font-bold text-green-500">How It Works</span>
            </div>
            <ul className="list-disc ml-8 text-slate-700 space-y-1">
              <li><span className="font-bold">Connect & Start:</span> Sign up with your IIT BHU email and get 100000 tokens instantly</li>
              <li><span className="font-bold">Choose & Bet:</span> Browse active drives and place strategic bets with dynamic stake multipliers</li>
              <li><span className="font-bold">Track & Win:</span> Monitor results live, collect winnings, and climb the leaderboard</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-500 text-2xl">🔍</span>
              <span className="text-xl font-bold text-green-500">Pro Tips</span>
            </div>
            <ul className="list-disc ml-8 text-slate-700 space-y-1">
              <li>Keep an eye on multipliers - they update automatically based on betting patterns</li>
              <li>Higher multipliers = bigger potential returns</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
  const pageProps = {
    user,
    showUserGuideModal,
    setShowUserGuideModal
  };
  return (
    <BrowserRouter>
      <AppWithRouterAnnouncementBar 
        showAnnouncement={showAnnouncement}
        setShowAnnouncement={setShowAnnouncement}
        announcementIdx={announcementIdx}
        announcements={announcements}
        isSliding={isSliding}
        showUserGuideModal={showUserGuideModal}
        setShowUserGuideModal={setShowUserGuideModal}
        userGuideContent={userGuideContent}
      >
        <Routes>
          <Route path="/" element={<LandingPage loadUser={loadUser} />} />
          {/* Pass setUser to HomePage and other pages as needed */}
          <Route path="/home" element={<HomePage user={user} setUser={setUser} showUserGuideModal={showUserGuideModal} setShowUserGuideModal={setShowUserGuideModal} userGuideContent={userGuideContent} />} />
          <Route path="/profile" element={<UserProfilePage user={user} onUserGuide={() => setShowUserGuideModal(true)} />} />
          <Route path="/profile/:userId" element={<UserProfileWrapper {...pageProps} />} />
          <Route path="/my-bets" element={<MyBets {...pageProps} userGuideContent={userGuideContent} />} />
          <Route path="/active-bets" element={<ActiveBets {...pageProps} setUser={setUser} userGuideContent={userGuideContent} />} />
          <Route path="/shortlists" element={<Shortlists {...pageProps} userGuideContent={userGuideContent} />} />
          <Route path="/expired-bets" element={<ExpiredBets {...pageProps} userGuideContent={userGuideContent} />} />
          <Route path="/leaderboard" element={<Leaderboard {...pageProps} userGuideContent={userGuideContent} />} />
          <Route path="/admin-panel" element={<AdminPanel {...pageProps} userGuideContent={userGuideContent} />} />
          <Route path="/placement-data" element={<PlacementData {...pageProps} userGuideContent={userGuideContent} />} />
        </Routes>
      </AppWithRouterAnnouncementBar>
    </BrowserRouter>
  );
}
function AppWithRouterAnnouncementBar(props) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  
  return (
    <>
      {props.showAnnouncement && !isLoginPage && (
        <div className="w-full bg-[#28c76f] text-[#1e1e1e] text-center py-2 font-semibold text-lg flex items-center justify-center relative z-50 overflow-hidden" style={{minHeight: '48px'}}>
          <span
            className={`mx-auto transition-all duration-300 ease-in-out inline-block
              ${props.isSliding ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}
            style={{willChange: 'opacity, transform'}}
          >
            {props.announcements[props.announcementIdx]}
          </span>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1e1e1e] text-2xl font-bold hover:text-[#0e7c3a] transition" onClick={() => props.setShowAnnouncement(false)} aria-label="Close announcement">&times;</button>
        </div>
      )}
      {props.showUserGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => props.setShowUserGuideModal(false)}>&times;</button>
            {props.userGuideContent}
            <button className="mt-8 w-full bg-[#28c76f] hover:bg-[#22b36a] text-white font-bold py-3 rounded-full text-lg transition hover:shadow-md" onClick={() => props.setShowUserGuideModal(false)}>Get Started</button>
          </div>
        </div>
      )}
      {props.children}
    </>
  );
}
