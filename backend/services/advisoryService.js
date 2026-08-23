const axios = require('axios');
const { getWeatherForecast } = require('./weatherService');

// Comprehensive Crop Agronomic Database covering all 25 crops
const CROP_AGRONOMY_DB = {
  wheat: {
    category: 'Cereal / Rabi Grain',
    waterNeeds: 'Moderate (Crown Root Initiation & Flowering are critical)',
    irrigationTip: 'Irrigate at CRI stage (21 days post-sowing) and boot stage. Avoid over-irrigation to prevent lodging.',
    waterQtyLiters: 1600,
    fertilizer: {
      type: 'Urea (120 kg N) + DAP (60 kg P2O5) + MOP (40 kg K2O) per acre',
      quantityKg: 30,
      unit: 'kg/acre',
      micro: 'Zinc Sulphate (21%) @ 10 kg/acre at sowing'
    },
    pestThreat: 'Yellow Rust (Puccinia striiformis), Brown Rust, Wheat Aphids',
    pestRemedy: 'Propiconazole 25% EC @ 1ml/L for rust; Imidacloprid 17.8% SL @ 0.5ml/L for aphids',
    organicPest: 'Neem seed kernel extract 5% or Trichoderma viride seed treatment',
    mandiPriceRange: '₹2,275 – ₹2,580 per quintal (MSP: ₹2,275)',
    harvestingTip: 'Harvest when grains turn golden-yellow and moisture content drops below 12-14%.'
  },
  rice: {
    category: 'Kharif Wetland Paddy',
    waterNeeds: 'High (Maintain 2-5 cm standing water during tillering & panicle initiation)',
    irrigationTip: 'Ensure continuous shallow submergence (2-3 cm) till 10 days before harvest. Drain field before top-dressing.',
    waterQtyLiters: 3500,
    fertilizer: {
      type: 'Urea (100 kg N) + SSP (50 kg P2O5) + MOP (50 kg K2O) per acre',
      quantityKg: 35,
      unit: 'kg/acre',
      micro: 'Zinc Sulphate 25 kg/acre + Bio-fertilizer Azospirillum'
    },
    pestThreat: 'Paddy Blast (Pyricularia oryzae), Brown Plant Hopper (BPH), Stem Borer',
    pestRemedy: 'Tricyclazole 75% WP @ 0.6g/L for blast; Cartap Hydrochloride 4G @ 8kg/acre for stem borer',
    organicPest: 'Pseudomonas fluorescens 10g/L spray + Light traps for stem borer moths',
    mandiPriceRange: '₹2,300 – ₹3,200 per quintal (Basmati varieties: ₹3,800 – ₹5,400)',
    harvestingTip: 'Harvest when 80-85% panicles turn straw yellow to avoid grain shattering.'
  },
  tomato: {
    category: 'Solanaceous Vegetable',
    waterNeeds: 'Moderate-High (Sensitive to both drought and waterlogging)',
    irrigationTip: 'Drip irrigation at 3-day intervals. Avoid wetting foliage during evening to prevent blight spores.',
    waterQtyLiters: 1200,
    fertilizer: {
      type: 'NPK 19:19:19 water-soluble + Calcium Nitrate (5 kg/acre) + Boron',
      quantityKg: 15,
      unit: 'kg/acre',
      micro: 'Chelated Calcium + Boron 2g/L (prevents Blossom End Rot & fruit cracking)'
    },
    pestThreat: 'Early/Late Blight (Alternaria / Phytophthora), Tomato Leaf Curl Virus (Whitefly vector), Fruit Borer (Helicoverpa)',
    pestRemedy: 'Mancozeb 75% WP (2.5g/L) for blight; Coragen (Chlorantraniliprole 18.5% SC) @ 0.4ml/L for fruit borer',
    organicPest: 'Yellow sticky cards (15/acre) for whiteflies + Trichogramma egg parasitoids + Neem oil (5ml/L)',
    mandiPriceRange: '₹1,200 – ₹3,400 per quintal (High seasonal volatility)',
    harvestingTip: 'Pick at breaker/pink stage for long-distance transport; red ripe stage for local processing.'
  },
  cotton: {
    category: 'Commercial Fiber / Cash Crop',
    waterNeeds: 'Moderate (Critical at square formation and flowering)',
    irrigationTip: 'Provide regulated irrigation. Avoid water stagnation at all costs as cotton is extremely susceptible to root asphyxiation.',
    waterQtyLiters: 1800,
    fertilizer: {
      type: 'DAP 50 kg + Urea 45 kg + MOP 35 kg per acre in 3 split doses',
      quantityKg: 25,
      unit: 'kg/acre',
      micro: 'Magnesium Sulphate (10 kg/acre) + Boron 0.1% spray at square formation'
    },
    pestThreat: 'Pink Bollworm (Pectinophora gossypiella), Whitefly, Aphids, Leaf Curl Virus',
    pestRemedy: 'Profenofos 50% EC @ 2ml/L or Emamectin Benzoate 5% SG @ 0.5g/L for bollworm',
    organicPest: 'Pheromone traps (8/acre) for PBW monitoring + Beauveria bassiana 5g/L spray',
    mandiPriceRange: '₹6,800 – ₹7,850 per quintal (Medium to Long Staple)',
    harvestingTip: 'Pick in clean, dry sunny weather only when bolls are fully opened; avoid morning dew collection.'
  },
  sugarcane: {
    category: 'Long-duration Commercial Cash Crop',
    waterNeeds: 'Very High (1500–2500 mm annual requirement)',
    irrigationTip: 'Furrow or subsurface drip irrigation at 7-10 day intervals during tillering and formative phases.',
    waterQtyLiters: 4000,
    fertilizer: {
      type: 'NPK 250:100:125 kg/ha (Urea + Single Super Phosphate + Potash) + FYM 10 tons',
      quantityKg: 45,
      unit: 'kg/acre',
      micro: 'Ferrous Sulphate (10 kg/acre) to cure cane chlorosis + Zinc Sulphate'
    },
    pestThreat: 'Red Rot (Colletotrichum falcatum), Early Shoot Borer, Pyrilla, White Grub',
    pestRemedy: 'Chlorantraniliprole 0.4% G @ 7.5 kg/acre for shoot borer; Carbendazim set-treatment for red rot',
    organicPest: 'Trichogramma chilonis releases @ 20,000/acre at 10-day intervals',
    mandiPriceRange: '₹340 – ₹380 per quintal (Fair & Remunerative Price / SAP)',
    harvestingTip: 'Harvest flush with the ground level when Brix refractometer reading reaches 18–20%.'
  },
  maize: {
    category: 'Coarse Grain / Cereal',
    waterNeeds: 'Moderate (Knee-high, Tasseling, and Silking stages are critical)',
    irrigationTip: 'Ensure soil moisture during tasseling and silking. Even brief water stress during pollination causes unfilled cobs.',
    waterQtyLiters: 1400,
    fertilizer: {
      type: 'Urea (60 kg) + DAP (30 kg) + Potash (20 kg) per acre in 3 splits',
      quantityKg: 25,
      unit: 'kg/acre',
      micro: 'Zinc Sulphate @ 10 kg/acre (prevents white bud of maize)'
    },
    pestThreat: 'Fall Armyworm (Spodoptera frugiperda), Stem Borer, Turcicum Leaf Blight',
    pestRemedy: 'Spinetoram 11.7% SC @ 0.5ml/L or Chlorantraniliprole 18.5% SC @ 0.4ml/L applied into whorls for FAW',
    organicPest: 'Apply sand-lime mixture (9:1) or Metarhizium anisopliae (5g/L) into leaf whorls',
    mandiPriceRange: '₹2,090 – ₹2,450 per quintal (MSP: ₹2,090)',
    harvestingTip: 'Harvest when cob sheath turns completely brown and moisture is around 15-18%.'
  },
  potato: {
    category: 'Tuber Vegetable',
    waterNeeds: 'Moderate-High (Stolon formation and tuber enlargement stages)',
    irrigationTip: 'Light and frequent irrigation at 6-8 days interval. Stop watering 10 days before harvesting for skin hardening.',
    waterQtyLiters: 1500,
    fertilizer: {
      type: 'NPK 12:32:16 + Sulphate of Potash (SOP 0:0:50) for superior tuber size',
      quantityKg: 30,
      unit: 'kg/acre',
      micro: 'Magnesium Sulphate + Boron spray 30 days after planting'
    },
    pestThreat: 'Late Blight (Phytophthora infestans), Potato Tuber Moth (PTM), Aphids',
    pestRemedy: 'Cymoxanil 8% + Mancozeb 64% WP (Sectina/Curzate) @ 2g/L as preventive/early curative for blight',
    organicPest: 'Trichoderma viride soil application + Copper Oxychloride (2.5g/L) preventive spray',
    mandiPriceRange: '₹1,150 – ₹1,850 per quintal (Cold storage arrival dynamics)',
    harvestingTip: 'Dehaulm (cut top stems) 10-12 days before harvest to allow skin curing in soil.'
  },
  soybean: {
    category: 'Oilseed & Legume',
    waterNeeds: 'Moderate (Flowering and pod filling stages are critical)',
    irrigationTip: 'Supplementary protective irrigation during prolonged dry spells during flowering or pod filling.',
    waterQtyLiters: 1200,
    fertilizer: {
      type: 'DAP 35 kg + MOP 20 kg + Sulphur 10 kg/acre (Rhizobium inoculated)',
      quantityKg: 20,
      unit: 'kg/acre',
      micro: 'Single Super Phosphate (SSP) for essential Sulphur content in oil synthesis'
    },
    pestThreat: 'Yellow Mosaic Virus (Whitefly vector), Girdle Beetle, Stem Fly, Semilooper',
    pestRemedy: 'Thiamethoxam 25% WG @ 0.3g/L for whitefly; Chlorantraniliprole 18.5% SC @ 0.3ml/L for defoliators',
    organicPest: 'Neem oil 3000 ppm (3ml/L) + Install bird perches (15/acre) for caterpillar predation',
    mandiPriceRange: '₹4,300 – ₹4,950 per quintal (MSP: ₹4,600)',
    harvestingTip: 'Harvest when 90% leaves turn yellow and drop and pods give a rattling sound.'
  },
  mustard: {
    category: 'Rabi Oilseed',
    waterNeeds: 'Low-Moderate (Flowering and siliqua development)',
    irrigationTip: 'Two irrigations are usually adequate: 1st at 30 days (flowering) and 2nd at 60 days (pod filling).',
    waterQtyLiters: 1000,
    fertilizer: {
      type: 'Urea (30 kg) + SSP (50 kg) + MOP (15 kg) per acre',
      quantityKg: 20,
      unit: 'kg/acre',
      micro: 'Elemental Sulphur (15 kg/acre) is critical to boost oil percentage'
    },
    pestThreat: 'Mustard Aphid (Lipaphis erysimi), White Rust, Alternaria Blight',
    pestRemedy: 'Dimethoate 30% EC @ 1.7ml/L or Oxydemeton-methyl @ 1.5ml/L for aphids; Mancozeb @ 2g/L for rust',
    organicPest: 'Verticillium lecanii (5g/L) spray + Conserve predatory ladybird beetles',
    mandiPriceRange: '₹5,150 – ₹5,850 per quintal (MSP: ₹5,650)',
    harvestingTip: 'Harvest in early morning hours when 75% pods turn yellow to prevent shattering loss.'
  },
  chana: {
    category: 'Rabi Pulses / Chickpea',
    waterNeeds: 'Low (Drought resilient; susceptible to excessive water)',
    irrigationTip: 'Avoid heavy watering. One light irrigation at branching and one at pod formation is sufficient.',
    waterQtyLiters: 800,
    fertilizer: {
      type: 'DAP (30 kg) + Gypsum (50 kg) + Rhizobium & PSB bio-fertilizer',
      quantityKg: 15,
      unit: 'kg/acre',
      micro: 'Molybdenum seed treatment + 2% Urea foliar spray at pod development'
    },
    pestThreat: 'Gram Pod Borer (Helicoverpa armigera), Fusarium Wilt, Ascochyta Blight',
    pestRemedy: 'Emamectin Benzoate 5% SG @ 0.4g/L or Flubendiamide 39.35% SC @ 0.2ml/L for pod borer',
    organicPest: 'Helicoverpa NPV (HaNPV @ 250 LE/ha) + Intercropping with coriander or mustard',
    mandiPriceRange: '₹5,350 – ₹6,150 per quintal (MSP: ₹5,440)',
    harvestingTip: 'Harvest when plant foliage dries up and seeds rattle inside dried pods.'
  },
  groundnut: {
    category: 'Kharif/Rabi Oilseed & Legume',
    waterNeeds: 'Moderate (Pegging and pod development stages are critical)',
    irrigationTip: 'Maintain optimal moisture during peg entry into soil. Do not allow soil crust to harden.',
    waterQtyLiters: 1300,
    fertilizer: {
      type: 'Gypsum (150 kg/acre at pegging) + DAP (30 kg) + Potash (25 kg)',
      quantityKg: 25,
      unit: 'kg/acre',
      micro: 'Gypsum application at 40-45 DAS is essential for calcium uptake in pods'
    },
    pestThreat: 'Tikka Disease (Cercospora leaf spot), Collar Rot, Spodoptera, Leaf Miner',
    pestRemedy: 'Hexaconazole 5% EC @ 2ml/L or Carbendazim + Mancozeb @ 2g/L for Tikka disease',
    organicPest: 'Trichoderma viride seed treatment @ 4g/kg seed + Pseudomonas foliar spray',
    mandiPriceRange: '₹6,200 – ₹7,100 per quintal (MSP: ₹6,377)',
    harvestingTip: 'Check inside pod shell: a dark brownish-black inner shell indicates full maturity.'
  },
  onion: {
    category: 'Bulb Vegetable',
    waterNeeds: 'Moderate-High (Shallow root system requires frequent light irrigation)',
    irrigationTip: 'Stop irrigation 10-15 days before harvest to prevent rotting during storage and cure the neck.',
    waterQtyLiters: 1400,
    fertilizer: {
      type: 'NPK 10:26:26 + Potash (MOP) 25 kg + Sulphur 15 kg/acre',
      quantityKg: 25,
      unit: 'kg/acre',
      micro: 'Sulphur application enhances pungent allyl propyl disulfide compounds and bulb hardness'
    },
    pestThreat: 'Thrips (Thrips tabaci), Purple Blotch (Alternaria porri), Stemphylium Blight',
    pestRemedy: 'Fipronil 5% SC @ 1.5ml/L for thrips; Difenoconazole 25% EC @ 1ml/L for purple blotch',
    organicPest: 'Blue sticky traps (20/acre) + Spray garlic-chili extract or Neem oil (5ml/L)',
    mandiPriceRange: '₹1,600 – ₹2,900 per quintal (High cyclical variation in Nashik/Lasalgaon)',
    harvestingTip: 'Harvest when 50% tops fall over (neck collapse). Field-cure in shade for 5 days.'
  },
  chili: {
    category: 'Spices & Cash Crop',
    waterNeeds: 'Moderate (Sensitive to moisture stress and stagnant water)',
    irrigationTip: 'Drip fertigation recommended. Avoid flood irrigation as it spreads Phytophthora damping-off.',
    waterQtyLiters: 1300,
    fertilizer: {
      type: 'NPK 19:19:19 + 13:0:45 (Potassium Nitrate) in split doses + Micronutrient mix',
      quantityKg: 20,
      unit: 'kg/acre',
      micro: 'Zinc + Boron + Magnesium spray at early flowering to stop flower drop'
    },
    pestThreat: 'Chilli Thrips (Scirtothrips dorsalis), Yellow Mites, Anthracnose / Die-back, Leaf Curl Virus',
    pestRemedy: 'Spinetoram 11.7% SC (0.8ml/L) for thrips; Spiromesifen 22.9% SC (1ml/L) for mites; Azoxystrobin (1ml/L) for fruit rot',
    organicPest: 'Yellow & blue sticky traps + Spray Karanj oil (3ml/L) + Lecanicillium lecanii (5g/L)',
    mandiPriceRange: '₹14,500 – ₹21,000 per quintal (Dry Red Chili - Guntur/Byadgi)',
    harvestingTip: 'Pick ripe red chilies in dry weather and solar-dry on tarpaulins to 10% moisture.'
  },
  apple: {
    category: 'Temperate Horticulture',
    waterNeeds: 'Moderate (High during fruit expansion and bud break)',
    irrigationTip: 'Mulch tree basins with dry grass. Drip irrigation during dry post-monsoon or early summer months.',
    waterQtyLiters: 2000,
    fertilizer: {
      type: 'FYM (30 kg/tree) + CAN (Calcium Ammonium Nitrate) + MOP + Boron',
      quantityKg: 35,
      unit: 'kg/orchard unit',
      micro: 'Zinc Sulphate + Borax foliar spray in pink bud stage'
    },
    pestThreat: 'Apple Scab (Venturia inaequalis), Woolly Apple Aphid, San Jose Scale, Powdery Mildew',
    pestRemedy: 'Difenoconazole 25% EC @ 0.5ml/L or Dodine 65% WP @ 1g/L for scab preventive schedule',
    organicPest: 'Horticultural Mineral Oil (Servo Orchard spray oil) @ 2% for scale control',
    mandiPriceRange: '₹6,500 – ₹10,500 per quintal (Royal Delicious / Red Delicious)',
    harvestingTip: 'Pick carefully with stalk intact using fruit clippers; sort by size and grade.'
  },
  mango: {
    category: 'Tropical Fruit Horticulture',
    waterNeeds: 'Low-Moderate (Withhold water 2 months before flowering to induce flower buds)',
    irrigationTip: 'Do not irrigate during pre-flowering stage. Resume drip irrigation after fruit set until 15 days before harvest.',
    waterQtyLiters: 1800,
    fertilizer: {
      type: 'NPK 1000:500:1000 g per tree per year (Urea + SSP + MOP) + Vermicompost 25 kg',
      quantityKg: 30,
      unit: 'kg/orchard unit',
      micro: 'Paclobutrazol (Cultar) application for alternate bearing + Boron (0.1%) spray'
    },
    pestThreat: 'Mango Hopper (Amritodus atkinsoni), Powdery Mildew, Anthracnose, Fruit Fly (Bactrocera)',
    pestRemedy: 'Imidacloprid 17.8% SL @ 0.3ml/L for hoppers; Hexaconazole 5% SC @ 1ml/L for powdery mildew',
    organicPest: 'Methyl Eugenol pheromone traps (6/acre) for fruit fly mass trapping',
    mandiPriceRange: '₹4,500 – ₹8,500 per quintal (Alphonso / Kesar / Dasheri / Banganapalle)',
    harvestingTip: 'Harvest at 85% maturity (tapka stage) with 1cm pedicel to prevent stem-end rot.'
  },
  banana: {
    category: 'Tropical Fruit / High Water Feeder',
    waterNeeds: 'High (Continuous optimal moisture; highly sensitive to drying)',
    irrigationTip: 'Daily or alternate day drip fertigation. Keep soil moist without standing water around pseudo-stem.',
    waterQtyLiters: 3200,
    fertilizer: {
      type: 'NPK 200:40:300 g/plant in 15-20 split fertigation doses + Potash richness',
      quantityKg: 35,
      unit: 'kg/acre',
      micro: 'Micronutrient cocktail (Zinc, Iron, Boron) foliar spray at 3rd, 5th and 7th month'
    },
    pestThreat: 'Sigatoka Leaf Spot (Mycosphaerella), Panama Wilt (Fusarium), Rhizome Weevil, Aphids',
    pestRemedy: 'Propiconazole 25% EC (1ml/L) + Mineral oil (1%) for Sigatoka control',
    organicPest: 'Pseudomonas fluorescens root dip + Banana pseudo-stem trap for weevils',
    mandiPriceRange: '₹1,700 – ₹2,600 per quintal (Grand Naine / Robusta)',
    harvestingTip: 'Harvest bunches when fruit angles become rounded and ridges disappear (75-80% maturity).'
  },
  citrus: {
    category: 'Sub-tropical Horticulture (Orange / Lemon / Lime)',
    waterNeeds: 'Moderate (Sensitive to water stagnation and severe drying)',
    irrigationTip: 'Ring basin or drip system. Avoid wetting main trunk directly to prevent Phytophthora gummosis.',
    waterQtyLiters: 1600,
    fertilizer: {
      type: 'Urea (600g) + Single Super Phosphate (1000g) + MOP (400g) per mature tree',
      quantityKg: 25,
      unit: 'kg/orchard unit',
      micro: 'Zinc Sulphate (0.5%) + Ferrous Sulphate (0.4%) + Lime spray to correct citrus yellowing'
    },
    pestThreat: 'Citrus Psylla (Greening vector), Leaf Miner, Citrus Canker (Xanthomonas), Gummosis',
    pestRemedy: 'Copper Oxychloride (3g/L) + Streptocycline (1g/10L) for canker; Thiamethoxam (0.3g/L) for psylla',
    organicPest: 'Bordeaux paste painting on tree trunk up to 60 cm height',
    mandiPriceRange: '₹3,200 – ₹5,400 per quintal (Nagpur Mandarin / Sweet Lime)',
    harvestingTip: 'Harvest when fruit skin changes from dark green to light yellowish-green with clippers.'
  },
  turmeric: {
    category: 'Commercial Spices / Rhizome',
    waterNeeds: 'High (Constant moisture required in bed ridges)',
    irrigationTip: 'Irrigate at 5-7 days interval depending on soil. Ensure rapid drainage during monsoon to avoid rhizome rot.',
    waterQtyLiters: 2200,
    fertilizer: {
      type: 'FYM 15 tons/acre + NPK 60:50:120 kg/acre (Urea + SSP + MOP in 3 splits)',
      quantityKg: 30,
      unit: 'kg/acre',
      micro: 'Zinc Sulphate (10 kg) + Ferrous Sulphate (10 kg) + VAM (Mycorrhiza)'
    },
    pestThreat: 'Rhizome Rot (Pythium / Fusarium), Leaf Spot (Colletotrichum), Shoot Borer (Conogethes)',
    pestRemedy: 'Metalaxyl 8% + Mancozeb 64% WP @ 2.5g/L drenching for rhizome rot',
    organicPest: 'Seed rhizome treatment with Trichoderma harzianum @ 10g/kg + Neem cake (200 kg/acre)',
    mandiPriceRange: '₹12,800 – ₹17,500 per quintal (Salem / Nizamabad / Sangli finger varieties)',
    harvestingTip: 'Harvest when leaves turn yellow and dry completely at 7-9 months.'
  },
  tea: {
    category: 'Plantation Beverage',
    waterNeeds: 'High (Requires well-distributed rainfall and cool humid climate)',
    irrigationTip: 'Sprinkler irrigation during dry winter-spring months (Jan-March) in Assam/Nilgiris to boost first flush.',
    waterQtyLiters: 2500,
    fertilizer: {
      type: 'NPK 140:30:140 kg/ha in 4 split doses + Urea foliar spray (2%)',
      quantityKg: 25,
      unit: 'kg/acre',
      micro: 'Zinc Sulphate 1% + Manganese Sulphate foliar spray post-pruning'
    },
    pestThreat: 'Tea Mosquito Bug (Helopeltis theivora), Red Spider Mite, Blister Blight (Exobasidium)',
    pestRemedy: 'Hexythiazox 5.45% EC @ 1ml/L for red spider mite; Copper Oxychloride 2g/L for blister blight',
    organicPest: 'Entomopathogenic fungi (Verticillium) + Light prune infected bushes',
    mandiPriceRange: '₹18,000 – ₹28,000 per quintal (Made Tea basis)',
    harvestingTip: 'Standard plucking of "two leaves and a bud" at 7-10 day rounds during active flush.'
  },
  coffee: {
    category: 'Plantation Beverage (Arabica / Robusta)',
    waterNeeds: 'Moderate-High (Blossom showers and backing showers are vital)',
    irrigationTip: 'Blossom irrigation (25 mm) using sprinklers in Feb-March triggers uniform flowering.',
    waterQtyLiters: 2000,
    fertilizer: {
      type: 'NPK 120:90:120 kg/ha in 3 split applications (Pre-monsoon, Mid-monsoon, Post-monsoon)',
      quantityKg: 25,
      unit: 'kg/acre',
      micro: 'Zinc Sulphate (0.25%) + Borax (0.1%) foliar spray'
    },
    pestThreat: 'Coffee Berry Borer (Hypothenemus hampei), White Stem Borer (Xylotrechus), Coffee Leaf Rust',
    pestRemedy: 'Bordeaux mixture 0.5% spray for leaf rust; Chlorpyrifos 20% EC @ 2ml/L trunk swab for borer',
    organicPest: 'Beauveria bassiana @ 5g/L for berry borer + Broca pheromone traps',
    mandiPriceRange: '₹22,000 – ₹34,000 per quintal (Clean Coffee / Parchment)',
    harvestingTip: 'Selectively harvest only bright crimson red ripe cherries (Arabica) / maroon (Robusta).'
  },
  jute: {
    category: 'Bast Fiber Crop',
    waterNeeds: 'High (Warm and humid monsoon climate)',
    irrigationTip: 'One or two light irrigations during early vegetative stage if pre-monsoon showers are delayed.',
    waterQtyLiters: 1800,
    fertilizer: {
      type: 'Urea (30 kg) + SSP (30 kg) + MOP (20 kg) per acre in 2 split top dressings',
      quantityKg: 20,
      unit: 'kg/acre',
      micro: 'Zinc Sulphate 5 kg/acre'
    },
    pestThreat: 'Yellow Mite (Polyphagotarsonemus latus), Jute Semilooper, Stem Rot (Macrophomina)',
    pestRemedy: 'Fenazaquin 10% EC @ 1.5ml/L for yellow mite; Carbendazim 1g/L for stem rot',
    organicPest: 'Neem seed kernel extract 5% spray + Early weeding',
    mandiPriceRange: '₹4,800 – ₹5,600 per quintal (TD-5 / White Jute MSP: ₹5,050)',
    harvestingTip: 'Harvest at 50% flowering stage (120-135 days) for optimal fiber strength and luster.'
  },
  barley: {
    category: 'Rabi Cereal / Malt & Feed',
    waterNeeds: 'Low-Moderate (High drought and salinity tolerance)',
    irrigationTip: 'Provide 2-3 irrigations (tillering and heading stages). Avoid late watering to preserve malting grain quality.',
    waterQtyLiters: 1100,
    fertilizer: {
      type: 'Urea (35 kg) + DAP (25 kg) + MOP (15 kg) per acre',
      quantityKg: 20,
      unit: 'kg/acre',
      micro: 'Zinc Sulphate @ 8 kg/acre'
    },
    pestThreat: 'Stripe Rust, Covered Smut, Aphids',
    pestRemedy: 'Tebuconazole 2% DS @ 1.5g/kg seed for smut; Imidacloprid @ 0.5ml/L for aphids',
    organicPest: 'Trichoderma viride seed treatment @ 5g/kg seed',
    mandiPriceRange: '₹1,850 – ₹2,350 per quintal (MSP: ₹1,850, Malt grade premium)',
    harvestingTip: 'Harvest when grain is hard and straw turns light golden; thresh at 12% moisture.'
  },
  bajra: {
    category: 'Kharif Nutri-Cereal / Pearl Millet',
    waterNeeds: 'Low (Highly drought hardy and arid climate adapted)',
    irrigationTip: 'Grown largely rainfed. One protective irrigation at panicle emergence significantly boosts grain weight.',
    waterQtyLiters: 750,
    fertilizer: {
      type: 'Urea (30 kg) + DAP (25 kg) + Potash (15 kg) per acre',
      quantityKg: 18,
      unit: 'kg/acre',
      micro: 'Zinc Sulphate (10 kg) + Azospirillum bio-fertilizer seed inoculation'
    },
    pestThreat: 'Downy Mildew (Green Ear), Ergot (Claviceps fusiformis), Shoot Fly',
    pestRemedy: 'Metalaxyl 35% WS @ 6g/kg seed treatment for downy mildew; Thiamethoxam 30% FS for shoot fly',
    organicPest: 'Salt water 10% flotation treatment to remove ergot sclerotia before sowing',
    mandiPriceRange: '₹2,500 – ₹2,850 per quintal (MSP: ₹2,500)',
    harvestingTip: 'Harvest when earheads are fully dried and grains become flinty and firm.'
  },
  jowar: {
    category: 'Kharif/Rabi Nutri-Cereal / Sorghum',
    waterNeeds: 'Low-Moderate (Extensive root system with high moisture extraction)',
    irrigationTip: 'Provide protective irrigation at boot leaf stage and grain filling stage if dry spell occurs.',
    waterQtyLiters: 900,
    fertilizer: {
      type: 'NPK 80:40:40 kg/ha (Urea + SSP + MOP) in split doses',
      quantityKg: 20,
      unit: 'kg/acre',
      micro: 'Iron (FeSO4) 0.5% spray if iron chlorosis appears on calcareous black soils'
    },
    pestThreat: 'Sorghum Shoot Fly (Atherigona soccata), Stem Borer, Grain Mold',
    pestRemedy: 'Carbofuran 3G @ 3kg/acre in seed furrow or Chlorantraniliprole 18.5% SC @ 0.3ml/L',
    organicPest: 'High seed rate (12 kg/ha) + Thinning out dead-heart seedlings at 10 DAS',
    mandiPriceRange: '₹3,180 – ₹3,850 per quintal (MSP: ₹3,180 Maldandi variety premium)',
    harvestingTip: 'Harvest when black spot appears at bottom of grain indicating physiological maturity.'
  },
  ragi: {
    category: 'Nutri-Cereal / Finger Millet',
    waterNeeds: 'Low-Moderate (High calcium and dietary fiber superfood)',
    irrigationTip: 'Mainly rainfed; provide 1-2 protective waterings at tillering and flowering if rain fails.',
    waterQtyLiters: 850,
    fertilizer: {
      type: 'FYM 5 tons + Urea (25 kg) + SSP (30 kg) + MOP (15 kg) per acre',
      quantityKg: 18,
      unit: 'kg/acre',
      micro: 'Zinc Sulphate @ 10 kg/acre + Azotobacter seed treatment'
    },
    pestThreat: 'Ragi Blast (Pyricularia grisea), Stem Borer, Aphids',
    pestRemedy: 'Tricyclazole 75% WP @ 0.6g/L or Kitazin 48% EC @ 1ml/L for blast control',
    organicPest: 'Pseudomonas fluorescens 10g/L spray + Resistant varieties (GPU-28, ML-365)',
    mandiPriceRange: '₹3,846 – ₹4,400 per quintal (MSP: ₹3,846)',
    harvestingTip: 'Harvest earheads when they turn brown with sickle; sun-dry before threshing.'
  }
};

// Deep Indian Agro-Climatic, Soil & Regional Mandi Matrix based on User Given Location
const getAgroClimaticInfo = (location) => {
  const loc = (location || '').toLowerCase();

  if (loc.includes('maharashtra') || loc.includes('nashik') || loc.includes('pune') || loc.includes('nagpur') || loc.includes('latur') || loc.includes('solapur') || loc.includes('aurangabad') || loc.includes('chhatrapati sambhajinagar') || loc.includes('amravati') || loc.includes('kolhapur') || loc.includes('sangli') || loc.includes('satara') || loc.includes('jalgaon') || loc.includes('ahmednagar')) {
    return {
      state: 'Maharashtra',
      zone: 'Western Dry/Semi-Arid Deccan Trap Zone',
      primarySoil: 'Deep Black Cotton Soil (Regur Clay - High moisture retention)',
      mandiHub: 'Lasalgaon / Pimpalgaon / Latur / Solapur APMC',
      university: 'MPKV Rahuri & PDKV Akola Agro-Advisory',
      soilAmendment: 'Soil is rich in potash and lime; apply Single Super Phosphate (SSP) to balance phosphate deficiency.'
    };
  }

  if (loc.includes('punjab') || loc.includes('ludhiana') || loc.includes('bathinda') || loc.includes('amritsar') || loc.includes('jalandhar') || loc.includes('patiala') || loc.includes('sangrur') || loc.includes('firozpur')) {
    return {
      state: 'Punjab',
      zone: 'Trans-Gangetic Plain (Alluvial High Productivity Granary)',
      primarySoil: 'Fertile Alluvial Loam (Indo-Gangetic Silt)',
      mandiHub: 'Khanna Grain Market (Asia’s largest) / Ludhiana / Bathinda APMC',
      university: 'PAU Ludhiana Agronomy Guidelines',
      soilAmendment: 'Intensively cropped alluvial soil; supplement Zinc Sulphate 21% @ 10-12 kg/acre to prevent Khaira disease/chlorosis.'
    };
  }

  if (loc.includes('haryana') || loc.includes('karnal') || loc.includes('hisar') || loc.includes('sirsa') || loc.includes('kurukshetra') || loc.includes('ambala') || loc.includes('rohtak') || loc.includes('panipat')) {
    return {
      state: 'Haryana',
      zone: 'Semi-Arid Indo-Gangetic Alluvial & Sandy Loam Zone',
      primarySoil: 'Alluvial Loam to Sandy Loam',
      mandiHub: 'Karnal Anaj Mandi / Sirsa / Hisar Grain Market',
      university: 'CCS HAU Hisar Agro-Advisory',
      soilAmendment: 'High water-table in canal zones; ensure laser leveling and apply Gypsum in saline-alkali patches.'
    };
  }

  if (loc.includes('uttar pradesh') || loc.includes('up') || loc.includes('varanasi') || loc.includes('agra') || loc.includes('lucknow') || loc.includes('kanpur') || loc.includes('prayagraj') || loc.includes('gorakhpur') || loc.includes('meerut') || loc.includes('muzaffarnagar') || loc.includes('bareilly') || loc.includes('aligarh') || loc.includes('jhansi')) {
    return {
      state: 'Uttar Pradesh',
      zone: 'Middle Gangetic Plains Agro-Climatic Zone',
      primarySoil: 'Deep Alluvial Silt (Khadar & Bhangar Soils)',
      mandiHub: 'Varanasi / Agra / Muzaffarnagar / Farrukhabad APMC',
      university: 'CSA Kanpur & GBPUAT Agro-Advisory',
      soilAmendment: 'Rich in organic potential; top-dress balanced NPK with Azotobacter/PSB bio-fertilizers.'
    };
  }

  if (loc.includes('madhya pradesh') || loc.includes('mp') || loc.includes('indore') || loc.includes('bhopal') || loc.includes('ujjain') || loc.includes('jabalpur') || loc.includes('gwalior') || loc.includes('sagar') || loc.includes('ratlam') || loc.includes('mandsaur') || loc.includes('neemuch')) {
    return {
      state: 'Madhya Pradesh',
      zone: 'Central Plateau & Malwa Black Soil Agro-Zone',
      primarySoil: 'Medium to Heavy Black Soil (Vertisols)',
      mandiHub: 'Indore Mandi / Ujjain / Neemuch APMC (Major Soybean & Wheat Hub)',
      university: 'RVSKVV Gwalior & JNKVV Jabalpur Guidelines',
      soilAmendment: 'Heavy clay soil prone to cracking; maintain trash mulching and apply elemental Sulphur for oilseed crops.'
    };
  }

  if (loc.includes('gujarat') || loc.includes('rajkot') || loc.includes('ahmedabad') || loc.includes('surat') || loc.includes('vadodara') || loc.includes('junagadh') || loc.includes('bhavnagar') || loc.includes('jamnagar') || loc.includes('kutch') || loc.includes('mehsana') || loc.includes('unjha')) {
    return {
      state: 'Gujarat',
      zone: 'Gujarat Plains & Saurashtra Semi-Arid Arable Zone',
      primarySoil: 'Medium Black & Coastal Saline Alluvial Soil',
      mandiHub: 'Unjha Mandi (Asia’s biggest spice hub) / Rajkot / Gondal APMC',
      university: 'JAU Junagadh & AAU Anand Agro-Advisory',
      soilAmendment: 'Coastal/semi-arid salinity risk; use drip fertigation and apply organic FYM to improve soil cation exchange.'
    };
  }

  if (loc.includes('rajasthan') || loc.includes('jaipur') || loc.includes('jodhpur') || loc.includes('kota') || loc.includes('bikaner') || loc.includes('sri ganganagar') || loc.includes('alwar') || loc.includes('udaipur') || loc.includes('bharatpur')) {
    return {
      state: 'Rajasthan',
      zone: 'Western Arid & Semi-Arid Desert Plain Zone',
      primarySoil: 'Sandy Arid Loam (Low water-holding capacity)',
      mandiHub: 'Kota Mandi / Bikaner / Sri Ganganagar APMC',
      university: 'MPUAT Udaipur & SKNAU Jobner Agro-Advisory',
      soilAmendment: 'Fast drainage and moisture loss; incorporate hydrogel or farmyard compost to boost water retention.'
    };
  }

  if (loc.includes('andhra pradesh') || loc.includes('andhra') || loc.includes('guntur') || loc.includes('vijayawada') || loc.includes('visakhapatnam') || loc.includes('kurnool') || loc.includes('tirupati') || loc.includes('kakinada') || loc.includes('nellore') || loc.includes('rajahmundry')) {
    return {
      state: 'Andhra Pradesh',
      zone: 'Southern Semi-Arid Coastal & Krishna-Godavari Delta Zone',
      primarySoil: 'Red Sandy Loam to Deltaic Alluvial Clay',
      mandiHub: 'Guntur Mirchi Yard (Asia’s biggest chili market) / Duggirala / Kurnool APMC',
      university: 'ANGRAU Guntur Agronomy Directives',
      soilAmendment: 'Red soils require regular organic green manuring (Dhaincha/Sunnhemp) and micronutrient boron sprays.'
    };
  }

  if (loc.includes('telangana') || loc.includes('hyderabad') || loc.includes('warangal') || loc.includes('nizamabad') || loc.includes('karimnagar') || loc.includes('khammam') || loc.includes('nalgonda')) {
    return {
      state: 'Telangana',
      zone: 'Telangana Plateau & Godavari Basin Agro-Zone',
      primarySoil: 'Red Sandy Loam (Chalka) & Deep Black Clay (Regur)',
      mandiHub: 'Enumamula Warangal (Major cotton market) / Nizamabad APMC',
      university: 'PJTSAU Hyderabad Agro-Advisory',
      soilAmendment: 'Supplement zinc and phosphorus; monitor nitrogen leaching during sudden thunderstorm showers.'
    };
  }

  if (loc.includes('tamil nadu') || loc.includes('chennai') || loc.includes('coimbatore') || loc.includes('madurai') || loc.includes('salem') || loc.includes('tiruchirappalli') || loc.includes('trichy') || loc.includes('erode') || loc.includes('thanjavur') || loc.includes('tirunelveli')) {
    return {
      state: 'Tamil Nadu',
      zone: 'Cauvery Delta & Southern Tropical Agro-Climatic Zone',
      primarySoil: 'Red Sandy Loam, Cauvery Delta Alluvium & Laterite',
      mandiHub: 'Erode Turmeric Market / Coimbatore / Thanjavur APMC',
      university: 'TNAU Coimbatore Agro-Meteorology Advisory',
      soilAmendment: 'Apply neem-coated urea and bio-fertilizer Azospirillum to maintain soil microbial health under high temperatures.'
    };
  }

  if (loc.includes('karnataka') || loc.includes('bengaluru') || loc.includes('bangalore') || loc.includes('mysuru') || loc.includes('hubballi') || loc.includes('hubli') || loc.includes('belagavi') || loc.includes('belgaum') || loc.includes('dharwad') || loc.includes('kolar') || loc.includes('shimoga') || loc.includes('shivamogga') || loc.includes('chikkamagaluru') || loc.includes('bellary')) {
    return {
      state: 'Karnataka',
      zone: 'Southern Dry & Transitional Deccan Agro-Zone',
      primarySoil: 'Red Sandy Loam (Maidan) & Deep Black Clay (North Karnataka)',
      mandiHub: 'Kolar Tomato Market / Byadgi Chili Mandi / Hubli APMC',
      university: 'UAS Bangalore & UAS Dharwad Guidelines',
      soilAmendment: 'Red soils require soil testing for available phosphorus; apply solubilizing bacteria (PSB).'
    };
  }

  if (loc.includes('kerala') || loc.includes('kochi') || loc.includes('thiruvananthapuram') || loc.includes('kozhikode') || loc.includes('wayanad') || loc.includes('palakkad') || loc.includes('idukki') || loc.includes('kottayam') || loc.includes('thrissur')) {
    return {
      state: 'Kerala',
      zone: 'Southern Tropical Western Ghats & Humid Coastal Zone',
      primarySoil: 'Acidic Laterite & Coastal Alluvial Sandy Loam',
      mandiHub: 'Kottayam Rubber/Spice Market / Wayanad Spices Pool / Kochi Auction',
      university: 'KAU Thrissur Agro-Advisory',
      soilAmendment: 'Soil is acidic (pH 4.5-5.8); broadcast agricultural lime or dolomite @ 200 kg/acre to neutralize acidity.'
    };
  }

  if (loc.includes('bihar') || loc.includes('patna') || loc.includes('gaya') || loc.includes('muzaffarpur') || loc.includes('bhagalpur') || loc.includes('purnia') || loc.includes('darbhanga') || loc.includes('motihari')) {
    return {
      state: 'Bihar',
      zone: 'Middle Gangetic North & South Alluvial Plain',
      primarySoil: 'North Gangetic Calcareous Alluvium & Sandy Silt',
      mandiHub: 'Gulabbagh Purnia (Eastern India’s largest maize hub) / Patna APMC',
      university: 'BAU Sabour & RPCAU Pusa Directives',
      soilAmendment: 'Calcareous soils with high pH; apply chelated iron and zinc to prevent micronutrient lock-up.'
    };
  }

  if (loc.includes('bengal') || loc.includes('west bengal') || loc.includes('kolkata') || loc.includes('burdwan') || loc.includes('bardhaman') || loc.includes('hooghly') || loc.includes('siliguri') || loc.includes('malda') || loc.includes('murshidabad') || loc.includes('jalpaiguri')) {
    return {
      state: 'West Bengal',
      zone: 'Lower Gangetic Plain & Terai Humid Agricultural Zone',
      primarySoil: 'Ganga-Brahmaputra Deltaic Silt & Terai Alluvium',
      mandiHub: 'Burdwan (Rice Bowl Mandi) / Hooghly Potato Market / Siliguri',
      university: 'BCKV Mohanpur & UBKV Guidelines',
      soilAmendment: 'Humid conditions accelerate fungal pathogens; maintain raised seedbeds and apply Trichoderma enriched compost.'
    };
  }

  if (loc.includes('odisha') || loc.includes('bhubaneswar') || loc.includes('cuttack') || loc.includes('sambalpur') || loc.includes('bargarh') || loc.includes('puri') || loc.includes('balasore')) {
    return {
      state: 'Odisha',
      zone: 'Eastern Coastal Plain & Mahanadi Delta Agro-Zone',
      primarySoil: 'Coastal Saline & Red-Yellow Lateritic Sandy Clay',
      mandiHub: 'Bargarh (Rice Bowl Mandi) / Cuttack / Sambalpur APMC',
      university: 'OUAT Bhubaneswar Advisory',
      soilAmendment: 'Prone to heavy monsoon drainage issues; ensure ridge planting and incorporate organic compost.'
    };
  }

  if (loc.includes('himachal') || loc.includes('shimla') || loc.includes('kullu') || loc.includes('mandi') || loc.includes('solan') || loc.includes('kangra') || loc.includes('chamba')) {
    return {
      state: 'Himachal Pradesh',
      zone: 'Western Himalayan Temperate Mountain Zone',
      primarySoil: 'Mountain Forest Brown Soil (Rich in humus, acidic to neutral)',
      mandiHub: 'Shimla Dhali Fruit Market / Solan / Parwanoo Mandi',
      university: 'Dr. YS Parmar UHF Nauni & CSKHPKV Palampur Guidelines',
      soilAmendment: 'Terraced slope drainage; protect tree basins with pine needle/grass mulch to retain snowmelt moisture.'
    };
  }

  if (loc.includes('kashmir') || loc.includes('jammu') || loc.includes('srinagar') || loc.includes('anantnag') || loc.includes('baramulla') || loc.includes('sopore')) {
    return {
      state: 'Jammu & Kashmir',
      zone: 'Temperate Alpine & Sub-Tropical Jammu Plains',
      primarySoil: 'Karewa Alluvial & Mountain Brown Loam',
      mandiHub: 'Sopore Apple Mandi (Asia’s 2nd largest fruit market) / Narwal Jammu',
      university: 'SKUAST Kashmir & Jammu Agro-Advisory',
      soilAmendment: 'High winter chill requirement; maintain orchard floor drainage and apply copper sprays post-harvest.'
    };
  }

  if (loc.includes('uttarakhand') || loc.includes('dehradun') || loc.includes('haridwar') || loc.includes('nainital') || loc.includes('haldwani') || loc.includes('udham singh nagar') || loc.includes('pantnagar')) {
    return {
      state: 'Uttarakhand',
      zone: 'Tarai-Bhabar & Himalayan Mountain Agro-Climatic Zone',
      primarySoil: 'Tarai Fertile Alluvial Silt & Mountain Loam',
      mandiHub: 'Haldwani Mandi / Rudrapur APMC / Dehradun',
      university: 'GBPUAT Pantnagar Agricultural Advisory',
      soilAmendment: 'Tarai zone has high fertility; avoid excess nitrogen to prevent lodging in cereal crops.'
    };
  }

  if (loc.includes('assam') || loc.includes('guwahati') || loc.includes('jorhat') || loc.includes('dibrugarh') || loc.includes('silchar') || loc.includes('nagaon')) {
    return {
      state: 'Assam',
      zone: 'Brahmaputra Valley Humid Tropical Agro-Zone',
      primarySoil: 'Brahmaputra Alluvial Acidic Soil (High organic matter)',
      mandiHub: 'Guwahati Tea Auction Centre / Nagaon APMC',
      university: 'AAU Jorhat Agro-Advisory',
      soilAmendment: 'Acidic soil requires periodic application of basic slag or agricultural lime @ 150 kg/acre.'
    };
  }

  return {
    state: location.split(',').pop()?.trim() || 'Regional India',
    zone: 'Indian Semi-Arid / Sub-Humid Agro-Climatic Zone',
    primarySoil: 'Regional Arable Agricultural Soil',
    mandiHub: 'Local District Agricultural Produce Market Committee (APMC)',
    university: 'ICAR / State Agricultural University Agromet Field Advisory',
    soilAmendment: 'Maintain balanced N-P-K fertilizer application and incorporate 5-8 tons/acre decomposed organic manure.'
  };
};

// Generate localized HTML advisory for 11 languages with location-specific data
const generateLocalizedAdvisoryHtml = ({ cropKey, cropData, location, language, weather, soilType, agroInfo }) => {
  const cropName = cropKey.charAt(0).toUpperCase() + cropKey.slice(1);
  const isHighHumidity = weather.humidity > 70;
  const isRaining = weather.rainfall > 5;
  const isHighTemp = weather.temperature > 34;

  const weatherContext = isRaining
    ? `Rainfall observed (${weather.rainfall}mm) in ${location}. Ensure field drainage channels are clear to prevent waterlogging.`
    : isHighTemp
    ? `High temperature (${weather.temperature}°C) in ${location} increasing evapotranspiration. Apply evening irrigation.`
    : `Current local weather in ${location}: ${weather.temperature}°C, ${weather.humidity}% humidity. Normal growth conditions.`;

  const diseaseWarning = isHighHumidity
    ? `⚠️ High humidity (${weather.humidity}%) in ${location} elevates risk of ${cropData.pestThreat}. Recommended action: ${cropData.pestRemedy}.`
    : `🛡️ Preventive care for ${location}: Monitor for ${cropData.pestThreat}. Apply ${cropData.organicPest}.`;

  const templates = {
    en: {
      badge: `📍 ${agroInfo.state} Regional Farm Advisory`,
      title: `Location-Specific AI Advisory for ${cropName} (${location})`,
      weatherLine: `Live Weather Station (${location}): Temp ${weather.temperature}°C, Humidity ${weather.humidity}%, Rain: ${weather.rainfall}mm, Sky: ${weather.condition}`,
      agroLine: `Agro-Climatic Zone: ${agroInfo.zone} | Primary Soil: ${soilType || agroInfo.primarySoil}`,
      items: [
        `💧 <strong>Irrigation Schedule:</strong> ${cropData.irrigationTip} (${weatherContext})`,
        `🌱 <strong>Fertilizer & Soil Nutrition (${agroInfo.state}):</strong> ${cropData.fertilizer.type}. Micronutrients: <em>${cropData.fertilizer.micro}</em>. <strong>Soil note:</strong> ${agroInfo.soilAmendment}`,
        `🛡️ <strong>Pest & Disease Advisory:</strong> ${diseaseWarning}`,
        `📈 <strong>Regional Mandi Benchmark (${agroInfo.mandiHub}):</strong> ${cropName} trading at <strong>${cropData.mandiPriceRange}</strong>.`,
        `🏛️ <strong>Agronomy Guideline Reference:</strong> Validated in accordance with ${agroInfo.university} crop cultivation protocols.`
      ]
    },
    hi: {
      badge: `📍 ${agroInfo.state} क्षेत्रीय कृषि सलाह`,
      title: `${location} में ${cropName} फसल के लिए सटीक कृषि सलाह`,
      weatherLine: `स्थानीय मौसम (${location}): तापमान ${weather.temperature}°C, आर्द्रता ${weather.humidity}%, वर्षा: ${weather.rainfall}mm, आकाश: ${weather.condition}`,
      agroLine: `कृषि-जलवायु क्षेत्र: ${agroInfo.zone} | मिट्टी: ${soilType || agroInfo.primarySoil}`,
      items: [
        `💧 <strong>सिंचाई प्रबंधन:</strong> ${cropData.irrigationTip} (${weatherContext})`,
        `🌱 <strong>उर्वरक एवं पोषण (${agroInfo.state}):</strong> ${cropData.fertilizer.type}। सूक्ष्म पोषक: <em>${cropData.fertilizer.micro}</em>। <strong>मिट्टी सुधार:</strong> ${agroInfo.soilAmendment}`,
        `🛡️ <strong>कीट एवं रोग सुरक्षा:</strong> ${isHighHumidity ? `उच्च आर्द्रता (${weather.humidity}%) के कारण ${cropData.pestThreat} का खतरा है। अनुशंसित: ${cropData.pestRemedy}` : `निवारक उपाय: ${cropData.pestThreat} की निगरानी रखें। जैविक उपाय: ${cropData.organicPest}`}`,
        `📈 <strong>मंडी भाव विश्लेषण (${agroInfo.mandiHub}):</strong> ${cropName} का वर्तमान भाव <strong>${cropData.mandiPriceRange}</strong> है।`,
        `🏛️ <strong>कृषि दिशानिर्देश:</strong> ${agroInfo.university} के फसल प्रबंधन मानकों के अनुसार प्रमाणित।`
      ]
    },
    mr: {
      badge: `📍 ${agroInfo.state} प्रादेशिक कृषी सल्ला`,
      title: `${location} साठी ${cropName} पिकाचा अचूक कृषी सल्ला`,
      weatherLine: `स्थानिक हवामान (${location}): तापमान ${weather.temperature}°C, आर्द्रता ${weather.humidity}%, पाऊस: ${weather.rainfall}mm, आकाश: ${weather.condition}`,
      agroLine: `कृषी हवामान विभाग: ${agroInfo.zone} | जमीन: ${soilType || agroInfo.primarySoil}`,
      items: [
        `💧 <strong>सिंचन व्यवस्थापन:</strong> ${cropData.irrigationTip}`,
        `🌱 <strong>खत व पोषण व्यवस्थापन (${agroInfo.state}):</strong> ${cropData.fertilizer.type}. सूक्ष्म अन्नद्रव्ये: <em>${cropData.fertilizer.micro}</em>. <strong>जमीन सुधारणा:</strong> ${agroInfo.soilAmendment}`,
        `🛡️ <strong>कीड व रोग संरक्षण:</strong> ${isHighHumidity ? `हवेतील आर्द्रता (${weather.humidity}%) मुळे ${cropData.pestThreat} चा प्रादुर्भाव संभवतो. उपाय: ${cropData.pestRemedy}` : `प्रतिबंधात्मक काळजी: ${cropData.pestThreat} चे निरीक्षण करा. सेंद्रिय उपाय: ${cropData.organicPest}`}`,
        `📈 <strong>बाजारभाव आढावा (${agroInfo.mandiHub}):</strong> ${cropName} चे भाव <strong>${cropData.mandiPriceRange}</strong> आहेत.`,
        `🏛️ <strong>कृषी विद्यापीठ सल्ला:</strong> ${agroInfo.university} च्या मार्गदर्शक सूचनांनुसार.`
      ]
    },
    ta: {
      badge: `📍 ${agroInfo.state} பகுதி விவசாய ஆலோசனை`,
      title: `${location} இல் ${cropName} பயிருக்கான துல்லிய விவசாய ஆலோசனை`,
      weatherLine: `வானிலை (${location}): வெப்பநிலை ${weather.temperature}°C, ஈரப்பதம் ${weather.humidity}%, மழை: ${weather.rainfall}mm`,
      agroLine: `வேளாண் காலநிலை மண்டலம்: ${agroInfo.zone}`,
      items: [
        `💧 <strong>நீர்ப்பாசனம்:</strong> ${cropData.irrigationTip}`,
        `🌱 <strong>உர மேலாண்மை (${agroInfo.state}):</strong> ${cropData.fertilizer.type}. நுண்ணூட்டம்: <em>${cropData.fertilizer.micro}</em>. ${agroInfo.soilAmendment}`,
        `🛡️ <strong>பூச்சி மற்றும் நோய் பாதுகாப்பு:</strong> ${cropData.pestThreat}. பரிந்துரை: ${cropData.pestRemedy}`,
        `📈 <strong>சந்தை விலை நிலவரம் (${agroInfo.mandiHub}):</strong> ${cropName} சந்தை விலை <strong>${cropData.mandiPriceRange}</strong>.`,
        `🏛️ <strong>பரிந்துரை:</strong> ${agroInfo.university} வழிகாட்டுதலின்படி.`
      ]
    },
    te: {
      badge: `📍 ${agroInfo.state} ప్రాంతీయ వ్యవసాయ సలహా`,
      title: `${location} లో ${cropName} పంట కోసం ప్రత్యేక వ్యవసాయ సలహా`,
      weatherLine: `వాతావరణం (${location}): ఉష్ణోగ్రత ${weather.temperature}°C, తేమ ${weather.humidity}%, వర్షం: ${weather.rainfall}mm`,
      agroLine: `వ్యవసాయ వాతావరణ మండలం: ${agroInfo.zone}`,
      items: [
        `💧 <strong>నీటి పారుదల:</strong> ${cropData.irrigationTip}`,
        `🌱 <strong>ఎరువుల మోతాదు (${agroInfo.state}):</strong> ${cropData.fertilizer.type}. సూక్ష్మ పోషకాలు: <em>${cropData.fertilizer.micro}</em>. ${agroInfo.soilAmendment}`,
        `🛡️ <strong>తెగుళ్ల నివారణ:</strong> ${cropData.pestThreat}. సిఫార్సు: ${cropData.pestRemedy}`,
        `📈 <strong>మార్కెట్ ధర (${agroInfo.mandiHub}):</strong> ${cropName} మార్కెట్ ధర <strong>${cropData.mandiPriceRange}</strong>.`,
        `🏛️ <strong>వ్యవసాయ పరిశోధన:</strong> ${agroInfo.university} మార్గదర్శకాల ప్రకారం.`
      ]
    },
    bn: {
      badge: `📍 ${agroInfo.state} আঞ্চলিক কৃষি পরামর্শ`,
      title: `${location} অঞ্চলে ${cropName} ফসলের নির্দিষ্ট কৃষি পরামর্শ`,
      weatherLine: `স্থানীয় আবহাওয়া (${location}): তাপমাত্রা ${weather.temperature}°C, আর্দ্রতা ${weather.humidity}%, বৃষ্টি: ${weather.rainfall}mm`,
      agroLine: `কৃষি-আবহাওয়া অঞ্চল: ${agroInfo.zone}`,
      items: [
        `💧 <strong>সেচ ব্যবস্থাপনা:</strong> ${cropData.irrigationTip}`,
        `🌱 <strong>সার প্রয়োগ (${agroInfo.state}):</strong> ${cropData.fertilizer.type}। অনুখাদ্য: <em>${cropData.fertilizer.micro}</em>। ${agroInfo.soilAmendment}`,
        `🛡️ <strong>বালাই ব্যবস্থাপনা:</strong> ${cropData.pestThreat}। প্রতিকার: ${cropData.pestRemedy}`,
        `📈 <strong>বাজার দর (${agroInfo.mandiHub}):</strong> ${cropName} বাজার দর <strong>${cropData.mandiPriceRange}</strong>।`,
        `🏛️ <strong>কৃষি নির্দেশিকা:</strong> ${agroInfo.university} এর নির্দেশানুসারে প্রস্তুত।`
      ]
    },
    gu: {
      badge: `📍 ${agroInfo.state} પ્રાદેશિક કૃષિ સલાહ`,
      title: `${location} માટે ${cropName} પાક ની સચોટ કૃષિ સલાહ`,
      weatherLine: `હવામાન (${location}): તાપમાન ${weather.temperature}°C, ભેજ ${weather.humidity}%, વરસાદ: ${weather.rainfall}mm`,
      agroLine: `કૃષિ-આબોહવા ઝોન: ${agroInfo.zone}`,
      items: [
        `💧 <strong>પિયત વ્યવસ્થાપન:</strong> ${cropData.irrigationTip}`,
        `🌱 <strong>ખાતર ભલામણ (${agroInfo.state}):</strong> ${cropData.fertilizer.type}. સુક્ષ્મ તત્વો: <em>${cropData.fertilizer.micro}</em>. ${agroInfo.soilAmendment}`,
        `🛡️ <strong>રોગ નિયંત્રણ:</strong> ${cropData.pestThreat}. ઉપાય: ${cropData.pestRemedy}`,
        `📈 <strong>બજાર ભાવ (${agroInfo.mandiHub}):</strong> ${cropName} બજાર ભાવ <strong>${cropData.mandiPriceRange}</strong>.`,
        `🏛️ <strong>કૃષિ યુનિવર્સિટી માર્ગદર્શિકા:</strong> ${agroInfo.university} મુજબ.`
      ]
    },
    kn: {
      badge: `📍 ${agroInfo.state} ಪ್ರಾದೇಶಿಕ ಕೃಷಿ ಸಲಹೆ`,
      title: `${location} ನಲ್ಲಿ ${cropName} ಬೆಳೆಗೆ ನಿಖರ ಕೃಷಿ ಸಲಹೆ`,
      weatherLine: `ಹವಾಮಾನ (${location}): ತಾಪಮಾನ ${weather.temperature}°C, ಆರ್ದ್ರತೆ ${weather.humidity}%, ಮಳೆ: ${weather.rainfall}mm`,
      agroLine: `ಕೃಷಿ ಹವಾಮಾನ ವಲಯ: ${agroInfo.zone}`,
      items: [
        `💧 <strong>ನೀರಾವರಿ ನಿರ್ವಹಣೆ:</strong> ${cropData.irrigationTip}`,
        `🌱 <strong>ಗೊಬ್ಬರ ಶಿಫಾರಸು (${agroInfo.state}):</strong> ${cropData.fertilizer.type}. ಸೂಕ್ಷ್ಮ ಪೋಷಕಾಂಶ: <em>${cropData.fertilizer.micro}</em>. ${agroInfo.soilAmendment}`,
        `🛡️ <strong>ರೋಗ ನಿಯಂತ್ರಣ:</strong> ${cropData.pestThreat}. ಪರಿಹಾರ: ${cropData.pestRemedy}`,
        `📈 <strong>ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ (${agroInfo.mandiHub}):</strong> ${cropName} ಮಾರುಕಟ್ಟೆ ಬೆಲೆ <strong>${cropData.mandiPriceRange}</strong>.`,
        `🏛️ <strong>ಕೃಷಿ ವಿಶ್ವವಿದ್ಯಾಲಯ:</strong> ${agroInfo.university} ಶಿಫಾರಸಿನಂತೆ.`
      ]
    },
    ml: {
      badge: `📍 ${agroInfo.state} കാർഷിക ഉപദേശം`,
      title: `${location} പ്രദേശത്തെ ${cropName} കൃഷി ഉപദേശം`,
      weatherLine: `കാലാവസ്ഥ (${location}): താപനില ${weather.temperature}°C, ഈർപ്പം ${weather.humidity}%, മഴ: ${weather.rainfall}mm`,
      agroLine: `മേഖല: ${agroInfo.zone}`,
      items: [
        `💧 <strong>നനയ്ക്കൽ രീതി:</strong> ${cropData.irrigationTip}`,
        `🌱 <strong>വളപ്രയോഗം (${agroInfo.state}):</strong> ${cropData.fertilizer.type}. സൂക്ഷ്മ മൂലകങ്ങൾ: <em>${cropData.fertilizer.micro}</em>. ${agroInfo.soilAmendment}`,
        `🛡️ <strong>രോഗ നിയന്ത്രണം:</strong> ${cropData.pestThreat}. പരിഹാരം: ${cropData.pestRemedy}`,
        `📈 <strong>വിപണി വില (${agroInfo.mandiHub}):</strong> ${cropName} വിപണി വില <strong>${cropData.mandiPriceRange}</strong>.`,
        `🏛️ <strong>കാർഷിക സർവ്വകലാശാല:</strong> ${agroInfo.university} നിർദ്ദേശങ്ങൾ പ്രകാരം.`
      ]
    },
    pa: {
      badge: `📍 ${agroInfo.state} ਖੇਤਰੀ ਖੇਤੀਬਾੜੀ ਸਲਾਹ`,
      title: `${location} ਲਈ ${cropName} ਫ਼ਸਲ ਦੀ ਸਟੀਕ ਖੇਤੀਬਾੜੀ ਸਲਾਹ`,
      weatherLine: `ਮੌਸਮ (${location}): ਤਾਪਮਾਨ ${weather.temperature}°C, ਨਮੀ ${weather.humidity}%, ਮੀਂਹ: ${weather.rainfall}mm`,
      agroLine: `ਖੇਤਰ: ${agroInfo.zone}`,
      items: [
        `💧 <strong>ਸਿੰਚਾਈ ਪ੍ਰਬੰਧਨ:</strong> ${cropData.irrigationTip}`,
        `🌱 <strong>ਖਾਦ ਸਿਫ਼ਾਰਸ਼ (${agroInfo.state}):</strong> ${cropData.fertilizer.type}. ਸੂਖਮ ਤੱਤ: <em>${cropData.fertilizer.micro}</em>. <strong>ਮਿੱਟੀ ਸੰਭਾਲ:</strong> ${agroInfo.soilAmendment}`,
        `🛡️ <strong>ਬੀਮਾਰੀ ਰੋਕਥਾਮ:</strong> ${cropData.pestThreat}. ਇਲਾਜ: ${cropData.pestRemedy}`,
        `📈 <strong>ਮੰਡੀ ਭਾਅ (${agroInfo.mandiHub}):</strong> ${cropName} ਮੰਡੀ ਭਾਅ <strong>${cropData.mandiPriceRange}</strong>.`,
        `🏛️ <strong>ਪੰਜਾਬ ਐਗਰੀਕਲਚਰਲ ਯੂਨੀਵਰਸਿਟੀ / ਖੋਜ ਕੇਂਦਰ:</strong> ${agroInfo.university} ਅਨੁਸਾਰ ਪ੍ਰਮਾਣਿਤ।`
      ]
    },
    or: {
      badge: `📍 ${agroInfo.state} ଆଞ୍ଚଳିକ କୃଷି ପରାମର୍ଶ`,
      title: `${location} ରେ ${cropName} ଫସଲ ପାଇଁ ସଠିକ କୃଷି ପରାମର୍ଶ`,
      weatherLine: `ସ୍ଥାନୀୟ ପାଣିପାଗ (${location}): ତାପମାତ୍ରା ${weather.temperature}°C, ଆର୍ଦ୍ରତା ${weather.humidity}%, ବର୍ଷା: ${weather.rainfall}mm`,
      agroLine: `କୃଷି-ପାଣିପାଗ ଅଞ୍ଚଳ: ${agroInfo.zone}`,
      items: [
        `💧 <strong>ଜଳସେଚନ:</strong> ${cropData.irrigationTip}`,
        `🌱 <strong>ଖତ ପ୍ରୟୋଗ (${agroInfo.state}):</strong> ${cropData.fertilizer.type}। ଅଣୁ ପୋଷକ: <em>${cropData.fertilizer.micro}</em>। ${agroInfo.soilAmendment}`,
        `🛡️ <strong>ରୋଗ ନିୟନ୍ତ୍ରଣ:</strong> ${cropData.pestThreat}। ପ୍ରତିକାର: ${cropData.pestRemedy}`,
        `📈 <strong>ମଣ୍ଡି ଦର (${agroInfo.mandiHub}):</strong> ${cropName} ମଣ୍ଡି ଦର <strong>${cropData.mandiPriceRange}</strong>।`,
        `🏛️ <strong>କୃଷି ନିର୍ଦ୍ଦେଶାବଳୀ:</strong> ${agroInfo.university} ନିର୍ଦ୍ଦେଶ ଅନୁଯାୟୀ।`
      ]
    }
  };

  const t = templates[language] || templates.en;

  return `
    <div class="advisory-content" style="display: flex; flex-direction: column; gap: 14px;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <h4 style="color: #60a5fa; font-size: 17px; font-weight: 700; margin: 0;">${t.title}</h4>
        <span style="font-size: 11px; padding: 4px 10px; background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(96, 165, 250, 0.4); border-radius: 999px; color: #93c5fd; font-weight: 600;">${t.badge}</span>
      </div>
      <div style="background: rgba(15, 23, 42, 0.4); padding: 10px 14px; border-radius: 8px; border-left: 3px solid #38bdf8; font-size: 13px; color: #94a3b8; display: flex; flex-direction: column; gap: 4px;">
        <div><strong>${t.weatherLine}</strong></div>
        <div style="font-size: 12px; color: #cbd5e1;">${t.agroLine}</div>
      </div>
      <ul style="padding-left: 20px; color: #f1f5f9; display: flex; flex-direction: column; gap: 10px; margin: 0; line-height: 1.6; font-size: 14px;">
        ${t.items.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  `;
};

// Main Advisory Generator function with AI integration (Gemini, Claude, OpenAI) + Deep Agronomic Fallback
const generateAdvisory = async ({ farmerId, crop, location, lat, lng, language = 'en', soilType }) => {
  const targetCrop = (crop || 'wheat').toLowerCase().trim();
  const cropKey = CROP_AGRONOMY_DB[targetCrop] ? targetCrop : 'wheat';
  const cropData = CROP_AGRONOMY_DB[cropKey];

  const weather = await getWeatherForecast(location, lat, lng);
  const actualLocation = weather.location || location || 'Nashik, Maharashtra';
  const agroInfo = getAgroClimaticInfo(actualLocation);
  const soilDesc = soilType || agroInfo.primarySoil;

  let advisoryText = '';

  // 1. Check Google Gemini API
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (geminiKey && !advisoryText) {
    try {
      const prompt = `You are a certified agricultural scientist and agronomist for Indian farmers.
Generate a specific, highly accurate agricultural advisory for:
- Crop: ${cropKey.toUpperCase()} (${cropData.category})
- User Location: ${actualLocation} (State: ${agroInfo.state}, Agro-Climatic Zone: ${agroInfo.zone})
- Soil Type: ${soilDesc}
- Nearby Primary Mandi Hub: ${agroInfo.mandiHub}
- Current Live Weather at Location: Temperature: ${weather.temperature}°C, Humidity: ${weather.humidity}%, Rain: ${weather.rainfall}mm, Sky: ${weather.condition}
- Requested Language: ${language}

Strict requirements:
1. Provide distinct agronomic advice specifically for ${cropKey.toUpperCase()} in ${actualLocation}, never generic advice.
2. Address irrigation with exact days interval and liters based on current local weather.
3. Recommend specific fertilizer dosages (e.g., NPK ratio, Urea, DAP, MOP, micronutrients in kg/acre) tailored to ${agroInfo.state}'s soil conditions.
4. Identify real-world pests & diseases for ${cropKey.toUpperCase()} with chemical & bio-remedies.
5. Provide real-market benchmark Mandi price range in ₹/quintal for ${cropKey.toUpperCase()} at ${agroInfo.mandiHub}.
6. Write directly in ${language} using clean HTML (<h4>, <p>, <ul>, <li>, <strong>).`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 850, temperature: 0.2 }
        },
        { timeout: 8000 }
      );

      const generated = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generated) {
        advisoryText = generated.replace(/```html/g, '').replace(/```/g, '').trim();
      }
    } catch (err) {
      console.warn('⚠️ Gemini AI API call failed:', err.message);
    }
  }

  // 2. Check Anthropic Claude API
  const claudeKey = process.env.CLAUDE_API_KEY;
  if (claudeKey && !advisoryText) {
    try {
      const prompt = `You are an expert agronomic AI advisor for farmers in India.
Crop: ${cropKey.toUpperCase()} (${cropData.category}), Location: ${actualLocation} (${agroInfo.state}), Soil: ${soilDesc}.
Live Weather: Temp ${weather.temperature}°C, Humidity ${weather.humidity}%, Rain ${weather.rainfall}mm, Sky: ${weather.condition}.
Language: ${language}.
Provide a location-specific, crop-specific 4-step action advisory for ${cropKey} in ${actualLocation} in ${language} in HTML format.`;

      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 750,
          messages: [{ role: 'user', content: prompt }]
        },
        {
          headers: {
            'x-api-key': claudeKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          },
          timeout: 8000
        }
      );

      if (response.data?.content?.[0]?.text) {
        advisoryText = response.data.content[0].text;
      }
    } catch (err) {
      console.warn('⚠️ Claude API call failed:', err.message);
    }
  }

  // 3. Fallback: Deep Agronomic Domain Engine for All 25 Crops & All Indian Regions
  if (!advisoryText) {
    advisoryText = generateLocalizedAdvisoryHtml({
      cropKey,
      cropData,
      location: actualLocation,
      language,
      weather,
      soilType: soilDesc,
      agroInfo
    });
  }

  return {
    advisoryId: 'adv_' + Date.now(),
    farmerId: farmerId || 'farmer_demo_123',
    crop: cropKey.charAt(0).toUpperCase() + cropKey.slice(1),
    cropCategory: cropData.category,
    location: actualLocation,
    state: agroInfo.state,
    latitude: weather.latitude,
    longitude: weather.longitude,
    agroZone: agroInfo.zone,
    mandiHub: agroInfo.mandiHub,
    language,
    advisoryHtml: advisoryText,
    weatherSnapshot: {
      temperature: weather.temperature,
      humidity: weather.humidity,
      rainfall: weather.rainfall,
      condition: weather.condition,
      description: weather.description
    },
    recommendations: {
      irrigation: {
        required: weather.rainfall < 5,
        schedule: weather.rainfall > 5 ? 'Drain field, postpone irrigation' : 'Evening 5:00 PM - 7:00 PM',
        quantityLitersPerAcre: cropData.waterQtyLiters,
        tip: cropData.irrigationTip
      },
      fertilizer: {
        type: cropData.fertilizer.type,
        quantityKg: cropData.fertilizer.quantityKg,
        unit: cropData.fertilizer.unit,
        micronutrient: cropData.fertilizer.micro,
        regionalSoilAmendment: agroInfo.soilAmendment
      },
      pestControl: {
        threat: cropData.pestThreat,
        recommended: cropData.pestRemedy,
        organic: cropData.organicPest
      },
      mandiPrice: {
        crop: cropKey.toUpperCase(),
        range: cropData.mandiPriceRange,
        primaryMarket: agroInfo.mandiHub
      }
    },
    generatedAt: new Date().toISOString()
  };
};

module.exports = {
  generateAdvisory,
  CROP_AGRONOMY_DB,
  getAgroClimaticInfo
};
