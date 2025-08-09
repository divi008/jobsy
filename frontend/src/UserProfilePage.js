import React, { useEffect, useMemo, useState } from 'react';
import PageLayout from './PageLayout';
import axios from 'axios';

export default function UserProfilePage({ user, onUserGuide, showAnnouncement, setShowAnnouncement, announcementIdx, announcements, isSliding }) {
  const [filter, setFilter] = useState('all');
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!user?._id) { setLoading(false); return; }
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/bets/user/${user._id}`);
        setBets(res.data || []);
      } catch (err) {
        setError('Could not load user bets.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?._id]);

  const normalizedBets = useMemo(() => (Array.isArray(bets) ? bets.map(b => ({
    ...b,
    status: (b.status || '').toLowerCase(),
    type: (b.type || '').toLowerCase()
  })) : []), [bets]);

  const filteredBets = useMemo(() => {
    const src = normalizedBets;
    if (filter === 'all') return src;
    if (filter === 'expired') return src.filter(b => ['expired','won','lost'].includes(b.status));
    return src.filter(b => b.status === filter);
  }, [normalizedBets, filter]);

  const totalBets = normalizedBets.length;
  const activeBets = normalizedBets.filter(b => b.status === 'active').length;
  const resolvedBets = normalizedBets.filter(b => ['won','lost','expired'].includes(b.status));
  const wonBets = resolvedBets.filter(b => b.status === 'won').length;
  const successRate = resolvedBets.length > 0 ? (wonBets / resolvedBets.length) * 100 : 0;
  const streak = (user?.streak ?? user?.streakCount) || 0;

  if (!user) return <PageLayout><div>Loading user data...</div></PageLayout>;

  const initials = (user.name || '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  const enrollment = user.enrollmentNumber || user.id;

  return (
    <PageLayout
      user={user}
      onUserGuide={onUserGuide}
      showAnnouncement={showAnnouncement}
      setShowAnnouncement={setShowAnnouncement}
      announcementIdx={announcementIdx}
      announcements={announcements}
      isSliding={isSliding}
    >
      <div className="w-full mt-8">
        <div className="bg-[linear-gradient(to_top_right,_#181a1b_80%,_#28c76f_20%,_#181a1b_100%)] backdrop-blur-md border border-white/10 shadow-md rounded-2xl px-8 py-8 md:py-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 mb-8 relative w-full">
          <div className="flex-shrink-0 flex flex-col items-center md:items-start">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#28c76f] flex items-center justify-center text-3xl md:text-4xl font-bold text-white shadow-lg mb-2 md:mb-0">{initials}</div>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center md:items-start w-full">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl md:text-3xl font-bold text-[#28c76f]">{user.name}</span>
            </div>
            <div className="text-gray-900 text-base md:text-lg mb-1">{user.email}</div>
            <div className="text-gray-900 text-base md:text-lg mb-1">Enrollment No: <span className="font-semibold">{enrollment}</span></div>
            <div className="text-gray-500 text-sm md:text-base mb-4">{(user.tokens || 0).toLocaleString()} Tokens</div>
            <div className="flex items-center justify-between w-full mb-1 mt-2">
              <span className="text-gray-500 text-sm font-semibold">Success Rate</span>
              <span className="bg-[#e2f7e1] text-[#28c76f] text-xs font-bold px-3 py-1 rounded-full">{successRate.toFixed(2)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-red-200 relative overflow-hidden mb-2">
              <div className="absolute left-0 top-0 h-full bg-[#28c76f]" style={{ width: `${successRate}%` }}></div>
              <div className="absolute right-0 top-0 h-full bg-red-500" style={{ width: `${100-successRate}%` }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 w-full">
          <div className="relative rounded-2xl bg-[#181f1f] border-2 border-[#28c76f]/80 p-8">
            <span className="text-gray-200 text-base mb-2 block">Total Bets</span>
            <span className="text-2xl font-bold text-white">{totalBets}</span>
          </div>
          <div className="relative rounded-2xl bg-[#181f1f] border-2 border-[#28c76f]/80 p-8">
            <span className="text-gray-200 text-base mb-2 block">No. of Active Bets</span>
            <span className="text-2xl font-bold text-white">{activeBets}</span>
          </div>
          <div className="relative rounded-2xl bg-[#181f1f] border-2 border-[#28c76f]/80 p-8">
            <span className="text-gray-200 text-base mb-2 block">Streak</span>
            <span className="text-2xl font-bold text-white">{streak}</span>
          </div>
          <div className="relative rounded-2xl bg-[#181f1f] border-2 border-[#28c76f]/80 p-8">
            <span className="text-gray-200 text-base mb-2 block">Success</span>
            <span className="text-2xl font-bold text-emerald-200">{successRate.toFixed(2)}%</span>
          </div>
        </div>

        <div className="relative rounded-2xl bg-white/80 border-2 border-white shadow-[0_0_10px_#28c76f11] p-8 w-full overflow-hidden">
          <div className="flex items-center bg-[#e2f7e1]/40 rounded-full p-1 w-fit mb-6 mx-auto gap-2 shadow-inner">
            <button onClick={() => setFilter('all')} className={`px-7 py-2 rounded-full font-semibold text-base ${filter==='all'?'bg-[#28c76f] text-white':'bg-transparent text-[#28c76f]'}`}>All</button>
            <button onClick={() => setFilter('active')} className={`px-7 py-2 rounded-full font-semibold text-base ${filter==='active'?'bg-[#28c76f] text-white':'bg-transparent text-[#28c76f]'}`}>Active</button>
            <button onClick={() => setFilter('expired')} className={`px-7 py-2 rounded-full font-semibold text-base ${filter==='expired'?'bg-[#28c76f] text-white':'bg-transparent text-[#28c76f]'}`}>Expired</button>
          </div>
          {loading ? (
            <div className="text-center text-gray-400 py-12 text-lg font-semibold">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-400 py-12 text-lg font-semibold">{error}</div>
          ) : filteredBets.length === 0 ? (
            <div className="text-center text-gray-400 py-12 text-lg font-semibold">Nothing to show</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-gray-900">
                <thead>
                  <tr className="border-b-2 border-white">
                    <th className="py-2 px-6 text-[#28c76f] font-semibold">Company</th>
                    <th className="py-2 px-6 text-[#28c76f] font-semibold">Candidate</th>
                    <th className="py-2 px-6 text-[#28c76f] font-semibold">Type</th>
                    <th className="py-2 px-6 text-[#28c76f] font-semibold">Amount</th>
                    <th className="py-2 px-6 text-[#28c76f] font-semibold">Stake</th>
                    <th className="py-2 px-6 text-[#28c76f] font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBets.map((bet, idx) => (
                    <tr key={idx} className="border-b-2 border-white">
                      <td className="py-2 px-6">{bet.companyEvent?.companyName || '—'}</td>
                      <td className="py-2 px-6">{bet.candidate?.name || '—'}</td>
                      <td className="py-2 px-6">
                        {bet.type === 'for' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-up w-4 h-4 sm:w-5 sm:h-5 text-blue-500"><path d="M7 10v12"></path><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"></path></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-down w-4 h-4 sm:w-5 sm:h-5 text-red-500"><path d="M17 14V2"></path><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"></path></svg>
                        )}
                      </td>
                      <td className="py-2 px-6">{bet.amount}</td>
                      <td className="py-2 px-6">{bet.stake}</td>
                      <td className="py-2 px-6">
                        <span className={`px-2 py-1 rounded text-xs ${bet.status==='active' ? 'bg-green-100 text-green-700' : bet.status==='won' ? 'bg-blue-100 text-blue-700' : bet.status==='lost' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-900'}`}>{bet.status ? bet.status[0].toUpperCase()+bet.status.slice(1) : '—'}</span>
                      </td>
                    </tr>) )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

