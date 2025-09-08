import React, { useState } from 'react';

export default function CreatePostModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', body: '', tag: 'General', isAnonymous: true, authorName: '', authorBranch: '', authorRollNo: '' });
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const doSubmit = async () => {
    if (!form.title || form.title.length > 150) return alert('Title is required and <= 150 chars');
    if (!form.isAnonymous && (!form.authorName || !form.authorBranch || !form.authorRollNo)) return alert('Name, Branch, Roll are required when not anonymous');
    try {
      setSubmitting(true);
      await onSubmit(form);
      setSubmitting(false);
    } catch (e) {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="rounded-2xl w-full max-w-2xl p-6 border-2 border-[#28c76f]/30 bg-[#0a0a0a] shadow-[0_20px_80px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-2xl font-bold">Create Confession</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm text-gray-300">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full mt-1 rounded-md bg-black text-white border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#28c76f]" maxLength={150} placeholder="What do you want to share?" />
          </div>
          <div>
            <label className="text-sm text-gray-300">Body (optional)</label>
            <textarea name="body" value={form.body} onChange={handleChange} rows={5} className="w-full mt-1 rounded-md bg-black text-white border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#28c76f]" placeholder="Write more details..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-300">Tag</label>
              <select name="tag" value={form.tag} onChange={handleChange} className="w-full mt-1 rounded-md bg-black text-white border border-gray-600 px-3 py-2">
                <option>General</option>
                <option>Company</option>
                <option>Branch</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <input id="anon" type="checkbox" name="isAnonymous" checked={form.isAnonymous} onChange={handleChange} />
              <label htmlFor="anon" className="text-gray-300">Post as Anonymous</label>
            </div>
          </div>
          {!form.isAnonymous && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-300">Name</label>
                <input name="authorName" value={form.authorName} onChange={handleChange} className="w-full mt-1 rounded-md bg-black text-white border border-gray-600 px-3 py-2" />
              </div>
              <div>
                <label className="text-sm text-gray-300">Branch</label>
                <input name="authorBranch" value={form.authorBranch} onChange={handleChange} className="w-full mt-1 rounded-md bg-black text-white border border-gray-600 px-3 py-2" />
              </div>
              <div>
                <label className="text-sm text-gray-300">Roll No</label>
                <input name="authorRollNo" value={form.authorRollNo} onChange={handleChange} className="w-full mt-1 rounded-md bg-black text-white border border-gray-600 px-3 py-2" />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:text-white hover:border-white">Cancel</button>
          <button disabled={submitting} onClick={doSubmit} className="px-5 py-2 rounded-md bg-[#28c76f] text-black font-semibold hover:bg-[#22b455] shadow-[0_10px_30px_rgba(40,199,111,0.35)]">{submitting ? 'Posting...' : 'Post'}</button>
        </div>
      </div>
    </div>
  );
}


