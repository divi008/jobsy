import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DropdownMenu from './DropdownMenu';

export default function HeaderNav({ user, onUserGuide }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    function handleClick(e) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (mobileNavOpen && !e.target.closest('#mobile-nav-menu') && !e.target.closest('#hamburger-btn')) {
        setMobileNavOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen, mobileNavOpen]);

  function handleLogout() {
    setMenuOpen(false);
    setMobileNavOpen(false);
    navigate('/');
  }

  const userInitials = React.useMemo(() => {
    if (user?.initials) return user.initials;
    if (user?.name) {
      return user.name
        .split(' ')
        .filter(Boolean)
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return '';
  }, [user]);

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-10 py-4 md:py-6 relative shadow-sm" style={{ 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        borderBottom: '1px solid #333',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
          <img src="/pngkey.com-poker-chips-png-594513.png" alt="Jobsy Logo" className="w-8 h-8 md:w-10 md:h-10" />
          <span className="text-2xl md:text-3xl font-bold text-[#28c76f]">Jobsy</span>
        </div>
        {/* Desktop user menu */}
        <div className="hidden md:flex items-center gap-6 relative">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            border: '2px solid #90EE90',
            boxShadow: '0 2px 10px rgba(144,238,144,0.3)'
          }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#90EE90' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V6c0-2.21 3.582-4 8-4s8 1.79 8 4v8c0 2.21-3.582 4-8 4z" />
            </svg>
            <span className="font-bold text-lg" style={{ 
              color: '#90EE90', 
              fontFamily: 'monospace',
              textShadow: '0 0 10px rgba(144,238,144,0.5)'
            }}>{user?.tokens.toLocaleString()}</span>
          </div>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="w-10 h-10 bg-[#28c76f] rounded-full flex items-center justify-center font-bold text-lg text-white focus:outline-none focus:ring-2 focus:ring-[#28c76f]">
              {userInitials}
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
        {/* Hamburger for mobile */}
        <button
          id="hamburger-btn"
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#28c76f]"
          aria-label="Open navigation menu"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          <svg className="w-7 h-7 text-[#28c76f]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>
      {/* Navbar for desktop */}
      <nav className="hidden md:flex items-center gap-8 px-10 py-2 bg-[#181f1f] text-gray-100 text-base font-medium shadow-sm">
        <span className={`flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-[#28c76f] hover:border-[#28c76f] hover:border-2 ${location.pathname === '/shortlists' ? 'border-2 border-[#28c76f] bg-[#28c76f] text-[#181f1f]' : ''}`} onClick={() => navigate('/shortlists')}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target w-4 h-4 mr-1"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg> See Shortlists</span>
        <span className={`flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-[#28c76f] hover:border-[#28c76f] hover:border-2 ${location.pathname === '/active-bets' ? 'border-2 border-[#28c76f] bg-[#28c76f] text-[#181f1f]' : ''}`} onClick={() => navigate('/active-bets')}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hourglass w-4 h-4 mr-1"><path d="M6 2h12"/><path d="M6 22h12"/><path d="M6 2v6a6 6 0 0 0 12 0V2"/><path d="M6 22v-6a6 6 0 0 1 12 0v6"/><path d="M12 12v0"/></svg> Active Bets</span>
        <span className={`flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-[#28c76f] hover:border-[#28c76f] hover:border-2 ${location.pathname === '/expired-bets' ? 'border-2 border-[#28c76f] bg-[#28c76f] text-[#181f1f]' : ''}`} onClick={() => navigate('/expired-bets')}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history w-4 h-4 mr-1"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 12 3v9z"/></svg> Expired Bets</span>
        <span className={`flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-[#28c76f] hover:border-[#28c76f] hover:border-2 ${location.pathname === '/leaderboard' ? 'border-2 border-[#28c76f] bg-[#28c76f] text-[#181f1f]' : ''}`} onClick={() => navigate('/leaderboard')}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy w-4 h-4 mr-1"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v4a5 5 0 0 1-10 0V4z"/><path d="M17 4a5 5 0 0 0 5 5"/><path d="M7 4a5 5 0 0 1-5 5"/></svg> Leaderboard</span>
        <span className={`flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-[#28c76f] hover:border-[#28c76f] hover:border-2 ${location.pathname === '/forum' ? 'border-2 border-[#28c76f] bg-[#28c76f] text-[#181f1f]' : ''}`} onClick={() => navigate('/forum')}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square w-4 h-4 mr-1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Forum</span>
        <span className={`flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-[#28c76f] hover:border-[#28c76f] hover:border-2 ${location.pathname === '/admin-panel' ? 'border-2 border-[#28c76f] bg-[#28c76f] text-[#181f1f]' : ''}`} onClick={() => navigate('/admin-panel')}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield w-4 h-4 mr-1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Admin Panel</span>
      </nav>
      {/* Mobile nav overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden" onClick={() => setMobileNavOpen(false)}></div>
      )}
      {/* Mobile nav menu */}
      <nav
        id="mobile-nav-menu"
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#181f1f] text-white flex flex-col pt-20 px-6 shadow-2xl transition-transform duration-300 md:hidden ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Mobile navigation"
      >
        <button className="absolute top-6 right-6 text-3xl text-white" onClick={() => setMobileNavOpen(false)}>&times;</button>
        <a href="/home" className="py-3 text-lg font-semibold hover:text-[#28c76f]" onClick={() => setMobileNavOpen(false)}>Home</a>
        <a href="/active-bets" className="py-3 text-lg font-semibold hover:text-[#28c76f]" onClick={() => setMobileNavOpen(false)}>Active Bets</a>
        <a href="/my-bets" className="py-3 text-lg font-semibold hover:text-[#28c76f]" onClick={() => setMobileNavOpen(false)}>My Bets</a>
        <a href="/profile" className="py-3 text-lg font-semibold hover:text-[#28c76f]" onClick={() => setMobileNavOpen(false)}>Profile</a>
        <a href="/leaderboard" className="py-3 text-lg font-semibold hover:text-[#28c76f]" onClick={() => setMobileNavOpen(false)}>Leaderboard</a>
        <a href="/forum" className="py-3 text-lg font-semibold hover:text-[#28c76f]" onClick={() => setMobileNavOpen(false)}>Forum</a>
        <a href="/shortlists" className="py-3 text-lg font-semibold hover:text-[#28c76f]" onClick={() => setMobileNavOpen(false)}>See Shortlists</a>
        <a href="/admin-panel" className="py-3 text-lg font-semibold hover:text-[#28c76f]" onClick={() => setMobileNavOpen(false)}>Admin Panel</a>
        <div className="mt-6 border-t border-white/20 pt-4">
          <button className="w-full flex items-center gap-3 py-2 px-4 bg-[#28c76f] rounded-full text-lg font-bold text-white" onClick={() => { setMobileNavOpen(false); onUserGuide && onUserGuide(); }}>
            {userInitials} <span className="ml-auto">Profile</span>
          </button>
          <button className="w-full mt-2 flex items-center gap-3 py-2 px-4 bg-[#093820] rounded-full text-lg font-bold text-white" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
} 