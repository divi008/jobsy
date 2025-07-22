import React, { useState, useEffect } from "react";
import PageLayout from "./PageLayout";
import { mockCompanies, mockCandidates, mockBets, adminCarouselCompanyIds } from "./mockData";
import { mockUsers } from "./mockUsers";
import { branches } from "./mockData";

// Add Individual Modal Component
function AddIndividualModal({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    enrollment: '',
    branch: '',
    email: ''
  });
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkForDuplicates = (name, enrollment, email) => {
    setIsChecking(true);
    const duplicates = [];

    // Check in mockCandidates - only check enrollment numbers
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

    // Remove duplicates based on enrollment
    const uniqueDuplicates = duplicates.filter((dup, index, self) => 
      index === self.findIndex(d => 
        (d.data.enrollment && d.data.enrollment === dup.data.enrollment) ||
        (d.data.id && d.data.id === dup.data.id)
      )
    );

    setDuplicateWarning(uniqueDuplicates.length > 0 ? uniqueDuplicates : null);
    setIsChecking(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Check for duplicates when enrollment changes
    if (field === 'enrollment') {
      const newData = { ...formData, [field]: value };
      // Check for duplicates if we have the enrollment field
      if (newData[field] && newData[field].trim()) {
        checkForDuplicates(newData.name || '', newData.enrollment || '', newData.email || '');
      } else {
        setDuplicateWarning(null);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (duplicateWarning && duplicateWarning.length > 0) {
      alert('Please resolve duplicate entries before adding the individual.');
      return;
    }
    onSubmit(formData);
    setFormData({ name: '', enrollment: '', branch: '', email: '' });
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
              <label className="block text-[#28c76f] font-bold mb-2">Branch *</label>
              <select
                value={formData.branch}
                onChange={(e) => handleInputChange('branch', e.target.value)}
                className="w-full bg-[#0f1414] border-2 border-[#28c76f]/40 rounded-lg px-4 py-3 text-white focus:border-[#28c76f] focus:outline-none"
                required
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
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
              <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-4">
                <div className="text-red-400 font-bold mb-2 flex items-center gap-2">
                  <span>⚠️</span> Duplicate Found!
                </div>
                <div className="text-red-300 text-sm space-y-2">
                  {duplicateWarning.map((dup, idx) => (
                    <div key={idx} className="bg-red-500/10 p-2 rounded">
                      <div className="font-semibold">{dup.type}: {dup.data.name}</div>
                      <div className="text-xs opacity-80">
                        {dup.reason}: {dup.reason === 'Name' ? dup.data.name :
                                      dup.reason === 'Enrollment' ? dup.data.enrollment || dup.data.id :
                                      dup.data.email}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-red-200 text-xs mt-2">
                  Please use a different name, enrollment number, or email address.
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={duplicateWarning && duplicateWarning.length > 0}
                className="flex-1 bg-[#28c76f] hover:bg-[#22b36a] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
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
  const [companyName, setCompanyName] = useState(company?.name || "");
  const [profile, setProfile] = useState(company?.role || "");
  const [expiresOn, setExpiresOn] = useState(company?.expiresOn || "");
  const [logoUrl, setLogoUrl] = useState(company?.logoUrl || "");
  const [liveEventSection, setLiveEventSection] = useState(company?.liveEventSection || "");
  const [status, setStatus] = useState(company?.status || "active");
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({ name: '', enrollment: '', course: '', branch: '', forTokens: 0, againstTokens: 0 });
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  useEffect(() => {
    if (company) {
      setCompanyName(company.name || "");
      setProfile(company.role || "");
      setExpiresOn(company.expiresOn || "");
      setLogoUrl(company.logo || "");
      setLiveEventSection(company.liveEventSection || "");
      
      // Determine status based on whether results are declared
      const hasResultsDeclared = company.candidates && company.candidates.some(c => c.result !== 'awaited');
      setStatus(hasResultsDeclared ? 'expired' : 'active');
      
      // Load candidates for this company with proper names and details
      const companyCandidates = (company.shortlist || []).map(candidateId => {
        const candidate = mockCandidates.find(c => c.id === candidateId);
        const existingResult = company.candidates?.find(c => c.enrollment === candidate?.enrollment)?.result || 'awaited';
        return {
          enrollment: candidate?.enrollment || candidateId,
          name: candidate?.name || candidateId,
          branch: candidate?.branch || 'N/A',
          result: existingResult
        };
      });
      setCandidates(companyCandidates);
    }
  }, [company]);

  function handleResultChange(enrollment, result) {
    setCandidates(prev => prev.map(c => 
      c.enrollment === enrollment ? { ...c, result } : c
    ));
  }

  function handleNewCandidateChange(field, value) {
    setNewCandidate(prev => ({ ...prev, [field]: value }));
    
    // Auto-fill existing data when enrollment matches
    if (field === 'enrollment' && value.trim()) {
      // Check in global candidates
      const existingCandidate = mockCandidates.find(c => c.enrollment === value);
      if (existingCandidate) {
        // Extract course and branch from combined format
        const branchParts = existingCandidate.branch.split('(');
        const course = branchParts[0]?.trim() || '';
        const branch = branchParts[1]?.replace(')', '') || existingCandidate.branch;
        
        setNewCandidate(prev => ({
          ...prev,
          name: existingCandidate.name,
          course: course,
          branch: branch,
          enrollment: value
        }));
        setDuplicateWarning('Candidate found in database. Details auto-filled.');
        return;
      }
      
      // Check in global users
      const existingUser = mockUsers.find(u => u.id === value);
      if (existingUser) {
        setNewCandidate(prev => ({
          ...prev,
          name: existingUser.name,
          enrollment: value
        }));
        setDuplicateWarning('User found in database. Name auto-filled.');
        return;
      }
    }
    
    // Duplicate detection in current shortlist - only check enrollment numbers
    if (field === 'enrollment') {
      const enrollmentExists = candidates.some(c => c.enrollment === value);
      if (enrollmentExists) {
        setDuplicateWarning('Candidate with this enrollment number already exists in the shortlist.');
      } else {
        setDuplicateWarning(null);
      }
    }
  }

  function handleAddCandidateInline() {
    if (!newCandidate.name || !newCandidate.enrollment || !newCandidate.course || !newCandidate.branch) return;
    if (duplicateWarning && !duplicateWarning.includes('found in database')) return;
    
    // Combine course and branch into "Course (Branch)" format
    let combinedBranch = "";
    if (newCandidate.course && newCandidate.branch) {
      combinedBranch = `${newCandidate.course} (${newCandidate.branch})`;
    } else if (newCandidate.course) {
      combinedBranch = newCandidate.course;
    } else if (newCandidate.branch) {
      combinedBranch = newCandidate.branch;
    } else {
      combinedBranch = "Unknown";
    }
    
    // Add to global candidates if not present
    let candidate = mockCandidates.find(c => c.enrollment === newCandidate.enrollment);
    if (!candidate) {
      candidate = {
        id: `cand${mockCandidates.length + 1}`,
        name: newCandidate.name,
        enrollment: newCandidate.enrollment,
        branch: combinedBranch,
        shortlistedIn: [company.id]
      };
      mockCandidates.push(candidate);
    } else {
      // Update existing candidate's branch if provided
      if (combinedBranch !== "Unknown") {
        candidate.branch = combinedBranch;
      }
      if (!candidate.shortlistedIn.includes(company.id)) {
        candidate.shortlistedIn.push(company.id);
      }
    }
    
    // Add to global users if not present
    let user = mockUsers.find(u => u.id === newCandidate.enrollment);
    if (!user) {
      mockUsers.push({
        id: newCandidate.enrollment,
        name: newCandidate.name,
        email: newCandidate.name.toLowerCase().replace(/[^a-z]/g, ".") + ".got21@itbhu.ac.in",
        tokens: 100000,
        successRate: 75,
        bets: []
      });
    }
    
    // Update company's shortlist to include the new candidate
    if (!company.shortlist.includes(candidate.id)) {
      company.shortlist.push(candidate.id);
    }
    
    // Add to this company's candidates list if not present
    setCandidates(prev => [
      ...prev,
      {
        enrollment: newCandidate.enrollment,
        name: newCandidate.name,
        branch: combinedBranch,
        forTokens: newCandidate.forTokens,
        againstTokens: newCandidate.againstTokens,
        result: 'awaited'
      }
    ]);
    
    // Force refresh to update betting cards and other components
    if (onRefresh) {
      onRefresh();
    }
    
    setNewCandidate({ name: '', enrollment: '', course: '', branch: '', forTokens: 0, againstTokens: 0 });
    setDuplicateWarning(null);
  }

  function handleSubmit() {
    // Check if any candidate has been selected or not selected
    const hasResults = candidates.some(c => c.result !== 'awaited');
    const newStatus = hasResults ? 'expired' : status;
    
    onSubmit({ 
      id: company.id,
      name: companyName, 
      role: profile, 
      expiresOn, 
      logoUrl, 
      liveEventSection,
      status: newStatus,
      candidates: candidates
    });
    onClose();
  }

  if (!open) return null;
  return (
    <>
      <AddIndividualModal 
        open={false} // This modal is no longer used for inline adding
        onClose={() => {}}
        onSubmit={() => {}}
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
        <h2 className="text-3xl font-bold text-[#28c76f] mb-4">Edit Company</h2>
        {/* Add Individual Button */}
        <div className="flex justify-end mb-2">
          <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-base shadow" onClick={() => {
            // This button is no longer needed for inline adding
            // setShowAddIndividualModal(true); 
          }}>
            <span className="text-xl">👤</span> Add Individual
          </button>
        </div>
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

        {/* Candidates Section */}
        <h3 className="text-xl font-bold text-[#28c76f] mb-2 mt-4">Shortlisted Candidates</h3>
        <div className="bg-[#232b2b] rounded-xl p-4 border border-[#28c76f]/30 mb-4 shadow-inner max-h-60 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 text-white font-semibold">
            <input className="bg-[#181f1f] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" placeholder="Name" value={newCandidate.name} onChange={e => handleNewCandidateChange('name', e.target.value)} />
            <input className="bg-[#181f1f] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" placeholder="Enrollment" value={newCandidate.enrollment} onChange={e => handleNewCandidateChange('enrollment', e.target.value)} />
            <select className="bg-[#181f1f] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" value={newCandidate.course} onChange={e => handleNewCandidateChange('course', e.target.value)}>
              <option value="">Select Course</option>
              <option value="B.Tech">B.Tech</option>
              <option value="IDD">IDD</option>
              <option value="M.Tech">M.Tech</option>
              <option value="M.Sc">M.Sc</option>
              <option value="B.Sc">B.Sc</option>
              <option value="PhD">PhD</option>
            </select>
            <select className="bg-[#181f1f] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" value={newCandidate.branch} onChange={e => handleNewCandidateChange('branch', e.target.value)} disabled={!newCandidate.course}>
              <option value="">Select Branch</option>
              {newCandidate.course && (
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
            <input className="bg-[#181f1f] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" placeholder="For Tokens" type="number" value={newCandidate.forTokens} onChange={e => handleNewCandidateChange('forTokens', e.target.value)} />
            <input className="bg-[#181f1f] border border-[#28c76f]/30 rounded-lg px-3 py-2 text-white" placeholder="Against Tokens" type="number" value={newCandidate.againstTokens} onChange={e => handleNewCandidateChange('againstTokens', e.target.value)} />
            <button className="bg-[#28c76f] hover:bg-[#22b36a] text-white font-bold px-3 py-2 rounded-lg" onClick={handleAddCandidateInline} disabled={(duplicateWarning && !duplicateWarning.includes('found in database')) || !newCandidate.name || !newCandidate.enrollment || !newCandidate.course || !newCandidate.branch}>Add</button>
          </div>
                      {duplicateWarning && (
              <div className={`mb-2 ${duplicateWarning.includes('found in database') ? 'text-green-400' : 'text-red-400'}`}>
                {duplicateWarning}
              </div>
            )}
          {candidates.length === 0 ? (
            <div className="text-gray-400 text-center py-4">No candidates shortlisted</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-white font-semibold">
              <div>Candidate Name</div>
              <div>Enrollment</div>
              <div>Branch</div>
              <div>Result</div>
            </div>
          )}
          {candidates.map((candidate, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 p-3 bg-[#181f1f] rounded-lg">
              <div className="text-white font-semibold">{candidate.name}</div>
              <div className="text-gray-300">{candidate.enrollment}</div>
              <div className="text-gray-400">{candidate.branch}</div>
              <div>
                <select 
                  className="w-full bg-[#232b2b] border border-[#28c76f]/40 rounded-lg px-3 py-2 text-white" 
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
      // Load candidates with proper names and details
      const companyCandidates = (company.shortlist || []).map(candidateId => {
        const candidate = mockCandidates.find(c => c.id === candidateId);
        const existingResult = company.candidates?.find(c => c.enrollment === candidate?.enrollment)?.result || 'awaited';
        return {
          enrollment: candidate?.enrollment || candidateId,
          name: candidate?.name || candidateId,
          branch: candidate?.branch || 'N/A',
          result: existingResult
        };
      });
      setCandidates(companyCandidates);
    }
  }, [company]);

  function handleResultChange(enrollment, result) {
    setCandidates(prev => prev.map(c => 
      c.enrollment === enrollment ? { ...c, result } : c
    ));
  }

  function handleSubmit() {
    onSubmit(company.id, candidates);
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
        <h2 className="text-3xl font-bold text-red-400 mb-4">Update Results - {company?.name}</h2>
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

export default function AdminPanel({ user, showUserGuideModal, setShowUserGuideModal, showAnnouncement, setShowAnnouncement, announcementIdx, announcements, isSliding }) {
  // Only allow Jon Snow (admin) to view this page
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showAddIndividualModal, setShowAddIndividualModal] = useState(false);
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  // Local state to force refresh after adding company
  const [refresh, setRefresh] = useState(0);
  // Filter states for individuals table
  const [individualSearchTerm, setIndividualSearchTerm] = useState("");
  const [individualStatusFilter, setIndividualStatusFilter] = useState("all");
  const [individualBranchFilter, setIndividualBranchFilter] = useState("all");
  
  // Load companies on component mount and refresh
  useEffect(() => {
    setCompanies([...mockCompanies]);
  }, [refresh]);

  const isAdmin = user && user.name === 'Jon Snow';
  if (!isAdmin) {
    return (
      <PageLayout user={user}>
        <div className="w-full max-w-2xl min-h-[200px] bg-[#181f1f] rounded-2xl shadow-lg flex items-center justify-center border-2 border-red-400/30 mt-10">
          <span className="text-2xl text-red-500 font-bold">403 - Not Authorized</span>
        </div>
      </PageLayout>
    );
  }

  const handleAddCompany = (newCompany) => {
    // Add company to mockCompanies (in-place for demo)
    const companyData = {
      id: newCompany.companyName.toLowerCase().replace(/[^a-z0-9]/g, ""),
      name: newCompany.companyName,
      role: newCompany.profile,
      expiresOn: newCompany.expiresOn,
      liveEventSection: newCompany.liveEventSection,
      logo: newCompany.logoUrl || "",
      shortlist: newCompany.individuals.map(ind => ind.enrollment),
      status: 'active', // Default status
      candidates: newCompany.individuals.map(ind => ({
        enrollment: ind.enrollment,
        name: ind.name,
        result: 'awaited' // Default result
      }))
    };
    mockCompanies.push(companyData);
    
    // Add or update individuals in mockCandidates
    newCompany.individuals.forEach(ind => {
      let candidate = mockCandidates.find(c => c.enrollment === ind.enrollment);
      
      // Combine course and branch into "Course (Branch)" format
      let combinedBranch = "";
      if (ind.course && ind.branch) {
        combinedBranch = `${ind.course} (${ind.branch})`;
      } else if (ind.course) {
        combinedBranch = ind.course;
      } else if (ind.branch) {
        combinedBranch = ind.branch;
      } else {
        combinedBranch = "Unknown";
      }
      
      if (!candidate) {
        // Add new candidate
        mockCandidates.push({
          id: `cand${mockCandidates.length + 1}`,
          name: ind.name,
          enrollment: ind.enrollment,
          branch: combinedBranch,
          shortlistedIn: [newCompany.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")]
        });
      } else {
        // Update existing candidate's branch if provided
        if (combinedBranch !== "Unknown") {
          candidate.branch = combinedBranch;
        }
        // Add company to their shortlist if not already present
        if (!candidate.shortlistedIn.includes(newCompany.companyName.toLowerCase().replace(/[^a-z0-9]/g, ""))) {
          candidate.shortlistedIn.push(newCompany.companyName.toLowerCase().replace(/[^a-z0-9]/g, ""));
        }
      }
    });
    setRefresh(r => r + 1); // Force re-render
  };

  const handleEditCompany = (updatedCompany) => {
    const index = mockCompanies.findIndex(c => c.id === updatedCompany.id);
    if (index !== -1) {
      // Check if any candidate has been selected or not selected
      const hasResultsDeclared = updatedCompany.candidates && updatedCompany.candidates.some(c => c.result !== 'awaited');
      const newStatus = hasResultsDeclared ? 'expired' : 'active';
      
      // Update company data
      mockCompanies[index] = { 
        ...mockCompanies[index], 
        ...updatedCompany,
        logo: updatedCompany.logoUrl || mockCompanies[index].logo || "",
        status: newStatus
      };
      
      // Update candidate data in mockCandidates if results changed
      if (updatedCompany.candidates) {
        updatedCompany.candidates.forEach(updatedCandidate => {
          const candidateIndex = mockCandidates.findIndex(c => c.enrollment === updatedCandidate.enrollment);
          if (candidateIndex !== -1) {
            // Update the candidate's result in the global data
            if (!mockCandidates[candidateIndex].results) {
              mockCandidates[candidateIndex].results = {};
            }
            mockCandidates[candidateIndex].results[updatedCompany.id] = updatedCandidate.result;
          }
        });
      }
      
      setRefresh(r => r + 1);
    }
  };

  const handleUpdateResults = (companyId, results) => {
    const index = mockCompanies.findIndex(c => c.id === companyId);
    if (index !== -1) {
      mockCompanies[index].candidates = results;
      mockCompanies[index].status = 'expired';
      setRefresh(r => r + 1);
    }
  };

  const handleAddIndividual = (newIndividual) => {
    // Check if individual already exists
    let candidate = mockCandidates.find(c => c.enrollment === newIndividual.enrollment);
    
    if (!candidate) {
      // Add new candidate
      candidate = {
        id: `cand${mockCandidates.length + 1}`,
        name: newIndividual.name,
        enrollment: newIndividual.enrollment,
        branch: newIndividual.branch,
        email: newIndividual.email,
        shortlistedIn: [] // No companies shortlisted yet
      };
      mockCandidates.push(candidate);
      
      // Also add to mockUsers if not exists
      const existingUser = mockUsers.find(u => u.id === newIndividual.enrollment);
      if (!existingUser) {
        const newUser = {
          id: newIndividual.enrollment,
          name: newIndividual.name,
          email: newIndividual.email,
          tokens: 100000, // Default tokens
          successRate: 75, // Default success rate
          bets: [] // No bets yet
        };
        mockUsers.push(newUser);
      }
      
      alert(`✅ Individual "${newIndividual.name}" added successfully!`);
    } else {
      // Update existing candidate's information
      candidate.name = newIndividual.name;
      candidate.branch = newIndividual.branch;
      candidate.email = newIndividual.email;
      
      alert(`✅ Individual "${newIndividual.name}" information updated!`);
    }
    
    setRefresh(r => r + 1); // Force re-render
  };

  const handleUpdateCarousel = (selectedCompanyIds) => {
    // Update the global carousel company IDs
    adminCarouselCompanyIds.length = 0;
    adminCarouselCompanyIds.push(...selectedCompanyIds);
    
    alert(`✅ Carousel updated with ${selectedCompanyIds.length} companies!`);
    setRefresh(r => r + 1); // Force re-render
  };

  const getTotalTokens = (company) => {
    // Calculate total tokens bet on this company from actual bets
    return mockBets.filter(bet => bet.companyId === company.id)
      .reduce((sum, bet) => sum + (Number(bet.amount) || 0), 0);
  };

  const isExpired = (expiresOn) => {
    if (!expiresOn) return false;
    const today = new Date();
    const expiryDate = new Date(expiresOn);
    return today > expiryDate;
  };

  return (
    <PageLayout
      user={user}
      onUserGuide={() => setShowUserGuideModal(true)}
      showAnnouncement={showAnnouncement}
      setShowAnnouncement={setShowAnnouncement}
      announcementIdx={announcementIdx}
      announcements={announcements}
      isSliding={isSliding}
    >
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
      <div className="w-full max-w-6xl mx-auto mt-4">
        <h1 className="text-4xl font-extrabold text-[#28c76f] mb-4 text-center">Betting Admin Panel</h1>
        <div className="flex justify-between mb-4 gap-2">
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
          <table className="min-w-full text-base">
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
                // Determine status based on whether results are declared
                const hasResultsDeclared = company.candidates && company.candidates.some(c => c.result !== 'awaited');
                const actualStatus = hasResultsDeclared ? 'expired' : 'active';
                const statusColor = actualStatus === 'active' ? 'bg-[#28c76f]' : 'bg-red-500';
                const statusText = actualStatus;
                return (
                  <tr key={company.id} className="border-b border-[#28c76f]/10">
                    <td className="px-3 py-2">{company.name}</td>
                    <td className="px-3 py-2">{company.role}</td>
                    <td className="px-3 py-2">{company.liveEventSection || 'N/A'}</td>
                    <td className="px-3 py-2">{company.expiresOn || 'N/A'}</td>
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
                            setSelectedCompany(company);
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
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Expired Bets Management Section */}
        <div className="bg-[#181f1f] rounded-2xl shadow-lg p-4 border-2 border-red-400/40 overflow-x-auto mb-8">
          <h2 className="text-2xl font-bold text-red-400 mb-3 flex items-center gap-2"><span>⏰</span> Expired Bets - Update Results</h2>
          <div className="text-gray-300 mb-4">Companies with expired betting periods. Update candidate results to finalize payouts.</div>
          <table className="min-w-full text-base">
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
                  <tr key={company.id} className="border-b border-red-400/10">
                    <td className="px-3 py-2">{company.name}</td>
                    <td className="px-3 py-2">{company.role}</td>
                    <td className="px-3 py-2">{company.expiresOn || 'N/A'}</td>
                    <td className="px-3 py-2">{company.candidates?.length || 0} candidates</td>
                    <td className="px-3 py-2">
                      <span className={`${hasResults ? 'bg-green-500' : 'bg-red-500'} text-white px-3 py-1 rounded-full font-bold text-sm`}>
                        {hasResults ? 'Results Updated' : 'Pending Results'}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button 
                        className={`${hasResults ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'} text-white font-bold px-3 py-1 rounded-lg text-sm`}
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowResultsModal(true);
                        }}
                        disabled={hasResults}
                      >
                        {hasResults ? 'Completed' : 'Update Results'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Individuals Management Section */}
        <div className="bg-[#181f1f] rounded-2xl shadow-lg p-4 border-2 border-purple-400/40 overflow-x-auto mb-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-3 flex items-center gap-2"><span>👥</span> All Individuals</h2>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                {branches.map(b => (
                  <option key={b} value={b}>{b}</option>
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

          <table className="min-w-full text-base">
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
      </div>
    </PageLayout>
  );
} 