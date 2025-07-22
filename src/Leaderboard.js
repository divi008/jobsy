import React, { useState, useEffect } from "react";
import PageLayout from "./PageLayout";
import { mockUsers } from "./mockUsers";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function getInitials(name) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);
}

function Arrow({ active, dir }) {
  // Truly single-headed vertical arrow (bow and arrow style)
  const isAsc = dir === "asc";
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="inline ml-1 align-middle transition-transform duration-150"
      style={{ verticalAlign: "middle" }}
    >
      {/* Arrow shaft */}
      <line x1="12" y1="4" x2="12" y2="20" stroke={active ? "#FFD600" : "#888"} strokeWidth="2" strokeLinecap="round" />
      {/* Arrow head: only at the top for asc, only at the bottom for desc */}
      {isAsc ? (
        <polygon points="12,4 9,8 15,8" fill={active ? "#FFD600" : "#888"} />
      ) : (
        <polygon points="12,20 9,16 15,16" fill={active ? "#FFD600" : "#888"} />
      )}
      {/* Arrow tail (feathers) always at the bottom */}
      <line x1="12" y1="20" x2="9" y2="17" stroke={active ? "#FFD600" : "#888"} strokeWidth="1.5" />
      <line x1="12" y1="20" x2="15" y2="17" stroke={active ? "#FFD600" : "#888"} strokeWidth="1.5" />
    </svg>
  );
}

export default function Leaderboard({ user, showUserGuideModal, setShowUserGuideModal, showAnnouncement, setShowAnnouncement, announcementIdx, announcements, isSliding }) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("tokens");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    if (typeof window.confetti !== 'function') return;
    const duration = 1200;
    const interval = 16000;
    let intervalId;
    function shootRocket(x) {
      const duration = 1300;
      const end = Date.now() + duration;
      (function frame() {
        // Rocket trail
        window.confetti({
          particleCount: 2,
          startVelocity: 55,
          angle: 90,
          spread: 10,
          origin: { x, y: 1 },
          colors: ['#ffd700', '#ff4e50', '#ffffff'],
          scalar: 0.7,
          gravity: 0.7,
          decay: 0.95
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          // Final burst at top
          window.confetti({
            particleCount: 60,
            startVelocity: 30,
            spread: 500,
            origin: { x, y: 0.2 },
            colors: ['#FFD700', '#C0C0C0', '#FF6347', '#ffffff'],
            scalar: 1.15,
            gravity: 0.5,
            decay: 0.92
          });
        }
      })();
    }
    function fireCrackers() {
      shootRocket(0.2);
      shootRocket(0.5);
      shootRocket(0.8);
    }
    intervalId = setInterval(fireCrackers, interval);
    // Fire once on mount
    fireCrackers();
    return () => clearInterval(intervalId);
  }, []);

  function handleSort(col) {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir(col === "rank" ? "asc" : "desc");
    }
  }

  let sorted = [...mockUsers].map((u, i) => ({ ...u, rank: i + 1 }));
  if (sortBy === "tokens") {
    sorted.sort((a, b) => sortDir === "asc" ? a.tokens - b.tokens : b.tokens - a.tokens);
  } else if (sortBy === "success") {
    sorted.sort((a, b) => sortDir === "asc" ? a.successRate - b.successRate : b.successRate - a.successRate);
  } else if (sortBy === "streak") {
    sorted.sort((a, b) => sortDir === "asc" ? Math.floor(a.successRate/10) - Math.floor(b.successRate/10) : Math.floor(b.successRate/10) - Math.floor(a.successRate/10));
  } else if (sortBy === "rank") {
    sorted = [...mockUsers].map((u, i) => ({ ...u, rank: i + 1 }));
  }
  // After sorting, re-assign rank
  sorted = sorted.map((u, i) => ({ ...u, rank: i + 1 }));
  const top3 = [sorted[1], sorted[0], sorted[2]];
  // Actually, sort top3 by tokens descending for correct podium order
  const podium = [...sorted].sort((a, b) => b.tokens - a.tokens).slice(0, 3);

  return (
    <PageLayout
      user={user}
      onUserGuide={() => setShowUserGuideModal(true)}
      showAnnouncement={showAnnouncement}
      setShowAnnouncement={setShowAnnouncement}
      announcementIdx={announcementIdx}
      announcements={announcements}
      isSliding={isSliding}
    >
      <div className="w-full flex flex-col items-center py-2">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-5xl font-extrabold text-[#28c76f] mb-1 text-center"
        >
          Jobsy Leaderboard
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-slate-300 mb-12 text-center"
        >
          Celebrating Our Top Performers
        </motion.div>
        {/* Podium */}
        <div className="flex flex-col md:flex-row justify-center items-end gap-8 mb-12 w-full max-w-6xl mx-auto">
          {/* Silver */}
          <div
            className="group w-[280px] h-[320px] rounded-2xl p-6 border border-white/30 flex flex-col items-center justify-center relative transition-all duration-300 ease-in-out hover:scale-105 hover:-rotate-2 hover:shadow-2xl"
            style={{
              background: "linear-gradient(to bottom, #f4f4f4 0%, #dcdcdc 30%, #bcbcbc 60%, #a0a0a0 80%, #888888 100%)",
              boxShadow: "0 4px 32px 0 rgba(200,200,200,0.13), 0 1.5px 8px 0 rgba(255,255,255,0.10)"
            }}
            onMouseOver={e => e.currentTarget.style.boxShadow = "0 6px 40px 0 rgba(255,255,255,0.18), 0 2px 12px 0 rgba(200,200,200,0.13)"}
            onMouseOut={e => e.currentTarget.style.boxShadow = "0 4px 32px 0 rgba(200,200,200,0.13), 0 1.5px 8px 0 rgba(255,255,255,0.10)"}
          >
            {/* Only SVG icon remains, emoji removed */}
            <div className="absolute top-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-medal h-6 w-6">
                <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"></path>
                <path d="M11 12 5.12 2.2"></path>
                <path d="m13 12 5.88-9.8"></path>
                <path d="M8 7h8"></path>
                <circle cx="12" cy="17" r="5"></circle>
                <path d="M12 18v-2h-.5"></path>
              </svg>
            </div>
            <div className="w-20 h-20 rounded-full border-2 border-white bg-white/10" style={{boxShadow:'0 0 12px 2px #fff, 0 0 8px 2px #fff8',backdropFilter:'blur(3px)'}}>
              <div className="flex items-center justify-center w-full h-full text-3xl font-bold text-white">{getInitials(podium[1].name)}</div>
            </div>
            <button className="text-white text-xl font-bold mb-1 hover:underline hover:text-[#28c76f] transition" onClick={() => navigate(`/profile/${podium[1].id}`)}>{podium[1].name}</button>
            <div className="text-white font-bold text-lg flex items-center gap-2 mb-2">
              <span>🏆</span> {podium[1].tokens.toLocaleString()} Tokens
            </div>
            <div className="text-sm text-white/80 mb-1">Success Rate</div>
            <div className="w-full bg-gray-300/40 h-2 rounded-full mb-1 overflow-hidden">
              <div className="bg-green-400 h-full" style={{ width: `${podium[1].successRate}%` }}></div>
            </div>
            <div className="text-green-600 font-semibold text-sm">{podium[1].successRate.toFixed(1)}%</div>
          </div>
          {/* Gold */}
          <div
            className="group w-[320px] h-[400px] rounded-2xl p-6 border-2 border-yellow-200 flex flex-col items-center justify-center relative z-10 transition-all duration-300 ease-in-out hover:scale-105 hover:rotate-2 hover:shadow-2xl"
            style={{
              background: "linear-gradient(to bottom, #eab308 0%, #eab308 60%, #ffd700 80%, #ffb300 90%, #ffae42 100%)",
              boxShadow: "0 6px 36px 0 rgba(255,223,0,0.13), 0 2px 12px 0 rgba(255,255,255,0.10)"
            }}
            onMouseOver={e => e.currentTarget.style.boxShadow = "0 8px 48px 0 rgba(255,255,255,0.18), 0 3px 16px 0 rgba(255,223,0,0.13)"}
            onMouseOut={e => e.currentTarget.style.boxShadow = "0 6px 36px 0 rgba(255,223,0,0.13), 0 2px 12px 0 rgba(255,255,255,0.10)"}
          >
            {/* Replace crown emoji with SVG icon */}
            <div className="absolute top-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B2608" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-crown h-6 w-6">
                <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path>
                <path d="M5 21h14"></path>
              </svg>
            </div>
            <div className="w-20 h-20 rounded-full border-2 border-white bg-white/10" style={{boxShadow:'0 0 12px 2px #fff, 0 0 8px 2px #fff8',backdropFilter:'blur(3px)'}}>
              <div className="flex items-center justify-center w-full h-full text-3xl font-bold text-white">{getInitials(podium[0].name)}</div>
            </div>
            <button className="text-white text-xl font-bold mb-1 hover:underline hover:text-[#28c76f] transition" onClick={() => navigate(`/profile/${podium[0].id}`)}>{podium[0].name}</button>
            <div className="text-white font-bold text-lg flex items-center gap-2 mb-2">
              <span>🏆</span> {podium[0].tokens.toLocaleString()} Tokens
            </div>
            <div className="text-sm text-white/80 mb-1">Success Rate</div>
            <div className="w-full bg-yellow-200/40 h-2 rounded-full mb-1 overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: `${podium[0].successRate}%` }}></div>
            </div>
            <div className="text-green-700 font-semibold text-sm">{podium[0].successRate.toFixed(1)}%</div>
          </div>
          {/* Bronze */}
          <div
            className="group w-[280px] h-[320px] rounded-2xl p-6 border border-white/30 flex flex-col items-center justify-center relative transition-all duration-300 ease-in-out hover:scale-105 hover:-rotate-2 hover:shadow-2xl"
            style={{
              background: "linear-gradient(to bottom, #f5deb3 0%, #cd7f32 30%, #b87333 60%, #8b4513 90%, #5a2d0c 100%)",
              boxShadow: "0 4px 32px 0 rgba(205,127,50,0.13), 0 1.5px 8px 0 rgba(255,255,255,0.10)"
            }}
            onMouseOver={e => e.currentTarget.style.boxShadow = "0 6px 40px 0 rgba(255,255,255,0.18), 0 2px 12px 0 rgba(205,127,50,0.13)"}
            onMouseOut={e => e.currentTarget.style.boxShadow = "0 4px 32px 0 rgba(205,127,50,0.13), 0 1.5px 8px 0 rgba(255,255,255,0.10)"}
          >
            {/* Only SVG icon remains, emoji removed */}
            <div className="absolute top-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-medal h-6 w-6">
                <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"></path>
                <path d="M11 12 5.12 2.2"></path>
                <path d="m13 12 5.88-9.8"></path>
                <path d="M8 7h8"></path>
                <circle cx="12" cy="17" r="5"></circle>
                <path d="M12 18v-2h-.5"></path>
              </svg>
            </div>
            <div className="w-20 h-20 rounded-full border-2 border-white bg-white/10" style={{boxShadow:'0 0 12px 2px #fff, 0 0 8px 2px #fff8',backdropFilter:'blur(3px)'}}>
              <div className="flex items-center justify-center w-full h-full text-3xl font-bold text-white">{getInitials(podium[2].name)}</div>
            </div>
            <button className="text-white text-xl font-bold mb-1 hover:underline hover:text-[#28c76f] transition" onClick={() => navigate(`/profile/${podium[2].id}`)}>{podium[2].name}</button>
            <div className="text-white font-bold text-lg flex items-center gap-2 mb-2">
              <span>🏆</span> {podium[2].tokens.toLocaleString()} Tokens
            </div>
            <div className="text-sm text-white/80 mb-1">Success Rate</div>
            <div className="w-full bg-orange-200/40 h-2 rounded-full mb-1 overflow-hidden">
              <div className="bg-green-400 h-full" style={{ width: `${podium[2].successRate}%` }}></div>
            </div>
            <div className="text-green-700 font-semibold text-sm">{podium[2].successRate.toFixed(1)}%</div>
          </div>
        </div>
        {/* Complete Rankings Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-bold text-white mb-4 text-center w-full"
        >
          Complete Rankings
        </motion.h2>
        {/* Complete Rankings Table - edge to edge but with a little margin and sharp edges */}
        <div className="w-full bg-[#181f1f] shadow-lg p-6 mt-0 mx-2 sm:mx-4 md:mx-8" style={{ borderRadius: 0 }}>
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[700px] text-left text-base">
              <thead>
                <tr className="bg-transparent text-[#28c76f] border-b border-[#28c76f]/30">
                  <th className="py-3 px-4 font-bold cursor-pointer select-none" onClick={() => handleSort("rank")}>Rank
                    <Arrow active={sortBy === "rank"} dir={sortDir} />
                  </th>
                  <th className="py-3 px-4 font-bold">User</th>
                  <th className="py-3 px-4 font-bold cursor-pointer select-none" onClick={() => handleSort("tokens")}>Tokens
                    <Arrow active={sortBy === "tokens"} dir={sortDir} />
                  </th>
                  <th className="py-3 px-4 font-bold cursor-pointer select-none" onClick={() => handleSort("success")}>Success
                    <Arrow active={sortBy === "success"} dir={sortDir} />
                  </th>
                  <th className="py-3 px-4 font-bold cursor-pointer select-none" onClick={() => handleSort("streak")}>Streak
                    <Arrow active={sortBy === "streak"} dir={sortDir} />
                  </th>
                </tr>
              </thead>
              <motion.tbody
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
              >
                {sorted.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4 } } }}
                    className={`border-b border-[#232b3a] ${i % 2 === 1 ? 'bg-[#1a2320]/60' : ''}`}
                  >
                    <td className="py-2 px-4 font-bold text-[#28c76f]">{i + 1}</td>
                    <td className="py-2 px-4 flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-[#28c76f] text-[#181f1f] font-bold flex items-center justify-center text-lg border-2 border-[#28c76f]/60">{getInitials(u.name)}</span>
                      <button className="text-white hover:text-[#28c76f] hover:underline font-semibold transition" onClick={() => navigate(`/profile/${u.id}`)}>{u.name}</button>
                    </td>
                    <td className="py-2 px-4 text-white font-semibold">{u.tokens.toLocaleString()}</td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-[#232b3a] rounded-full overflow-hidden">
                          <div className="h-full bg-[#28c76f]" style={{ width: `${u.successRate}%` }} />
                        </div>
                        <span className="text-white font-bold">{u.successRate.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-orange-400 font-bold flex items-center gap-1">{Math.floor(u.successRate / 10)} <span role="img" aria-label="fire">🔥</span></td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 