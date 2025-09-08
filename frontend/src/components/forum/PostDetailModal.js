import React, { useMemo, useState } from 'react';

export default function PostDetailModal({ open, post, comments, onClose, onVotePost, onAddComment, onVoteComment, onReportPost, onReportComment, onDeletePost, onDeleteComment, canDeletePost, currentUserId }) {
  const [sort, setSort] = useState('newest');
  const [text, setText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [roll, setRoll] = useState('');

  const sorted = useMemo(() => {
    if (!comments) return [];
    const seen = new Set();
    const unique = [];
    for (const c of comments) {
      if (c && c._id && !seen.has(c._id)) { seen.add(c._id); unique.push(c); }
    }
    const copy = unique;
    if (sort === 'oldest') return copy.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sort === 'top') return copy.sort((a,b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    return copy.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [comments, sort]);

  if (!open || !post) return null;

  const canSubmit = text.trim() && (isAnonymous || (name && branch && roll));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="rounded-2xl w-full max-w-4xl p-6 border-2 border-[#28c76f]/30 bg-[#0a0a0a] shadow-[0_20px_80px_rgba(0,0,0,0.7)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full border border-[#28c76f]/40 text-xs text-[#28c76f]">{post.tag}</span>
              <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <h2 className="text-white text-2xl font-bold">{post.title}</h2>
            <p className="text-gray-300 mt-2 whitespace-pre-wrap">{post.body}</p>
            <div className="text-sm text-gray-500 mt-1">
              {post.isAnonymous ? 'Anonymous' : `${post.authorName || ''}${post.authorBranch ? ' · ' + post.authorBranch : ''}${post.authorRollNo ? ' · ' + post.authorRollNo : ''}`}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {canDeletePost && (
              <button onClick={onDeletePost} className="text-xs text-red-400 hover:text-red-300 border border-red-400/40 px-2 py-1 rounded-md">Delete Post</button>
            )}
            <button onClick={onClose} className="text-gray-300 hover:text-white text-2xl">&times;</button>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button onClick={() => onVotePost('up')} className="w-9 h-9 grid place-items-center rounded-md border text-red-400 border-red-400 shadow-[0_0_12px_#ef444477]"><span className="arrow-up" /></button>
          <button onClick={() => onVotePost('down')} className="w-9 h-9 grid place-items-center rounded-md border text-blue-400 border-blue-400 shadow-[0_0_12px_#3b82f677]"><span className="arrow-down" /></button>
          <button onClick={onReportPost} className="ml-auto text-xs text-gray-400 hover:text-red-400">Report</button>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-lg">Comments</h3>
            <select value={sort} onChange={(e)=>setSort(e.target.value)} className="rounded-md bg-black text-white border border-gray-600 px-2 py-1 text-sm">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="top">Top</option>
            </select>
          </div>

          <div className="space-y-4">
            {sorted.map(c => (
              <div key={c._id} className="rounded-xl border border-[#28c76f]/20 bg-[#121212] p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    {c.isAnonymous ? 'Anonymous' : `${c.authorName || ''}${c.authorBranch ? ' · ' + c.authorBranch : ''}${c.authorRollNo ? ' · ' + c.authorRollNo : ''}`}
                    <span className="ml-2">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <button onClick={() => onReportComment(c)} className="text-xs text-gray-400 hover:text-red-400">Report</button>
                </div>
                <div className="text-gray-200 mt-2 whitespace-pre-wrap">{c.body}</div>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => onVoteComment(c, 'up')} className="w-7 h-7 grid place-items-center rounded-md border text-red-400 border-red-400 shadow-[0_0_10px_#ef444477]"><span className="arrow-up" /></button>
                  <button onClick={() => onVoteComment(c, 'down')} className="w-7 h-7 grid place-items-center rounded-md border text-blue-400 border-blue-400 shadow-[0_0_10px_#3b82f677]"><span className="arrow-down" /></button>
                  {currentUserId && c.user === currentUserId && (
                    <button onClick={() => onDeleteComment(c)} className="ml-auto text-xs text-red-400 hover:text-red-300 border border-red-400/40 px-2 py-1 rounded-md">Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-[#28c76f]/30 p-4 bg-[#121212]">
            <textarea value={text} onChange={(e)=>setText(e.target.value)} rows={3} className="w-full rounded-md bg-black text-white border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#28c76f]" placeholder="Write a comment..." />
            <div className="flex items-center gap-3 mt-3">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={isAnonymous} onChange={(e)=>setIsAnonymous(e.target.checked)} /> Anonymous
              </label>
              {!isAnonymous && (
                <>
                  <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="rounded-md bg-black text-white border border-gray-600 px-2 py-1 text-sm" />
                  <input value={branch} onChange={(e)=>setBranch(e.target.value)} placeholder="Branch" className="rounded-md bg-black text-white border border-gray-600 px-2 py-1 text-sm" />
                  <input value={roll} onChange={(e)=>setRoll(e.target.value)} placeholder="Roll No" className="rounded-md bg-black text-white border border-gray-600 px-2 py-1 text-sm" />
                </>
              )}
              <button disabled={!canSubmit} onClick={()=>onAddComment({ body: text, isAnonymous, authorName: name, authorBranch: branch, authorRollNo: roll })} className="ml-auto px-4 py-2 rounded-md bg-[#28c76f] text-black font-semibold hover:bg-[#22b455] disabled:opacity-50">Post Comment</button>
            </div>
          </div>
        </div>
        <style>{`.arrow-up{width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:10px solid currentColor}.arrow-down{width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:10px solid currentColor}`}</style>
      </div>
    </div>
  );
}



