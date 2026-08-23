const { CROPS_DATA } = require('../config/constants');

const recommendCrops = async ({ soilType, nitrogen, phosphorus, potassium, ph, rainfall, temperature, location }) => {
  const n = parseFloat(nitrogen) || 90;
  const p = parseFloat(phosphorus) || 45;
  const k = parseFloat(potassium) || 45;
  const phVal = parseFloat(ph) || 6.5;
  const rainVal = parseFloat(rainfall) || 700;
  const tempVal = parseFloat(temperature) || 25;

  const scoredCrops = CROPS_DATA.map(crop => {
    let score = 100;

    // NPK Distance calculation
    const nDiff = Math.abs(crop.optimalNPK.n - n);
    const pDiff = Math.abs(crop.optimalNPK.p - p);
    const kDiff = Math.abs(crop.optimalNPK.k - k);
    score -= (nDiff * 0.2 + pDiff * 0.3 + kDiff * 0.3);

    // pH match
    if (phVal < crop.phRange[0] || phVal > crop.phRange[1]) {
      score -= 15;
    }

    // Rainfall match
    if (rainVal < crop.rainfall[0] || rainVal > crop.rainfall[1]) {
      score -= 15;
    }

    // Temperature match
    if (tempVal < crop.tempRange[0] || tempVal > crop.tempRange[1]) {
      score -= 15;
    }

    // Soil type affinity
    if (soilType) {
      const st = soilType.toLowerCase();
      if (crop.id === 'rice' && (st === 'clay' || st === 'alluvial')) score += 10;
      if (crop.id === 'cotton' && st === 'black') score += 15;
      if (crop.id === 'wheat' && (st === 'alluvial' || st === 'loamy')) score += 10;
    }

    const suitabilityPercentage = Math.min(99, Math.max(55, Math.round(score)));

    return {
      cropId: crop.id,
      name: crop.name,
      nameHindi: crop.nameHindi,
      matchPercentage: suitabilityPercentage,
      season: crop.season,
      estimatedYieldQuintalPerAcre: (Math.random() * 5 + 15).toFixed(1),
      estimatedPricePerQuintalRupees: Math.round(Math.random() * 1000 + 2200),
      recommendedFertilizerRatio: `N:${crop.optimalNPK.n} P:${crop.optimalNPK.p} K:${crop.optimalNPK.k}`,
      soilRequirement: `pH ${crop.phRange[0]}-${crop.phRange[1]}`
    };
  });

  // Sort descending by match percentage
  scoredCrops.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    queryParameters: { soilType, nitrogen: n, phosphorus: p, potassium: k, ph: phVal, rainfall: rainVal, temperature: tempVal, location },
    recommendations: scoredCrops
  };
};

module.exports = {
  recommendCrops
};
