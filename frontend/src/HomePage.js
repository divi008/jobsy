import React, { useState, useRef, useEffect, useMemo } from "react";
import PageLayout from "./PageLayout";
import axios from 'axios';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import './index.css';
import { useNavigate } from "react-router-dom";
import DropdownMenu from './DropdownMenu';
import HeaderNav from "./HeaderNav";

import CompanyShortlistModal from './CompanyShortlistModal';
import { motion } from "framer-motion";

const companies = [
  { name: "American Express", role: "Data Science", logo: "/amex-logo.png", expires: "31/11/2024", tokens: 94036, domain: "data" },
  { name: "Flipkart", role: "SDE", logo: "/flipkart-logo.png", expires: "31/11/2024", tokens: 120000, domain: "sde" },
  { name: "Meesho", role: "Product Manager", logo: "/meesho-logo.png", expires: "31/11/2024", tokens: 110000, domain: "product" },
  { name: "Groww", role: "Associate Business Analyst", logo: "/groww-logo.png", expires: "31/11/2024", tokens: 81393, domain: "quant" },
  { name: "HiLabs", role: "Data Science", logo: "/hilabs-logo.png", expires: "31/11/2024", tokens: 118655, domain: "data" },
  { name: "Deloitte", role: "Analyst", logo: "/deloitte-logo.png", expires: "31/11/2024", tokens: 99892, domain: "core" },
  { name: "Google", role: "Software Engineer", logo: "/google-logo.png", expires: "31/11/2024", tokens: 150000, domain: "sde" },
  { name: "Microsoft", role: "Cloud Engineer", logo: "/microsoft-logo.png", expires: "31/11/2024", tokens: 140000, domain: "core" },
  { name: "Amazon", role: "Operations Manager", logo: "/amazon-logo.png", expires: "31/11/2024", tokens: 135000, domain: "misc" },
  { name: "Uber", role: "Backend Developer", logo: "/uber-logo.png", expires: "31/11/2024", tokens: 125000, domain: "misc" },
];

const filterOptions = [
  {
    key: 'all', label: 'All',
    icon: (selected) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={selected ? '#fff' : '#22b36a'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play h-5 w-5"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
    )
  },
  {
    key: 'quant', label: 'Quant',
    icon: (selected) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={selected ? '#fff' : '#22b36a'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calculator h-5 w-5"><rect x="4" y="2" width="16" height="20" rx="2"/><rect x="8" y="6" width="8" height="2"/><line x1="9" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="9" y2="16"/><line x1="15" y1="16" x2="15" y2="16"/></svg>
    )
  },
  {
    key: 'sde', label: 'SDE',
    icon: (selected) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={selected ? '#fff' : '#22b36a'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code h-5 w-5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
    )
  },
  {
    key: 'product', label: 'Product',
    icon: (selected) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={selected ? '#fff' : '#22b36a'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-box h-5 w-5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    )
  },
  {
    key: 'data', label: 'Data',
    icon: (selected) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={selected ? '#fff' : '#22b36a'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-database h-5 w-5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>
    )
  },
  {
    key: 'core', label: 'Core',
    icon: (selected) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={selected ? '#fff' : '#22b36a'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cpu h-5 w-5"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="9 2v2"/><path d="9 20v2"/></svg>
    )
  },
  {
    key: 'misc', label: 'Misc',
    icon: (selected) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={selected ? '#fff' : '#22b36a'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal h-5 w-5"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
    )
  },
];

export default function HomePage({ user, setUser, showUserGuideModal, setShowUserGuideModal, userGuideContent, showAnnouncement, setShowAnnouncement, announcementIdx, announcements, isSliding }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [search, setSearch] = useState("");
  // Announcement bar control comes from App via props
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [activeEvents, setActiveEvents] = useState([]);
const [allCandidates, setAllCandidates] = useState([]);
const [allBets, setAllBets] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
useEffect(() => {
  const fetchHomePageData = async () => {
    try {
      // Fetch all required data at the same time
      const [eventsRes, candidatesRes, betsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/events/active'),
        axios.get('http://localhost:5000/api/candidates'),
        axios.get('http://localhost:5000/api/bets'),
      ]);
      // Only keep active companies
      setActiveEvents(eventsRes.data.filter(e => e.status === 'active'));
      setAllCandidates(candidatesRes.data);
      setAllBets(betsRes.data);
    } catch (err) {
      console.error("Failed to fetch homepage data", err);
      setError("Could not load homepage data.");
    } finally {
      setLoading(false);
    }
  };
  fetchHomePageData();
}, []);

  // Add this handler inside HomePage
  function handleModalSubmit(betsToSubmit, totalBet, apiResponse) {
    // If API response contains updated user and newBets, update state
    if (apiResponse && apiResponse.user && apiResponse.newBets) {
      if (setUser) setUser(apiResponse.user); // Update global user state
      setAllBets(prev => [...prev, ...apiResponse.newBets]);
    } else {
      // Fallback: just add enriched bets
      const enrichedBets = betsToSubmit.map(bet => {
        const candidate = allCandidates.find(c => c._id === bet.candidateId);
        const company = activeEvents.find(c => c._id === bet.companyId);
        return {
          ...bet,
          name: candidate ? candidate.name : 'Unknown',
          company: company ? company.companyName : 'Unknown',
          type: bet.type === 'for' ? '👍' : '👎',
        };
      });
      setAllBets(prev => [...prev, ...enrichedBets]);
    }
    setModalOpen(false);
  }

  // Helper: check if company has results declared
  const hasResultsDeclared = (company) => {
    return company.status !== 'active';
  };

  // Filter companies for Live Events box (only show companies where results are NOT declared)
  const filteredCompanies = useMemo(() => {
    // Use the activeEvents directly as the base list of all companies
    let companies = activeEvents.filter(c => c.status === 'active');

    // Domain filter from UI buttons
    if (selectedDomain && selectedDomain !== 'all') {
      companies = companies.filter(c => (c.liveEventSection || 'misc') === selectedDomain);
    }

    if (!search.trim()) return companies;

    const term = search.trim().toLowerCase();
    return companies.filter(c =>
        c.companyName.toLowerCase().includes(term) ||
        (c.jobProfile && c.jobProfile.toLowerCase().includes(term))
    );
}, [search, activeEvents, selectedDomain]);
  // Filter companies for Hot Bets (top 3 by tokens, filtered by selected domain, only active companies)
  const hotBetsCompanies = filteredCompanies
  .sort((a, b) => {
    const totalTokensA = allBets.filter(bet => bet.companyEvent?._id === a._id)
      .reduce((sum, bet) => sum + (Number(bet.amount) || 0), 0);
    const totalTokensB = allBets.filter(bet => bet.companyEvent?._id === b._id)
      .reduce((sum, bet) => sum + (Number(bet.amount) || 0), 0);
    return totalTokensB - totalTokensA;
  })
  .slice(0, 3);

  // Persistent, bet-driven stakes for each company
  const [companyStakes, setCompanyStakes] = useState({});

  useEffect(() => {
    if (activeEvents.length === 0 || allBets.length === 0) return;
  
    const newStakes = {};
    activeEvents.forEach(company => {
      // Use the real database _id
      const companyId = company._id;
      const shortlistedCandidateObjects = company.candidates || [];
  
      shortlistedCandidateObjects.forEach(candidate => {
        const candidateId = candidate._id;

        const t_i = allBets.filter(bet => bet.companyEvent?._id === companyId && bet.candidate?._id === candidateId)
          .reduce((sum, bet) => sum + (Number(bet.amount) || 0), 0);

        const baseFor = 2.0;
        const minFor = 1.05;
        const maxFor = 10.0;
        const k = 0.00005; // smoother
        let targetFor = baseFor;
        let targetAgainst = baseFor;

        if (t_i > 0) {
          targetFor = Math.max(minFor, baseFor - k * t_i);
          targetAgainst = Math.min(maxFor, baseFor + k * t_i);
        }

        const prev = companyStakes[companyId]?.[candidateId] || { for: baseFor.toFixed(2), against: baseFor.toFixed(2) };
        const easedFor = Number(prev.for) + (targetFor - Number(prev.for)) * 0.2;
        const easedAgainst = Number(prev.against) + (targetAgainst - Number(prev.against)) * 0.2;

        if (!newStakes[companyId]) newStakes[companyId] = {};
        newStakes[companyId][candidateId] = {
          for: easedFor.toFixed(2),
          against: easedAgainst.toFixed(2)
        };
      });
    });
    setCompanyStakes(newStakes);
  }, [allBets, activeEvents]);

  // Calculate top 8 companies by total tokens bet
  const topCompanyIds = useMemo(() => {
    const totals = {};
    allBets.forEach(bet => {
      if (!totals[bet.companyId]) totals[bet.companyId] = 0;
      totals[bet.companyId] += Number(bet.amount) || 0;
    });
    // Sort company ids by total tokens bet, descending
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id]) => id);
  }, [allBets]);


  // Prefer admin-selected featured companies for the carousel
  const featuredCarouselCompanies = useMemo(() => {
    const activeOnly = activeEvents.filter(e => e.status === 'active');
    const featured = activeOnly.filter(e => e.isFeatured);
    if (featured.length > 0) return featured;
    // Fallback when admin hasn't set featured: pick top by bet counts
    const betCounts = {};
    allBets.forEach(bet => {
      const companyId = bet.companyEvent?._id;
      if (!companyId) return;
      betCounts[companyId] = (betCounts[companyId] || 0) + 1;
    });
    const topIds = Object.entries(betCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id]) => id);
    const byBets = activeOnly.filter(e => topIds.includes(e._id));
    if (byBets.length > 0) return byBets;
    // Final fallback: show first N active events so the carousel never disappears
    return activeOnly.slice(0, 8);
  }, [activeEvents, allBets]);

  const carouselCompanies = featuredCarouselCompanies;

  // Helper to close menu on outside click
  const menuRef = useRef();
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
    // Clear user state if needed
    navigate('/');
  }
  if (loading) {
    return <PageLayout user={user}><div>Loading...</div></PageLayout>;
}
if (error) {
    return <PageLayout user={user}><div>{error}</div></PageLayout>;
}
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
      {/* Main Content Sections */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.18 } }, hidden: {} }}
      >
        {/* 1. Swiper Carousel (all companies) */}
        <motion.section
          variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
          className="flex flex-col items-center py-4 md:py-8 px-2 sm:px-4 w-full"
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={24}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, el: '.custom-swiper-pagination' }}
            navigation={false}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="w-full max-w-[98vw] md:max-w-[90vw]"
          >
            {carouselCompanies.filter(c => c.status === 'active').map((company, idx) => {
              // Calculate total tokens for this company
              const totalTokens = allBets.filter(bet => bet.companyEvent?._id === company._id)
                .reduce((sum, bet) => sum + (Number(bet.amount) || 0), 0);
              return (
                <SwiperSlide key={company._id}>
                  <motion.div
                    key={company._id}
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                    className="rounded-2xl p-3 bg-[linear-gradient(135deg,_#23282b_80%,_#444950_100%),_radial-gradient(circle_at_80%_20%,_rgba(255,255,255,0.13)_0%,_transparent_70%)] shadow-[0_8px_32px_0_rgba(40,199,111,0.18),_0_1.5px_8px_0_rgba(255,255,255,0.10)_inset] hover:shadow-[0_0_32px_8px_rgba(184,255,231,0.18)] hover:scale-[1.01] backdrop-blur-[6px] bg-opacity-95 transition-all duration-300 flex flex-col justify-between min-h-[80px] max-w-full sm:max-w-[750px] w-full mx-auto cursor-pointer relative overflow-hidden"
                    style={{ boxShadow: '0 4px 32px 0 rgba(184,255,231,0.18), 0 1.5px 8px 0 rgba(255,255,255,0.10) inset', }}
                    onClick={() => { setSelectedCompany(company); setModalOpen(true); }}
                  >
                    {/* Glossy highlight overlay */}
                    <div className="absolute left-0 top-0 w-full h-full pointer-events-none z-10" style={{ background: 'linear-gradient(120deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.04)_60%,rgba(255,255,255,0.10)_100%)', mixBlendMode: 'screen', borderRadius: 'inherit' }} />
                    <span className="inline-block bg-[#28c76f] text-white text-xs font-bold px-4 py-1 rounded-full mb-4 w-fit">ACTIVE</span>
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1 break-words">{company.companyName}</h3>
                        <div className="text-emerald-400 text-base font-medium">{company.jobProfile}</div>
                      </div>
                      <div className="flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32">
                        <img
                          src={company.logo || '/logo192.png'}
                          alt={company.name + " logo"}
                          className="w-20 h-20 sm:w-28 sm:h-28 object-contain"
                          onError={e => { e.target.onerror = null; e.target.src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'; }}
                        />
                      </div>
                    </div>
                                          <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-2 text-red-400 text-base font-medium"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> expires on: {new Date(company.expiresAt).toLocaleDateString()}</div>
                        <div className="flex items-center gap-2 text-gray-400 text-base">
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2" /></svg>
                          Total Tokens: {totalTokens.toLocaleString()}
                        </div>
                      </div>
                    <div className="flex justify-end mt-auto">
                      <button className="w-full bg-[#28c76f] hover:bg-[#22b455] text-white font-bold py-3 rounded-lg text-lg transition hover:shadow-md">Place Bet</button>
                    </div>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="custom-swiper-pagination mt-4 flex justify-center gap-2"></div>
        </motion.section>
        {/* 2. Live Events Box with Filters and Hot Bets */}
        <motion.section
          variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
          className="px-2 sm:px-4 md:px-10 py-6 md:py-8 w-full"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
            className="bg-[linear-gradient(to_top_right,_#181a1b_80%,_#28c76f_20%,_#181a1b_100%)] backdrop-blur-md border border-white/10 shadow-md rounded-xl p-4 sm:p-6 md:p-10 w-full"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
              <span className="inline-flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#28c76f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap w-10 h-10"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </span>
              Live Events
            </h2>
            {/* Filter Buttons (lighter shade) */}
            <div className="flex gap-2 md:gap-4 mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-[#a3f7bf]/40 scrollbar-track-transparent w-full">
              {filterOptions.map(opt => (
                <div className="flex flex-col items-center gap-1" key={opt.key}>
                  <button
                    className={`rounded-full flex items-center justify-center focus:outline-none w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200
                      ${selectedDomain === opt.key
                        ? 'bg-[#28c76f] shadow-[0_0_32px_0_rgba(40,199,111,0.25)]'
                        : 'bg-[#0a0f0c]'}
                    `}
                    onClick={() => setSelectedDomain(opt.key)}
                    aria-label={opt.label}
                  >
                    {opt.icon(selectedDomain === opt.key)}
                  </button>
                  <span className={`text-xs sm:text-sm md:text-base font-medium transition-all duration-200 mt-2 text-white`}>{opt.label}</span>
                </div>
              ))}
            </div>
             {/* Hot Bets Cards (filtered, max 3, sorted by tokens and domain) */}
            <div className="flex flex-col md:flex-row gap-6 w-full min-h-[220px]">
              {hotBetsCompanies.map((company, idx) => {
                const companyBets = allBets.filter(bet => bet.companyEvent?._id === company._id);
const candidateBetTotals = {};
companyBets.forEach(bet => {
    const candidateId = bet.candidate?._id;
    if (candidateId) {
        if (!candidateBetTotals[candidateId]) {
            candidateBetTotals[candidateId] = { id: candidateId, name: bet.candidate.name, totalTokens: 0 };
        }
        candidateBetTotals[candidateId].totalTokens += bet.amount || 0;
    }
});

// Get candidates with bets, sorted by most tokens
let topCandidates = Object.values(candidateBetTotals).sort((a, b) => b.totalTokens - a.totalTokens);

// If we have fewer than 2, fill the rest with other shortlisted candidates
if (topCandidates.length < 2) {
  const bettedCandidateIds = new Set(topCandidates.map(c => c.id));
  const otherShortlisted = (company.candidates || [])
    .filter(c => !bettedCandidateIds.has(c._id)) // Find candidates who are not already in the list
    .map(c => ({ id: c._id, name: c.name, totalTokens: 0 })); // Format them

  topCandidates.push(...otherShortlisted);
}

const topTwo = topCandidates.slice(0, 2);
                const stakes = companyStakes[company._id] || {};
                // Calculate total tokens for this company
                const totalTokens = allBets.filter(bet => bet.companyEvent?._id === company._id)
                  .reduce((sum, bet) => sum + (Number(bet.amount) || 0), 0);
                // Compose the company object for the modal
                const modalCompany = {
                  ...company,
                  role: company.jobProfile || 'N/A',
                  logo: company.logo || '/logo192.png',
                  expires: company.expiresOn || 'N/A',
                  tokens: totalTokens,
                  domain: company.liveEventSection || 'misc',
                };

                // Get shortlisted candidate IDs for this company
                // Use persistent, bet-driven stakes


                return (
                  <motion.div
                    key={company._id}
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                    className="bg-[#181f1f] rounded-2xl p-4 sm:p-6 w-full md:w-[420px] h-[200px] flex flex-col justify-between shadow-lg relative border-2 border-[#28c76f]/80 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] hover:border-[#28c76f] cursor-pointer"
                    onClick={() => { setSelectedCompany(modalCompany); setModalOpen(true); }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-lg font-bold text-[#28c76f]">{company.companyName}</span>
                      <span className="bg-[#28c76f] text-white text-xs px-3 py-1 rounded-full font-semibold absolute top-6 right-6">{modalCompany.role}</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-1 mb-2">
                      {topTwo.length > 0 ? topTwo.map((cand, i) => (
                        <div className="flex items-center gap-3" key={cand.id}>
                          <span className="text-gray-200 font-medium truncate max-w-[80px] sm:max-w-[120px]">{cand.name}</span>
                          <span className="font-bold text-green-500 ml-auto">{stakes[cand.id]?.for || '2.00'}x</span>
                          <span className="font-bold text-red-500">{stakes[cand.id]?.against || '2.00'}x</span>
                        </div>
                      )) : (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-200 font-medium">No bets yet</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-end text-xs text-gray-400 mt-2">
                      <div className="flex items-center gap-1"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {modalCompany.expires}</div>
                      <div className="flex items-center gap-1"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2" /></svg> {typeof modalCompany.tokens === 'number' ? modalCompany.tokens.toLocaleString() : 'N/A'} tokens</div>
                    </div>
                  </motion.div>
                );
              })}
              {/* placeholders to keep box height/width stable when <3 cards */}
              {hotBetsCompanies.length < 3 && Array.from({ length: 3 - hotBetsCompanies.length }).map((_, i) => (
                <div key={`ph-${i}`} className="hidden md:block w-full md:w-[420px] h-[200px]" />
              ))}
            </div>
          </motion.div>
        </motion.section>
      </motion.div>
      {showUserGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowUserGuideModal(false)}>&times;</button>
            {userGuideContent}
            <button className="mt-8 w-full bg-[#28c76f] hover:bg-[#22b36a] text-white font-bold py-3 rounded-full text-lg transition hover:shadow-md" onClick={() => setShowUserGuideModal(false)}>Get Started</button>
          </div>
        </div>
      )}
      {/* Company Shortlist Modal */}
      <CompanyShortlistModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        company={selectedCompany}
        activeEvents={activeEvents}
        candidates={allCandidates}
        allBets={allBets}
        user={user}
        onSubmit={handleModalSubmit}
        stakes={selectedCompany ? companyStakes[selectedCompany._id] : {}}
      />
    </PageLayout>
  );
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
} 