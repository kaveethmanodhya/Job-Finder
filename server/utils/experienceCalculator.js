/**
 * Calculates the experience level based on total years or job title.
 * 
 * @param {number} totalYears - Total years of experience.
 * @param {string} jobTitle - The candidate's job title.
 * @returns {string} - "Entry", "Mid", or "Senior".
 */
const calculateExperienceLevel = (totalYears, jobTitle) => {
  // If explicitly provided via years
  if (totalYears && totalYears > 0) {
    if (totalYears <= 2) return 'Entry';
    if (totalYears >= 6) return 'Senior';
    return 'Mid';
  }

  // Fallback to checking job title keywords
  const title = jobTitle || '';

  if (/(senior|lead|principal|director)/i.test(title)) {
    return 'Senior';
  }
  
  if (/(intern|junior|trainee|graduate)/i.test(title)) {
    return 'Entry';
  }

  return 'Mid';
};

module.exports = { calculateExperienceLevel };
