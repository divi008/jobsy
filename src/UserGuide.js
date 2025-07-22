import React from "react";
import HeaderNav from "./HeaderNav";

export default function UserGuide({ user }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 text-gray-900 font-sans">
      <HeaderNav user={user} />
      <div className="max-w-2xl mx-auto mt-16 p-8 bg-white/80 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold text-[#28c76f] mb-4">Welcome to<br/>Jobsy <span role='img' aria-label='target'>🎯</span></h1>
        <h2 className="text-2xl font-semibold mb-4">Quick Navigation</h2>
        <ul className="list-disc ml-6 text-lg text-gray-700 space-y-2 mb-6">
          <li><span className="font-bold">📋 See Shortlists</span><br/>
            View all shortlists across active companies<br/>
            Filter candidates by branch<br/>
            Quick search via enrollment number or name<br/>
            Track total shortlists of Students in real-time
          </li>
          <li><span className="font-bold">📈 Predict & Win</span><br/>
            Start with 100000 welcome tokens<br/>
            Place strategic bets on placement outcomes - bet "For" or "Against"<br/>
            Watch stake multipliers update in real-time based on community betting<br/>
            Track your winning streak and climb our dynamic leaderboard
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mb-4">How It Works <span role='img' aria-label='target'>🎯</span></h2>
        <ul className="list-disc ml-6 text-lg text-gray-700 space-y-2 mb-6">
          <li><span className="font-bold">Connect & Start:</span> Sign up with your IIT BHU email and get 100000 tokens instantly</li>
          <li><span className="font-bold">Choose & Bet:</span> Browse active drives and place strategic bets with dynamic stake multipliers</li>
          <li><span className="font-bold">Track & Win:</span> Monitor results live, collect winnings, and climb the leaderboard</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-4">🔍 Pro Tips</h2>
        <ul className="list-disc ml-6 text-lg text-gray-700 space-y-2 mb-6">
          <li>Keep an eye on multipliers - they update automatically based on betting patterns</li>
          <li>Higher multipliers = bigger potential returns</li>
        </ul>
        <div className="text-base text-gray-500">For more help, contact support@jobsy.com</div>
      </div>
    </div>
  );
} 