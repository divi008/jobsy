import React, { useEffect, useState } from "react";
import axios from 'axios';
import PageLayout from "./PageLayout";
import { motion } from "framer-motion";

export default function MyBets({ user, tokens, setTokens, bets, setBets, showUserGuideModal, setShowUserGuideModal, userGuideContent, showAnnouncement, setShowAnnouncement, announcementIdx, announcements, isSliding }) {
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myBets, setMyBets] = useState([]);

  useEffect(() => {
    const fetchMyBets = async () => {
      if (!user?._id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/api/bets/user/${user._id}`);
        const data = res.data || [];
        setMyBets(data);
        setBets && setBets(data);
      } catch (err) {
        console.error('Failed to load user bets', err);
        setError('Could not load your bets.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyBets();
  }, [user?._id]);

  const safeBets = Array.isArray(myBets) && myBets.length > 0 ? myBets : (Array.isArray(bets) ? bets : []);
  const filteredBets = filter === 'all' ? safeBets : filter === 'expired' ? safeBets.filter(b => ['expired','won','lost'].includes(b.status)) : safeBets.filter(b => b.status === filter);
  const totalAmountBet = safeBets.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const activeBets = safeBets.filter(b => b.status === 'active').length;
  const expiredBets = safeBets.filter(b => b.status !== 'active').length;
  const averageStake = safeBets.length ? (safeBets.reduce((sum, b) => sum + parseFloat(b.stake), 0) / safeBets.length).toFixed(2) : '0.00';

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
      {showUserGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowUserGuideModal(false)}>&times;</button>
            {userGuideContent}
            <button className="mt-8 w-full bg-[#28c76f] hover:bg-[#22b36a] text-white font-bold py-3 rounded-full text-lg transition hover:shadow-md" onClick={() => setShowUserGuideModal(false)}>Get Started</button>
          </div>
        </div>
      )}
      <div className="w-full">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl sm:text-5xl font-bold text-[#28c76f] mb-2 text-center"
        >
          My Bets
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-gray-400 text-base sm:text-lg mb-8 text-center"
        >
          Track Your Betting Journey
        </motion.div>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 w-full">
          <div className="relative rounded-2xl bg-[#181f1f] border-2 border-[#28c76f]/80 p-8 flex flex-col items-start justify-between w-full transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:border-[#28c76f] group overflow-hidden">
            <span className="absolute top-4 right-4">
              {/* Dollar Icon */}
              <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' fill='none' viewBox='0 0 24 24' stroke='#facc15' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M12 8c-2.21 0-4 1.343-4 3s1.79 3 4 3 4-1.343 4-3-1.79-3-4-3zm0 10c-4.418 0-8-1.79-8-4V6c0-2.21 3.582-4 8-4s8 1.79 8 4v8c0 2.21-3.582 4-8 4z'/></svg>
            </span>
            <span className="text-gray-200 text-base mb-2 flex items-center gap-2 text-left">Total Amount Bet</span>
            <span className="text-2xl font-bold text-white text-left">{totalAmountBet.toLocaleString()} tokens</span>
          </div>
          <div className="relative rounded-2xl bg-[#181f1f] border-2 border-[#28c76f]/80 p-8 flex flex-col items-start justify-between w-full transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:border-[#28c76f] group overflow-hidden">
            <span className="absolute top-4 right-4">
              {/* Hourglass Icon */}
              <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' fill='none' viewBox='0 0 24 24' stroke='#facc15' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M6 2h12M6 22h12M6 2v6a6 6 0 0 0 12 0V2M6 22v-6a6 6 0 0 1 12 0v6M12 12v0'/></svg>
            </span>
            <span className="text-gray-200 text-base mb-2 flex items-center gap-2 text-left">Active Bets</span>
            <span className="text-2xl font-bold text-white text-left">{activeBets}</span>
          </div>
          <div className="relative rounded-2xl bg-[#181f1f] border-2 border-[#28c76f]/80 p-8 flex flex-col items-start justify-between w-full transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:border-[#28c76f] group overflow-hidden">
            <span className="absolute top-4 right-4">
              {/* History Icon */}
              <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' fill='none' viewBox='0 0 24 24' stroke='#facc15' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M3 3v5h5M3.05 13A9 9 0 1 0 12 3v9z'/></svg>
            </span>
            <span className="text-gray-200 text-base mb-2 flex items-center gap-2 text-left">Expired Bets</span>
            <span className="text-2xl font-bold text-white text-left">{expiredBets}</span>
          </div>
          <div className="relative rounded-2xl bg-[#181f1f] border-2 border-[#28c76f]/80 p-8 flex flex-col items-start justify-between w-full transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:border-[#28c76f] group overflow-hidden">
            <span className="absolute top-4 right-4">
              {/* Growth Icon */}
              <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' fill='none' viewBox='0 0 24 24' stroke='#facc15' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M3 17l6-6 4 4 8-8'/></svg>
            </span>
            <span className="text-gray-200 text-base mb-2 flex items-center gap-2 text-left">Average Stake</span>
            <span className="text-2xl font-bold text-white text-left">{averageStake}x</span>
          </div>
        </div>
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center bg-[#101615] rounded-full p-1 w-fit mb-6 mx-auto gap-2 shadow-inner">
          <button
            onClick={() => setFilter('all')}
            className={`px-7 py-2 rounded-full font-semibold text-base transition-all duration-200 focus:outline-none
              ${filter === 'all'
                ? 'bg-[#137333] text-white shadow-md'
                : 'bg-transparent text-[#6ee7b7]'}
            `}
          >All</button>
          <button
            onClick={() => setFilter('active')}
            className={`px-7 py-2 rounded-full font-semibold text-base transition-all duration-200 focus:outline-none
              ${filter === 'active'
                ? 'bg-[#137333] text-white shadow-md'
                : 'bg-transparent text-[#6ee7b7]'}
            `}
          >Active</button>
          <button
            onClick={() => setFilter('expired')}
            className={`px-7 py-2 rounded-full font-semibold text-base transition-all duration-200 focus:outline-none
              ${filter === 'expired'
                ? 'bg-[#137333] text-white shadow-md'
                : 'bg-transparent text-[#6ee7b7]'}
            `}
          >Expired</button>
        </div>
        {/* Betting History Table */}
        <div className="relative rounded-2xl bg-white/5 border border-white p-8 w-full overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(40,199,111,0.10)_0%,_rgba(40,199,111,0)_80%)]" />
          <div className="text-xl font-bold text-[#6ee7b7] mb-4">Betting History</div>
          <div className="overflow-x-auto w-full">
            {loading ? (
              <div className="text-center text-gray-400 py-12 text-lg font-semibold">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-400 py-12 text-lg font-semibold">{error}</div>
            ) : filteredBets.length === 0 ? (
              <div className="text-center text-gray-400 py-12 text-lg font-semibold">Nothing to show</div>
            ) : (
              <table className="min-w-full text-left text-white text-xs sm:text-sm md:text-base">
                <thead>
                  <tr className="border-b-2 border-white/30">
                    <th className="py-2 px-6 text-[#b9ffe0] font-semibold">Candidate</th>
                    <th className="py-2 px-6 text-[#b9ffe0] font-semibold">Type</th>
                    <th className="py-2 px-6 text-[#b9ffe0] font-semibold">Amount</th>
                    <th className="py-2 px-6 text-[#b9ffe0] font-semibold">Company</th>
                    <th className="py-2 px-6 text-[#b9ffe0] font-semibold">Stake</th>
                    <th className="py-2 px-6 text-[#b9ffe0] font-semibold">Status</th>
                  </tr>
                </thead>
                <motion.tbody
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
                >
                  {filteredBets.map((bet, idx) => (
                    <motion.tr
                      key={idx}
                      variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4 } } }}
                      className="border-b-2 border-white/10"
                    >
                      <td className="py-2 px-6">{bet.candidate?.name || bet.name}</td>
                      <td className="py-2 px-6">
                        {bet.type === 'for' || bet.type === '👍' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-up w-4 h-4 sm:w-5 sm:h-5 text-blue-500"><path d="M7 10v12"></path><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"></path></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-down w-4 h-4 sm:w-5 sm:h-5 text-red-500"><path d="M17 14V2"></path><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"></path></svg>
                        )}
                      </td>
                      <td className="py-2 px-6">{bet.amount}</td>
                      <td className="py-2 px-6">{bet.companyEvent?.companyName || bet.company}</td>
                      <td className="py-2 px-6">{bet.stake}</td>
                      <td className="py-2 px-6">
                        <span className={`px-2 py-1 rounded text-xs ${bet.status === 'active' ? 'bg-green-900 text-green-300' : bet.status === 'won' ? 'bg-blue-900 text-blue-300' : bet.status === 'lost' ? 'bg-red-900 text-red-300' : 'bg-gray-800 text-gray-300'}`}>{bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}</span>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 