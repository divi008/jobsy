import mockUsers from './mockUsers.js';

// Mock Companies
const mockCompanies = [
  { id: "hilabs", name: "HiLabs", role: "Data Science", shortlist: [], candidates: [], liveEventSection: "data", logo: "" },
  { id: "google", name: "Google", role: "Software Engineer", shortlist: [], candidates: [], liveEventSection: "sde", logo: "" },
  { id: "amazon", name: "Amazon", role: "Operations Manager", shortlist: [], candidates: [], liveEventSection: "misc", logo: "" },
  { id: "flipkart", name: "Flipkart", role: "SDE", shortlist: [], candidates: [], liveEventSection: "sde", logo: "" },
  { id: "meesho", name: "Meesho", role: "Product Manager", shortlist: [], candidates: [], liveEventSection: "product", logo: "" },
  { id: "groww", name: "Groww", role: "Quant Analyst", shortlist: [], candidates: [], liveEventSection: "quant", logo: "" },
  { id: "uber", name: "Uber", role: "Backend Developer", shortlist: [], candidates: [], liveEventSection: "sde", logo: "" },
  { id: "deloitte", name: "Deloitte", role: "Analyst", shortlist: [], candidates: [], liveEventSection: "misc", logo: "" },
  { id: "microsoft", name: "Microsoft", role: "Cloud Engineer", shortlist: [], candidates: [], liveEventSection: "sde", logo: "" },
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
  "Virat Kohli", "Rohit Sharma", "MS Dhoni", "Sachin Tendulkar", "Yuvraj Singh", "Sourav Ganguly", "Rahul Dravid", "Jasprit Bumrah", "Hardik Pandya", "Ravindra Jadeja", "KL Rahul", "Shikhar Dhawan", "Rishabh Pant", "Suryakumar Yadav", "Mohammed Shami", "Bhuvneshwar Kumar", "Harbhajan Singh", "Zaheer Khan", "Anil Kumble", "VVS Laxman", "Gautam Gambhir", "Ajinkya Rahane", "Cheteshwar Pujara", "Ishant Sharma", "Navdeep Saini", "Narendra Modi", "Yogi Adityanath", "Baba Ramdev", "The Great Khali", "Kapil Dev", "Sunil Gavaskar", "Mohinder Amarnath", "Syed Kirmani", "Kedar Jadhav", "Prithvi Shaw", "Sanju Samson", "Dinesh Karthik", "Manish Pandey", "Robin Uthappa", "Parthiv Patel", "Sreesanth",
  "Jethalal Gada", "Taarak Mehta", "Daya Gada", "Champaklal Gada", "Babita Iyer", "Iyer", "Aatmaram Bhide", "Madhavi Bhide", "Sonalika Sonu Bhide", "Popatlal Pandey", "Dr. Hathi", "Komal Hathi", "Goli Hathi", "Roshan Singh Sodhi", "Roshan Kaur Sodhi", "Gogi Sodhi", "Abdul", "Patrakaar Popatlal", "Rita Reporter", "Bagha", "Natu Kaka", "Baawri", "Sodhi", "Anjali Mehta", "Tapu", "Gogi", "Pinku", "Bapuji"
];

const branches = [
  "B.Tech. (Ceramic Engineering)","IDD (Ceramic Engineering)","B.Tech. (Chemical Engineering)","B.Tech. (Civil Engineering)","IDD (Civil Engineering)","B.Tech. (Computer Science and Engineering)","IDD (Computer Science and Engineering)","B.Tech. (Electrical Engineering)","IDD (Electrical Engineering)","B.Tech. (Electronics Engineering)","B.Tech. (Mechanical Engineering)","IDD (Mechanical Engineering)","B.Tech. (Metallurgical & Materials Engineering)","IDD (Metallurgical & Materials Engineering)","B.Tech. (Mining Engineering)","IDD (Mining Engineering)","B.Tech. (Pharmaceutical Engineering & Technology)","IDD (Pharmaceutical Engineering & Technology)","IDD (Engineering Physics)","IDD (Biochemical Engineering)","IDD (Biomedical Engineering)","IDD (Materials Science and Technology)","IDD (Decision Science and Engineering)","B.Arch. (Architecture)"
];

function randomEnrollment(idx) {
  return (21112000 + idx) + String.fromCharCode(97 + (idx % 5));
}

const companyIds = mockCompanies.map(c => c.id);

const mahabharataNames = [
  "Arjuna", "Bhima", "Yudhishthira", "Nakula", "Sahadeva", "Karna", "Draupadi", "Duryodhana", "Shakuni", "Krishna", "Abhimanyu", "Ghatotkacha", "Ashwatthama", "Bhishma", "Dronacharya", "Vidura", "Kunti", "Gandhari", "Subhadra", "Ekalavya"
];

const mahabharataCandidates = mahabharataNames.map((name, idx) => {
  const id = `candM${idx+1}`;
  const enrollment = `21113M${(idx+1).toString().padStart(2,'0')}`;
  const branch = branches[Math.floor(Math.random() * branches.length)];
  const n = 2 + Math.floor(Math.random()*3);
  const shuffled = [...companyIds].sort(() => 0.5 - Math.random());
  const shortlistedIn = shuffled.slice(0, n);
  // Extract course from branch name
  let course = "B.Tech";
  if (branch.includes("IDD")) {
    course = "IDD";
  } else if (branch.includes("M.Tech")) {
    course = "M.Tech";
  } else if (branch.includes("Ph.D")) {
    course = "Ph.D";
  } else if (branch.includes("B.Arch")) {
    course = "B.Arch";
  }
  return { id, name, enrollment, branch, course, shortlistedIn };
});

const mockCandidates = [
  ...candidateNames.map((name, idx) => {
    const id = `cand${idx + 1}`;
    const enrollment = randomEnrollment(idx);
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const shortlistedIn = companyIds.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * companyIds.length) + 1);
    // Extract course from branch name
    let course = "B.Tech";
    if (branch.includes("IDD")) {
      course = "IDD";
    } else if (branch.includes("M.Tech")) {
      course = "M.Tech";
    } else if (branch.includes("Ph.D")) {
      course = "Ph.D";
    } else if (branch.includes("B.Arch")) {
      course = "B.Arch";
    }
    return { id, name, enrollment, branch, course, shortlistedIn };
  }),
  ...mahabharataCandidates
];

const mockExpiredCompanies = [
  { id: "squarepoint1", name: "SquarePoint Capital", role: "Graduate Software Developer", shortlist: [], candidates: [], liveEventSection: "sde", logo: "" },
  { id: "squarepoint2", name: "SquarePoint Capital", role: "Infrastructure Engineer", shortlist: [], candidates: [], liveEventSection: "sde", logo: "" },
  { id: "squarepoint3", name: "SquarePoint Capital", role: "Desk Quant Analyst", shortlist: [], candidates: [], liveEventSection: "quant", logo: "" },
  { id: "goldmansachs", name: "Goldman Sachs", role: "Quantitative Analyst", shortlist: [], candidates: [], liveEventSection: "quant", logo: "" },
  { id: "barclays", name: "Barclays", role: "Risk Analyst", shortlist: [], candidates: [], liveEventSection: "quant", logo: "" },
];

const expiredCompanyIds = mockExpiredCompanies.map(c => c.id);
mockCompanies.push(...mockExpiredCompanies);

mahabharataCandidates.forEach(candidate => {
  const allCompanyIds = [...companyIds, ...expiredCompanyIds];
  const n = 2 + Math.floor(Math.random()*3);
  const shuffled = [...allCompanyIds].sort(() => 0.5 - Math.random());
  candidate.shortlistedIn = shuffled.slice(0, n);
});

mockCompanies.forEach(company => {
  company.shortlist = mockCandidates.filter(c => c.shortlistedIn.includes(company.id)).map(c => c.id);
});

let mockExpiredBets = [];
const leaderboardUsers = mockUsers.slice(0, 10);
const verdicts = ["selected", "not selected"];
leaderboardUsers.forEach((user, i) => {
  const company = mockExpiredCompanies[i % mockExpiredCompanies.length];
  const shortlist = company.shortlist;
  if (shortlist.length === 0) return;
  const candidateId = shortlist[Math.floor(Math.random() * shortlist.length)];
  const verdict = verdicts[i % 2];
  mockExpiredBets.push({ userId: user.id, candidateId, companyId: company.id, type: "for", amount: 10000 + (i*5000), stake: `${(1.2 + 0.1*i).toFixed(2)}x`, status: "expired", verdict});
});

const mockBets = [
  { userId: "21075001", candidateId: "cand1", companyId: "hilabs", type: "for", amount: 2000, stake: "1.29x", status: "active" },
  { userId: "21075002", candidateId: "cand3", companyId: "amazon", type: "for", amount: 1000, stake: "1.75x", status: "expired" },
];

// Combine all the data into a single object to be exported.
const mockData = {
  users: mockUsers,
  companies: mockCompanies,
  candidates: mockCandidates,
  bets: [...mockBets, ...mockExpiredBets],
};

export default mockData;