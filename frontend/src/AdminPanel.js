import React, { useState, useEffect, useMemo } from "react";
import forumAdminApi from './services/forumAdminApi';
import PageLayout from "./PageLayout";
import axios from 'axios';
import { mockCompanies, mockCandidates, mockBets, adminCarouselCompanyIds } from "./mockData";
import { mockUsers } from "./mockUsers";

// Shared course + branch options
const COURSE_BRANCH_OPTIONS = [
  { course: "B.Tech", branch: "Ceramic Engineering" },
  { course: "IDD", branch: "Ceramic Engineering" },
  { course: "B.Tech", branch: "Chemical Engineering" },
  { course: "B.Tech", branch: "Civil Engineering" },
  { course: "IDD", branch: "Civil Engineering" },
  { course: "B.Tech", branch: "Computer Science and Engineering" },
  { course: "IDD", branch: "Computer Science and Engineering" },
  { course: "B.Tech", branch: "Electrical Engineering" },
  { course: "IDD", branch: "Electrical Engineering" },
  { course: "B.Tech", branch: "Electronics Engineering" },
  { course: "B.Tech", branch: "Mechanical Engineering" },
  { course: "IDD", branch: "Mechanical Engineering" },
  { course: "B.Tech", branch: "Metallurgical & Materials Engineering" },
  { course: "IDD", branch: "Metallurgical & Materials Engineering" },
  { course: "B.Tech", branch: "Mining Engineering" },
  { course: "IDD", branch: "Mining Engineering" },
  { course: "B.Tech", branch: "Pharmaceutical Engineering & Technology" },
  { course: "IDD", branch: "Pharmaceutical Engineering & Technology" },
  { course: "IDD", branch: "Engineering Physics" },
  { course: "IDD", branch: "Biochemical Engineering" },
  { course: "IDD", branch: "Biomedical Engineering" },
  { course: "IDD", branch: "Materials Science and Technology" },
  { course: "IDD", branch: "Decision Science and Engineering" },
  { course: "B.Arch", branch: "Architecture" }
];

// Edit Candidate Modal Component
function EditCandidateModal({ open, onClose, onSubmit, candidate }) {
  const [formData, setFormData] = useState({
    name: '',
    enrollmentNumber: '',
    course: '',
    branch: '',
    email: ''
  });

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        enrollmentNumber: candidate.enrollmentNumber || '',
        course: candidate.course || '',
        branch: candidate.branch || '',
        email: candidate.email || ''
      });
    }
  }, [candidate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.enrollmentNumber || !formData.course || !formData.branch) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#181f1f] rounded-2xl shadow-2xl border-2 border-[#28c76f]/40 max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#28c76f] flex items-center gap-2">
              <span>✏️</span> Edit Candidate
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#232b2b] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#28c76f]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">Enrollment Number *</label>
              <input
                type="text"
                value={formData.enrollmentNumber}
                onChange={(e) => setFormData({...formData, enrollmentNumber: e.target.value})}
                className="w-full bg-[#232b2b] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#28c76f]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">Course *</label>
              <select
                value={formData.course}
                onChange={(e) => {
                  setFormData({...formData, course: e.target.value, branch: ''});
                }}
                className="w-full bg-[#232b2b] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#28c76f]"
                required
              >
                <option value="">Select Course</option>
                <option value="B.Tech">B.Tech</option>
                <option value="IDD">IDD</option>
                <option value="M.Tech">M.Tech</option>
                <option value="Ph.D">Ph.D</option>
                <option value="B.Arch">B.Arch</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">Branch *</label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({...formData, branch: e.target.value})}
                className="w-full bg-[#232b2b] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#28c76f]"
                required
                disabled={!formData.course}
              >
                <option value="">Select Branch</option>
                {COURSE_BRANCH_OPTIONS.filter(option => option.course === formData.course).map(option => (
                  <option key={`${option.course}-${option.branch}`} value={option.branch}>
                    {option.branch}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[#232b2b] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#28c76f]"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#28c76f] hover:bg-[#22b36a] text-white font-bold px-6 py-2 rounded-lg"
              >
                Update Candidate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Add Individual Modal Component
function AddIndividualModal({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    enrollment: '',
    course: '',
    branch: '',
    email: ''
  });
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkForDuplicates = async (name, enrollment, email) => {
    setIsChecking(true);
    const duplicates = [];

    try {
      // Check in backend candidates
      if (enrollment.trim()) {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/candidates/lookup`, { enrollmentNumber: enrollment }, {
          headers: { 'x-auth-token': localStorage.getItem('token') || '' }
        });
        if (res.data) {
          duplicates.push({
            type: 'Candidate',
            data: res.data,
            reason: 'Enrollment found in database'
          });
        }
      }
    } catch (err) {
      // If not found in backend, check mock data
    if (enrollment.trim()) {
      const candidateEnrollmentMatch = mockCandidates.find(c => 
        c.enrollment === enrollment
      );
      if (candidateEnrollmentMatch) {
        duplicates.push({
          type: 'Candidate',
          data: candidateEnrollmentMatch,
          reason: 'Enrollment'
        });
      }
    }

    // Check in mockUsers - only check enrollment numbers
    if (enrollment.trim()) {
      const userEnrollmentMatch = mockUsers.find(u => 
        u.id === enrollment
      );
      if (userEnrollmentMatch) {
        duplicates.push({
          type: 'User',
          data: userEnrollmentMatch,
          reason: 'Enrollment'
        });
        }
      }
    }

    // Remove duplicates based on enrollment
    const uniqueDuplicates = duplicates.filter((dup, index, self) => 
      index === self.findIndex(d => 
        (d.data.enrollment && d.data.enrollment === dup.data.enrollment) ||
        (d.data.enrollmentNumber && d.data.enrollmentNumber === dup.data.enrollmentNumber) ||
        (d.data.id && d.data.id === dup.data.id)
      )
    );

    setDuplicateWarning(uniqueDuplicates.length > 0 ? uniqueDuplicates : null);
    setIsChecking(false);
  };

  const handleInputChange = async (field, value) => {
    if (field === 'courseBranch') {
      // Handle course+branch selection
      const selectedOption = COURSE_BRANCH_OPTIONS.find(b => `${b.course} (${b.branch})` === value);
      if (selectedOption) {
        setFormData(prev => ({
          ...prev,
          course: selectedOption.course,
          branch: selectedOption.branch
        }));
      }
    } else {
    setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Auto-fill data when enrollment changes
    if (field === 'enrollment' && value.trim()) {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/candidates/lookup`, { enrollmentNumber: value }, {
          headers: { 'x-auth-token': localStorage.getItem('token') || '' }
        });
        if (res.data) {
          // Auto-fill from backend data
          setFormData(prev => ({
            ...prev,
            name: res.data.name || prev.name,
            course: res.data.course || prev.course,
            branch: res.data.branch || prev.branch,
            email: res.data.email || prev.email
          }));
          setDuplicateWarning([{
            type: 'Candidate',
            data: res.data,
            reason: 'Enrollment found in database - data auto-filled'
          }]);
        } else {
          // Check mock data as fallback
          const candidateEnrollmentMatch = mockCandidates.find(c => c.enrollment === value);
          if (candidateEnrollmentMatch) {
            setFormData(prev => ({
              ...prev,
              name: candidateEnrollmentMatch.name || prev.name,
              course: candidateEnrollmentMatch.course || prev.course,
              branch: candidateEnrollmentMatch.branch || prev.branch
            }));
            setDuplicateWarning([{
              type: 'Candidate',
              data: candidateEnrollmentMatch,
              reason: 'Enrollment found in mock data - data auto-filled'
            }]);
      } else {
        setDuplicateWarning(null);
          }
        }
      } catch (err) {
        // Check mock data as fallback
        const candidateEnrollmentMatch = mockCandidates.find(c => c.enrollment === value);
        if (candidateEnrollmentMatch) {
          setFormData(prev => ({
            ...prev,
            name: candidateEnrollmentMatch.name || prev.name,
            course: candidateEnrollmentMatch.course || prev.course,
            branch: candidateEnrollmentMatch.branch || prev.branch
          }));
          setDuplicateWarning([{
            type: 'Candidate',
            data: candidateEnrollmentMatch,
            reason: 'Enrollment found in mock data - data auto-filled'
          }]);
        } else {
          setDuplicateWarning(null);
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (duplicateWarning && duplicateWarning.length > 0 && !duplicateWarning[0].reason.includes('found in database')) {
      alert('Please resolve duplicate entries before adding the individual.');
      return;
    }
    onSubmit(formData);
    setFormData({ name: '', enrollment: '', course: '', branch: '', email: '' });
    setDuplicateWarning(null);
  };

  const handleClose = () => {
    setFormData({ name: '', enrollment: '', branch: '', email: '' });
    setDuplicateWarning(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#181f1f] rounded-2xl shadow-2xl border-2 border-[#28c76f]/40 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#28c76f] flex items-center gap-2">
              <span>👤</span> Add Individual
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#28c76f] font-bold mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-[#0f1414] border-2 border-[#28c76f]/40 rounded-lg px-4 py-3 text-white focus:border-[#28c76f] focus:outline-none"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block text-[#28c76f] font-bold mb-2">Enrollment Number *</label>
              <input
                type="text"
                value={formData.enrollment}
                onChange={(e) => handleInputChange('enrollment', e.target.value)}
                className="w-full bg-[#0f1414] border-2 border-[#28c76f]/40 rounded-lg px-4 py-3 text-white focus:border-[#28c76f] focus:outline-none"
                placeholder="e.g., 21112001a"
                required
              />
            </div>

            <div>
              <label className="block text-[#28c76f] font-bold mb-2">Course & Branch *</label>
              <select
                value={`${formData.course} (${formData.branch})`}
                onChange={(e) => handleInputChange('courseBranch', e.target.value)}
                className="w-full bg-[#0f1414] border-2 border-[#28c76f]/40 rounded-lg px-4 py-3 text-white focus:border-[#28c76f] focus:outline-none"
                required
              >
                <option value="">Select Course & Branch</option>
                {COURSE_BRANCH_OPTIONS.map((branch, index) => (
                  <option key={index} value={`${branch.course} (${branch.branch})`}>
                    {branch.course} ({branch.branch})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#28c76f] font-bold mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-[#0f1414] border-2 border-[#28c76f]/40 rounded-lg px-4 py-3 text-white focus:border-[#28c76f] focus:outline-none"
                placeholder="email@itbhu.ac.in"
                required
              />
            </div>

            {/* Duplicate Warning */}
            {isChecking && (
              <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-3">
                <div className="text-blue-400 text-sm flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking for duplicates...
                </div>
              </div>
            )}

            {duplicateWarning && duplicateWarning.length > 0 && (
              <div className={`${duplicateWarning[0].reason.includes('found in database') ? 'bg-green-500/20 border-green-500/40' : 'bg-red-500/20 border-red-500/40'} border rounded-lg p-4`}>
                <div className={`${duplicateWarning[0].reason.includes('found in database') ? 'text-green-400' : 'text-red-400'} font-bold mb-2 flex items-center gap-2`}>
                  <span>{duplicateWarning[0].reason.includes('found in database') ? '✅' : '⚠️'}</span> 
                  {duplicateWarning[0].reason.includes('found in database') ? 'Data Auto-filled!' : 'Duplicate Found!'}
                </div>
                  {duplicateWarning.map((dup, idx) => (
                  <div key={idx} className="text-sm">
                    <div className="font-semibold">{dup.type}: {dup.data.name || dup.data.id}</div>
                    <div className="text-gray-300">{dup.reason}</div>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#28c76f] hover:bg-[#22b36a] text-white font-bold py-3 px-4 rounded-lg transition"
              >
                Add Individual
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function AddCompanyModal({ open, onClose, onSubmit }) {
  const [companyName, setCompanyName] = useState("");
  const [profile, setProfile] = useState("");
  const [expiresOn, setExpiresOn] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [liveEventSection, setLiveEventSection] = useState("");
  const [individuals, setIndividuals] = useState([
    { name: "", enrollment: "", course: "", branch: "", forTokens: 0, againstTokens: 0 }
  ]);
  const [showAddIndividualModal, setShowAddIndividualModal] = useState(false);
  const [autoFillMessage, setAutoFillMessage] = useState("");
  function handleIndividualChange(idx, field, value) {
    setIndividuals(prev => {
      const updated = prev.map((ind, i) => {
        if (i === idx) {
          const updatedInd = { ...ind, [field]: value };
          
          // Auto-fill existing data when enrollment matches
          if (field === 'enrollment' && value.trim()) {
            // Check in global candidates
            const existingCandidate = mockCandidates.find(c => c.enrollment === value);
            if (existingCandidate) {
              // Extract course and branch from combined format
              const branchParts = existingCandidate.branch.split('(');
              const course = branchParts[0]?.trim() || '';
              const branch = branchParts[1]?.replace(')', '') || existingCandidate.branch;
              
              setAutoFillMessage(`✅ Auto-filled details for ${existingCandidate.name}`);
              setTimeout(() => setAutoFillMessage(""), 3000);
              
              return {
                ...updatedInd,
                name: existingCandidate.name,
                course: course,
                branch: branch,
                enrollment: value
              };
            }
            
            // Check in global users
            const existingUser = mockUsers.find(u => u.id === value);
            if (existingUser) {
              setAutoFillMessage(`✅ Auto-filled name for ${existingUser.name}`);
              setTimeout(() => setAutoFillMessage(""), 3000);
              
              return {
                ...updatedInd,
                name: existingUser.name,
                enrollment: value
              };
            }
          }
          
          return updatedInd;
        }
        return ind;
      });
      
      return updated;
    });
  }
  function addIndividual() {
    setIndividuals(prev => [...prev, { name: "", enrollment: "", course: "", branch: "", forTokens: 0, againstTokens: 0 }]);
  }
  function removeIndividual(idx) {
    setIndividuals(prev => prev.filter((_, i) => i !== idx));
  }
  function handleSubmit() {
    onSubmit({ companyName, profile, expiresOn, logoUrl, liveEventSection, individuals });
    setCompanyName(""); setProfile(""); setExpiresOn(""); setLogoUrl(""); setLiveEventSection(""); setIndividuals([{ name: "", enrollment: "", course: "", branch: "", forTokens: 0, againstTokens: 0 }]);
    onClose();
  }

  function handleAddIndividualToCompany(newIndividual) {
    // Add the individual to the company's shortlist
    const newIndividualEntry = {
      name: newIndividual.name,
      enrollment: newIndividual.enrollment,
      course: newIndividual.branch.split('(')[0]?.trim() || "B.Tech",
      branch: newIndividual.branch.split('(')[1]?.replace(')', '') || newIndividual.branch,
      forTokens: 0,
      againstTokens: 0
    };
    
    setIndividuals(prev => [...prev, newIndividualEntry]);
    setShowAddIndividualModal(false);
  }
  if (!open) return null;
  return (
    <>
      <AddIndividualModal 
        open={showAddIndividualModal}
        onClose={() => setShowAddIndividualModal(false)}
        onSubmit={handleAddIndividualToCompany}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative border-2 border-[#28c76f] p-6 md:p-8"
          style={{
            background: 'linear-gradient(135deg, #232b2b 60%, #232b2b 100%)',
            boxShadow: '0 8px 32px 0 rgba(40,199,111,0.25), 0 1.5px 8px 0 rgba(255,255,255,0.10) inset, 0 0 32px 4px #28c76f33',
            border: '2.5px solid #28c76f',
            borderRadius: '18px',
            backdropFilter: 'blur(12px)',
          }}>
        <button className="absolute top-4 right-4 text-gray-400 text-2xl font-bold hover:text-[#28c76f]" onClick={onClose}>&times;</button>
        <h2 className="text-3xl font-bold text-[#28c76f] mb-4">Add Company</h2>
        {/* Add Individual Button */}
        <div className="flex justify-end mb-2">
          <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-base shadow" onClick={() => setShowAddIndividualModal(true)}>
            <span className="text-xl">👤</span> Add Individual
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-white mb-1">Company Name</label>
            <input className="w-full bg-[#232b2b] border border-[#28c76f]/40 rounded-lg px-3 py-2 text-white" value={companyName} onChange={e => setCompanyName(e.target.value)} />
          </div>
          <div>
            <label className="block text-white mb-1">Profile</label>
            <input className="w-full bg-[#232b2b] border border-[#28c76f]/40 rounded-lg px-3 py-2 text-white" value={profile} onChange={e => setProfile(e.target.value)} />
          </div>
          <div>
            <label className="block text-white mb-1">Expires On</label>
            <input 
              type="date" 
              className="w-full bg-[#232b2b] border border-[#28c76f]/40 rounded-lg px-3 py-2 text-white" 
              value={expiresOn} 
              onChange={e => setExpiresOn(e.target.value)} 
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-white mb-1">Live Event Section</label>
            <select className="w-full bg-[#232b2b] border border-[#28c76f]/40 rounded-lg px-3 py-2 text-white" value={liveEventSection} onChange={e => setLiveEventSection(e.target.value)}>
              <option value="">Select Section</option>
              <option value="all">All</option>
              <option value="quant">Quant</option>
              <option value="sde">SDE</option>
              <option value="product">Product</option>
              <option value="data">Data</option>
              <option value="core">Core</option>
              <option value="misc">Misc</option>
            </select>
          </div>
          <div>
            <label className="block text-white mb-1">Logo URL (optional)</label>
            <input className="w-full bg-[#232b2b] border border-[#28c76f]/40 rounded-lg px-3 py-2 text-white" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
          </div>
        </div>
        <h3 className="text-xl font-bold text-[#28c76f] mb-2 mt-2">Individuals</h3>
        {autoFillMessage && (
          <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-3 mb-4">
            <div className="text-green-400 text-sm">{autoFillMessage}</div>
          </div>
        )}
        <div className="bg-[#232b2b] rounded-xl p-4 border border-[#28c76f]/30 mb-4 shadow-inner" style={{ boxShadow: '0 2px 12px 0 #28c76f22, 0 1.5px 8px 0 #fff2 inset' }}>
          {individuals.map((ind, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-4 mb-2">
              <input className="bg-[#181f1f] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" placeholder="Name" value={ind.name} onChange={e => handleIndividualChange(idx, 'name', e.target.value)} />
              <input className="bg-[#181f1f] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" placeholder="Enrollment" value={ind.enrollment} onChange={e => handleIndividualChange(idx, 'enrollment', e.target.value)} />
              <select className="bg-[#181f1f] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" value={ind.course} onChange={e => handleIndividualChange(idx, 'course', e.target.value)}>
                <option value="">Select Course</option>
                <option value="B.Tech">B.Tech</option>
                <option value="IDD">IDD</option>
                <option value="M.Tech">M.Tech</option>
                <option value="M.Sc">M.Sc</option>
                <option value="B.Sc">B.Sc</option>
                <option value="PhD">PhD</option>
              </select>
              <select className="bg-[#181f1f] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" value={ind.branch} onChange={e => handleIndividualChange(idx, 'branch', e.target.value)} disabled={!ind.course}>
                <option value="">Select Branch</option>
                {ind.course && (
                  <>
                    <option value="Ceramic Engineering">Ceramic Engineering</option>
                    <option value="Chemical Engineering">Chemical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Electronics Engineering">Electronics Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Metallurgical & Materials Engineering">Metallurgical & Materials Engineering</option>
                    <option value="Mining Engineering">Mining Engineering</option>
                    <option value="Pharmaceutical Engineering & Technology">Pharmaceutical Engineering & Technology</option>
                    <option value="Engineering Physics">Engineering Physics</option>
                    <option value="Biochemical Engineering">Biochemical Engineering</option>
                    <option value="Biomedical Engineering">Biomedical Engineering</option>
                    <option value="Materials Science and Technology">Materials Science and Technology</option>
                    <option value="Decision Science and Engineering">Decision Science and Engineering</option>
                    <option value="Architecture">Architecture</option>
                  </>
                )}
              </select>
              <input className="bg-[#181f1f] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" placeholder="For Tokens" type="number" value={ind.forTokens} onChange={e => handleIndividualChange(idx, 'forTokens', e.target.value)} />
              <input className="bg-[#181f1f] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" placeholder="Against Tokens" type="number" value={ind.againstTokens} onChange={e => handleIndividualChange(idx, 'againstTokens', e.target.value)} />
              <button className="col-span-4 bg-red-700 hover:bg-red-800 text-white font-bold px-3 py-1 rounded-lg mt-1" onClick={() => removeIndividual(idx)}>Remove</button>
            </div>
          ))}
          <button className="bg-[#232b2b] border border-[#28c76f] text-[#28c76f] font-bold px-4 py-2 rounded-lg mt-2 hover:bg-[#28c76f] hover:text-white transition shadow" onClick={addIndividual}>+ Add Individual</button>
        </div>
        <div className="flex justify-end">
          <button className="bg-[#28c76f] hover:bg-[#22b36a] text-white font-bold px-8 py-3 rounded-xl text-lg shadow-lg transition-all" style={{ boxShadow: '0 2px 12px 0 #28c76f55, 0 1.5px 8px 0 #fff2 inset' }} onClick={handleSubmit}>Add Company</button>
        </div>
      </div>
    </div>
    </>
  );
}

function EditCompanyModal({ open, onClose, onSubmit, company, onRefresh }) {
  const [companyName, setCompanyName] = useState(company?.name || company?.companyName || "");
  const [profile, setProfile] = useState(company?.role || company?.jobProfile || "");
  const [expiresOn, setExpiresOn] = useState(company?.expiresOn || (company?.expiresAt ? new Date(company.expiresAt).toISOString().slice(0,10) : ""));
  const [logoUrl, setLogoUrl] = useState(company?.logoUrl || company?.companyLogo || "");
  const [liveEventSection, setLiveEventSection] = useState(company?.liveEventSection || "");
  const [status, setStatus] = useState(company?.status || "active");
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    enrollment: '',
    branch: '',
    course: 'B.Tech'
  });

  useEffect(() => {
    if (company) {
      setCompanyName(company.name || company.companyName || "");
      setProfile(company.role || company.jobProfile || "");
      setExpiresOn(company.expiresOn || (company.expiresAt ? new Date(company.expiresAt).toISOString().slice(0,10) : ""));
      setLogoUrl(company.logo || company.companyLogo || "");
      setLiveEventSection(company.liveEventSection || "");
      setStatus(company.status || 'active');

      // Backend provides populated candidates array
      const backendCands = (company.candidates || []).map(c => ({
        id: c._id || c.id,
        name: c.name,
        enrollment: c.enrollmentNumber || c.enrollment,
        branch: c.branch || 'N/A',
        course: c.course || 'B.Tech',
        result: c.result || (company.status === 'pending' ? 'awaited' : 'not_selected')
      }));
      setCandidates(backendCands);
    }
  }, [company]);

  const handleNewCandidateChange = async (field, value) => {
    setNewCandidate(prev => ({ ...prev, [field]: value }));
    
    // Auto-fill data when enrollment changes
    if (field === 'enrollment' && value.trim()) {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/candidates/lookup`, { enrollmentNumber: value }, {
          headers: { 'x-auth-token': localStorage.getItem('token') || '' }
        });
        if (res.data) {
          // Auto-fill from backend data
        setNewCandidate(prev => ({
          ...prev,
            name: res.data.name || prev.name,
            branch: res.data.branch || prev.branch,
            course: res.data.course || 'B.Tech'
          }));
        } else {
          // Check mock data as fallback
          const candidateEnrollmentMatch = mockCandidates.find(c => c.enrollment === value);
          if (candidateEnrollmentMatch) {
        setNewCandidate(prev => ({
          ...prev,
              name: candidateEnrollmentMatch.name || prev.name,
              branch: candidateEnrollmentMatch.branch || prev.branch
            }));
          }
        }
      } catch (err) {
        // Check mock data as fallback
        const candidateEnrollmentMatch = mockCandidates.find(c => c.enrollment === value);
        if (candidateEnrollmentMatch) {
          setNewCandidate(prev => ({
            ...prev,
            name: candidateEnrollmentMatch.name || prev.name,
            branch: candidateEnrollmentMatch.branch || prev.branch
          }));
        }
      }
    }
  };

  const handleAddCandidateInline = async () => {
    if (!newCandidate.name || !newCandidate.enrollment || !newCandidate.branch || !newCandidate.course) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/companies/${company.id || company._id}/candidates`, {
        name: newCandidate.name,
        enrollmentNumber: newCandidate.enrollment,
        branch: newCandidate.branch,
        course: newCandidate.course
      }, { headers: { 'x-auth-token': localStorage.getItem('token') || '' } });

      // Add to local state
      const addedCandidate = {
        id: res.data._id || res.data.id,
        name: newCandidate.name,
        enrollment: newCandidate.enrollment,
        branch: newCandidate.branch,
        course: newCandidate.course,
        result: status === 'pending' ? 'awaited' : 'not_selected'
      };
      setCandidates(prev => [...prev, addedCandidate]);
      
      // Reset form
      setNewCandidate({
        name: '',
        enrollment: '',
        branch: '',
        course: 'B.Tech'
      });
      
      alert('✅ Candidate added to shortlist');
    } catch (err) {
      console.error(err);
      alert('Failed to add candidate');
    }
  };

  function handleSubmit() {
    onSubmit({ 
      id: company.id || company._id,
      name: companyName, 
      role: profile, 
      expiresOn, 
      logoUrl, 
      liveEventSection,
      status: status
    });
    onClose();
  }

  if (!open) return null;
  return (
    <>
      <AddIndividualModal open={false} onClose={() => {}} onSubmit={() => {}} />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative border-2 border-[#28c76f] p-6 md:p-8"
          style={{
            background: 'linear-gradient(135deg, #232b2b 60%, #232b2b 100%)',
            boxShadow: '0 8px 32px 0 rgba(40,199,111,0.25), 0 1.5px 8px 0 rgba(255,255,255,0.10) inset, 0 0 32px 4px #28c76f33',
            border: '2.5px solid #28c76f',
            borderRadius: '18px',
            backdropFilter: 'blur(12px)',
          }}>
        <button className="absolute top-4 right-4 text-gray-400 text-2xl font-bold hover:text-[#28c76f]" onClick={onClose}>&times;</button>
        <h2 className="text-3xl font-bold text-[#28c76f] mb-4">Edit Company</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-white mb-1">Company Name</label>
            <input className="w-full bg-[#232b2b] border border-[#28c76f]/40 rounded-lg px-3 py-2 text-white" value={companyName} onChange={e => setCompanyName(e.target.value)} />
          </div>
          <div>
            <label className="block text-white mb-1">Profile</label>
            <input className="w-full bg-[#232b2b] border border-[#28c76f]/40 rounded-lg px-3 py-2 text-white" value={profile} onChange={e => setProfile(e.target.value)} />
          </div>
          <div>
            <label className="block text-white mb-1">Expires On</label>
            <input 
              type="date" 
              className="w-full bg-[#232b2b] border border-[#28c76f]/40 rounded-lg px-3 py-2 text-white" 
              value={expiresOn} 
              onChange={e => setExpiresOn(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-white mb-1">Live Event Section</label>
            <select className="w-full bg-[#232b2b] border border-[#28c76f]/40 rounded-lg px-3 py-2 text-white" value={liveEventSection} onChange={e => setLiveEventSection(e.target.value)}>
              <option value="">Select Section</option>
              <option value="all">All</option>
              <option value="quant">Quant</option>
              <option value="sde">SDE</option>
              <option value="product">Product</option>
              <option value="data">Data</option>
              <option value="core">Core</option>
              <option value="misc">Misc</option>
            </select>
          </div>
          <div>
            <label className="block text-white mb-1">Status</label>
            <select className="w-full bg-[#232b2b] border border-[#28c76f]/40 rounded-lg px-3 py-2 text-white" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div>
            <label className="block text-white mb-1">Logo URL (optional)</label>
            <input className="w-full bg-[#232b2b] border border-[#28c76f]/40 rounded-lg px-3 py-2 text-white" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
          </div>
        </div>

        {/* Add New Candidate Section */}
        <h3 className="text-xl font-bold text-[#28c76f] mb-2 mt-4">Add New Candidate</h3>
        <div className="bg-[#232b2b] rounded-xl p-4 border border-[#28c76f]/30 mb-4 shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input 
              className="bg-[#181f1f] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" 
              placeholder="Name" 
              value={newCandidate.name} 
              onChange={e => handleNewCandidateChange('name', e.target.value)} 
            />
            <input 
              className="bg-[#181f1f] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" 
              placeholder="Enrollment" 
              value={newCandidate.enrollment} 
              onChange={e => handleNewCandidateChange('enrollment', e.target.value)} 
            />
            <select 
              className="bg-[#181f1f] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" 
              value={`${newCandidate.course} (${newCandidate.branch})`}
              onChange={e => {
                const selectedOption = COURSE_BRANCH_OPTIONS.find(b => `${b.course} (${b.branch})` === e.target.value);
                if (selectedOption) {
                  setNewCandidate(prev => ({
                    ...prev,
                    course: selectedOption.course,
                    branch: selectedOption.branch
                  }));
                }
              }}
            >
              <option value="">Select Course & Branch</option>
              {COURSE_BRANCH_OPTIONS.map((branch, index) => (
                <option key={index} value={`${branch.course} (${branch.branch})`}>
                  {branch.course} ({branch.branch})
                </option>
              ))}
            </select>
          </div>
          <button 
            className="bg-[#28c76f] hover:bg-[#22b36a] text-white font-bold px-4 py-2 rounded-lg" 
            onClick={handleAddCandidateInline}
            disabled={!newCandidate.name || !newCandidate.enrollment || !newCandidate.branch || !newCandidate.course}
          >
            Add to Shortlist
          </button>
        </div>

        {/* Existing Candidates Section */}
        <h3 className="text-xl font-bold text-[#28c76f] mb-2 mt-4">Shortlisted Candidates</h3>
        <div className="bg-[#232b2b] rounded-xl p-4 border border-[#28c76f]/30 mb-4 shadow-inner max-h-80 overflow-y-auto">
          {candidates.length === 0 ? (
            <div className="text-gray-400 text-center py-4">No candidates shortlisted</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 text-white font-semibold">
              <div>Name</div>
              <div>Enrollment</div>
              <div>Course</div>
              <div>Branch</div>
              <div>Verdict</div>
              <div>Actions</div>
            </div>
          )}
          {candidates.map((candidate, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-3 p-3 bg-[#181f1f] rounded-lg">
              <input className="bg-[#232b2b] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" value={candidate.name}
                onChange={e => setCandidates(prev => prev.map((c, i) => i === idx ? { ...c, name: e.target.value } : c))} />
              <input className="bg-[#232b2b] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" value={candidate.enrollment}
                onChange={e => setCandidates(prev => prev.map((c, i) => i === idx ? { ...c, enrollment: e.target.value } : c))} />
              <select className="bg-[#232b2b] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" value={candidate.course || 'B.Tech'}
                onChange={e => setCandidates(prev => prev.map((c, i) => i === idx ? { ...c, course: e.target.value } : c))}>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="PhD">PhD</option>
                <option value="IDD">IDD</option>
                <option value="B.Arch">B.Arch</option>
            </select>
              <select className="bg-[#232b2b] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" value={candidate.branch}
                onChange={e => setCandidates(prev => prev.map((c, i) => i === idx ? { ...c, branch: e.target.value } : c))}>
                  <option value="Ceramic Engineering">Ceramic Engineering</option>
                  <option value="Chemical Engineering">Chemical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Electronics Engineering">Electronics Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Metallurgical & Materials Engineering">Metallurgical & Materials Engineering</option>
                  <option value="Mining Engineering">Mining Engineering</option>
                  <option value="Pharmaceutical Engineering & Technology">Pharmaceutical Engineering & Technology</option>
                  <option value="Engineering Physics">Engineering Physics</option>
                  <option value="Biochemical Engineering">Biochemical Engineering</option>
                  <option value="Biomedical Engineering">Biomedical Engineering</option>
                  <option value="Materials Science and Technology">Materials Science and Technology</option>
                  <option value="Decision Science and Engineering">Decision Science and Engineering</option>
                  <option value="Architecture">Architecture</option>
            </select>
              <div>
                <select 
                  className="w-full bg-[#232b2b] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white"
                  value={candidate.result || (status === 'pending' ? 'awaited' : 'not_selected')}
                  onChange={e => setCandidates(prev => prev.map((c, i) => i === idx ? { ...c, result: e.target.value } : c))}
                >
                  <option value="awaited">Awaited</option>
                  <option value="selected">Selected</option>
                  <option value="not_selected">Not Selected</option>
                </select>
              </div>
              <div className="md:col-span-6 grid grid-cols-3 gap-3">
                <input id={`for-${idx}`} placeholder="For stake (e.g., 2.00)" className="bg-[#232b2b] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" />
                <input id={`against-${idx}`} placeholder="Against stake (e.g., 2.00)" className="bg-[#232b2b] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" />
                <div className="flex gap-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded" onClick={async () => {
                    try {
                      await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/companies/${company.id || company._id}/candidates/${candidate.id}`, {
                        name: candidate.name,
                        enrollmentNumber: candidate.enrollment,
                        branch: candidate.branch,
                        course: candidate.course,
                        stakes: {
                          for: document.getElementById(`for-${idx}`).value || '2.00',
                          against: document.getElementById(`against-${idx}`).value || '2.00'
                        }
                      }, { headers: { 'x-auth-token': localStorage.getItem('token') || '' } });
                      alert('✅ Candidate updated');
                    } catch (err) {
                      console.error(err);
                      alert('Failed to update candidate');
                    }
                  }}>Save</button>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded" onClick={async () => {
                    if (!window.confirm('Remove from shortlist?')) return;
                    try {
                      const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/companies/${company.id || company._id}/candidates/${candidate.id}`, { headers: { 'x-auth-token': localStorage.getItem('token') || '' } });
                      const ev = res.data;
                      setCandidates((ev.candidates || []).map(c => ({ id: c._id, name: c.name, enrollment: c.enrollmentNumber, branch: c.branch, course: c.course })));
                    } catch (err) {
                      console.error(err);
                      alert('Failed to delete candidate');
                    }
                  }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3">
          <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-xl text-lg shadow-lg transition-all" onClick={onClose}>Cancel</button>
          <button className="bg-[#28c76f] hover:bg-[#22b36a] text-white font-bold px-6 py-3 rounded-xl text-lg shadow-lg transition-all" style={{ boxShadow: '0 2px 12px 0 #28c76f55, 0 1.5px 8px 0 #fff2 inset' }} onClick={handleSubmit}>Update Company</button>
        </div>
      </div>
    </div>
    </>
  );
}

function UpdateResultsModal({ open, onClose, onSubmit, company }) {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    if (company) {
      const list = (company.candidates || []).map(c => ({
        id: c._id || c.id,
        name: c.name,
        enrollment: c.enrollmentNumber || c.enrollment,
        branch: c.branch || 'N/A',
        result: company.status === 'pending' ? 'awaited' : 'not_selected'
      }));
      if (company.status === 'expired' && Array.isArray(company.winningCandidates)) {
        const winSet = new Set(company.winningCandidates.map(x => String(x)));
        list.forEach(c => { if (winSet.has(String(c.id))) c.result = 'selected'; });
      }
      setCandidates(list);
    }
  }, [company]);

  function handleResultChange(enrollment, result) {
    setCandidates(prev => prev.map(c => c.enrollment === enrollment ? { ...c, result } : c));
  }

  function handleSubmit() {
    const winningCandidateIds = candidates.filter(c => c.result === 'selected').map(c => c.id);
    onSubmit(company._id || company.id, winningCandidateIds);
    onClose();
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative border-2 border-red-400 p-6 md:p-8"
        style={{
          background: 'linear-gradient(135deg, #232b2b 60%, #232b2b 100%)',
          boxShadow: '0 8px 32px 0 rgba(239,68,68,0.25), 0 1.5px 8px 0 rgba(255,255,255,0.10) inset, 0 0 32px 4px rgba(239,68,68,0.33)',
          border: '2.5px solid #ef4444',
          borderRadius: '18px',
          backdropFilter: 'blur(12px)',
        }}>
        <button className="absolute top-4 right-4 text-gray-400 text-2xl font-bold hover:text-red-400" onClick={onClose}>&times;</button>
        <h2 className="text-3xl font-bold text-red-400 mb-4">Update Results - {company?.name || company?.companyName}</h2>
        <div className="bg-[#232b2b] rounded-xl p-4 border border-red-400/30 mb-4 shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-white font-semibold">
            <div>Candidate Name</div>
            <div>Enrollment</div>
            <div>Branch</div>
            <div>Result</div>
          </div>
          {candidates.map((candidate, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 p-3 bg-[#181f1f] rounded-lg">
              <div className="text-white font-semibold">{candidate.name}</div>
              <div className="text-gray-300">{candidate.enrollment}</div>
              <div className="text-gray-400">{candidate.branch}</div>
              <div>
                <select 
                  className="w-full bg-[#232b2b] border border-red-400/40 rounded-lg px-3 py-2 text-white" 
                  value={candidate.result} 
                  onChange={e => handleResultChange(candidate.enrollment, e.target.value)}
                >
                  <option value="awaited">Awaited</option>
                  <option value="selected">Selected</option>
                  <option value="not_selected">Not Selected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3">
          <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-xl text-lg shadow-lg transition-all" onClick={onClose}>Cancel</button>
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl text-lg shadow-lg transition-all" onClick={handleSubmit}>Update Results</button>
        </div>
      </div>
    </div>
  );
}

// Select Carousel Companies Modal
function SelectCarouselModal({ open, onClose, onSubmit }) {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [companyLogos, setCompanyLogos] = useState({});

  useEffect(() => {
    if (open) {
      // Get all active companies (where results are not declared)
      const activeCompanies = mockCompanies.filter(c => {
        const hasResultsDeclared = c.candidates && c.candidates.some(cand => cand.result !== 'awaited');
        return !hasResultsDeclared;
      });
      setAvailableCompanies(activeCompanies);
      setSelectedCompanies([...adminCarouselCompanyIds]);
      
      // Initialize logos from existing companies
      const logos = {};
      activeCompanies.forEach(company => {
        logos[company.id] = company.logo || '';
      });
      setCompanyLogos(logos);
    }
  }, [open]);

  const handleCompanyToggle = (companyId) => {
    setSelectedCompanies(prev => {
      if (prev.includes(companyId)) {
        return prev.filter(id => id !== companyId);
      } else {
        if (prev.length >= 8) {
          alert('Maximum 8 companies allowed in carousel');
          return prev;
        }
        return [...prev, companyId];
      }
    });
  };

  const handleLogoChange = (companyId, logoUrl) => {
    setCompanyLogos(prev => ({
      ...prev,
      [companyId]: logoUrl
    }));
    
    // Update the company's logo in mockCompanies
    const company = mockCompanies.find(c => c.id === companyId);
    if (company) {
      company.logo = logoUrl;
    }
  };

  const handleSubmit = () => {
    if (selectedCompanies.length === 0) {
      alert('Please select at least one company for the carousel');
      return;
    }
    
    // Update logos for selected companies
    selectedCompanies.forEach(companyId => {
      const company = mockCompanies.find(c => c.id === companyId);
      if (company) {
        company.logo = companyLogos[companyId] || '';
      }
    });
    
    onSubmit(selectedCompanies);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#181f1f] rounded-2xl shadow-2xl border-2 border-[#28c76f]/40 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#28c76f] flex items-center gap-2">
              <span>🎠</span> Select Carousel Companies
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-300 mb-2">Select up to 8 companies to display in the homepage carousel:</p>
            <p className="text-green-400 text-sm">Selected: {selectedCompanies.length}/8</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {availableCompanies.map(company => {
              const isSelected = selectedCompanies.includes(company.id);
              const totalTokens = mockBets.filter(bet => bet.companyId === company.id)
                .reduce((sum, bet) => sum + (Number(bet.amount) || 0), 0);
              
              return (
                <div
                  key={company.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected 
                      ? 'border-[#28c76f] bg-[#28c76f]/10' 
                      : 'border-gray-600 bg-[#0f1414] hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white">{company.name}</h3>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCompanyToggle(company.id)}
                      className="w-4 h-4 text-[#28c76f] bg-gray-700 border-gray-600 rounded focus:ring-[#28c76f]"
                    />
                  </div>
                  <p className="text-gray-400 text-sm mb-1">{company.role}</p>
                  <p className="text-gray-500 text-xs mb-2">{company.liveEventSection || 'N/A'}</p>
                  <p className="text-[#28c76f] text-sm font-semibold mb-3">
                    {totalTokens.toLocaleString()} tokens bet
                  </p>
                  
                  {/* Logo Input - only show for selected companies */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <label className="block text-[#28c76f] font-bold text-sm mb-2">
                        🖼️ Company Logo URL
                      </label>
                      <input
                        type="url"
                        value={companyLogos[company.id] || ''}
                        onChange={(e) => handleLogoChange(company.id, e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="w-full bg-[#0f1414] border-2 border-[#28c76f]/40 rounded-lg px-3 py-2 text-white text-sm focus:border-[#28c76f] focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {companyLogos[company.id] && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-green-400 text-xs">✓ Logo set</span>
                          <img 
                            src={companyLogos[company.id]} 
                            alt={`${company.name} logo`}
                            className="w-6 h-6 rounded object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-[#28c76f] hover:bg-[#22b36a] text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Update Carousel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Edit Shortlist Modal Component
function EditShortlistModal({ open, onClose, onSubmit, candidate, companies }) {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (candidate && companies) {
      // Initialize with current shortlisted companies
      const currentShortlisted = candidate.shortlistedIn || [];
      const companyIds = currentShortlisted.map(entry => {
        if (typeof entry === 'object' && entry._id) {
          return entry._id;
        } else if (typeof entry === 'string') {
          return entry;
        }
        return null;
      }).filter(Boolean);
      setSelectedCompanies(companyIds);
    }
  }, [candidate, companies]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!candidate) return;
    
    setLoading(true);
    try {
      await onSubmit(selectedCompanies);
    } catch (error) {
      console.error('Error updating shortlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#181f1f] rounded-2xl shadow-2xl border-2 border-[#28c76f]/40 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#28c76f] flex items-center gap-2">
              <span>📋</span> Edit Shortlist for {candidate?.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-300 text-sm">
              Select the companies where this candidate should be shortlisted:
            </p>
          </div>

          {companies && companies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {companies.map(company => (
                <label key={company._id} className="flex items-center space-x-3 p-3 bg-[#232b2b] rounded-lg border border-[#28c76f]/30 hover:border-[#28c76f]/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCompanies.includes(company._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCompanies([...selectedCompanies, company._id]);
                      } else {
                        setSelectedCompanies(selectedCompanies.filter(id => id !== company._id));
                      }
                    }}
                    className="w-4 h-4 text-[#28c76f] bg-[#232b2b] border-[#28c76f]/30 rounded focus:ring-[#28c76f] focus:ring-2"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-white">{company.companyName}</div>
                    <div className="text-sm text-gray-400">{company.jobProfile}</div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              No companies available
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#28c76f] hover:bg-[#22b36a] text-white font-bold px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Shortlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel({ user, showUserGuideModal, setShowUserGuideModal }) {
  // Only allow Jon Snow (admin) to view this page
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showAddIndividualModal, setShowAddIndividualModal] = useState(false);
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [showEditCandidateModal, setShowEditCandidateModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [candidates, setCandidates] = useState([]);
  // Local state to force refresh after adding company
  const [refresh, setRefresh] = useState(0);
  // Filter states for individuals table
  const [individualSearchTerm, setIndividualSearchTerm] = useState("");
  const [individualStatusFilter, setIndividualStatusFilter] = useState("all");
  const [individualBranchFilter, setIndividualBranchFilter] = useState("all");
  // Candidate management states
  const [candidateSearchTerm, setCandidateSearchTerm] = useState("");
  const [candidateBranchFilter, setCandidateBranchFilter] = useState("all");
  const [showEditShortlistModal, setShowEditShortlistModal] = useState(false);
  // Forum moderation state
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportFilters, setReportFilters] = useState({ type: '', status: '', q: '' });
  const [reportRefreshTick, setReportRefreshTick] = useState(0);
  
  // Load companies, bets, and candidates from backend on mount/refresh
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [eventsRes, betsRes, candidatesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/events`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/bets`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/admin/candidates`, {
            headers: { 'x-auth-token': localStorage.getItem('token') || '' }
          })
        ]);
        
        const eventsData = eventsRes.data || [];
        const candidatesData = candidatesRes.data || [];
        
        // Ensure companies have candidates data populated
        const companiesWithCandidates = eventsData.map(company => ({
          ...company,
          candidates: company.candidates || []
        }));
        
        setCompanies(companiesWithCandidates);
        setBets(betsRes.data || []);
        setCandidates(candidatesData);
        
        // Debug logging
        console.log('Companies data:', companiesWithCandidates);
        console.log('Candidates data:', candidatesData);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
        // Fallback to mock if backend not available
    setCompanies([...mockCompanies]);
        setCandidates([...mockCandidates]);
      }
    };
    fetchAdminData();
  }, [refresh]);

  // Forum reports loader
  useEffect(() => {
    async function loadReports() {
      try {
        setReportsLoading(true);
        const params = {};
        if (reportFilters.type) params.type = reportFilters.type;
        if (reportFilters.status) params.status = reportFilters.status;
        if (reportFilters.q) params.q = reportFilters.q;
        const data = await forumAdminApi.fetchReports(params);
        setReports(data || []);
      } catch (e) {
        // noop
      } finally { setReportsLoading(false); }
    }
    loadReports();
  }, [reportFilters, reportRefreshTick]);

  function AdminReportsTable({ type }) {
    const filtered = useMemo(() => (
      (reports || []).filter(r => (type ? r.targetType === type : true))
    ), [reports, type]);

    async function handleResolve(id) {
      await forumAdminApi.resolveReport(id);
      setReportRefreshTick(x => x + 1);
    }
    async function handleDelete(targetType, id) {
      if (targetType === 'post') await forumAdminApi.deletePost(id);
      else await forumAdminApi.deleteComment(id);
      setReportRefreshTick(x => x + 1);
    }
    async function handleBan(userId) {
      const type = prompt('Ban type: confession | comment | both', 'both');
      if (!type) return;
      const reason = prompt('Reason (optional)', '');
      await forumAdminApi.banUser(userId, { type, reason });
      alert('User banned');
    }
    async function handleUnban(userId) {
      await forumAdminApi.unbanUser(userId);
      alert('User unbanned');
    }

    return (
      <div className="overflow-auto">
        {reportsLoading ? (
          <div className="text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-400">No reports</div>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-[#28c76f] border-b border-[#28c76f]/20">
                <th className="py-2 px-3">Report ID</th>
                <th className="py-2 px-3">Target</th>
                <th className="py-2 px-3">Reason</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r._id} className="border-b border-[#28c76f]/10 text-gray-200">
                  <td className="py-2 px-3 align-top">{r._id}</td>
                  <td className="py-2 px-3 align-top">{r.targetType}</td>
                  <td className="py-2 px-3 align-top max-w-[320px] truncate" title={r.reason}>{r.reason}</td>
                  <td className="py-2 px-3 align-top">{r.status}</td>
                  <td className="py-2 px-3 align-top flex gap-2 flex-wrap">
                    <button className="admin-action" onClick={async () => {
                      try {
                        if (r.targetType === 'post') {
                          const data = await forumAdminApi.getPost(r.targetId);
                          setViewData({ targetType: 'post', data });
                          handleOpenModal();
                        } else {
                          const data = await forumAdminApi.getComment(r.targetId);
                          setViewData({ targetType: 'comment', data });
                          handleOpenModal();
                        }
                      } catch (e) { alert('Failed to load target'); }
                    }}>View</button>
                    <button className="admin-action" onClick={() => handleResolve(r._id)}>Resolve</button>
                    <button className="admin-action" onClick={() => handleDelete(r.targetType, r.targetId)}>Delete</button>
                    <button className="admin-action" onClick={() => handleBan(r.reporter)}>Ban User</button>
                    <button className="admin-action" onClick={() => handleUnban(r.reporter)}>Unban</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
  const [viewModal, setViewModal] = useState(false);
  const [viewData, setViewData] = useState({ targetType: 'post', data: null });
  const handleOpenModal = () => setViewModal(true);
  const handleCloseModal = () => setViewModal(false);

  function ViewTargetModal() {
    if (!viewModal || !viewData.data) return null;
    const v = viewData.data;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="rounded-2xl w-full max-w-3xl p-6 border-2 border-[#28c76f]/30 bg-[#0a0a0a] shadow-[0_20px_80px_rgba(0,0,0,0.7)] max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-xl font-bold">View {viewData.targetType}</h3>
            <button className="text-gray-300 hover:text-white text-2xl" onClick={handleCloseModal}>&times;</button>
          </div>
          {viewData.targetType === 'post' ? (
            <div className="text-gray-200">
              <div className="text-sm text-gray-400 mb-1">{new Date(v.createdAt).toLocaleString()} · {v.tag}</div>
              <div className="text-white text-2xl font-bold mb-2">{v.title}</div>
              <div className="whitespace-pre-wrap">{v.body}</div>
            </div>
          ) : (
            <div className="text-gray-200">
              <div className="text-sm text-gray-400 mb-1">{new Date(v.createdAt).toLocaleString()}</div>
              <div className="whitespace-pre-wrap">{v.body}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
  const [bets, setBets] = useState([]);
  const openAddIndividualGlobal = () => setShowAddIndividualModal(true);

  const isAdmin = Boolean(user?.isAdmin);
  if (!isAdmin) {
    return (
      <PageLayout user={user}>
        <div className="w-full max-w-2xl min-h-[200px] bg-[#181f1f] rounded-2xl shadow-lg flex items-center justify-center border-2 border-red-400/30 mt-10">
          <span className="text-2xl text-red-500 font-bold">403 - Not Authorized</span>
        </div>
      </PageLayout>
    );
  }

  const handleAddCompany = async (newCompany) => {
    try {
      const payload = {
        companyName: newCompany.companyName,
        companyLogo: newCompany.logoUrl || '',
        jobProfile: newCompany.profile,
        status: 'active',
        expiresAt: newCompany.expiresOn,
      liveEventSection: newCompany.liveEventSection,
        candidates: []
      };
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/companies`, payload, {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      alert('✅ Company created');
      setRefresh(r => r + 1);
    } catch (err) {
      console.error(err);
      alert('Failed to create company');
    }
  };

  const handleEditCompany = async (updatedCompany) => {
    try {
      const payload = {
        companyName: updatedCompany.name,
        companyLogo: updatedCompany.logoUrl,
        jobProfile: updatedCompany.role,
        expiresAt: updatedCompany.expiresOn,
        liveEventSection: updatedCompany.liveEventSection,
        status: updatedCompany.status
      };
      const targetId = updatedCompany._id || updatedCompany.id;
      await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/companies/${targetId}`, payload, {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      alert('✅ Company updated');
      setRefresh(r => r + 1);
    } catch (err) {
      console.error(err);
      alert('Failed to update company');
    }
  };

  const handleUpdateResults = (companyId, winningCandidateIds) => {
    axios.post(`${process.env.REACT_APP_API_URL}/api/admin/events/${companyId}/update-results`, {
      winningCandidateIds
    }, {
      headers: { 'x-auth-token': localStorage.getItem('token') || '' }
    }).then(() => {
      alert('✅ Results updated successfully');
      setRefresh(r => r + 1);
    }).catch(err => {
      console.error(err);
      alert('Failed to update results');
    });
  };

  const handleAddIndividual = (newIndividual) => {
    // This function is called when adding individual from the global modal
    // The individual is already added to the backend, so we just need to refresh
    setRefresh(r => r + 1);
    alert('✅ Individual added successfully');
  };

  const handleUpdateCarousel = async (selectedCompanyIds) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/feature`, { featuredIds: selectedCompanyIds }, {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      alert('✅ Carousel updated');
      setRefresh(r => r + 1);
    } catch (err) {
      console.error(err);
      alert('Failed to update carousel: ' + (err.response?.data?.msg || err.message));
    }
  };

  const getTotalTokens = (company) => {
    return bets.filter(bet => bet.companyEvent?._id === company._id)
      .reduce((sum, bet) => sum + (Number(bet.amount) || 0), 0);
  };

  const isExpired = (expiresOn) => {
    if (!expiresOn) return false;
    const today = new Date();
    const expiryDate = new Date(expiresOn);
    return today > expiryDate;
  };

  const handleEditCandidate = async (updatedCandidate) => {
    try {
      if (!selectedCandidate || !selectedCandidate._id) {
        alert('No candidate selected for editing');
        return;
      }
      
      await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/candidates/${selectedCandidate._id}`, updatedCandidate, {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      alert('✅ Candidate updated successfully');
      setShowEditCandidateModal(false);
      setSelectedCandidate(null);
      setRefresh(r => r + 1);
    } catch (err) {
      console.error(err);
      alert('Failed to update candidate: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (!candidateId) {
      alert('No candidate ID provided');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this candidate? This will remove them from all shortlists.')) {
      return;
    }
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/candidates/${candidateId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      alert('✅ Candidate deleted successfully');
      setRefresh(r => r + 1);
    } catch (err) {
      console.error(err);
      alert('Failed to delete candidate: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleUpdateShortlist = async (candidateId, selectedCompanyIds) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/candidates/${candidateId}/shortlist`, {
        companyIds: selectedCompanyIds
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });

      alert('✅ Shortlist updated successfully');
      setShowEditShortlistModal(false);
      setSelectedCandidate(null);
      setRefresh(r => r + 1);
    } catch (err) {
      console.error(err);
      alert('Failed to update shortlist: ' + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <PageLayout user={user} onUserGuide={() => setShowUserGuideModal(true)}>
      <AddCompanyModal open={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddCompany} />
      <EditCompanyModal 
        open={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        onSubmit={handleEditCompany}
        company={selectedCompany}
        onRefresh={() => setRefresh(r => r + 1)}
      />
      <UpdateResultsModal 
        open={showResultsModal} 
        onClose={() => setShowResultsModal(false)} 
        onSubmit={handleUpdateResults}
        company={selectedCompany}
      />
      <AddIndividualModal 
        open={showAddIndividualModal}
        onClose={() => setShowAddIndividualModal(false)}
        onSubmit={handleAddIndividual}
      />
      <SelectCarouselModal 
        open={showCarouselModal}
        onClose={() => setShowCarouselModal(false)}
        onSubmit={handleUpdateCarousel}
      />
      <EditCandidateModal 
        open={showEditCandidateModal}
        onClose={() => {
          setShowEditCandidateModal(false);
          setSelectedCandidate(null);
        }}
        onSubmit={handleEditCandidate}
        candidate={selectedCandidate}
      />
      <EditShortlistModal 
        open={showEditShortlistModal}
        onClose={() => {
          setShowEditShortlistModal(false);
          setSelectedCandidate(null);
        }}
        onSubmit={(selectedCompanyIds) => handleUpdateShortlist(selectedCandidate._id, selectedCompanyIds)}
        candidate={selectedCandidate}
        companies={companies}
      />
      <div className="w-full max-w-6xl mx-auto mt-4">
        <h1 className="text-4xl font-extrabold text-[#28c76f] mb-4 text-center">Betting Admin Panel</h1>
        {/* Forum Moderation */}
        <div className="mt-10 rounded-2xl border-2 border-[#28c76f]/30 p-6 bg-[#101414] shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Forum Moderation</h2>
            <div className="flex gap-2">
              <input id="forum-search" placeholder="Search reason..." className="rounded-md bg-black text-white border border-gray-600 px-3 py-2" />
              <select id="forum-status" className="rounded-md bg-black text-white border border-gray-600 px-3 py-2">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
              <select id="forum-type" className="rounded-md bg-black text-white border border-gray-600 px-3 py-2">
                <option value="">All Types</option>
                <option value="post">Posts</option>
                <option value="comment">Comments</option>
              </select>
              <button id="forum-refresh" className="px-4 py-2 rounded-md bg-[#28c76f] text-black font-semibold hover:bg-[#22b455]">Refresh</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-[#28c76f]/20 p-4 bg-[#121212]">
              <h3 className="text-white font-bold mb-3">Reported Posts</h3>
              <AdminReportsTable type="post" />
            </div>
            <div className="rounded-xl border border-[#28c76f]/20 p-4 bg-[#121212]">
              <h3 className="text-white font-bold mb-3">Reported Comments</h3>
              <AdminReportsTable type="comment" />
            </div>
          </div>
          <style>{`.admin-action{border:1px solid #333;padding:6px 10px;border-radius:8px} .admin-action:hover{border-color:#28c76f}`}</style>
        </div>
        <ViewTargetModal />
        <div className="flex flex-wrap justify-between mb-4 gap-2">
          <button className="bg-[#28c76f] hover:bg-[#22b36a] text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-base shadow" onClick={() => setShowAddModal(true)}>
            <span className="text-xl">＋</span> Add Company
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-base shadow" onClick={() => setShowAddIndividualModal(true)}>
            <span className="text-xl">👤</span> Add Individual
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-base shadow" onClick={() => window.location.reload()}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5 9A7.003 7.003 0 0 1 12 5c1.657 0 3.156.576 4.354 1.536M19 15a7.003 7.003 0 0 1-7 4c-1.657 0-3.156-.576-4.354-1.536" /></svg>
            Refresh Page
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-base shadow" onClick={() => setShowCarouselModal(true)}>
            <span className="text-xl">🎠</span>
            Select Carousel
          </button>
        </div>
        <div className="bg-[#181f1f] rounded-2xl shadow-lg p-4 border-2 border-[#28c76f]/40 mb-6 overflow-x-auto">
          <h2 className="text-2xl font-bold text-[#28c76f] mb-3 flex items-center gap-2"><span>📊</span> All Companies</h2>
          <table className="min-w-full text-xs sm:text-base">
            <thead>
              <tr className="text-[#28c76f] border-b border-[#28c76f]/20">
                <th className="px-3 py-2 text-left">Company</th>
                <th className="px-3 py-2 text-left">Profile</th>
                <th className="px-3 py-2 text-left">Section</th>
                <th className="px-3 py-2 text-left">Expires On</th>
                <th className="px-3 py-2 text-left">Total Token Bet</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {companies.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-3 py-4 text-center text-gray-400">No companies added yet. Add your first company!</td>
                </tr>
              ) : companies.map(company => {
                const actualStatus = company.status || 'active';
                const statusColor = actualStatus === 'active' ? 'bg-[#28c76f]' : 'bg-red-500';
                const statusText = actualStatus;
                return (
                  <tr key={company._id} className="border-b border-[#28c76f]/10">
                    <td className="px-3 py-2">{company.companyName}</td>
                    <td className="px-3 py-2">{company.jobProfile}</td>
                    <td className="px-3 py-2">{company.liveEventSection || 'N/A'}</td>
                    <td className="px-3 py-2">{company.expiresAt ? new Date(company.expiresAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-3 py-2">{getTotalTokens(company).toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <span className={`${statusColor} text-white px-3 py-1 rounded-full font-bold text-sm`}>
                        {statusText}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button 
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-1 rounded-lg text-sm"
                          onClick={() => {
                            setSelectedCompany({
                              id: company._id,
                              _id: company._id,
                              name: company.companyName,
                              role: company.jobProfile,
                              expiresOn: company.expiresAt ? new Date(company.expiresAt).toISOString().slice(0,10) : '',
                              logo: company.companyLogo,
                              liveEventSection: company.liveEventSection,
                              status: company.status,
                              candidates: company.candidates
                            });
                            setShowEditModal(true);
                          }}
                        >
                          Edit
                        </button>
                        {actualStatus === 'expired' && (
                          <button 
                            className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-sm"
                            onClick={() => {
                              setSelectedCompany(company);
                              setShowResultsModal(true);
                            }}
                          >
                            Results
                          </button>
                        )}
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-lg text-sm"
                          onClick={async () => {
                            if (!window.confirm('Delete this company and all its bets?')) return;
                            try {
                              await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/companies/${company._id || company.id}`, { headers: { 'x-auth-token': localStorage.getItem('token') || '' } });
                              setRefresh(r => r + 1);
                            } catch (err) {
                              console.error(err);
                              alert('Failed to delete company');
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Expired Bets Management Section */}
        <div className="hidden">
          <h2 className="text-2xl font-bold text-red-400 mb-3 flex items-center gap-2"><span>⏰</span> Expired Bets - Update Results</h2>
          <div className="text-gray-300 mb-4">Companies with expired betting periods. Update candidate results to finalize payouts.</div>
          <table className="min-w-full text-xs sm:text-base">
            <thead>
              <tr className="text-red-400 border-b border-red-400/20">
                <th className="px-3 py-2 text-left">Company</th>
                <th className="px-3 py-2 text-left">Profile</th>
                <th className="px-3 py-2 text-left">Expired On</th>
                <th className="px-3 py-2 text-left">Candidates</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {companies.filter(c => {
                // Only show companies with declared results
                return c.candidates && c.candidates.some(cand => cand.result !== 'awaited');
              }).length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-3 py-4 text-center text-gray-400">No companies with declared results found.</td>
                </tr>
              ) : companies.filter(c => {
                // Only show companies with declared results
                return c.candidates && c.candidates.some(cand => cand.result !== 'awaited');
              }).map(company => {
                const hasResults = company.candidates && company.candidates.some(c => c.result !== 'awaited');
                return (
                  <tr key={company._id} className="border-b border-red-400/10">
                    <td className="px-3 py-2">{company.companyName}</td>
                    <td className="px-3 py-2">{company.jobProfile}</td>
                    <td className="px-3 py-2">{company.expiresAt ? new Date(company.expiresAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-3 py-2">{company.candidates?.length || 0} candidates</td>
                    <td className="px-3 py-2">
                      <span className={`${hasResults ? 'bg-green-500' : 'bg-red-500'} text-white px-3 py-1 rounded-full font-bold text-sm`}>
                        {hasResults ? 'Results Updated' : 'Pending Results'}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button 
                        className={`bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-sm`}
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowResultsModal(true);
                        }}
                      >
                        Update Results
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Individuals Management Section */}
        <div className="hidden">
          <h2 className="text-2xl font-bold text-purple-400 mb-3 flex items-center gap-2"><span>👥</span> All Individuals</h2>
          
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-purple-300 font-bold mb-2 text-sm">🔍 Search</label>
              <input
                type="text"
                placeholder="Search by name or enrollment..."
                value={individualSearchTerm}
                onChange={(e) => setIndividualSearchTerm(e.target.value)}
                className="w-full bg-[#0f1414] border-2 border-purple-400/40 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-purple-300 font-bold mb-2 text-sm">📊 Status</label>
              <select
                value={individualStatusFilter}
                onChange={(e) => setIndividualStatusFilter(e.target.value)}
                className="w-full bg-[#0f1414] border-2 border-purple-400/40 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-400 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="available">Available</option>
              </select>
            </div>
            <div>
              <label className="block text-purple-300 font-bold mb-2 text-sm">🎓 Branch</label>
              <select
                value={individualBranchFilter}
                onChange={(e) => setIndividualBranchFilter(e.target.value)}
                className="w-full bg-[#0f1414] border-2 border-purple-400/40 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-400 focus:outline-none"
              >
                <option value="all">All Branches</option>
                {Array.from(new Set(mockCandidates.map(c => c.branch))).sort().map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setIndividualSearchTerm("");
                  setIndividualStatusFilter("all");
                  setIndividualBranchFilter("all");
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
              >
                🗑️ Clear Filters
              </button>
            </div>
          </div>

          <div className="text-gray-300 mb-4">
            Manage all individuals in the system. 
            Total: {mockCandidates.length} candidates | 
            Showing: {(() => {
              const filtered = mockCandidates.filter(candidate => {
                const matchesSearch = !individualSearchTerm || 
                  candidate.name.toLowerCase().includes(individualSearchTerm.toLowerCase()) ||
                  candidate.enrollment.toLowerCase().includes(individualSearchTerm.toLowerCase());
                
                const matchesStatus = individualStatusFilter === "all" ||
                  (individualStatusFilter === "shortlisted" && candidate.shortlistedIn.length > 0) ||
                  (individualStatusFilter === "available" && candidate.shortlistedIn.length === 0);
                
                const matchesBranch = individualBranchFilter === "all" ||
                  candidate.branch.includes(individualBranchFilter);
                
                return matchesSearch && matchesStatus && matchesBranch;
              });
              return filtered.length;
            })()} filtered
          </div>

          <table className="min-w-full text-xs sm:text-base">
            <thead>
              <tr className="text-purple-400 border-b border-purple-400/20">
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Enrollment</th>
                <th className="px-3 py-2 text-left">Branch</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Shortlisted In</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {(() => {
                const filtered = mockCandidates.filter(candidate => {
                  const matchesSearch = !individualSearchTerm || 
                    candidate.name.toLowerCase().includes(individualSearchTerm.toLowerCase()) ||
                    candidate.enrollment.toLowerCase().includes(individualSearchTerm.toLowerCase());
                  
                  const matchesStatus = individualStatusFilter === "all" ||
                    (individualStatusFilter === "shortlisted" && candidate.shortlistedIn.length > 0) ||
                    (individualStatusFilter === "available" && candidate.shortlistedIn.length === 0);
                  
                  const matchesBranch = individualBranchFilter === "all" ||
                    candidate.branch.includes(individualBranchFilter);
                  
                  return matchesSearch && matchesStatus && matchesBranch;
                });

                if (filtered.length === 0) {
                  return (
                    <tr>
                      <td colSpan="6" className="px-3 py-4 text-center text-gray-400">
                        No individuals found matching the current filters.
                      </td>
                    </tr>
                  );
                }

                return filtered.slice(0, 20).map(candidate => {
                  const shortlistedCompanies = candidate.shortlistedIn.map(companyId => {
                    const company = mockCompanies.find(c => c.id === companyId);
                    return company ? company.name : companyId;
                  }).join(', ');
                  
                  return (
                    <tr key={candidate.id} className="border-b border-purple-400/10">
                      <td className="px-3 py-2 font-semibold">{candidate.name}</td>
                      <td className="px-3 py-2 text-purple-300">{candidate.enrollment}</td>
                      <td className="px-3 py-2">{candidate.branch}</td>
                      <td className="px-3 py-2 text-purple-300">{candidate.email || 'N/A'}</td>
                      <td className="px-3 py-2">
                        <span className="text-sm text-gray-300">
                          {shortlistedCompanies || 'None'}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`${candidate.shortlistedIn.length > 0 ? 'bg-green-500' : 'bg-gray-500'} text-white px-3 py-1 rounded-full font-bold text-sm`}>
                          {candidate.shortlistedIn.length > 0 ? 'Shortlisted' : 'Available'}
                        </span>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
          {(() => {
            const filtered = mockCandidates.filter(candidate => {
              const matchesSearch = !individualSearchTerm || 
                candidate.name.toLowerCase().includes(individualSearchTerm.toLowerCase()) ||
                candidate.enrollment.toLowerCase().includes(individualSearchTerm.toLowerCase());
              
              const matchesStatus = individualStatusFilter === "all" ||
                (individualStatusFilter === "shortlisted" && candidate.shortlistedIn.length > 0) ||
                (individualStatusFilter === "available" && candidate.shortlistedIn.length === 0);
              
              const matchesBranch = individualBranchFilter === "all" ||
                candidate.branch.includes(individualBranchFilter);
              
              return matchesSearch && matchesStatus && matchesBranch;
            });
            
            return filtered.length > 20 && (
              <div className="text-center mt-4 text-gray-400 text-sm">
                Showing first 20 of {filtered.length} filtered individuals. Total: {mockCandidates.length}
              </div>
            );
          })()}
        </div>

        {/* Candidate Management Section */}
        <div className="bg-[#181f1f] rounded-2xl shadow-lg p-4 border-2 border-[#28c76f]/40 mb-6 overflow-x-auto">
          <h2 className="text-2xl font-bold text-[#28c76f] mb-3 flex items-center gap-2"><span>👥</span> Manage Candidates</h2>
          
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-[#28c76f] font-bold mb-2 text-sm">🔍 Search</label>
              <input
                type="text"
                placeholder="Search by name or enrollment..."
                value={candidateSearchTerm}
                onChange={(e) => setCandidateSearchTerm(e.target.value)}
                className="w-full bg-[#0f1414] border-2 border-[#28c76f]/40 rounded-lg px-3 py-2 text-white text-sm focus:border-[#28c76f] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#28c76f] font-bold mb-2 text-sm">🎓 Branch</label>
              <select
                value={candidateBranchFilter}
                onChange={(e) => setCandidateBranchFilter(e.target.value)}
                className="w-full bg-[#0f1414] border-2 border-[#28c76f]/40 rounded-lg px-3 py-2 text-white text-sm focus:border-[#28c76f] focus:outline-none"
              >
                <option value="all">All Branches</option>
                {Array.from(new Set(
                  candidates
                    .map(c => c.branch)
                    .filter(Boolean)
                    .map(branch => {
                      // Clean up branch names - remove course prefixes like "IDD (Engineering Physics)" -> "Engineering Physics"
                      if (branch.includes('(') && branch.includes(')')) {
                        return branch.replace(/^[^(]+\(([^)]+)\)$/, '$1').trim();
                      }
                      return branch;
                    })
                )).sort().map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setCandidateSearchTerm("");
                  setCandidateBranchFilter("all");
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
              >
                🗑️ Clear Filters
              </button>
            </div>
          </div>

          <div className="text-gray-300 mb-4">
            Manage all candidates in the system. 
            Total: {candidates.length} candidates | 
            Showing: {(() => {
              const filtered = candidates.filter(candidate => {
                const matchesSearch = !candidateSearchTerm || 
                  candidate.name?.toLowerCase().includes(candidateSearchTerm.toLowerCase()) ||
                  candidate.enrollmentNumber?.toLowerCase().includes(candidateSearchTerm.toLowerCase());
                
                const matchesBranch = candidateBranchFilter === "all" || (() => {
                  if (!candidate.branch) return false;
                  // Clean up candidate's branch name for comparison
                  let candidateBranch = candidate.branch;
                  if (candidateBranch.includes('(') && candidateBranch.includes(')')) {
                    candidateBranch = candidateBranch.replace(/^[^(]+\(([^)]+)\)$/, '$1').trim();
                  }
                  return candidateBranch === candidateBranchFilter;
                })();
                
                return matchesSearch && matchesBranch;
              });
              return filtered.length;
            })()} filtered
          </div>

          <table className="min-w-full text-xs sm:text-base">
            <thead>
              <tr className="text-[#28c76f] border-b border-[#28c76f]/20">
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Enrollment</th>
                <th className="px-3 py-2 text-left">Course</th>
                <th className="px-3 py-2 text-left">Branch</th>
                <th className="px-3 py-2 text-left">Shortlisted In</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {(() => {
                const filtered = candidates.filter(candidate => {
                  const matchesSearch = !candidateSearchTerm || 
                    candidate.name?.toLowerCase().includes(candidateSearchTerm.toLowerCase()) ||
                    candidate.enrollmentNumber?.toLowerCase().includes(candidateSearchTerm.toLowerCase());
                  
                  const matchesBranch = candidateBranchFilter === "all" || (() => {
                    if (!candidate.branch) return false;
                    // Clean up candidate's branch name for comparison
                    let candidateBranch = candidate.branch;
                    if (candidateBranch.includes('(') && candidateBranch.includes(')')) {
                      candidateBranch = candidateBranch.replace(/^[^(]+\(([^)]+)\)$/, '$1').trim();
                    }
                    return candidateBranch === candidateBranchFilter;
                  })();
                  
                  return matchesSearch && matchesBranch;
                });

                if (filtered.length === 0) {
                  return (
                    <tr>
                      <td colSpan="6" className="px-3 py-4 text-center text-gray-400">
                        No candidates found matching the current filters.
                      </td>
                    </tr>
                  );
                }

                return filtered.map(candidate => {
                  // Get shortlisted companies with proper handling of different data structures
                  const getShortlistedCompanies = (candidate) => {
                    const shortlistedCompanies = [];
                    
                    // Method 1: Try to get names from populated shortlistedIn data
                    if (candidate.shortlistedIn && Array.isArray(candidate.shortlistedIn)) {
                      candidate.shortlistedIn.forEach(entry => {
                        if (entry && typeof entry === 'object') {
                          // If it's a populated object with companyName
                          if (entry.companyName) {
                            shortlistedCompanies.push(entry.companyName);
                          } else if (entry._id) {
                            // If it's an object with just _id, try to find the company
                            const company = companies.find(c => c._id === entry._id);
                            if (company) {
                              shortlistedCompanies.push(company.companyName);
                            }
                          }
                        } else if (typeof entry === 'string') {
                          // If it's a string (ObjectId), try to find the company
                          const company = companies.find(c => c._id === entry);
                          if (company) {
                            shortlistedCompanies.push(company.companyName);
                          }
                        }
                      });
                    }
                    
                    // Method 2: If no names found from shortlistedIn, try to compute from events data (fallback)
                    if (shortlistedCompanies.length === 0 && companies.length > 0) {
                      const candidateId = candidate._id || candidate.id;
                      const candidateEnrollment = candidate.enrollmentNumber;
                      
                      for (const company of companies) {
                        if (company.candidates && Array.isArray(company.candidates)) {
                          const isCandidateInCompany = company.candidates.some(c => {
                            const cId = c._id || c.id || c;
                            const cEnrollment = c.enrollmentNumber || c.enrollment;
                            return cId === candidateId || cEnrollment === candidateEnrollment;
                          });
                          
                          if (isCandidateInCompany) {
                            const companyName = company.companyName;
                            if (companyName && !shortlistedCompanies.includes(companyName)) {
                              shortlistedCompanies.push(companyName);
                            }
                          }
                        }
                      }
                    }
                    
                    // Method 3: If still no companies found, try to check if candidate is in any company's candidates array
                    if (shortlistedCompanies.length === 0 && companies.length > 0) {
                      const candidateId = candidate._id || candidate.id;
                      const candidateEnrollment = candidate.enrollmentNumber;
                      
                      for (const company of companies) {
                        // Check if candidate is in the company's candidates array
                        if (company.candidates && Array.isArray(company.candidates)) {
                          const isInCompany = company.candidates.some(c => {
                            if (typeof c === 'object' && c._id) {
                              return c._id === candidateId || c.enrollmentNumber === candidateEnrollment;
                            } else if (typeof c === 'string') {
                              return c === candidateId;
                            }
                            return false;
                          });
                          
                          if (isInCompany) {
                            const companyName = company.companyName;
                            if (companyName && !shortlistedCompanies.includes(companyName)) {
                              shortlistedCompanies.push(companyName);
                            }
                          }
                        }
                      }
                    }
                    
                    return shortlistedCompanies;
                  };

                  const shortlistedCompanies = getShortlistedCompanies(candidate);
                  const shortlistedCompaniesText = shortlistedCompanies.length > 0 
                    ? shortlistedCompanies.join(', ') 
                    : 'None';
                  
                  // Clean up branch name for display
                  let displayBranch = candidate.branch || 'N/A';
                  if (displayBranch !== 'N/A' && displayBranch.includes('(') && displayBranch.includes(')')) {
                    displayBranch = displayBranch.replace(/^[^(]+\(([^)]+)\)$/, '$1').trim();
                  }
                  
                  return (
                    <tr key={candidate._id} className="border-b border-[#28c76f]/10">
                      <td className="px-3 py-2 font-semibold">{candidate.name || 'N/A'}</td>
                      <td className="px-3 py-2 text-[#28c76f]">{candidate.enrollmentNumber || 'N/A'}</td>
                      <td className="px-3 py-2">{candidate.course || 'N/A'}</td>
                      <td className="px-3 py-2">{displayBranch}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-300">
                            {shortlistedCompaniesText}
                          </span>
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white font-bold px-2 py-1 rounded text-xs"
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setShowEditShortlistModal(true);
                            }}
                            title="Edit Shortlist"
                          >
                            📋
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <button 
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-1 rounded-lg text-sm"
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setShowEditCandidateModal(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-lg text-sm"
                            onClick={() => handleDeleteCandidate(candidate._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
} 