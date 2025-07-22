import React from "react";
import PageLayout from "./PageLayout";
import { mockCompanies, mockCandidates, mockBets } from './mockData';
import CompanyShortlistModal from './CompanyShortlistModal';
import { motion } from "framer-motion";

export default function ExpiredBets({ user, showUserGuideModal, setShowUserGuideModal, showAnnouncement, setShowAnnouncement, announcementIdx, announcements, isSliding }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [modalCandidates, setModalCandidates] = React.useState([]);

  // Helper: check if company is expired
  const isExpired = (company) => {
    if (company.status === 'expired') return true;
    if (!company.expiresOn) return false;
    const today = new Date();
    const expiryDate = new Date(company.expiresOn);
    return today > expiryDate;
  };

  // Filter companies by search (only show companies where results ARE declared)
  const filteredCompanies = React.useMemo(() => {
    let companies = mockCompanies.filter(c => {
      // Show companies where results ARE declared (any candidate has result other than 'awaited')
      return c.candidates && c.candidates.some(cand => cand.result !== 'awaited');
    });
    
    if (!search.trim()) return companies;
    const term = search.trim().toLowerCase();
    return companies.filter(c =>
      c.name.toLowerCase().includes(term) ||
      (c.role && c.role.toLowerCase().includes(term))
    );
  }, [search]);

  // Get candidate verdicts for a company
  function getCompanyCandidates(company) {
    const cands = (company.shortlist || []).map(candidateId => {
      const cand = mockCandidates.find(c => c.id === candidateId);
      // Find bets for this candidate in this company
      const bets = mockBets.filter(b => b.companyId === company.id && b.candidateId === candidateId);
      // Aggregate tokens betted and against
      let forTokens = 0, againstTokens = 0;
      bets.forEach(bet => {
        if (bet.type === 'for') forTokens += Number(bet.amount);
        else againstTokens += Number(bet.amount);
      });
      
      // Get result from company candidates data or default to 'awaited'
      const candidateResult = company.candidates?.find(c => c.enrollment === cand?.enrollment)?.result || 'awaited';
      
      return {
        id: cand?.id || candidateId,
        name: cand?.name || candidateId,
        enrollment: cand?.enrollment || candidateId,
        forTokens,
        againstTokens,
        verdict: candidateResult === 'selected' ? 'selected' : candidateResult === 'not_selected' ? 'not selected' : 'awaited'
      };
    });
    return cands;
  }

  // Helper: get top 3 most betted candidates for a company
  function getTopCandidates(company) {
    return getCompanyCandidates(company)
      .sort((a, b) => (b.forTokens + b.againstTokens) - (a.forTokens + a.againstTokens))
      .slice(0, 3);
  }

  // Helper: get total tokens betted on a company (for + against)
  function getTotalTokens(company) {
    return mockBets.filter(bet => bet.companyId === company.id)
      .reduce((sum, bet) => sum + (Number(bet.amount) || 0), 0);
  }

  function openModal(company) {
    setSelectedCompany(company);
    setModalCandidates(getCompanyCandidates(company));
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedCompany(null);
    setModalCandidates([]);
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
      <div className="w-full flex flex-col items-center mb-6 mt-0">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-5xl font-bold text-[#28c76f] mb-1 mt-0 text-center"
        >
          Expired Bets
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl text-gray-300 mb-6 text-center"
        >
          View results of completed placement bets
        </motion.div>
        <motion.input
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by companies or profiles..."
          className="w-full max-w-xl px-5 py-3 bg-[#232b2b] border border-[#28c76f]/30 text-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-[#28c76f] mb-2 shadow"
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
        ) : filteredCompanies.map(company => (
          <motion.div
            key={company.id}
            variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }}
            className="relative rounded-2xl border transition-all duration-200 p-0 flex flex-col min-h-[220px] w-full group hover:scale-[1.045] hover:shadow-2xl min-w-[200px]"
            style={{
              background: 'linear-gradient(135deg, rgba(40,199,111,0.10) 0%, rgba(35,43,43,0.85) 100%)',
              boxShadow: '0 8px 32px 0 rgba(40,199,111,0.15), 0 1.5px 8px 0 rgba(255,255,255,0.08) inset',
              border: '1.5px solid',
              borderImage: 'linear-gradient(120deg, #b8ffe7 0%, #28c76f 40%, #232b2b 100%) 1',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              overflow: 'hidden',
            }}
            onClick={() => openModal(company)}
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-1">
              <span className="text-2xl font-bold text-[#28c76f]">{company.name}</span>
              <span className="flex items-center gap-1 bg-[#232b2b] text-[#28c76f] font-semibold text-base px-3 py-1 rounded-full border border-[#28c76f]/40">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#28c76f" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2h5" /><circle cx="12" cy="7" r="4" /></svg>
                {company.shortlist.length}
              </span>
            </div>
            <div className="px-4 flex items-center justify-between text-gray-400 text-sm mb-1 gap-2">
              <span className="flex items-center gap-1 text-[#28c76f] font-semibold">
                <svg width='18' height='18' fill='none' viewBox='0 0 24 24' stroke='#28c76f' strokeWidth='2'><circle cx='12' cy='12' r='10' /><path d='M12 6v6l4 2' /></svg>
                {company.role}
              </span>
              <span className="flex items-center gap-1">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#28c76f" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2" /></svg>
                {getTotalTokens(company).toLocaleString()} tokens
              </span>
            </div>
            <div className="px-4 pt-1 pb-3">
              <div className="font-semibold text-gray-200 mb-2">Results:</div>
              <div className="flex flex-col gap-2">
                {getTopCandidates(company).length > 0 ? getTopCandidates(company).map(cand => (
                  <div key={cand.id} className="flex items-center justify-between bg-[#2d3235] rounded-lg px-3 py-1.5">
                    <span className="font-bold text-white">{cand.name}</span>
                    <span className={`px-3 py-1 rounded text-xs font-bold ${cand.verdict === 'selected' ? 'bg-[#28c76f] text-white' : 'bg-red-500 text-white'}`}>{cand.verdict === 'selected' ? 'Selected' : 'Not Selected'}</span>
                  </div>
                )) : (
                  <div className="text-gray-400">No results</div>
                )}
              </div>
            </div>
            <div className="px-4 pb-3 flex justify-end">
              <span className="text-[#28c76f] font-semibold cursor-pointer">View Details &gt;</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
      {/* Modal for company details */}
      {modalOpen && selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#232b2b] rounded-lg shadow-2xl p-8 min-w-[340px] max-w-full relative border-2 border-[#28c76f]" style={{ borderRadius: 12 }}>
            <button className="absolute top-3 right-4 text-gray-400 hover:text-[#28c76f] text-2xl font-bold" onClick={closeModal}>&times;</button>
            <div className="text-2xl font-bold text-[#28c76f] mb-2">{selectedCompany.name} - {selectedCompany.role}</div>
            <div className="mb-4 text-gray-300">Shortlisted Candidates:</div>
            <table className="min-w-full text-sm mb-2">
              <thead>
                <tr className="text-[#28c76f]">
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Enrollment</th>
                  <th className="px-3 py-2 text-right">For Tokens</th>
                  <th className="px-3 py-2 text-right">Against Tokens</th>
                  <th className="px-3 py-2 text-center">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {modalCandidates.map(cand => (
                  <tr key={cand.id}>
                    <td className="px-3 py-2 text-white font-semibold">{cand.name}</td>
                    <td className="px-3 py-2 text-gray-200">{cand.enrollment}</td>
                    <td className="px-3 py-2 text-right text-[#28c76f]">{cand.forTokens}</td>
                    <td className="px-3 py-2 text-right text-red-400">{cand.againstTokens}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-3 py-1 rounded text-xs font-bold ${cand.verdict === 'selected' ? 'bg-[#28c76f] text-white' : 'bg-red-500 text-white'}`}>{cand.verdict === 'selected' ? 'Selected' : 'Not Selected'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageLayout>
  );
} 