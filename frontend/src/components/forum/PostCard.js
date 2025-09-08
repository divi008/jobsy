import React from 'react';

export default function PostCard({ post, onOpen, onVote, onReport, selectedVote }) {
  const score = (post.upvotes || 0) - (post.downvotes || 0);
  const glowUp = selectedVote === 'up' ? 'shadow-[0_0_12px_#ef444477] text-red-400 border-red-400' : 'text-gray-300 border-gray-600 hover:text-red-300 hover:border-red-300';
  const glowDown = selectedVote === 'down' ? 'shadow-[0_0_12px_#3b82f677] text-blue-400 border-blue-400' : 'text-gray-300 border-gray-600 hover:text-blue-300 hover:border-blue-300';

  return (
    <div className="rounded-2xl bg-[#181f1f] border-2 border-[#28c76f]/20 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)] transition relative">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full border border-[#28c76f]/40 text-xs text-[#28c76f]">{post.tag || 'General'}</span>
            <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <button onClick={onOpen} className="text-left text-white font-bold text-lg hover:text-[#28c76f] line-clamp-2">{post.title}</button>
          <div className="text-sm text-gray-400 mt-1 truncate">
            {post.isAnonymous ? 'Anonymous' : `${post.authorName || ''}${post.authorBranch ? ' · ' + post.authorBranch : ''}${post.authorRollNo ? ' · ' + post.authorRollNo : ''}`}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button onClick={() => onVote('up')} className={`w-8 h-8 grid place-items-center rounded-md border ${glowUp} transition`} aria-label="Upvote">
            <span className="arrow-up" />
          </button>
          <div className="text-white text-sm font-bold">{score}</div>
          <button onClick={() => onVote('down')} className={`w-8 h-8 grid place-items-center rounded-md border ${glowDown} transition`} aria-label="Downvote">
            <span className="arrow-down" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4 text-sm">
        <button onClick={onOpen} className="flex items-center gap-2 text-gray-300 hover:text-white">
          <span className="arrow-down rotate-90" />
          <span>{post.commentCount || 0}</span>
        </button>
        <button onClick={onReport} className="ml-auto text-xs text-gray-400 hover:text-red-400">Report</button>
      </div>
      <style>{`
        .arrow-up { width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 10px solid currentColor; }
        .arrow-down { width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 10px solid currentColor; }
      `}</style>
    </div>
  );
}


