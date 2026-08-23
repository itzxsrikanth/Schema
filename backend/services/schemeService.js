const { SCHEMES_DATABASE } = require('../config/constants');

const matchSchemes = async ({ landSize, state, income, crops }) => {
  const farmerLand = parseFloat(landSize) || 2.5;
  const farmerIncome = parseFloat(income) || 250000;
  const farmerState = state || 'All';
  const farmerCrops = Array.isArray(crops) ? crops : (crops ? [crops] : []);

  const matched = SCHEMES_DATABASE.map(scheme => {
    let eligible = true;
    const reasons = [];

    if (farmerLand < scheme.eligibility.minLandSize) {
      eligible = false;
      reasons.push(`Requires minimum land size of ${scheme.eligibility.minLandSize} acres.`);
    }

    if (farmerLand > scheme.eligibility.maxLandSize) {
      eligible = false;
      reasons.push(`Land size exceeds maximum limit of ${scheme.eligibility.maxLandSize} acres.`);
    }

    if (farmerIncome > scheme.eligibility.maxIncome) {
      eligible = false;
      reasons.push(`Income exceeds eligibility cap of ₹${scheme.eligibility.maxIncome.toLocaleString('en-IN')}.`);
    }

    return {
      ...scheme,
      isEligible: eligible,
      reasons: eligible ? ['Meets all land and income criteria.'] : reasons
    };
  });

  return {
    totalSchemes: matched.length,
    eligibleCount: matched.filter(s => s.isEligible).length,
    schemes: matched
  };
};

module.exports = {
  matchSchemes
};
