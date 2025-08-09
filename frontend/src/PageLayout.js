import React from "react";
import HeaderNav from "./HeaderNav";

export default function PageLayout({ user, onUserGuide, children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,_#0b1412_0%,_#0b1412_35%,_#0d1a17_65%,_#0b1412_100%)] text-gray-200 font-sans flex flex-col">
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