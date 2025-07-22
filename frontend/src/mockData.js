import { mockUsers } from "./mockUsers";
// Mock Companies
export const mockCompanies = [
  { id: "hilabs", name: "HiLabs", role: "Data Science", shortlist: [], candidates: [], liveEventSection: "data", logo: "" },
  { id: "google", name: "Google", role: "Software Engineer", shortlist: [], candidates: [], liveEventSection: "sde", logo: "" },
  { id: "amazon", name: "Amazon", role: "Operations Manager", shortlist: [], candidates: [], liveEventSection: "misc", logo: "" },
  { id: "flipkart", name: "Flipkart", role: "SDE", shortlist: [], candidates: [], liveEventSection: "sde", logo: "" },
  { id: "meesho", name: "Meesho", role: "Product Manager", shortlist: [], candidates: [], liveEventSection: "product", logo: "" },
  { id: "groww", name: "Groww", role: "Quant Analyst", shortlist: [], candidates: [], liveEventSection: "quant", logo: "" },
  { id: "uber", name: "Uber", role: "Backend Developer", shortlist: [], candidates: [], liveEventSection: "sde", logo: "" },
  { id: "deloitte", name: "Deloitte", role: "Analyst", shortlist: [], candidates: [], liveEventSection: "misc", logo: "" },
  { id: "microsoft", name: "Microsoft", role: "Cloud Engineer", shortlist: [], candidates: [], liveEventSection: "sde", logo: "" },
  // New mock companies
  { id: "infosys", name: "Infosys", role: "System Engineer", shortlist: [], candidates: [], liveEventSection: "core", logo: "" },
  { id: "tcs", name: "TCS", role: "Consultant", shortlist: [], candidates: [], liveEventSection: "misc", logo: "" },
  { id: "wipro", name: "Wipro", role: "Data Analyst", shortlist: [], candidates: [], liveEventSection: "data", logo: "" },
  { id: "adani", name: "Adani Group", role: "Project Engineer", shortlist: [], candidates: [], liveEventSection: "core", logo: "" },
  { id: "reliance", name: "Reliance Industries", role: "Business Analyst", shortlist: [], candidates: [], liveEventSection: "misc", logo: "" },
  { id: "ola", name: "Ola Cabs", role: "AI Engineer", shortlist: [], candidates: [], liveEventSection: "data", logo: "" },
  { id: "zomato", name: "Zomato", role: "Operations Lead", shortlist: [], candidates: [], liveEventSection: "misc", logo: "" },
  { id: "byjus", name: "BYJU'S", role: "EdTech Associate", shortlist: [], candidates: [], liveEventSection: "misc", logo: "" },
  { id: "paytm", name: "Paytm", role: "FinTech Developer", shortlist: [], candidates: [], liveEventSection: "sde", logo: "" },
  { id: "swiggy", name: "Swiggy", role: "Logistics Manager", shortlist: [], candidates: [], liveEventSection: "misc", logo: "" },
];

const candidateNames = [
  // Cricket and famous personalities (existing)
  "Virat Kohli", "Rohit Sharma", "MS Dhoni", "Sachin Tendulkar", "Yuvraj Singh", "Sourav Ganguly", "Rahul Dravid", "Jasprit Bumrah", "Hardik Pandya", "Ravindra Jadeja", "KL Rahul", "Shikhar Dhawan", "Rishabh Pant", "Suryakumar Yadav", "Mohammed Shami", "Bhuvneshwar Kumar", "Harbhajan Singh", "Zaheer Khan", "Anil Kumble", "VVS Laxman", "Gautam Gambhir", "Ajinkya Rahane", "Cheteshwar Pujara", "Ishant Sharma", "Navdeep Saini", "Narendra Modi", "Yogi Adityanath", "Baba Ramdev", "The Great Khali", "Kapil Dev", "Sunil Gavaskar", "Mohinder Amarnath", "Syed Kirmani", "Kedar Jadhav", "Prithvi Shaw", "Sanju Samson", "Dinesh Karthik", "Manish Pandey", "Robin Uthappa", "Parthiv Patel", "Sreesanth",
  // Taarak Mehta Ka Ooltah Chashmah characters
  "Jethalal Gada", "Taarak Mehta", "Daya Gada", "Champaklal Gada", "Babita Iyer", "Iyer", "Aatmaram Bhide", "Madhavi Bhide", "Sonalika Sonu Bhide", "Popatlal Pandey", "Dr. Hathi", "Komal Hathi", "Goli Hathi", "Roshan Singh Sodhi", "Roshan Kaur Sodhi", "Gogi Sodhi", "Abdul", "Patrakaar Popatlal", "Rita Reporter", "Bagha", "Natu Kaka", "Baawri", "Sodhi", "Anjali Mehta", "Tapu", "Gogi", "Pinku", "Bapuji"
];

const branches = [
  "B.Tech. (Ceramic Engineering)",
  "IDD (Ceramic Engineering)",
  "B.Tech. (Chemical Engineering)",
  "B.Tech. (Civil Engineering)",
  "IDD (Civil Engineering)",
  "B.Tech. (Computer Science and Engineering)",
  "IDD (Computer Science and Engineering)",
  "B.Tech. (Electrical Engineering)",
  "IDD (Electrical Engineering)",
  "B.Tech. (Electronics Engineering)",
  "B.Tech. (Mechanical Engineering)",
  "IDD (Mechanical Engineering)",
  "B.Tech. (Metallurgical & Materials Engineering)",
  "IDD (Metallurgical & Materials Engineering)",
  "B.Tech. (Mining Engineering)",
  "IDD (Mining Engineering)",
  "B.Tech. (Pharmaceutical Engineering & Technology)",
  "IDD (Pharmaceutical Engineering & Technology)",
  "IDD (Engineering Physics)",
  "IDD (Biochemical Engineering)",
  "IDD (Biomedical Engineering)",
  "IDD (Materials Science and Technology)",
  "IDD (Decision Science and Engineering)",
  "B.Arch. (Architecture)"
];

function randomEnrollment(idx) {
  return (21112000 + idx) + String.fromCharCode(97 + (idx % 5));
}

function getRandomBranch() {
  return branches[Math.floor(Math.random() * branches.length)];
}

// Each candidate can have any number of shortlists (1 to all companies)
function getRandomShortlists(companyIds) {
  const n = Math.floor(Math.random() * companyIds.length) + 1;
  const shuffled = [...companyIds].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

const companyIds = mockCompanies.map(c => c.id);

// Mahabharata characters to add as candidates
const mahabharataNames = [
  "Arjuna", "Bhima", "Yudhishthira", "Nakula", "Sahadeva", "Karna", "Draupadi", "Duryodhana", "Shakuni", "Krishna", "Abhimanyu", "Ghatotkacha", "Ashwatthama", "Bhishma", "Dronacharya", "Vidura", "Kunti", "Gandhari", "Subhadra", "Ekalavya"
];

const mahabharataCandidates = mahabharataNames.map((name, idx) => {
  const id = `candM${idx+1}`;
  const enrollment = `21113M${(idx+1).toString().padStart(2,'0')}`;
  const branch = branches[Math.floor(Math.random() * branches.length)];
  // Give each 2-4 random shortlists from mockCompanies only for now
  // We'll update this after expired companies are created
  const n = 2 + Math.floor(Math.random()*3);
  const shuffled = [...companyIds].sort(() => 0.5 - Math.random());
  const shortlistedIn = shuffled.slice(0, n);
  return { id, name, enrollment, branch, shortlistedIn };
});

export const mockCandidates = [
  ...candidateNames.map((name, idx) => {
    const id = `cand${idx + 1}`;
    const enrollment = randomEnrollment(idx);
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const shortlistedIn = getRandomShortlists(companyIds);
    return { id, name, enrollment, branch, shortlistedIn };
  }),
  ...mahabharataCandidates
];

// Companies only for expired bets (define after candidates)
export const mockExpiredCompanies = [
  { id: "squarepoint1", name: "SquarePoint Capital", role: "Graduate Software Developer", shortlist: [], candidates: [], liveEventSection: "sde", logo: "" },
  { id: "squarepoint2", name: "SquarePoint Capital", role: "Infrastructure Engineer", shortlist: [], candidates: [], liveEventSection: "sde", logo: "" },
  { id: "squarepoint3", name: "SquarePoint Capital", role: "Desk Quant Analyst", shortlist: [], candidates: [], liveEventSection: "quant", logo: "" },
  { id: "goldmansachs", name: "Goldman Sachs", role: "Quantitative Analyst", shortlist: [], candidates: [], liveEventSection: "quant", logo: "" },
  { id: "barclays", name: "Barclays", role: "Risk Analyst", shortlist: [], candidates: [], liveEventSection: "quant", logo: "" },
  { id: "jpmorgan", name: "JP Morgan", role: "Investment Banking Analyst", shortlist: [], candidates: [], liveEventSection: "misc", logo: "" },
  { id: "bain", name: "Bain & Company", role: "Associate Consultant", shortlist: [], candidates: [], liveEventSection: "misc", logo: "" },
  { id: "bostonconsulting", name: "Boston Consulting Group", role: "Consultant", shortlist: [], candidates: [], liveEventSection: "misc", logo: "" },
  { id: "mckinsey", name: "McKinsey & Company", role: "Business Analyst", shortlist: [], candidates: [], liveEventSection: "misc", logo: "" },
];

const expiredCompanyIds = mockExpiredCompanies.map(c => c.id);

// Add expired companies to the main companies array so they appear in the system
mockCompanies.push(...mockExpiredCompanies);

// Update mahabharata candidates to include expired companies in their shortlists
mahabharataCandidates.forEach(candidate => {
  const allCompanyIds = [...companyIds, ...expiredCompanyIds];
  const n = 2 + Math.floor(Math.random()*3);
  const shuffled = [...allCompanyIds].sort(() => 0.5 - Math.random());
  candidate.shortlistedIn = shuffled.slice(0, n);
});

// Update company shortlists to include all candidates who have that company in their shortlistedIn
mockCompanies.forEach(company => {
  company.shortlist = mockCandidates.filter(c => c.shortlistedIn.includes(company.id)).map(c => c.id);
});
mockExpiredCompanies.forEach(company => {
  company.shortlist = mockCandidates.filter(c => c.shortlistedIn.includes(company.id)).map(c => c.id);
});

// Ensure every expired company has at least 4-7 candidates shortlisted
mockExpiredCompanies.forEach(company => {
  let currentShortlist = company.shortlist;
  const needed = 4 + Math.floor(Math.random() * 4); // 4-7
  if (currentShortlist.length < needed) {
    // Find candidates not already in shortlist
    const notShortlisted = mockCandidates.filter(c => !currentShortlist.includes(c.id));
    // Shuffle and pick as many as needed
    const toAdd = notShortlisted.sort(() => 0.5 - Math.random()).slice(0, needed - currentShortlist.length);
    company.shortlist = [...currentShortlist, ...toAdd.map(c => c.id)];
  }
});

// Sample expired bets (with verdict) - will be replaced below
export let mockExpiredBets = [];

// Use leaderboard (mockUsers) to distribute winnings/losings for expired bets
const leaderboardUsers = mockUsers.slice(0, 10); // Top 10 for demo
const verdicts = ["selected", "not selected"];
leaderboardUsers.forEach((user, i) => {
  // Each user bets on 1-2 expired companies, random candidate from shortlist
  const companies = [mockExpiredCompanies[i % mockExpiredCompanies.length]];
  companies.forEach(company => {
    const shortlist = company.shortlist;
    if (shortlist.length === 0) return;
    const candidateId = shortlist[Math.floor(Math.random() * shortlist.length)];
    const verdict = verdicts[i % 2];
    const amount = 10000 + (i * 5000);
    mockExpiredBets.push({
      userId: user.id,
      candidateId,
      companyId: company.id,
      type: "for",
      amount,
      stake: `${(1.2 + 0.1*i).toFixed(2)}x`,
      status: "expired",
      verdict
    });
  });
});
// Add some Mahabharata candidates as selected in mockExpiredBets
const selectedMahabharata = mahabharataCandidates.slice(0, 6); // First 6 selected
selectedMahabharata.forEach((cand, i) => {
  mockExpiredBets.push({
    userId: `21075M${i+1}`,
    candidateId: cand.id,
    companyId: mockExpiredCompanies[i % mockExpiredCompanies.length].id,
    type: "for",
    amount: 3500 + i*200,
    stake: `${(1.2 + 0.1*i).toFixed(2)}x`,
    status: "expired",
    verdict: "selected"
  });
});

// Add some non-Mahabharata candidates as 'not selected' in expired bets if they are shortlisted in expired companies
const nonMahabharataCandidates = mockCandidates.filter(c => !c.id.startsWith('candM'));
const extraNotSelected = [
  { name: 'Rohit Sharma', id: 'cand2' },
  { name: 'Virat Kohli', id: 'cand1' },
  { name: 'MS Dhoni', id: 'cand3' },
  { name: 'Jethalal Gada', id: 'cand41' },
  { name: 'Narendra Modi', id: 'cand25' },
  { name: 'Babita Iyer', id: 'cand45' },
];
extraNotSelected.forEach((cand, i) => {
  // Find an expired company where this candidate is shortlisted
  const company = mockExpiredCompanies.find(c => c.shortlist.includes(cand.id));
  if (company) {
    mockExpiredBets.push({
      userId: `21075E${i+1}`,
      candidateId: cand.id,
      companyId: company.id,
      type: "for",
      amount: 2000 + i*500,
      stake: `${(1.15 + 0.07*i).toFixed(2)}x`,
      status: "expired",
      verdict: "not selected"
    });
  }
});

// Ensure multiple candidates are selected for each expired company
mockExpiredCompanies.forEach(company => {
  const shortlist = company.shortlist;
  if (shortlist.length < 2) return;
  // Pick 2-3 unique candidates from shortlist
  const nSelected = Math.min(3, Math.max(2, Math.floor(Math.random() * 3) + 2, shortlist.length));
  const shuffled = [...shortlist].sort(() => 0.5 - Math.random());
  const selectedCands = shuffled.slice(0, nSelected);
  selectedCands.forEach(cid => {
    // Check if a bet already exists for this candidate/company
    let bet = mockExpiredBets.find(b => b.companyId === company.id && b.candidateId === cid);
    if (bet) {
      bet.verdict = 'selected';
    } else {
      mockExpiredBets.push({
        userId: `21075S${cid}`,
        candidateId: cid,
        companyId: company.id,
        type: "for",
        amount: 2500 + Math.floor(Math.random()*2000),
        stake: `${(1.15 + Math.random()*0.5).toFixed(2)}x`,
        status: "expired",
        verdict: "selected"
      });
    }
  });
});

// Sample Bets
export const mockBets = [
  { userId: "21075001", candidateId: "cand1", companyId: "hilabs", type: "for", amount: 2000, stake: "1.29x", status: "active" },
  { userId: "21075001", candidateId: "cand2", companyId: "google", type: "against", amount: 1500, stake: "2.10x", status: "active" },
  { userId: "21075002", candidateId: "cand3", companyId: "amazon", type: "for", amount: 1000, stake: "1.75x", status: "expired" },
  { userId: "21075003", candidateId: "cand4", companyId: "flipkart", type: "for", amount: 2500, stake: "1.35x", status: "active" },
  { userId: "21075004", candidateId: "cand5", companyId: "meesho", type: "against", amount: 1800, stake: "3.44x", status: "active" },
  { userId: "21075005", candidateId: "cand6", companyId: "groww", type: "for", amount: 2200, stake: "1.49x", status: "expired" },
  { userId: "21075006", candidateId: "cand7", companyId: "uber", type: "for", amount: 1700, stake: "1.80x", status: "active" },
  { userId: "21075007", candidateId: "cand8", companyId: "deloitte", type: "against", amount: 900, stake: "2.75x", status: "active" },
  { userId: "21075008", candidateId: "cand9", companyId: "microsoft", type: "for", amount: 1200, stake: "2.30x", status: "active" },
  { userId: "21075009", candidateId: "cand10", companyId: "hilabs", type: "for", amount: 3000, stake: "1.41x", status: "expired" },
];

// Add sample results to expired companies so they show up in Expired Bets
// This needs to be done after mockCandidates is fully initialized
function addResultsToExpiredCompanies() {
  mockExpiredCompanies.forEach(company => {
    if (company.shortlist.length > 0) {
      // Add results for some candidates (2-4 candidates per company)
      const numResults = Math.min(4, Math.max(2, Math.floor(Math.random() * 3) + 2));
      const candidatesWithResults = company.shortlist.slice(0, numResults);
      
      company.candidates = candidatesWithResults.map((candidateId, index) => {
        const candidate = mockCandidates.find(c => c.id === candidateId);
        return {
          enrollment: candidate?.enrollment || candidateId,
          result: index < 2 ? 'selected' : 'not_selected' // First 2 selected, rest not selected
        };
      });
    }
  });
}

// Now add results to expired companies after everything is initialized
addResultsToExpiredCompanies(); 

// Admin-selected companies for homepage carousel (default to top 8 by tokens)
export let adminCarouselCompanyIds = [];

// Initialize with top 8 companies by default
function initializeCarouselCompanies() {
  const totals = {};
  mockBets.forEach(bet => {
    if (!totals[bet.companyId]) totals[bet.companyId] = 0;
    totals[bet.companyId] += Number(bet.amount) || 0;
  });
  
  // Sort company ids by total tokens bet, descending, and take top 8
  adminCarouselCompanyIds = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id]) => id);
    
  // If no bets yet, use first 8 companies
  if (adminCarouselCompanyIds.length === 0) {
    adminCarouselCompanyIds = mockCompanies.slice(0, 8).map(c => c.id);
  }
}

// Initialize carousel companies
initializeCarouselCompanies(); 