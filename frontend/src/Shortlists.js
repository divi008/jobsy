import React, { useState, useMemo, useRef, useEffect } from "react";
import PageLayout from "./PageLayout";
import axios from 'axios';
import { mockCandidates, mockCompanies } from "./mockData";
import { motion } from "framer-motion";

export default function Shortlists({ user, showUserGuideModal, setShowUserGuideModal, showAnnouncement, setShowAnnouncement, announcementIdx, announcements, isSliding }) {
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");
  const popoverRefs = useRef([]);
  const [candidates, setCandidates] = useState([]);
  const [companiesById, setCompaniesById] = useState({});
  const [activeEventsCache, setActiveEventsCache] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [candRes, eventsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/candidates'),
        axios.get('http://localhost:5000/api/events')
      ]);
      setCandidates(candRes.data || []);
      const byId = {};
      const evts = eventsRes.data || [];
      evts.forEach(ev => { byId[ev._id] = ev.companyName; });
      setCompaniesById(byId);
      setActiveEventsCache(evts);
    } catch (e) {
      // fallback to mock
      setCandidates(mockCandidates.map(c => ({
        name: c.name,
        enrollmentNumber: c.enrollment,
        branch: c.branch,
        shortlistedIn: c.shortlistedIn || []
      })));
      const byId = {};
      mockCompanies.forEach(ev => { byId[ev.id] = ev.name; });
      setCompaniesById(byId);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    
    // Refresh data every 30 seconds to catch updates from admin panel
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Normalize course/branch in case legacy data stores combined value in branch like "B.Tech. (Mechanical Engineering)"
  function normalizeCourseBranch(candidate) {
    const rawBranch = candidate.branch || '';
    const match = /^([^()]+)\s*\(([^)]+)\)/.exec(rawBranch);
    if (match) {
      const parsedCourse = match[1].trim();
      const parsedBranch = match[2].trim();
      return {
        course: candidate.course || parsedCourse,
        branch: parsedBranch
      };
    }
    return {
      course: candidate.course || '',
      branch: candidate.branch || ''
    };
  }

  // Helper to get company names for a candidate; handles both ObjectId arrays and populated objects
  function getShortlistedCompanies(candidate) {
    if (!candidate) return [];
    
    const entries = Array.isArray(candidate.shortlistedIn) ? candidate.shortlistedIn : [];
    const names = [];
    
    // First, try to get names from populated shortlistedIn data
    for (const entry of entries) {
      if (entry && typeof entry === 'object') {
        // If it's a populated object with companyName
        if (entry.companyName) {
          names.push(entry.companyName);
        } else if (entry._id) {
          // If it's an ObjectId, try to get from companiesById
          const companyName = companiesById[entry._id];
          if (companyName) {
            names.push(companyName);
          }
        }
      } else if (typeof entry === 'string') {
        // If it's just a string (ObjectId as string)
        const companyName = companiesById[entry];
        if (companyName) {
          names.push(companyName);
        }
      }
    }
    
    // If no names found from shortlistedIn, try to compute from events data
    if (names.length === 0 && activeEventsCache.length > 0) {
      const candidateId = candidate._id || candidate.id;
      const candidateEnrollment = candidate.enrollmentNumber;
      
      for (const ev of activeEventsCache) {
        if (ev.candidates && Array.isArray(ev.candidates)) {
          const isCandidateInEvent = ev.candidates.some(c => {
            const cId = c._id || c.id || c;
            const cEnrollment = c.enrollmentNumber || c.enrollment;
            return cId === candidateId || cEnrollment === candidateEnrollment;
          });
          
          if (isCandidateInEvent) {
            const companyName = ev.companyName || companiesById[ev._id];
            if (companyName && !names.includes(companyName)) {
              names.push(companyName);
            }
          }
        }
      }
    }
    
    return names;
  }

  // Count shortlisted companies directly; fallback to events data when needed
  function getShortlistsCount(candidate) {
    if (!candidate) return 0;
    
    const entries = Array.isArray(candidate.shortlistedIn) ? candidate.shortlistedIn : [];
    if (entries.length > 0) return entries.length;
    
    // Fallback: compute from events data we fetched
    if (activeEventsCache.length > 0) {
      const candidateId = candidate._id || candidate.id;
      const candidateEnrollment = candidate.enrollmentNumber;
      
      let count = 0;
      for (const ev of activeEventsCache) {
        if (ev.candidates && Array.isArray(ev.candidates)) {
          const isCandidateInEvent = ev.candidates.some(c => {
            const cId = c._id || c.id || c;
            const cEnrollment = c.enrollmentNumber || c.enrollment;
            return cId === candidateId || cEnrollment === candidateEnrollment;
          });
          
          if (isCandidateInEvent) {
            count++;
          }
        }
      }
      
      return count;
    }
    
    return 0;
  }

  // Build filter options from normalized course+branch
  const allBranches = useMemo(() => {
    const uniqueCombinations = Array.from(new Set(
      (candidates || []).map(c => {
        const norm = normalizeCourseBranch(c);
        return `${norm.course || 'Unknown'} (${norm.branch || 'Unknown'})`;
      })
    )).sort();
    return uniqueCombinations;
  }, [candidates]);

  const filteredCandidates = useMemo(() => {
    return (candidates || []).filter(cand => {
      const norm = normalizeCourseBranch(cand);
      const matchesSearch =
        !search.trim() ||
        (cand.name || '').toLowerCase().includes(search.trim().toLowerCase()) ||
        (cand.enrollmentNumber || '').toLowerCase().includes(search.trim().toLowerCase());
      const combo = `${norm.course || 'Unknown'} (${norm.branch || 'Unknown'})`;
      const matchesBranch = !branch || combo === branch;
      return matchesSearch && matchesBranch;
    });
  }, [search, branch, candidates]);

  // Memoized shortlisted companies data
  const shortlistedCompaniesData = useMemo(() => {
    const data = {};
    filteredCandidates.forEach(candidate => {
      data[candidate._id || candidate.enrollmentNumber] = getShortlistedCompanies(candidate);
    });
    return data;
  }, [filteredCandidates, companiesById, activeEventsCache]);

  // Memoized shortlists count data
  const shortlistsCountData = useMemo(() => {
    const data = {};
    filteredCandidates.forEach(candidate => {
      data[candidate._id || candidate.enrollmentNumber] = getShortlistsCount(candidate);
    });
    return data;
  }, [filteredCandidates, activeEventsCache]);

  useEffect(() => {
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
        <div className="flex flex-col items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl sm:text-5xl font-bold text-[#28c76f] mb-2 text-center"
          >
            See Shortlists
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base sm:text-xl text-gray-300 mb-6 text-center"
          >
            Search for individuals and view their shortlists, filter by branch
          </motion.div>
        </div>
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
                className="w-full pl-10 pr-4 py-2 sm:py-3 bg-[#232b2b] border border-[#28c76f]/30 text-gray-200 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#28c76f]"
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
                className="w-full pl-10 pr-4 py-2 sm:py-3 bg-[#232b2b] border border-[#28c76f]/30 text-gray-200 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#28c76f]"
                style={{ borderRadius: 0 }}
              >
                <option value="">Filter by course & branch...</option>
                {allBranches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <hr className="border-[#28c76f]/30 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-2 sm:gap-0">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#28c76f" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/></svg>
            <span className="text-2xl font-bold text-[#28c76f]">Search Results</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={loadData}
              disabled={loading}
              className="bg-[#28c76f] hover:bg-[#22b36a] disabled:bg-gray-600 text-white font-bold px-3 py-1 rounded text-sm flex items-center gap-1"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5 9A7.003 7.003 0 0 1 12 5c1.657 0 3.156.576 4.354 1.536M19 15a7.003 7.003 0 0 1-7 4c-1.657 0-3.156-.576-4.354-1.536" />
                </svg>
              )}
              Refresh
            </button>
            <span className="bg-[#28c76f] text-white font-bold px-5 py-2 rounded text-base" style={{ borderRadius: 4 }}>{filteredCandidates.length} Results</span>
          </div>
        </div>
        <div className="overflow-x-auto border border-[#28c76f]/20 px-2"
          style={{
            background: 'linear-gradient(120deg, rgba(40,199,111,0.08) 0%, rgba(35,43,43,0.92) 100%)',
            boxShadow: '0 8px 32px 0 rgba(40,199,111,0.18), 0 1.5px 8px 0 rgba(255,255,255,0.10) inset',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 0,
          }}>
          <table className="min-w-full font-sans text-xs sm:text-base">
            <thead>
              <tr className="text-[#28c76f] text-lg font-bold border-b border-[#28c76f]/20">
                <th className="px-7 py-4 text-left font-bold">Name</th>
                <th className="px-7 py-4 text-left font-bold">Enrol. No</th>
                <th className="px-7 py-4 text-left font-bold">Course</th>
                <th className="px-7 py-4 text-left font-bold">Branch</th>
                <th className="px-7 py-4 text-center font-bold">View</th>
                <th className="px-7 py-4 text-center font-bold">Count</th>
              </tr>
            </thead>
            <motion.tbody initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }}>
              {filteredCandidates.map((cand, idx) => (
                <motion.tr key={cand._id || cand.enrollmentNumber} variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4 } } }} className="border-b border-[#28c76f]/10 hover:bg-[#28c76f]/10 transition group relative">
                  {(() => { const norm = normalizeCourseBranch(cand); return (
                    <>
                      <td className="px-7 py-3 text-white font-semibold whitespace-nowrap align-middle">{cand.name}</td>
                      <td className="px-7 py-3 text-gray-200 whitespace-nowrap align-middle">{cand.enrollmentNumber}</td>
                      <td className="px-7 py-3 text-gray-200 whitespace-nowrap align-middle">{norm.course || '—'}</td>
                      <td className="px-7 py-3 text-gray-200 whitespace-nowrap align-middle">{norm.branch || '—'}</td>
                    </>
                  ); })()}
                  <td className="px-7 py-3 text-center align-middle relative">
                    <button className={`inline-flex items-center justify-center w-10 h-10 border-2 border-[#28c76f] ${expanded === idx ? 'bg-[#28c76f]/20' : 'bg-transparent'} text-[#28c76f] rounded transition`} onClick={e => { e.stopPropagation(); setExpanded(expanded === idx ? null : idx); }} aria-label="View Shortlisted Companies" ref={el => (popoverRefs.current[idx] = el)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                    {expanded === idx && (
                      <div className="absolute left-1/2 z-50 mt-2 -translate-x-1/2 min-w-[220px] border-2 border-[#28c76f] shadow-2xl p-4 text-sm" style={{ borderRadius: 0, background: 'linear-gradient(135deg, #23272a 0%, #444950 60%, #23272a 100%)', boxShadow: '0 8px 32px 0 rgba(200,200,200,0.18), 0 1.5px 8px 0 rgba(255,255,255,0.10) inset', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '2px solid #bfc6ce' }}>
                        <button className="absolute top-2 right-3 text-gray-400 hover:text-[#28c76f] text-lg font-bold focus:outline-none" style={{lineHeight: 1}} onClick={() => setExpanded(null)} aria-label="Close">&times;</button>
                        <div className="text-[#28c76f] font-bold mb-2">Shortlisted Companies</div>
                        <ul className="list-disc ml-6 text-white">
                          {shortlistedCompaniesData[cand._id || cand.enrollmentNumber] && shortlistedCompaniesData[cand._id || cand.enrollmentNumber].length > 0 ? (
                            shortlistedCompaniesData[cand._id || cand.enrollmentNumber].map((name, i) => (
                              <li key={i} className="mb-1">{name}</li>
                            ))
                          ) : (
                            <li className="text-gray-400">No shortlists</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </td>
                  <td className="px-7 py-3 text-center text-[#28c76f] font-bold align-middle">{shortlistsCountData[cand._id || cand.enrollmentNumber]}</td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
} 