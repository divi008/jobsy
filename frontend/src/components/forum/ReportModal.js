import React, { useState } from 'react';

export default function ReportModal({ open, onClose, onSubmit, targetLabel }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  const doSubmit = async () => {
    if (!reason.trim()) return alert('Please provide a reason');
    setLoading(true);
    await onSubmit({ reason: reason.trim() });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="rounded-2xl w-full max-w-xl p-6 border-2 border-[#28c76f]/30 bg-[#0a0a0a] shadow-[0_20px_80px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-bold">Report {targetLabel}</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white text-2xl">&times;</button>
        </div>
        <textarea value={reason} onChange={(e)=>setReason(e.target.value)} rows={5} className="w-full rounded-md bg-black text-white border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#28c76f]" placeholder="Describe the issue..." />
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:text-white hover:border-white">Cancel</button>
          <button disabled={loading} onClick={doSubmit} className="px-5 py-2 rounded-md bg-[#28c76f] text-black font-semibold hover:bg-[#22b455]">{loading ? 'Submitting...' : 'Submit'}</button>
        </div>
      </div>
    </div>
  );
}


