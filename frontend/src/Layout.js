import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import HeaderNav from "./HeaderNav";

export default function Layout({ user, tokens, setTokens, showUserGuideModal, setShowUserGuideModal, userGuideContent, showAnnouncement, setShowAnnouncement, announcementIdx, announcements, children }) {
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 via-white to-green-50 text-gray-900 font-sans">
      {/* Announcement Bar */}
      {(location.pathname === '/home' || location.pathname === '/profile' || location.pathname === '/my-bets') && showAnnouncement && (
        <div className="w-full bg-[#28c76f] text-[#1e1e1e] text-center py-2 font-semibold text-lg flex items-center justify-center relative z-50 overflow-hidden" style={{minHeight: '48px'}}>
          <span className="mx-auto transition-all duration-300 ease-in-out inline-block">
            {announcements[announcementIdx]}
          </span>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1e1e1e] text-2xl font-bold hover:text-[#0e7c3a] transition" onClick={() => setShowAnnouncement(false)} aria-label="Close announcement">&times;</button>
        </div>
      )}
      {/* Header and Nav */}
      <HeaderNav
        user={user}
        onUserGuide={() => setShowUserGuideModal(true)}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />
      {/* Mobile Nav Overlay */}
      <div className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${mobileNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}></div>
      <nav className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#181f1f] text-white flex flex-col pt-20 px-6 shadow-2xl transition-transform duration-300 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
        <button className="absolute top-6 right-6 text-3xl text-white" onClick={() => setMobileNavOpen(false)}>&times;</button>
        <a href="/home" className="py-3 text-lg font-semibold hover:text-[#28c76f]" onClick={() => setMobileNavOpen(false)}>Home</a>
        <a href="/active-bets" className="py-3 text-lg font-semibold hover:text-[#28c76f]" onClick={() => setMobileNavOpen(false)}>Active Bets</a>
        <a href="/my-bets" className="py-3 text-lg font-semibold hover:text-[#28c76f]" onClick={() => setMobileNavOpen(false)}>My Bets</a>
        <a href="/profile" className="py-3 text-lg font-semibold hover:text-[#28c76f]" onClick={() => setMobileNavOpen(false)}>Profile</a>
        <a href="/leaderboard" className="py-3 text-lg font-semibold hover:text-[#28c76f]" onClick={() => setMobileNavOpen(false)}>Leaderboard</a>
        <a href="/placement-data" className="py-3 text-lg font-semibold hover:text-[#28c76f]" onClick={() => setMobileNavOpen(false)}>Placement Data</a>
        <a href="/see-shortlists" className="py-3 text-lg font-semibold hover:text-[#28c76f]" onClick={() => setMobileNavOpen(false)}>See Shortlists</a>
        {/* Profile Dropdown for mobile (reuse DropdownMenu if possible) */}
        <div className="mt-6 border-t border-white/20 pt-4">
          <button className="w-full flex items-center gap-3 py-2 px-4 bg-[#28c76f] rounded-full text-lg font-bold text-white" onClick={() => setShowUserGuideModal(true)}>
            {user.initials} <span className="ml-auto">Profile</span>
          </button>
          <button className="w-full mt-2 flex items-center gap-3 py-2 px-4 bg-[#093820] rounded-full text-lg font-bold text-white" onClick={() => {/* handle logout */}}>
            Logout
          </button>
        </div>
      </nav>
      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-8 py-6">
        {children}
      </main>
      {/* Footer */}
      <footer className="w-full flex justify-center mt-10">
        <div className="w-full flex items-center gap-2 px-8 py-3 text-gray-300 bg-transparent text-sm" style={{borderTop: '1px solid #232b3a'}}>
          <svg className="w-5 h-5 text-[#28c76f] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#28c76f" strokeWidth="2" fill="none"/><path d="M12 16v-4" stroke="#28c76f" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="8" r="1" fill="#28c76f"/></svg>
          <span>For entertainment only. Not affiliated with IIT BHU or placement cells. Any resemblance to persons or events is coincidental. No real job predictions or monetary rewards. Participation is purely for fun—please enjoy responsibly.</span>
        </div>
      </footer>
    </div>
  );
} 