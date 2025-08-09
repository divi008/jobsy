// Mock database of 40 users (Game of Thrones characters)
const gotNames = [
  "Jon Snow", "Daenerys Targaryen", "Arya Stark", "Sansa Stark", "Bran Stark", "Robb Stark", "Catelyn Stark", "Ned Stark", "Tyrion Lannister", "Cersei Lannister", "Jaime Lannister", "Tywin Lannister", "Joffrey Baratheon", "Stannis Baratheon", "Renly Baratheon", "Robert Baratheon", "Melisandre", "Davos Seaworth", "Brienne of Tarth", "Samwell Tarly", "Gendry", "Theon Greyjoy", "Yara Greyjoy", "Euron Greyjoy", "Petyr Baelish", "Varys", "Sandor Clegane", "Gregor Clegane", "Bronn", "Podrick Payne", "Tormund Giantsbane", "Jorah Mormont", "Missandei", "Grey Worm", "Daario Naharis", "Oberyn Martell", "Ellaria Sand", "Margaery Tyrell", "Loras Tyrell", "High Sparrow", "Ramsay Bolton"
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBet(userName) {
  const companies = ["Google", "Amazon", "Microsoft", "SquarePoint Capital", "Flipkart", "Meesho", "Groww", "Uber", "Deloitte", "HiLabs"];
  const types = ["👍", "👎"];
  const statuses = ["active", "expired"];
  return {
    company: companies[randomInt(0, companies.length - 1)],
    type: types[randomInt(0, 1)],
    amount: randomInt(500, 5000),
    stake: (1 + Math.random() * 2).toFixed(2) + "x",
    status: statuses[randomInt(0, 1)],
    user: userName
  };
}

const mockUsers = gotNames.map((name, idx) => {
  const id = (21075001 + idx).toString();
  // Email: jon.snow.got21@itbhu.ac.in
  const email = name.toLowerCase().replace(/[^a-z]/g, ".") + ".got21@itbhu.ac.in";
  const tokens = randomInt(50000, 200000);
  const successRate = randomInt(60, 99);
  const bets = Array.from({ length: randomInt(3, 8) }, () => randomBet(name));
  return {
    id,
    name,
    email,
    tokens,
    successRate,
    bets
  };
});

export default mockUsers;