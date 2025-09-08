import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PageLayout from '../PageLayout';
import { fetchPosts, createPost, votePost, fetchPostDetail, addComment, voteComment, reportTarget, deleteOwnPost, deleteOwnComment } from '../services/forumApi';
import PostCard from '../components/forum/PostCard';
import CreatePostModal from '../components/forum/CreatePostModal';
import PostDetailModal from '../components/forum/PostDetailModal';
import ReportModal from '../components/forum/ReportModal';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import axios from 'axios';

export default function Forum(props) {
  const { user } = props;
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState('upvotes');
  const [filter, setFilter] = useState('');
  // removed page-level company/role/branch filters per request
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [detail, setDetail] = useState({ open: false, post: null, comments: [] });
  const [reportState, setReportState] = useState({ open: false, targetType: 'post', target: null });

  const { sentinelRef } = useInfiniteScroll({ hasMore, onLoadMore: () => loadMore() });

  // removed page-level filter option state

  useEffect(() => {
    // reset list when controls change
    setPosts([]); setPage(1); setHasMore(true);
  }, [sort, filter, search]);

  useEffect(() => { if (hasMore) loadMore(); }, [sort, filter, search, hasMore]);

  async function loadMore() {
    if (loading) return;
    setLoading(true);
    try {
      const data = await fetchPosts({ sort, filter, search, page, limit: 10 });
      setPosts(prev => [...prev, ...data]);
      setPage(prev => prev + 1);
      if (!data || data.length < 10) setHasMore(false);
    } catch(e) {
      setHasMore(false);
    } finally { setLoading(false); }
  }

  // removed loading of page-level company/role/branch options

  // Actions
  async function handleCreate(form) {
    const optimistic = { ...form, _id: 'tmp_'+Date.now(), createdAt: new Date().toISOString(), upvotes:0, downvotes:0, commentCount:0 };
    setPosts(p => [optimistic, ...p]);
    setShowCreate(false);
    try {
      const saved = await createPost(form);
      setPosts(p => p.map(x => x._id === optimistic._id ? saved : x));
    } catch(e) {
      setPosts(p => p.filter(x => x._id !== optimistic._id));
      alert(e?.response?.data?.msg || 'Failed to post');
    }
  }

  async function openDetail(post) {
    try {
      const data = await fetchPostDetail(post._id, { commentSort: 'newest', page: 1, limit: 50 });
      setDetail({ open: true, post: data.post, comments: data.comments });
    } catch(e) { alert('Failed to load post'); }
  }

  async function voteOnPost(post, type) {
    try {
      const res = await votePost(post._id, type);
      setPosts(arr => arr.map(p => p._id === post._id ? { ...p, upvotes: res.upvotes, downvotes: res.downvotes } : p));
    } catch(e) { /* no change on error */ }
  }

  async function voteOnComment(comment, type) {
    try {
      const res = await voteComment(comment._id, type);
      setDetail(d => ({ ...d, comments: d.comments.map(c => c._id === comment._id ? { ...c, upvotes: res.upvotes, downvotes: res.downvotes } : c) }));
    } catch(e) { /* no change */ }
  }

  async function addNewComment(payload) {
    try {
      const saved = await addComment(detail.post._id, payload);
      setDetail(d => ({ ...d, comments: [saved, ...d.comments] }));
      // also update post list commentCount by +1 for that post
      setPosts(arr => arr.map(p => p._id === detail.post._id ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p));
    } catch (e) {
      alert(e?.response?.data?.msg || 'Failed to add comment');
    }
  }

  function openReportPost(post) { setReportState({ open: true, targetType: 'post', target: post }); }
  function openReportComment(comment) { setReportState({ open: true, targetType: 'comment', target: comment }); }
  async function submitReport({ reason }) {
    try {
      await reportTarget({ targetType: reportState.targetType, targetId: reportState.target._id, reason });
      setReportState({ open: false, targetType: 'post', target: null });
    } catch(e) { alert('Failed to submit report'); }
  }

  const header = (
    <motion.div className="mb-8" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="text-center mb-4">
        <h1 className="text-5xl font-extrabold text-[#28c76f] leading-tight">Jobsy Forum</h1>
        <div className="text-gray-400 text-base">A space for open discussions and honest confessions.</div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-2xl">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#28c76f" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-2-2"/></svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 sm:py-3 bg-[#232b2b] border border-[#28c76f]/30 text-gray-200 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#28c76f]"
              style={{ borderRadius: 0 }}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-center w-full max-w-3xl">
          <select value={sort} onChange={(e)=>setSort(e.target.value)} className="h-12 bg-[#232b2b] text-gray-200 border border-[#28c76f]/30 px-3" style={{ borderRadius: 0 }}>
            <option value="upvotes">Most Upvotes</option>
            <option value="newest">Newest</option>
            <option value="comments">Most Commented</option>
          </select>
          <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="h-12 bg-[#232b2b] text-gray-200 border border-[#28c76f]/30 px-3" style={{ borderRadius: 0 }}>
            <option value="">All Tags</option>
            <option>General</option>
            <option>Company</option>
            <option>Branch</option>
          </select>
          <button onClick={()=>setShowCreate(true)} className="h-12 px-5 bg-[#28c76f] text-black font-semibold hover:bg-[#22b455] shadow-[0_10px_30px_rgba(40,199,111,0.35)]" style={{ borderRadius: 0 }}>Create Confession</button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <PageLayout user={user}>
      <div className="w-full">
        {header}
        <div className="grid grid-cols-1 gap-4">
          {useMemo(() => {
            const seen = new Set();
            return posts.filter(p => { if (!p || !p._id || seen.has(p._id)) return false; seen.add(p._id); return true; });
          }, [posts]).map(p => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <PostCard post={p} onOpen={()=>openDetail(p)} onVote={(t)=>voteOnPost(p,t)} onReport={()=>openReportPost(p)} onDelete={async ()=>{
              try { await deleteOwnPost(p._id); setPosts(arr => arr.filter(x => x._id !== p._id)); }
              catch(e){ alert(e?.response?.data?.msg || 'Failed to delete'); }
            }} canDelete={user && (user._id === p.user || user.id === p.user)} />
            </motion.div>
          ))}
          {hasMore && <div ref={sentinelRef} className="h-10" />}
          {!hasMore && posts.length === 0 && (
            <div className="text-center text-gray-400 py-10">No posts yet</div>
          )}
        </div>
      </div>

      <CreatePostModal open={showCreate} onClose={()=>setShowCreate(false)} onSubmit={handleCreate} />
      <PostDetailModal
        open={detail.open}
        post={detail.post}
        comments={detail.comments}
        onClose={()=>setDetail({ open:false, post:null, comments:[] })}
        onVotePost={(t)=>voteOnPost(detail.post, t)}
        onAddComment={addNewComment}
        onVoteComment={voteOnComment}
        onReportPost={()=>openReportPost(detail.post)}
        onReportComment={(c)=>openReportComment(c)}
        onDeletePost={async ()=>{
          try { await deleteOwnPost(detail.post._id); setDetail({ open:false, post:null, comments:[] }); setPosts(arr => arr.filter(x => x._id !== detail.post._id)); }
          catch(e){ alert(e?.response?.data?.msg || 'Failed to delete post'); }
        }}
        onDeleteComment={async (c)=>{
          try { await deleteOwnComment(c._id); setDetail(d => ({ ...d, comments: d.comments.filter(x => x._id !== c._id) })); }
          catch(e){ alert(e?.response?.data?.msg || 'Failed to delete comment'); }
        }}
        canDeletePost={user && (user._id === (detail.post && detail.post.user) || user.id === (detail.post && detail.post.user))}
        currentUserId={user && (user._id || user.id)}
      />
      <ReportModal open={reportState.open} onClose={()=>setReportState({ open:false, targetType:'post', target:null })} onSubmit={submitReport} targetLabel={reportState.targetType} />
    </PageLayout>
  );
}



