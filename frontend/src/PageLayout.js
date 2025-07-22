import React from "react";
import HeaderNav from "./HeaderNav";

function AnnouncementBar({ show, setShow, announcements, idx, isSliding }) {
  if (!show) return null;
  return (
    <div className="w-full bg-[#28c76f] text-[#1e1e1e] text-center py-2 font-semibold text-lg flex items-center justify-center relative z-50 overflow-hidden" style={{minHeight: '48px'}}>
      <span
        className={`mx-auto transition-all duration-300 ease-in-out inline-block ${isSliding ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}
        style={{willChange: 'opacity, transform'}}
      >
        {announcements[idx]}
      </span>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1e1e1e] text-2xl font-bold hover:text-[#0e7c3a] transition" onClick={() => setShow(false)} aria-label="Close announcement">&times;</button>
    </div>
  );
}

export default function PageLayout({ user, onUserGuide, children, showAnnouncement, setShowAnnouncement, announcementIdx, announcements, isSliding }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 text-gray-900 font-sans flex flex-col">
      <AnnouncementBar show={showAnnouncement} setShow={setShowAnnouncement} announcements={announcements} idx={announcementIdx} isSliding={isSliding} />
      <HeaderNav user={user} onUserGuide={onUserGuide} />
      <main className="flex-1 w-full px-4 md:px-10 flex flex-col items-center justify-center py-12">
        {children}
      </main>
      <footer className="w-full flex justify-center mt-10">
        <div className="w-full flex items-center gap-2 px-8 py-3 text-gray-300 bg-transparent text-sm" style={{borderTop: '1px solid #232b3a'}}>
          <svg className="w-5 h-5 text-[#28c76f] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#28c76f" strokeWidth="2" fill="none"/><path d="M12 16v-4" stroke="#28c76f" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="8" r="1" fill="#28c76f"/></svg>
          <span>For entertainment only. Not affiliated with IIT BHU or placement cells. Any resemblance to persons or events is coincidental. No real job predictions or monetary rewards. Participation is purely for fun—please enjoy responsibly.</span>
        </div>
      </footer>
    </div>
  );
} 