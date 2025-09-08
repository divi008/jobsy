import React, { useEffect, useMemo, useState } from 'react';
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
    <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between mb-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#28c76f]">Jobsy Forum</h1>
        <div className="text-gray-400 text-sm">A space for open discussions and honest confessions.</div>
      </div>
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <select value={sort} onChange={(e)=>setSort(e.target.value)} className="rounded-md bg-black text-white border border-gray-600 px-3 py-2">
          <option value="upvotes">Most Upvotes</option>
          <option value="newest">Newest</option>
          <option value="comments">Most Commented</option>
        </select>
        <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="rounded-md bg-black text-white border border-gray-600 px-3 py-2">
          <option value="">All Tags</option>
          <option>General</option>
          <option>Company</option>
          <option>Branch</option>
        </select>
        <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search..." className="rounded-md bg-black text-white border border-gray-600 px-3 py-2" />
        <button onClick={()=>setShowCreate(true)} className="px-4 py-2 rounded-md bg-[#28c76f] text-black font-semibold hover:bg-[#22b455] shadow-[0_10px_30px_rgba(40,199,111,0.35)]">Create Confession</button>
      </div>
    </div>
  );

  return (
    <PageLayout user={user}>
      <div className="w-full">
        {header}
        <div className="grid grid-cols-1 gap-4">
          {posts.map(p => (
            <PostCard key={p._id} post={p} onOpen={()=>openDetail(p)} onVote={(t)=>voteOnPost(p,t)} onReport={()=>openReportPost(p)} onDelete={async ()=>{
              try { await deleteOwnPost(p._id); setPosts(arr => arr.filter(x => x._id !== p._id)); }
              catch(e){ alert(e?.response?.data?.msg || 'Failed to delete'); }
            }} canDelete={user && (user._id === p.user || user.id === p.user)} />
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



