import React, { useState, useMemo, useRef } from "react";
import PageLayout from "./PageLayout";
import { mockCandidates, mockCompanies } from "./mockData";
import { motion } from "framer-motion";

const allBranches = Array.from(new Set(mockCandidates.map(c => c.branch))).sort();

export default function Shortlists({ user, showUserGuideModal, setShowUserGuideModal, showAnnouncement, setShowAnnouncement, announcementIdx, announcements, isSliding }) {
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");
  const popoverRefs = useRef([]);

  // Helper to get company names for a candidate
  function getShortlistedCompanies(candidate) {
    return (candidate.shortlistedIn || []).map(cid => {
      const company = mockCompanies.find(c => c.id === cid);
      return company ? company.name : cid;
    });
  }

  // Filter candidates by name/enrollment and branch
  const filteredCandidates = useMemo(() => {
    return mockCandidates.filter(cand => {
      const matchesSearch =
        !search.trim() ||
        cand.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        cand.enrollment.toLowerCase().includes(search.trim().toLowerCase());
      const matchesBranch = !branch || cand.branch === branch;
      return matchesSearch && matchesBranch;
    });
  }, [search, branch]);

  // Close popover on outside click
  React.useEffect(() => {
    function handleClick(e) {
      if (expanded !== null && popoverRefs.current[expanded] && !popoverRefs.current[expanded].contains(e.target)) {
        setExpanded(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [expanded]);

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
      <div className="w-full max-w-6xl mx-auto mt-2">
        {/* Heading and subtitle */}
        <div className="flex flex-col items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-5xl font-bold text-[#28c76f] mb-2 text-center"
          >
            See Shortlists
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl text-gray-300 mb-6 text-center"
          >
            Search for individuals and view their shortlists, filter by branch
          </motion.div>
        </div>
        {/* Search bars and button */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-full max-w-2xl flex flex-col gap-3">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#28c76f" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-2-2"/></svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Enter name or enrollment number..."
                className="w-full pl-10 pr-4 py-3 bg-[#232b2b] border border-[#28c76f]/30 text-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-[#28c76f]"
                style={{ borderRadius: 0 }}
              />
            </div>
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#28c76f" strokeWidth="2"><path d="M6 20v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <select
                value={branch}
                onChange={e => setBranch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#232b2b] border border-[#28c76f]/30 text-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-[#28c76f]"
                style={{ borderRadius: 0 }}
              >
                <option value="">Filter by branch...</option>
                {allBranches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="mt-2 bg-[#28c76f] hover:bg-[#22b36a] text-white font-bold px-10 py-3 text-lg transition rounded-none shadow"
            style={{ borderRadius: 0 }}
            onClick={e => e.preventDefault()}
          >
            <svg className="inline-block mr-2 -mt-1" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-2-2m0 0A7.5 7.5 0 1 0 5 5a7.5 7.5 0 0 0 14 14z" /></svg>
            Search
          </button>
        </div>
        <hr className="border-[#28c76f]/30 mb-6" />
        {/* Table and results count */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#28c76f" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/></svg>
            <span className="text-2xl font-bold text-[#28c76f]">Search Results</span>
          </div>
          <span className="bg-[#28c76f] text-white font-bold px-5 py-2 rounded text-base" style={{ borderRadius: 4 }}>{filteredCandidates.length} Results</span>
        </div>
        <div className="overflow-x-auto border border-[#28c76f]/20 px-2"
          style={{
            background: 'linear-gradient(120deg, rgba(40,199,111,0.08) 0%, rgba(35,43,43,0.92) 100%)',
            boxShadow: '0 8px 32px 0 rgba(40,199,111,0.18), 0 1.5px 8px 0 rgba(255,255,255,0.10) inset',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 0,
          }}>
          <table className="min-w-full font-sans">
            <thead>
              <tr className="text-[#28c76f] text-lg font-bold border-b border-[#28c76f]/20">
                <th className="px-7 py-4 text-left font-bold">Name</th>
                <th className="px-7 py-4 text-left font-bold">Enrol. No</th>
                <th className="px-7 py-4 text-left font-bold">Branch</th>
                <th className="px-7 py-4 text-center font-bold">View</th>
                <th className="px-7 py-4 text-center font-bold">Count</th>
              </tr>
            </thead>
            <motion.tbody
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
            >
              {filteredCandidates.map((cand, idx) => (
                <motion.tr
                  key={cand.id}
                  variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4 } } }}
                  className="border-b border-[#28c76f]/10 hover:bg-[#28c76f]/10 transition group relative"
                >
                  <td className="px-7 py-3 text-white font-semibold whitespace-nowrap align-middle">{cand.name}</td>
                  <td className="px-7 py-3 text-gray-200 whitespace-nowrap align-middle">{cand.enrollment}</td>
                  <td className="px-7 py-3 text-gray-200 whitespace-nowrap align-middle">{cand.branch}</td>
                  <td className="px-7 py-3 text-center align-middle relative">
                    <button
                      className={`inline-flex items-center justify-center w-10 h-10 border-2 border-[#28c76f] ${expanded === idx ? 'bg-[#28c76f]/20' : 'bg-transparent'} text-[#28c76f] rounded transition`}
                      onClick={e => {
                        e.stopPropagation();
                        setExpanded(expanded === idx ? null : idx);
                      }}
                      aria-label="View Shortlisted Companies"
                      ref={el => (popoverRefs.current[idx] = el)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    {/* Popover dropdown */}
                    {expanded === idx && (
                      <div
                        className="absolute left-1/2 z-50 mt-2 -translate-x-1/2 min-w-[220px] border-2 border-[#28c76f] shadow-2xl p-4 text-sm"
                        style={{
                          borderRadius: 0,
                          background: 'linear-gradient(135deg, #23272a 0%, #444950 60%, #23272a 100%)',
                          boxShadow: '0 8px 32px 0 rgba(200,200,200,0.18), 0 1.5px 8px 0 rgba(255,255,255,0.10) inset',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          border: '2px solid #bfc6ce',
                        }}
                      >
                        <button
                          className="absolute top-2 right-3 text-gray-400 hover:text-[#28c76f] text-lg font-bold focus:outline-none"
                          style={{lineHeight: 1}}
                          onClick={() => setExpanded(null)}
                          aria-label="Close"
                        >
                          &times;
                        </button>
                        <div className="text-[#28c76f] font-bold mb-2">Shortlisted Companies</div>
                        <ul className="list-disc ml-6 text-white">
                          {getShortlistedCompanies(cand).length > 0 ? (
                            getShortlistedCompanies(cand).map((name, i) => (
                              <li key={i} className="mb-1">{name}</li>
                            ))
                          ) : (
                            <li className="text-gray-400">No shortlists</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </td>
                  <td className="px-7 py-3 text-center text-[#28c76f] font-bold align-middle">{cand.shortlistedIn.length}</td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
} 