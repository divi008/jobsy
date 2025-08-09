import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Candidate from '../models/Candidate.js';
import CompanyBetEvent from '../models/CompanyBetEvent.js';
import Bet from '../models/Bet.js';
import mockData from './mockData.js';

dotenv.config({ path: './.env' });

const seedDatabase = async () => {
  console.log('--- RUNNING FINAL SEEDER SCRIPT ---');
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Clear existing data
    await Bet.deleteMany({});
    await CompanyBetEvent.deleteMany({});
    await Candidate.deleteMany({});
    await User.deleteMany({});
    console.log('Old data cleared.');

    // Create Users (one by one to trigger hashing)
    const createdUsers = [];
    for (const userData of mockData.users) {
      const user = new User({ ...userData, enrollmentNumber: userData.id, password: 'password123' });
      await user.save();
      createdUsers.push(user);
    }
    console.log(`${createdUsers.length} users created.`);

    // Create Candidates
    const createdCandidates = await Candidate.insertMany(mockData.candidates.map(c => ({
      name: c.name, enrollmentNumber: c.enrollment, course: c.course, branch: c.branch,
    })));
    console.log(`${createdCandidates.length} candidates created.`);

    // Create Maps for Linking
    const userMap = new Map(createdUsers.map(u => [u.enrollmentNumber, u._id]));
    const candidateMap = new Map(createdCandidates.map(c => [c.enrollmentNumber, c._id]));

    // Create Company Bet Events
    const companyEventsToCreate = mockData.companies.map(company => {
        const status = mockData.mockExpiredCompanies.some(exp => exp.id === company.id) ? 'expired' : 'active';
        return {
            companyName: company.name,
            companyLogo: company.logo,
            jobProfile: company.role,
            status: status, // Set status correctly
            expiresAt: new Date(),
            candidates: company.shortlist.map(cid => {
                const cand = mockData.candidates.find(c => c.id === cid);
                const dbCand = createdCandidates.find(db_c => db_c.enrollmentNumber === cand?.enrollment);
                return dbCand ? dbCand._id : null;
            }).filter(id => id),
        };
    });
    const createdCompanyEvents = await CompanyBetEvent.insertMany(companyEventsToCreate);
    console.log(`${createdCompanyEvents.length} company bet events created.`);
    
    // Create Bets
    const allMockBets = [...mockData.bets, ...mockData.mockExpiredBets];
    const betsToCreate = allMockBets.map(bet => {
        const user = createdUsers.find(u => u.enrollmentNumber === bet.userId);
        const mockCandidate = mockData.candidates.find(mc => mc.id === bet.candidateId);
        const candidate = mockCandidate ? createdCandidates.find(c => c.enrollmentNumber === mockCandidate.enrollment) : null;
        const mockCompany = mockData.companies.find(mc => mc.id === bet.companyId);
        const companyEvent = mockCompany ? createdCompanyEvents.find(c => c.companyName === mockCompany.name) : null;

        if (user && candidate && companyEvent) {
            return {
                user: user._id, candidate: candidate._id, companyEvent: companyEvent._id,
                status: bet.status, amount: bet.amount, stake: bet.stake,
            };
        }
        return null;
    }).filter(bet => bet !== null);

    if (betsToCreate.length > 0) {
        await Bet.insertMany(betsToCreate);
        console.log(`${betsToCreate.length} bets created.`);
    }

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding database: ${error}`);
    process.exit(1);
  }
};

seedDatabase();