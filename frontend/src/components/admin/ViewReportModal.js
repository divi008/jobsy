import React from "react";

export default function ViewReportModal({ data, onClose }) {
  if (!data) return null;
  const v = data.data || {};
  const type = data.targetType || 'post';
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-[#0a0a0a] rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.7)] border-2 border-[#28c76f]/30 p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">View {type}</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white text-2xl">&times;</button>
        </div>
        {type === 'post' ? (
          <div className="text-gray-200">
            <div className="text-sm text-gray-400 mb-1">{v.createdAt ? new Date(v.createdAt).toLocaleString() : ''} {v.tag ? `· ${v.tag}` : ''}</div>
            <div className="text-white text-2xl font-bold mb-2">{v.title}</div>
            <div className="whitespace-pre-wrap">{v.body}</div>
          </div>
        ) : (
          <div className="text-gray-200">
            <div className="text-sm text-gray-400 mb-1">{v.createdAt ? new Date(v.createdAt).toLocaleString() : ''}</div>
            <div className="whitespace-pre-wrap">{v.body}</div>
          </div>
        )}
      </div>
    </div>
  );
}


