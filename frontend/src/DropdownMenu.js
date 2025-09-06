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
    <div className="absolute right-0 mt-2 w-72 z-50 overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      borderRadius: '0px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
      border: '2px solid #333'
    }} ref={menuRef}>
      <div className="px-6 py-4" style={{ borderBottom: '1px solid #333' }}>
        <button
          className="font-bold text-lg mb-1 hover:text-red-500 transition-colors text-left w-full"
          style={{ color: '#fff' }}
          onMouseEnter={e => e.currentTarget.classList.add('text-red-500')}
          onMouseLeave={e => e.currentTarget.classList.remove('text-red-500')}
          onClick={() => {
            setOpen(false);
            if (onProfile) onProfile();
          }}
        >
          {user?.name || 'User'}
        </button>
        <div className="text-sm" style={{ color: '#90EE90' }}>{user?.email}</div>
      </div>
      <div className="flex flex-col" style={{ borderTop: '1px solid #333' }}>
        <button className="flex items-center gap-3 px-6 py-3 transition text-base text-left hover:bg-gray-800" style={{ color: '#fff', borderBottom: '1px solid #333' }} onClick={() => { setOpen(false); navigate('/my-bets'); }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#90EE90" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          My bets
        </button>
        <button className="flex items-center gap-3 px-6 py-3 transition text-base text-left hover:bg-gray-800" style={{ color: '#fff', borderBottom: '1px solid #333' }} onClick={() => { if (onUserGuide) onUserGuide(); setOpen(false); }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#90EE90" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
          User Guide
        </button>
        <button className="flex items-center gap-3 px-6 py-3 text-red-500 transition text-base text-left font-semibold hover:bg-gray-800" onClick={() => { setOpen(false); if (onLogout) onLogout(); }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
          Logout
        </button>
      </div>
    </div>
  );
} 