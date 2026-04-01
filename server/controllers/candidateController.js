const Candidate = require('../models/Candidate');

const getCandidates = async (req, res) => {
  try {
    const { jobTitle, location } = req.query;
    let query = {};

    if (jobTitle) {
      query.jobTitle = { $regex: jobTitle, $options: 'i' };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const candidates = await Candidate.find(query);
    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Server error fetching candidates' });
  }
};

module.exports = {
  getCandidates,
};
