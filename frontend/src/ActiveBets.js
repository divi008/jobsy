import React, { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import PageLayout from "./PageLayout";
import CompanyShortlistModal from './CompanyShortlistModal';
import { motion } from "framer-motion";

// Mapping for domain and expiry (from HomePage.js)
const companiesMeta = [
  { name: "American Express", role: "Data Science", expires: "31/11/2024", tokens: 94036, domain: "data" },
  { name: "Flipkart", role: "SDE", expires: "31/11/2024", tokens: 120000, domain: "sde" },
  { name: "Meesho", role: "Product Manager", expires: "31/11/2024", tokens: 110000, domain: "product" },
  { name: "Groww", role: "Associate Business Analyst", expires: "31/11/2024", tokens: 81393, domain: "quant" },
  { name: "HiLabs", role: "Data Science", expires: "31/11/2024", tokens: 118655, domain: "data" },
  { name: "Deloitte", role: "Analyst", expires: "31/11/2024", tokens: 99892, domain: "core" },
  { name: "Google", role: "Software Engineer", expires: "31/11/2024", tokens: 150000, domain: "sde" },
  { name: "Microsoft", role: "Cloud Engineer", expires: "31/11/2024", tokens: 140000, domain: "core" },
  { name: "Amazon", role: "Operations Manager", expires: "31/11/2024", tokens: 135000, domain: "misc" },
  { name: "Uber", role: "Backend Developer", expires: "31/11/2024", tokens: 125000, domain: "misc" },
];

const domainLabels = {
  quant: "Quant",
  sde: "SDE",
  product: "Product",
  data: "Data",
  core: "Core",
  misc: "Misc"
};

export default function ActiveBets({ user, showUserGuideModal, setShowUserGuideModal, setUser, showAnnouncement, setShowAnnouncement, announcementIdx, announcements, isSliding }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyStakes, setCompanyStakes] = useState({});
  const [search, setSearch] = useState("");

  // State for live data from the API
  const [activeCompanies, setActiveCompanies] = useState([]);
  const [activeBetsData, setActiveBetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to fetch live data from the API
  useEffect(() => {
      const fetchData = async () => {
          setLoading(true);
          try {
              const [companiesRes, betsRes] = await Promise.all([
                  axios.get('http://localhost:5000/api/events/active'),
                  axios.get('http://localhost:5000/api/bets/active')
              ]);
              setActiveCompanies(companiesRes.data);
              setActiveBetsData(betsRes.data);
          } catch (err) {
              console.error("Failed to fetch active companies or bets", err);
              setError("Could not load active bets.");
          } finally {
              setLoading(false);
          }
      };
      fetchData();
  }, []);

React.useEffect(() => {
  if (!activeCompanies || activeCompanies.length === 0) {
    setCompanyStakes({});
    return;
  }
  const newStakes = {};
  const baseFor = 2.0;
  const minFor = 1.05;
  const maxFor = 10.0;
  const k = 0.00005; // smoother
  activeCompanies.forEach(company => {
    const shortlisted = company.candidates || [];
    shortlisted.forEach(candidate => {
      const candidateId = candidate._id;
      const companyId = company._id;
      const t_i = activeBetsData
        .filter(bet => bet.companyEvent?._id === companyId && bet.candidate?._id === candidateId)
        .reduce((sum, bet) => sum + (Number(bet.amount) || 0), 0);
      let targetFor = baseFor;
      let targetAgainst = baseFor;
      if (t_i > 0) {
        targetFor = Math.max(minFor, baseFor - k * t_i);
        targetAgainst = Math.min(maxFor, baseFor + k * t_i);
      }
      const prev = companyStakes[companyId]?.[candidateId] || { for: baseFor.toFixed(2), against: baseFor.toFixed(2) };
      // ease toward target
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
}, [activeBetsData, activeCompanies]);

function handleModalSubmit(betsToSubmit, totalBet, apiResponse) {
  if (apiResponse && apiResponse.user && apiResponse.newBets) {
    setUser && setUser(apiResponse.user);
    setActiveBetsData(prev => [...prev, ...apiResponse.newBets]);
  }
  setModalOpen(false);
}

  // Helper: get top 3 most betted candidates for a company
  function getTopCandidates(company) {
    // Calculate total tokens bet for each candidate
    const candidateTotals = {};
    (company.candidates || []).forEach(candidate => {
      candidateTotals[candidate._id] = 0;
    });
    activeBetsData.forEach(bet => {
      if (bet.companyEvent?._id === company._id && bet.candidate?._id) {
        if (candidateTotals[bet.candidate._id] !== undefined) {
          candidateTotals[bet.candidate._id] += Number(bet.amount) || 0;
        }
      }
    });
    // Sort candidates by tokens bet
    const sorted = (company.candidates || []).map(c => ({
      ...c,
      totalTokens: candidateTotals[c._id] || 0
    })).sort((a, b) => b.totalTokens - a.totalTokens);
    return sorted.slice(0, 3);
  }

  // Helper: get total tokens bet on a company
  function getTotalTokens(company) {
    return activeBetsData.filter(bet => bet.companyEvent?._id === company._id)
      .reduce((sum, bet) => sum + (Number(bet.amount) || 0), 0);
  }

  // Helper: get meta info (domain, expiry) for a company
  function getCompanyMeta(company) {
    const name = company.name || company.companyName;
    if (!name) return {};
    return companiesMeta.find(meta => meta.name && meta.name.toLowerCase() === name.toLowerCase()) || {};
  }

  // Helper: check if company is expired
  const isExpired = (company) => {
    if (company.status === 'expired') return true;
    if (!company.expiresOn) return false;
    const today = new Date();
    const expiryDate = new Date(company.expiresOn);
    return today > expiryDate;
  };

  // Filter companies by search (show all companies that are NOT expired)
  const filteredCompanies = useMemo(() => {
    let companies = activeCompanies.filter(c => c.status === 'active');
    if (!search.trim()) return companies;
    const term = search.trim().toLowerCase();
    return companies.filter(c =>
      c.companyName.toLowerCase().includes(term) ||
      (c.jobProfile && c.jobProfile.toLowerCase().includes(term))
    );
  }, [search, activeCompanies]);

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
      {/* Heading and Search Bar */}
      <div className="w-full flex flex-col items-center mb-6 mt-0">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl sm:text-4xl font-bold text-[#28c76f] mb-1 mt-0 text-center"
        >
          Active Bets
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-base sm:text-lg text-gray-300 mb-6 text-center"
        >
          Place your bets on upcoming placements
        </motion.div>
        <motion.input
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by companies or profiles..."
          className="w-full max-w-xs sm:max-w-xl px-4 sm:px-5 py-2 sm:py-3 bg-[#232b2b] border border-[#28c76f]/30 text-gray-200 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#28c76f] mb-2 shadow"
          style={{ boxShadow: '0 2px 12px 0 rgba(40,199,111,0.05)', borderRadius: 0 }}
        />
      </div>
      <motion.div
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-0"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.15 } }, hidden: {} }}
      >
        {filteredCompanies.length === 0 ? (
          <motion.div
            variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }}
            className="col-span-full flex flex-col items-center justify-center py-16"
          >
            <span className="text-2xl text-[#28c76f] font-bold mb-2">No results found</span>
            <span className="text-lg text-gray-400">Try searching for another company or profile! 🚀</span>
          </motion.div>
        ) : filteredCompanies.map(company => {
              if (company.status !== 'active') return null;
              const topCandidates = getTopCandidates(company);
          const totalTokens = getTotalTokens(company);
          const meta = getCompanyMeta(company);
          return (
            <motion.div
              key={company._id}
              variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }}
              className="relative rounded-2xl border transition-all duration-200 p-0 flex flex-col min-h-[220px] w-full group hover:scale-[1.045] hover:shadow-2xl min-w-[180px] sm:min-w-[200px]"
              style={{
                background: 'linear-gradient(135deg, rgba(40,199,111,0.10) 0%, rgba(35,43,43,0.85) 100%)',
                boxShadow: '0 8px 32px 0 rgba(40,199,111,0.15), 0 1.5px 8px 0 rgba(255,255,255,0.08) inset',
                border: '1.5px solid',
                borderImage: 'linear-gradient(120deg, #b8ffe7 0%, #28c76f 40%, #232b2b 100%) 1',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                overflow: 'hidden',
              }}
              onClick={() => { setSelectedCompany(company); setModalOpen(true); }}
            >
              {/* Header Row */}
              <div className="flex items-center justify-between px-4 pt-4 pb-1">
                <span className="text-2xl font-bold text-[#28c76f]">{company.companyName}</span>
                <span className="flex items-center gap-1 bg-[#232b2b] text-[#28c76f] font-semibold text-base px-3 py-1 rounded-full border border-[#28c76f]/40">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#28c76f" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2h5" /><circle cx="12" cy="7" r="4" /></svg>
                  {company.candidates?.length || 0}
                </span>
              </div>
              {/* Role, Expiry, Tokens in one row */}
              <div className="px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-gray-400 text-sm mb-1 gap-2">
                <span className="flex items-center gap-1 text-[#28c76f] font-semibold">
                  <svg width='18' height='18' fill='none' viewBox='0 0 24 24' stroke='#28c76f' strokeWidth='2'><circle cx='12' cy='12' r='10' /><path d='M12 6v6l4 2' /></svg>
                  {domainLabels[meta.domain] || company.jobProfile}
                </span>
                <span className="flex items-center gap-1">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#28c76f" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {meta.expires || '31/11/2024'}
                </span>
                <span className="flex items-center gap-1">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#28c76f" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2" /></svg>
                  {totalTokens.toLocaleString()} tokens
                </span>
              </div>
              {/* Top Bettors Section */}
              <div className="px-4 pt-1 pb-1">
                <div className="font-semibold text-gray-200 mb-2">Top Bettors:</div>
                <div className="flex flex-col gap-2">
                {topCandidates.length > 0 ? topCandidates.map(cand => (
                    <div key={cand._id} className="flex items-center justify-between bg-[#2d3235] rounded-lg px-3 py-1.5">
                      <span className="font-bold text-white truncate max-w-[80px] sm:max-w-[120px]">{cand.name}</span>
                      <div className="flex gap-2">
                        <span className="bg-[#232b2b] border border-blue-400 text-blue-400 font-semibold px-2 py-1 rounded text-xs">For: {companyStakes[company._id]?.[cand._id]?.for || '2.00'}x</span>
                        <span className="bg-[#232b2b] border border-red-400 text-red-400 font-semibold px-2 py-1 rounded text-xs">Against: {companyStakes[company._id]?.[cand._id]?.against || '2.00'}x</span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-gray-400">No bets yet</div>
                  )}
                </div>
              </div>
              {/* View Details Link */}
              <div className="flex justify-end px-4 pb-3 pt-1">
                <button
                  className="text-[#28c76f] font-semibold hover:underline text-base flex items-center gap-1"
                  onClick={() => { setSelectedCompany(company); setModalOpen(true); }}
                >
                  View Details <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#28c76f" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              {/* Overlay for clickable card (optional, disables card click except on View Details) */}
              {/* <button className="absolute inset-0 z-0" onClick={() => { setSelectedCompany(company); setModalOpen(true); }} /> */}
            </motion.div>
          );
        })}
      </motion.div>
      <CompanyShortlistModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        company={selectedCompany}
        candidates={selectedCompany?.candidates || []}
        bets={activeBetsData}
        onSubmit={handleModalSubmit}
        stakes={selectedCompany ? companyStakes[selectedCompany._id] : {}}
        user={user}
        activeEvents={activeCompanies}
      />
    </PageLayout>
  );
} 