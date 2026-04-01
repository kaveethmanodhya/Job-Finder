const mongoose = require('mongoose');
require('dotenv').config();
const Candidate = require('./models/Candidate');
const { calculateExperienceLevel } = require('./utils/experienceCalculator');

const dummyData = [
  {
    name: 'Sarah Jenkins',
    jobTitle: 'Senior Frontend Engineer',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux'],
    location: 'San Francisco, CA',
    profileSource: 'LinkedIn_Verified',
    profileUrl: '#',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    totalYearsExperience: 7
  },
  {
    name: 'Marcus Chen',
    jobTitle: 'Full Stack Developer',
    skills: ['Node.js', 'React', 'MongoDB', 'AWS'],
    location: 'Remote',
    profileSource: 'Google_Scraped',
    profileUrl: '#',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
    totalYearsExperience: 4
  },
  {
    name: 'Elena Rodriguez',
    jobTitle: 'UI/UX Designer & Engineer',
    skills: ['Figma', 'React', 'CSS', 'Framer Motion'],
    location: 'Austin, TX',
    profileSource: 'LinkedIn_Verified',
    profileUrl: '#',
    imageUrl: '', // Testing the futuristic fallback
    totalYearsExperience: 5
  },
  {
    name: 'David Kim',
    jobTitle: 'Backend Junior Engineer',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    location: 'New York, NY',
    profileSource: 'Google_Scraped',
    profileUrl: '#',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
    totalYearsExperience: 1
  },
  {
    name: 'Aria Vance',
    jobTitle: 'Lead AI Developer',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'AWS', 'Node.js'],
    location: 'London, UK',
    profileSource: 'LinkedIn_Verified',
    profileUrl: '#',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150',
    totalYearsExperience: 6
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/talentmatch');
    console.log('✅ Connected to MongoDB for seeding...');

    await Candidate.deleteMany({});
    console.log('🗑️ Cleared existing candidates.');

    const processedData = dummyData.map(candidate => {
      return {
        ...candidate,
        experienceLevel: calculateExperienceLevel(candidate.totalYearsExperience, candidate.jobTitle)
      };
    });

    await Candidate.insertMany(processedData);
    console.log(`🌱 Successfully seeded ${processedData.length} candidates!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error during database seeding:', err);
    process.exit(1);
  }
};

seedDB();
