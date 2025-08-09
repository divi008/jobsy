import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Bet from '../models/Bet.js';
import CompanyBetEvent from '../models/CompanyBetEvent.js';

dotenv.config();

const resetSystem = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Reset all users' tokens to 100000 and clear winnings
    const userUpdate = await User.updateMany({}, {
      $set: {
        tokens: 100000,
        winnings: 0
      }
    });
    console.log(`✅ Reset ${userUpdate.modifiedCount} users' tokens to 100000`);

    // Clear all betting history
    const betDelete = await Bet.deleteMany({});
    console.log(`✅ Deleted ${betDelete.deletedCount} bets`);

    // Reset all company events to active status and clear winning candidates
    const eventUpdate = await CompanyBetEvent.updateMany({}, {
      $set: {
        status: 'active',
        winningCandidates: []
      },
      $unset: {
        stakesByCandidate: ""
      }
    });
    console.log(`✅ Reset ${eventUpdate.modifiedCount} company events`);

    console.log('🎉 System reset complete!');
    console.log('- All users now have 100,000 tokens');
    console.log('- All betting history cleared');
    console.log('- All company events set to active');
    console.log('- All stakes will default to 2x');

  } catch (error) {
    console.error('Error resetting system:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

resetSystem(); 