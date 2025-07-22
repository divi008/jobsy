import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DropdownMenu({ user, open, setOpen, onProfile, onUserGuide, onLogout, anchorRef }) {
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e) {
      if (open && menuRef.current && !menuRef.current.contains(e.target) && (!anchorRef || !anchorRef.current.contains(e.target))) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, setOpen, anchorRef]);

  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#e5f9ec] z-50 overflow-hidden" ref={menuRef}>
      <div className="px-6 py-4 border-b border-[#e5f9ec]">
        <button
          className="font-bold text-lg text-gray-900 mb-1 hover:text-red-500 transition-colors text-left w-full"
          onMouseEnter={e => e.currentTarget.classList.add('text-red-500')}
          onMouseLeave={e => e.currentTarget.classList.remove('text-red-500')}
          onClick={() => {
            setOpen(false);
            if (onProfile) onProfile();
          }}
        >
          {user?.name || 'User'}
        </button>
        <div className="text-[#28c76f] text-sm">{user?.email}</div>
      </div>
      <div className="flex flex-col divide-y divide-[#e5f9ec]">
        <button className="flex items-center gap-3 px-6 py-3 text-gray-900 transition text-base text-left" onClick={() => { setOpen(false); navigate('/my-bets'); }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#28c76f" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          My bets
        </button>
        <button className="flex items-center gap-3 px-6 py-3 text-gray-900 transition text-base text-left" onClick={() => { if (onUserGuide) onUserGuide(); setOpen(false); }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#28c76f" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
          User Guide
        </button>
        <button className="flex items-center gap-3 px-6 py-3 text-red-500 transition text-base text-left rounded-b-xl font-semibold bg-transparent" onClick={() => { setOpen(false); if (onLogout) onLogout(); }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
          Logout
        </button>
      </div>
    </div>
  );
} 