import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from 'axios'; 

function generateStakes(candidateIds) {
  const stakes = {};
  candidateIds.forEach(id => {
    stakes[id] = {
      for: (1.1 + Math.random() * 1.5).toFixed(2),
      against: (1.4 + Math.random() * 1.5).toFixed(2)
    };
  });
  return stakes;
}

export default function CompanyShortlistModal({ open, user,onClose, company,activeEvents, candidates, bets, onSubmit, stakes = {} }) {
  const [betSelections, setBetSelections] = useState({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (open && company) {
      setBetSelections({});
      setLoading(false);
    }
  }, [open, company]);

  if (!open || !company) return null;

  const shortlistedCandidates = company.candidates || [];
  const totalBet = Object.values(betSelections).reduce((sum, sel) => sum + (Number(sel.amount) || 0), 0);
  if (!user) return null; 
  const filteredBets = filter === 'all' ? (bets || []) : (bets || []).filter(b => b.status === filter);
  function handleType(candidateId, type) {
    setBetSelections(sel => ({
      ...sel,
      [candidateId]: { ...sel[candidateId], type }
    }));
  }
  function handleAmount(candidateId, amount) {
    setBetSelections(sel => ({
      ...sel,
      [candidateId]: { ...sel[candidateId], amount }
    }));
  }

  async function handleSubmit() {
    setLoading(true);
    
    const betsToPlace = Object.entries(betSelections)
      .filter(([_, sel]) => sel.type && sel.amount > 0)
      .map(([candidateId, sel]) => ({
        candidate: candidateId,
        companyEvent: company._id, // Use the database _id
        type: sel.type,
        amount: Number(sel.amount),
        stake: stakes[candidateId]?.[sel.type] || '2.00',
        status: "active"
      }));
  
    if (betsToPlace.length > 0) {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/bets`,
          { betsToPlace, totalBetAmount: totalBet },
          { headers: { 'x-auth-token': localStorage.getItem('token') || '' } }
        );
        onSubmit(betsToPlace, totalBet, res.data);
        // Refresh the page after successful bet placement
        window.location.reload();
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        alert("Failed to place bet: " + (err.response ? err.response.data.msg : "Server error"));
      }
    }
    
    setLoading(false);
    onClose(); // Close the modal
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="shadow-2xl w-full max-w-4xl p-10 relative max-h-[80vh] overflow-y-auto border-[3px] border-gray-600 flex flex-col"
        style={{
          borderRadius: 0,
          background: 'radial-gradient(circle at 60% 40%, rgba(40,199,111,0.05) 0%, rgba(0,0,0,1) 80%)',
          backgroundColor: '#000000',
        }}
      >
        <button className="absolute top-4 right-4 text-gray-400 text-2xl font-bold hover:text-gray-200" onClick={onClose}>&times;</button>
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl font-bold" style={{ color: '#28c76f' }}
          >
            {company.companyName} - {company.jobProfile}
          </motion.h2>
          <div className="flex items-center gap-2 bg-black px-4 py-2 rounded-full font-semibold text-lg" style={{ color: '#90EE90', border: '2px solid #90EE90' }}>
            Total: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{totalBet}</span>
          </div>
        </div>
        {/* Scrollable table container */}
        <div className="flex-1 overflow-y-auto min-h-0 mb-6">
          <table className="w-full text-left rounded-xl overflow-visible">
            <thead>
              <tr className="bg-[#181f1f] text-white">
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Enrollment</th>
                <th className="py-2 px-4">Stake</th>
                <th className="py-2 px-4">Bet Amount</th>
              </tr>
            </thead>
            <tbody>
              {shortlistedCandidates.map(cand => (
                <tr key={cand._id} className="border-b border-[#28c76f] transition hover:bg-[#28c76f]/10 hover:backdrop-blur-sm hover:border-[#28c76f]">
                  <td className="py-2 px-4 font-semibold text-white">{cand.name}</td>
                  <td className="py-2 px-4 pt-2 relative group" style={{ position: 'relative' }}>
                  <span className="underline cursor-pointer">{cand.enrollmentNumber}</span>
                    <div className="absolute md:left-full md:ml-2 left-auto right-0 translate-x-full md:translate-x-0 top-0 z-50 w-64 bg-black text-white rounded-xl shadow-2xl p-4 text-sm opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 border border-[#28c76f]" style={{ minWidth: '220px', boxShadow: '0 8px 32px 0 rgba(40,199,111,0.25)', maxWidth: '280px' }}>
                      <div><b>Branch:</b> {cand.branch}</div>
                      {(() => {
    const shortlists = (activeEvents || []).filter(event => 
      (event.candidates || []).some(c => c._id === cand._id)
    );
    return (
      <>
        <div><b>Shortlists:</b> {shortlists.length}</div>
        <div><b>Companies:</b> {shortlists.map(s => <span key={s._id} className="inline-block bg-[#28c76f] text-black px-2 py-1 rounded m-1 text-xs">{s.companyName}</span>)}</div>
      </>
    );
  })()}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border transition
                          ${betSelections[cand._id]?.type === 'for' ? 'bg-blue-600 text-white border-blue-400' : 'bg-black text-blue-400 border-blue-400 hover:bg-blue-900'}`}
                        onClick={() => handleType(cand._id, 'for')}
                      >
                        {/* Thumbs up SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-up w-4 h-4 sm:w-5 sm:h-5 text-blue-500"><path d="M7 10v12"></path><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"></path></svg>
                        <span>For: {stakes[cand._id]?.for || '2.00'}x</span>
                      </button>
                      <button
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border transition
                          ${betSelections[cand._id]?.type === 'against' ? 'bg-red-600 text-white border-red-400' : 'bg-black text-red-400 border-red-400 hover:bg-red-900'}`}
                        onClick={() => handleType(cand._id, 'against')}
                      >
                        {/* Thumbs down SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-down w-4 h-4 sm:w-5 sm:h-5 text-red-500"><path d="M17 14V2"></path><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"></path></svg>
                        <span>Against: {stakes[cand._id]?.against || '2.00'}x</span>
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      min="0"
                      className="w-20 px-2 py-1 rounded bg-white text-[#181f1f] border border-[#28c76f] focus:outline-none"
                      value={betSelections[cand._id]?.amount || ''}
                      onChange={e => handleAmount(cand._id, e.target.value)}
                      disabled={!betSelections[cand._id]?.type}
                      placeholder="0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Always visible submit button at the bottom */}
        <div className="flex justify-end mt-0 pt-0 sticky bottom-0 bg-transparent z-10 pb-2">
          <button
            className="bg-[#28c76f] hover:bg-[#22b455] text-white font-bold px-6 py-3 rounded-lg text-lg transition flex items-center gap-2"
            style={{ minWidth: '160px' }}
            onClick={handleSubmit}
            disabled={totalBet === 0 || loading}
          >
            {loading && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>}
            {loading ? 'Placing Bet...' : 'Submit Bet'}
          </button>
        </div>
      </div>
    </div>
  );
} 