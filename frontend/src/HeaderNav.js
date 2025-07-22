import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DropdownMenu from './DropdownMenu';

export default function HeaderNav({ user, onUserGuide }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-10 py-4 md:py-6 bg-white/80 border-b border-[#e5f9ec] text-gray-900 relative shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
          <img src="/pngkey.com-poker-chips-png-594513.png" alt="Jobsy Logo" className="w-8 h-8 md:w-10 md:h-10" />
          <span className="text-2xl md:text-3xl font-bold text-[#28c76f]">Jobsy</span>
        </div>
        <div className="hidden md:flex items-center gap-6 relative">
          <div className="flex items-center gap-2 bg-[#093820] px-4 py-2 rounded-full">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#28c76f]">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V6c0-2.21 3.582-4 8-4s8 1.79 8 4v8c0 2.21-3.582 4-8 4z" />
            </svg>
            <span className="font-semibold text-lg text-gray-900">{user.tokens.toLocaleString()}</span>
          </div>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="w-10 h-10 bg-[#28c76f] rounded-full flex items-center justify-center font-bold text-lg text-white focus:outline-none focus:ring-2 focus:ring-[#28c76f]">
              {user.initials}
            </button>
            <DropdownMenu
              user={user}
              open={menuOpen}
              setOpen={setMenuOpen}
              onProfile={() => { setMenuOpen(false); navigate('/profile'); }}
              onUserGuide={onUserGuide}
              onLogout={handleLogout}
              anchorRef={menuRef}
            />
          </div>
        </div>
      </header>
      {/* Navbar for desktop */}
      <nav className="hidden md:flex items-center gap-8 px-10 py-2 bg-[#181f1f] text-gray-100 text-base font-medium shadow-sm">
        <span className={`flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-[#28c76f] hover:border-[#28c76f] hover:border-2 ${location.pathname === '/shortlists' ? 'border-2 border-[#28c76f] bg-[#28c76f] text-[#181f1f]' : ''}`} onClick={() => navigate('/shortlists')}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target w-4 h-4 mr-1"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg> See Shortlists</span>
        <span className={`flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-[#28c76f] hover:border-[#28c76f] hover:border-2 ${location.pathname === '/active-bets' ? 'border-2 border-[#28c76f] bg-[#28c76f] text-[#181f1f]' : ''}`} onClick={() => navigate('/active-bets')}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hourglass w-4 h-4 mr-1"><path d="M6 2h12"/><path d="M6 22h12"/><path d="M6 2v6a6 6 0 0 0 12 0V2"/><path d="M6 22v-6a6 6 0 0 1 12 0v6"/><path d="M12 12v0"/></svg> Active Bets</span>
        <span className={`flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-[#28c76f] hover:border-[#28c76f] hover:border-2 ${location.pathname === '/expired-bets' ? 'border-2 border-[#28c76f] bg-[#28c76f] text-[#181f1f]' : ''}`} onClick={() => navigate('/expired-bets')}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history w-4 h-4 mr-1"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 12 3v9z"/></svg> Expired Bets</span>
        <span className={`flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-[#28c76f] hover:border-[#28c76f] hover:border-2 ${location.pathname === '/leaderboard' ? 'border-2 border-[#28c76f] bg-[#28c76f] text-[#181f1f]' : ''}`} onClick={() => navigate('/leaderboard')}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy w-4 h-4 mr-1"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v4a5 5 0 0 1-10 0V4z"/><path d="M17 4a5 5 0 0 0 5 5"/><path d="M7 4a5 5 0 0 1-5 5"/></svg> Leaderboard</span>
        <span className={`flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-[#28c76f] hover:border-[#28c76f] hover:border-2 ${location.pathname === '/placement-data' ? 'border-2 border-[#28c76f] bg-[#28c76f] text-[#181f1f]' : ''}`} onClick={() => navigate('/placement-data')}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-2 w-4 h-4 mr-1"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Placement Data</span>
        <span className={`flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-[#28c76f] hover:border-[#28c76f] hover:border-2 ${location.pathname === '/admin-panel' ? 'border-2 border-[#28c76f] bg-[#28c76f] text-[#181f1f]' : ''}`} onClick={() => navigate('/admin-panel')}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield w-4 h-4 mr-1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Admin Panel</span>
      </nav>
    </>
  );
} 