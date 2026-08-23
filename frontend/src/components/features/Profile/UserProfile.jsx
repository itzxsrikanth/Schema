import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage, INDIAN_STATES, CROPS_LOCALIZED } from '../../../context/LanguageContext';
import { 
  User, 
  Landmark, 
  Sprout, 
  MapPin, 
  CheckCircle, 
  Layers, 
  DollarSign, 
  ShieldCheck, 
  Save, 
  ArrowRight
} from 'lucide-react';

const CROP_KEYS = [
  'wheat', 'rice', 'tomato', 'cotton', 'sugarcane', 'potato',
  'mustard', 'soybean', 'chana', 'groundnut', 'onion', 'chili',
  'apple', 'mango', 'banana', 'citrus', 'turmeric', 'tea', 'coffee', 'maize', 'bajra', 'jowar', 'ragi'
];

const PROFILE_TRANSLATIONS = {
  en: {
    pageTitle: 'Farmer Profile & Scheme Criteria',
    pageSubtitle: 'Manage your land holding, income, state, and farm details. These parameters are directly used to auto-match Government Schemes & Subsidies.',
    viewSchemesBtn: 'View Matched Schemes',
    savedSuccess: 'Profile saved successfully! Government schemes eligibility has been auto-updated with your new details.',
    totalLand: 'Total Land Holding',
    acres: 'Acres',
    farmingStateDist: 'Farming State & District',
    districtTxt: 'District',
    annualIncome: 'Annual Household Income',
    withinSubsidy: 'Within Scheme Subsidy Limits',
    directBenefit: 'Direct Benefit Status',
    aadhaarKccActive: 'Aadhaar & KCC Active',
    readyTransfer: 'Ready for Direct Transfer',
    schemeParamsTitle: 'Government Scheme Parameters',
    schemeParamsSubtitle: 'These parameters determine your eligibility for schemes like PM-KISAN, PMFBY, KCC, and SMAM subsidies.',
    farmSizeLabel: 'Total Farm / Land Size (in Acres) *',
    categoryLabel: 'Category',
    stateLabel: 'State / UT *',
    districtLabel: 'District / Taluka *',
    incomeLabel: 'Annual Family Household Income (₹) *',
    incomeHelp: 'Subsidies like SMAM & PM-KISAN prioritize incomes below ₹10,00,000.',
    ownershipLabel: 'Ownership Type',
    ownerCultivator: 'Owner Cultivator',
    tenantFarmer: 'Tenant Farmer',
    sharecropper: 'Sharecropper / Lessee',
    kccLabel: 'KCC Card Holder?',
    kccYes: 'Yes, Active KCC Card',
    kccNo: 'No, Need to Apply',
    aadhaarCheckboxTitle: 'Aadhaar Linked with Land Record (DBT Active)',
    aadhaarCheckboxDesc: 'Enables direct payment transfer for PM-KISAN and crop insurance subsidies.',
    contactInfoTitle: 'Farmer Contact Info',
    fullNameLabel: 'Full Name *',
    mobileLabel: 'Mobile Phone',
    emailLabel: 'Email Address',
    soilCultivationTitle: 'Soil & Cultivation Preferences',
    soilTypeLabel: 'Primary Soil Type',
    irrigationLabel: 'Irrigation Method',
    dripIrrigation: 'Drip / Micro-Irrigation',
    sprinklerIrrigation: 'Sprinkler Irrigation',
    canalIrrigation: 'Canal / Surface Irrigated',
    rainfedIrrigation: 'Rainfed / Dryland',
    cropsLabel: 'Cultivated Crops (Select all that apply)',
    saveBtn: 'Save Profile & Update Schemes',
    savingBtn: 'Saving & Syncing...',
    categories: {
      marginal: 'Marginal Farmer (Below 2.5 Acres)',
      small: 'Small Farmer (2.5 – 5.0 Acres)',
      semiMedium: 'Semi-Medium Farmer (5.0 – 10.0 Acres)',
      large: 'Large Farmer (Above 10.0 Acres)'
    },
    soilTypes: {
      black: 'Black Cotton Soil (Regur Clay)',
      alluvial: 'Alluvial Loam (Indo-Gangetic Silt)',
      red: 'Red Loam & Mixed Soil',
      laterite: 'Laterite Acidic Soil',
      clay: 'Heavy Clay Soil',
      sandy: 'Sandy Loam / Arid Soil',
      loamy: 'Standard Loamy Garden Soil'
    }
  },
  hi: {
    pageTitle: 'किसान प्रोफाइल एवं योजना पात्रता मानदंड',
    pageSubtitle: 'अपनी भूमि, आय, राज्य और कृषि विवरण प्रबंधित करें। ये विवरण सरकारी योजनाओं और सब्सिडी के मिलान हेतु उपयोग किए जाते हैं।',
    viewSchemesBtn: 'पात्र योजनाएं देखें',
    savedSuccess: 'प्रोफाइल सफलतापूर्वक सहेज ली गई है! सरकारी योजनाओं की पात्रता आपके नए विवरणों के साथ अपडेट कर दी गई है।',
    totalLand: 'कुल भूमि धारिता',
    acres: 'एकड़',
    farmingStateDist: 'कृषि राज्य एवं जिला',
    districtTxt: 'जिला',
    annualIncome: 'वार्षिक पारिवारिक आय',
    withinSubsidy: 'सब्सिडी सीमा के अंतर्गत',
    directBenefit: 'प्रत्यक्ष लाभ अंतरण (DBT)',
    aadhaarKccActive: 'आधार एवं केसीसी सक्रिय',
    readyTransfer: 'सीधे बैंक अंतरण हेतु तैयार',
    schemeParamsTitle: 'सरकारी योजना मानदंड',
    schemeParamsSubtitle: 'ये मानदंड पीएम-किसान, पीएमएफबीवाई, केसीसी और कृषि यंत्र सब्सिडी की पात्रता निर्धारित करते हैं।',
    farmSizeLabel: 'कुल कृषि भूमि (एकड़ में) *',
    categoryLabel: 'श्रेणी',
    stateLabel: 'राज्य / केंद्र शासित प्रदेश *',
    districtLabel: 'जिला / तालुका *',
    incomeLabel: 'वार्षिक पारिवारिक आय (₹) *',
    incomeHelp: 'पीएम-किसान और एसएमएएम योजनाएं ₹10,00,000 से कम आय वाले किसानों को प्राथमिकता देती हैं।',
    ownershipLabel: 'भूमि स्वामित्व प्रकार',
    ownerCultivator: 'स्वयं काश्तकार (मालिक)',
    tenantFarmer: 'बटाईदार / पट्टेदार किसान',
    sharecropper: 'हिस्सेदार काश्तकार',
    kccLabel: 'किसान क्रेडिट कार्ड (KCC)?',
    kccYes: 'हाँ, सक्रिय KCC कार्ड धारक',
    kccNo: 'नहीं, आवेदन करना है',
    aadhaarCheckboxTitle: 'आधार कार्ड भूमि रिकॉर्ड से लिंक है (DBT सक्रिय)',
    aadhaarCheckboxDesc: 'पीएम-किसान और फसल बीमा की राशि सीधे खाते में प्राप्त करने हेतु।',
    contactInfoTitle: 'किसान संपर्क विवरण',
    fullNameLabel: 'पूरा नाम *',
    mobileLabel: 'मोबाइल नंबर',
    emailLabel: 'ईमेल पता',
    soilCultivationTitle: 'मिट्टी एवं फसल प्राथमिकताएं',
    soilTypeLabel: 'मुख्य मिट्टी का प्रकार',
    irrigationLabel: 'सिंचाई की व्यवस्था',
    dripIrrigation: 'ड्रिप / सूक्ष्म सिंचाई',
    sprinklerIrrigation: 'स्प्रिंकलर (फव्वारा) सिंचाई',
    canalIrrigation: 'नहर / सतही सिंचाई',
    rainfedIrrigation: 'वर्षा आधारित / बारानी',
    cropsLabel: 'बोई जाने वाली फसलें (लागू सभी फसलें चुनें)',
    saveBtn: 'प्रोफाइल सहेजें एवं योजनाएं अपडेट करें',
    savingBtn: 'सहेजा जा रहा है...',
    categories: {
      marginal: 'सीमांत किसान (2.5 एकड़ से कम)',
      small: 'लघु किसान (2.5 – 5.0 एकड़)',
      semiMedium: 'अर्ध-मध्यम किसान (5.0 – 10.0 एकड़)',
      large: 'बड़े किसान (10.0 एकड़ से अधिक)'
    },
    soilTypes: {
      black: 'काली कपास मिट्टी (रेगुर)',
      alluvial: 'जलोढ़ दोमट मिट्टी',
      red: 'लाल एवं मिश्रित मिट्टी',
      laterite: 'लैटेराइट अम्लीय मिट्टी',
      clay: 'चिकनी मिट्टी',
      sandy: 'बलुई / रेतीली दोमट मिट्टी',
      loamy: 'मानक दोमट मिट्टी'
    }
  },
  mr: {
    pageTitle: 'शेतकरी प्रोफाइल व शासकीय योजना निकष',
    pageSubtitle: 'आपली जमीन, उत्पन्न, राज्य व पीक माहिती व्यवस्थापित करा. ही माहिती थेट शासकीय योजना व अनुदानासाठी वापरली जाते.',
    viewSchemesBtn: 'पात्र योजना पहा',
    savedSuccess: 'प्रोफाइल यशस्वीरित्या सेव्ह झाली! शासकीय योजनांची पात्रता अद्ययावत केली आहे.',
    totalLand: 'एकूण शेतजमीन',
    acres: 'एकर',
    farmingStateDist: 'राज्य व जिल्हा',
    districtTxt: 'जिल्हा',
    annualIncome: 'वार्षिक कौटुंबिक उत्पन्न',
    withinSubsidy: 'अनुदान मर्यादेत',
    directBenefit: 'थेट लाभ हस्तांतरण (DBT)',
    aadhaarKccActive: 'आधार व KCC सक्रिय',
    readyTransfer: 'थेट खात्यात वर्ग करण्यास पात्र',
    schemeParamsTitle: 'शासकीय योजनांचे निकष',
    schemeParamsSubtitle: 'हे निकष पीएम-किसान, पीक विमा, केसीसी आणि कृषी यांत्रिकीकरण अनुदानासाठी आवश्यक आहेत.',
    farmSizeLabel: 'एकूण शेतजमीन (एकरमध्ये) *',
    categoryLabel: 'शेतकरी वर्गवारी',
    stateLabel: 'राज्य / केंद्रशासित प्रदेश *',
    districtLabel: 'जिल्हा / तालुका *',
    incomeLabel: 'वार्षिक कौटुंबिक उत्पन्न (₹) *',
    incomeHelp: 'पीएम-किसान आणि कृषी अवजारे योजना १० लाख रुपयांपेक्षा कमी उत्पन्नास प्राधान्य देतात.',
    ownershipLabel: 'जमीन मालकी प्रकार',
    ownerCultivator: 'स्वतःचे मालकी शेतकरी',
    tenantFarmer: 'कुळ / भाडेतत्त्वावरील शेतकरी',
    sharecropper: 'बटाईदार शेतकरी',
    kccLabel: 'किसान क्रेडिट कार्ड आहे का?',
    kccYes: 'होय, सक्रिय KCC कार्ड आहे',
    kccNo: 'नाही, अर्ज करायचा आहे',
    aadhaarCheckboxTitle: 'आधार कार्ड ७/१२ जमिनीशी जोडलेले आहे (DBT सक्रिय)',
    aadhaarCheckboxDesc: 'पीएम-किसान आणि पीक विम्याची रक्कम थेट बँक खात्यात जमा होण्यासाठी.',
    contactInfoTitle: 'शेतकरी संपर्क माहिती',
    fullNameLabel: 'पूर्ण नाव *',
    mobileLabel: 'मोबाईल नंबर',
    emailLabel: 'ईमेल पत्ता',
    soilCultivationTitle: 'माती व पीक प्राधान्ये',
    soilTypeLabel: 'मुख्य मातीचा प्रकार',
    irrigationLabel: 'सिंचन पद्धत',
    dripIrrigation: 'ठिबक सिंचन',
    sprinklerIrrigation: 'तुषार सिंचन',
    canalIrrigation: 'कालवा / पाटपाणी',
    rainfedIrrigation: 'जिरायती / पावसावर आधारित',
    cropsLabel: 'घेतलेली पिके (लागू असलेली सर्व पिके निवडा)',
    saveBtn: 'प्रोफाइल जतन करा आणि योजना तपासा',
    savingBtn: 'जतन होत आहे...',
    categories: {
      marginal: 'अत्यल्प भूधारक शेतकरी (२.५ एकरापेक्षा कमी)',
      small: 'अल्प भूधारक शेतकरी (२.५ ते ५.० एकर)',
      semiMedium: 'मध्यम भूधारक शेतकरी (५.० ते १०.० एकर)',
      large: 'मोठे शेतकरी (१०.० एकरापेक्षा जास्त)'
    },
    soilTypes: {
      black: 'काळी कसदार माती (रेगूर)',
      alluvial: 'गाळाची सुपीक माती',
      red: 'तांबडी माती',
      laterite: 'जांभी माती',
      clay: 'चिकण माती',
      sandy: 'वाळूयुक्त रेताड माती',
      loamy: 'मध्यम दोमट माती'
    }
  },
  ta: {
    pageTitle: 'விவசாயி சுயவிவரம் மற்றும் அரசு திட்ட தகுதி',
    pageSubtitle: 'உங்கள் நில அளவு, வருமானம், மாநில விவரங்களை நிர்வகிக்கவும். இவை அரசு திட்டங்கள் மற்றும் மானியங்களை பெற நேரடியாகப் பயன்படுகின்றன.',
    viewSchemesBtn: 'தகுதியான திட்டங்களை காண்க',
    savedSuccess: 'விவரங்கள் வெற்றிகரமாக சேமிக்கப்பட்டன! அரசு திட்ட தகுதி புதுப்பிக்கப்பட்டது.',
    totalLand: 'மொத்த நில அளவு',
    acres: 'ஏக்கர்',
    farmingStateDist: 'மாநிலம் மற்றும் மாவட்டம்',
    districtTxt: 'மாவட்டம்',
    annualIncome: 'ஆண்டு குடும்ப வருமானம்',
    withinSubsidy: 'மானிய வரம்பிற்குள் உள்ளது',
    directBenefit: 'நேரடி மானியம் (DBT)',
    aadhaarKccActive: 'ஆதார் & KCC இணைக்கப்பட்டுள்ளது',
    readyTransfer: 'நேரடி வங்கி பரிமாற்றத்திற்கு தயார்',
    schemeParamsTitle: 'அரசு திட்ட அளவுருக்கள்',
    schemeParamsSubtitle: 'பிஎம்-கிசான், பயிர் காப்பீடு, கிசான் கிரெடிட் கார்டு மற்றும் இயந்திர மானியங்களுக்கான அளவுகோல்.',
    farmSizeLabel: 'மொத்த நிலப்பரப்பு (ஏக்கரில்) *',
    categoryLabel: 'விவசாயி பிரிவு',
    stateLabel: 'மாநிலம் / யூனியன் பிரதேசம் *',
    districtLabel: 'மாவட்டம் / தாலுகா *',
    incomeLabel: 'ஆண்டு குடும்ப வருமானம் (₹) *',
    incomeHelp: 'பிஎம்-கிசான் திட்டங்கள் ஆண்டு வருமானம் ₹10 லட்சத்திற்குள் உள்ளவர்களுக்கு முன்னுரிமை அளிக்கிறது.',
    ownershipLabel: 'நில உரிமை வகை',
    ownerCultivator: 'நில உரிமையாளர் விவசாயி',
    tenantFarmer: 'குத்தகை விவசாயி',
    sharecropper: 'பங்கு விவசாயி',
    kccLabel: 'KCC அட்டை உள்ளதா?',
    kccYes: 'ஆம், செயலில் உள்ள KCC அட்டை உள்ளது',
    kccNo: 'இல்லை, விண்ணப்பிக்க வேண்டும்',
    aadhaarCheckboxTitle: 'ஆதார் நில ஆவணத்துடன் இணைக்கப்பட்டுள்ளது (DBT)',
    aadhaarCheckboxDesc: 'மானியத் தொகை நேரடியாக வங்கி கணக்கில் வரவு வைக்க.',
    contactInfoTitle: 'தொடர்பு விவரங்கள்',
    fullNameLabel: 'முழு பெயர் *',
    mobileLabel: 'கைபேசி எண்',
    emailLabel: 'மின்னஞ்சல்',
    soilCultivationTitle: 'மண் மற்றும் பயிர் விருப்பங்கள்',
    soilTypeLabel: 'முதன்மை மண் வகை',
    irrigationLabel: 'பாசன முறை',
    dripIrrigation: 'சொட்டு நீர் பாசனம்',
    sprinklerIrrigation: 'தெளிப்பு நீர் பாசனம்',
    canalIrrigation: 'கால்வாய் பாசனம்',
    rainfedIrrigation: 'மானாவாரி / மழைநீர் பாசனம்',
    cropsLabel: 'பயிரிடப்படும் பயிர்கள் (தேர்வு செய்யவும்)',
    saveBtn: 'சுயவிவரத்தை சேமித்து திட்டங்களை புதுப்பிக்கவும்',
    savingBtn: 'சேமிக்கப்படுகிறது...',
    categories: {
      marginal: 'குறு விவசாயி (2.5 ஏக்கருக்கு கீழ்)',
      small: 'சிறு விவசாயி (2.5 – 5.0 ஏக்கர்)',
      semiMedium: 'நடுத்தர விவசாயி (5.0 – 10.0 ஏக்கர்)',
      large: 'பெரிய விவசாயி (10.0 ஏக்கருக்கு மேல்)'
    },
    soilTypes: {
      black: 'கரிசல் மண்',
      alluvial: 'வண்டல் மண்',
      red: 'செம்மண்',
      laterite: 'சரளை மண்',
      clay: 'களிமண்',
      sandy: 'மணல் மண்',
      loamy: 'இரு மண்பாடு'
    }
  },
  te: {
    pageTitle: 'రైతు ప్రొఫైల్ & ప్రభుత్వ పథకాల అర్హత',
    pageSubtitle: 'మీ భూమి, ఆదాయం, రాష్ట్ర వివరాలను నిర్వహించండి. ఇవి ప్రభుత్వ పథకాలు మరియు సబ్సిడీలను సరిపోల్చడానికి ఉపయోగపడతాయి.',
    viewSchemesBtn: 'అర్హత పథకాలను చూడండి',
    savedSuccess: 'ప్రొఫైల్ విజయవంతంగా సేవ్ చేయబడింది! ప్రభుత్వ పథకాల అర్హత నవీకరించబడింది.',
    totalLand: 'మొత్తం భూమి విస్తీర్ణం',
    acres: 'ఎకరాలు',
    farmingStateDist: 'వ్యవసాయ రాష్ట్రం & జిల్లా',
    districtTxt: 'జిల్లా',
    annualIncome: 'వార్షిక కుటుంబ ఆదాయం',
    withinSubsidy: 'సబ్సిడీ పరిమితి లోపల ఉంది',
    directBenefit: 'ప్రత్యక్ష లబ్ధి బదిలీ (DBT)',
    aadhaarKccActive: 'ఆధార్ & KCC యాక్టివ్',
    readyTransfer: 'బ్యాంకు ఖాతాకు బదిలీకి సిద్ధం',
    schemeParamsTitle: 'ప్రభుత్వ పథకాల ప్రమాణాలు',
    schemeParamsSubtitle: 'పీఎం-కిసాన్, పంట బీమా, కేసీసీ మరియు యంత్రాల సబ్సిడీల అర్హత కోసం.',
    farmSizeLabel: 'మొత్తం భూమి (ఎకరాలలో) *',
    categoryLabel: 'రైతు వర్గం',
    stateLabel: 'రాష్ట్రం / కేంద్రపాలిత ప్రాంతం *',
    districtLabel: 'జిల్లా / మండలం *',
    incomeLabel: 'వార్షిక కుటుంబ ఆదాయం (₹) *',
    incomeHelp: 'పీఎం-కిసాన్ పథకాలు ₹10 లక్షల లోపు ఆదాయం ఉన్న రైతులకు ప్రాధాన్యతనిస్తాయి.',
    ownershipLabel: 'భూమి యాజమాన్య రకం',
    ownerCultivator: 'స్వంత భూమి రైతు',
    tenantFarmer: 'కౌలు రైతు',
    sharecropper: 'వాటా రైతు',
    kccLabel: 'KCC కార్డ్ ఉందా?',
    kccYes: 'అవును, KCC కార్డ్ ఉంది',
    kccNo: 'లేదు, దరఖాస్తు చేసుకోవాలి',
    aadhaarCheckboxTitle: 'ఆధార్ భూమి రికార్డులతో లింక్ చేయబడింది (DBT)',
    aadhaarCheckboxDesc: 'సబ్సిడీ నిధులు నేరుగా బ్యాంక్ ఖాతాకు జమ కావడానికి.',
    contactInfoTitle: 'రైతు సంప్రదింపు వివరాలు',
    fullNameLabel: 'పూర్తి పేరు *',
    mobileLabel: 'మొబైల్ నంబర్',
    emailLabel: 'ఈమెయిల్',
    soilCultivationTitle: 'నేల & పంట వివరాలు',
    soilTypeLabel: 'ప్రధాన నేల రకం',
    irrigationLabel: 'నీటి పారుదల పద్ధతి',
    dripIrrigation: 'బిందు సేద్యం (డ్రిప్)',
    sprinklerIrrigation: 'తుంపర సేద్యం (స్ప్రింక్లర్)',
    canalIrrigation: 'కాలువ / ఉపరితల నీరు',
    rainfedIrrigation: 'వర్షాధార / మెట్ట భూమి',
    cropsLabel: 'సాగు చేసే పంటలు (ఎంచుకోండి)',
    saveBtn: 'సేవ్ చేసి పథకాలను అప్‌డేట్ చేయండి',
    savingBtn: 'సేవ్ అవుతోంది...',
    categories: {
      marginal: 'ఉపాంత రైతు (2.5 ఎకరాల కంటే తక్కువ)',
      small: 'చిన్న రైతు (2.5 – 5.0 ఎకరాలు)',
      semiMedium: 'మధ్య తరహా రైతు (5.0 – 10.0 ఎకరాలు)',
      large: 'పెద్ద రైతు (10.0 ఎకరాల కంటే ఎక్కువ)'
    },
    soilTypes: {
      black: 'నల్లరేగడి నేల',
      alluvial: 'ఒండ్రు నేల',
      red: 'ఎర్ర నేల',
      laterite: 'లేటరైట్ నేల',
      clay: 'బంకమట్టి నేల',
      sandy: 'ఇసుక నేల',
      loamy: 'దుబ్బ నేల'
    }
  },
  bn: {
    pageTitle: 'কৃষক প্রোফাইল ও সরকারি প্রকল্পের যোগ্যতা',
    pageSubtitle: 'আপনার জমির পরিমাণ, আয়, রাজ্য এবং ফসলের তথ্য পরিচালনা করুন। এই তথ্যগুলি সরকারি প্রকল্প ও ভর্তুকির জন্য সরাসরি ব্যবহৃত হয়।',
    viewSchemesBtn: 'যোগ্য প্রকল্প দেখুন',
    savedSuccess: 'প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে! আপনার নতুন তথ্যের সাথে সরকারি প্রকল্পের যোগ্যতা আপডেট হয়েছে।',
    totalLand: 'মোট কৃষিজমি',
    acres: 'একর',
    farmingStateDist: 'রাজ্য ও জেলা',
    districtTxt: 'জেলা',
    annualIncome: 'বার্ষিক পারিবারিক আয়',
    withinSubsidy: 'ভর্তুকি সীমার মধ্যে',
    directBenefit: 'সরাসরি সুবিধা হস্তান্তর (DBT)',
    aadhaarKccActive: 'আধার ও KCC সক্রিয়',
    readyTransfer: 'সরাসরি ব্যাংক হস্তান্তরের জন্য প্রস্তুত',
    schemeParamsTitle: 'সরকারি প্রকল্পের পরামিতি',
    schemeParamsSubtitle: 'পিএম-কিসান, ফসল বিমা, কেসিসি এবং কৃষি যন্ত্রপাতির ভর্তুকির জন্য প্রয়োজনীয়।',
    farmSizeLabel: 'মোট জমির পরিমাণ (একরে) *',
    categoryLabel: 'কৃষকের শ্রেণী',
    stateLabel: 'রাজ্য / কেন্দ্রশাসিত অঞ্চল *',
    districtLabel: 'জেলা / ব্লক *',
    incomeLabel: 'বার্ষিক পারিবারিক আয় (₹) *',
    incomeHelp: 'পিএম-কিসান এবং অন্যান্য প্রকল্প ₹১০ লক্ষের কম আয়ে অগ্রাধিকার দেয়।',
    ownershipLabel: 'জমির মালিকানার ধরন',
    ownerCultivator: 'নিজস্ব চাষী',
    tenantFarmer: 'ভাগচাষী / ইজারাদার',
    sharecropper: 'বর্গা চাষী',
    kccLabel: 'KCC কার্ড আছে কি?',
    kccYes: 'হ্যাঁ, সক্রিয় KCC কার্ড আছে',
    kccNo: 'না, আবেদন করতে হবে',
    aadhaarCheckboxTitle: 'আধার জমির রেকর্ডের সাথে যুক্ত (DBT সক্রিয়)',
    aadhaarCheckboxDesc: 'পিএম-কিসান ও ফসল বিমার টাকা সরাসরি ব্যাংক অ্যাকাউন্টে পাওয়ার জন্য।',
    contactInfoTitle: 'কৃষকের যোগাযোগের তথ্য',
    fullNameLabel: 'সম্পূর্ণ নাম *',
    mobileLabel: 'মোবাইল নম্বর',
    emailLabel: 'ইমেল ঠিকানা',
    soilCultivationTitle: 'মাটি ও ফসলের পছন্দ',
    soilTypeLabel: 'প্রধান মাটির ধরণ',
    irrigationLabel: 'সেচ পদ্ধতি',
    dripIrrigation: 'ড্রিপ / বিন্দু সেচ',
    sprinklerIrrigation: 'স্প্রিংকলার / ফোয়ারা সেচ',
    canalIrrigation: 'খাল / ভূপৃষ্ঠের জল',
    rainfedIrrigation: 'বৃষ্টি নির্ভর / অনাবাদী',
    cropsLabel: 'চাষকৃত ফসল (নির্বাচন করুন)',
    saveBtn: 'প্রোফাইল সংরক্ষণ করুন ও প্রকল্প আপডেট করুন',
    savingBtn: 'সংরক্ষণ করা হচ্ছে...',
    categories: {
      marginal: 'প্রান্তিক কৃষক (২.৫ একরের নিচে)',
      small: 'ক্ষুদ্র কৃষক (২.৫ – ৫.০ একর)',
      semiMedium: 'মাঝারি কৃষক (৫.০ – ১০.০ একর)',
      large: 'বৃহৎ কৃষক (১০.০ একরের উপরে)'
    },
    soilTypes: {
      black: 'কালো মাটি (রেগুর)',
      alluvial: 'পলিমাটি দোআঁশ',
      red: 'লাল মাটি',
      laterite: 'ল্যাটেরাইট মাটি',
      clay: 'এঁটেল মাটি',
      sandy: 'বেলে মাটি',
      loamy: 'দোআঁশ মাটি'
    }
  },
  gu: {
    pageTitle: 'ખેડૂત પ્રોફાઇલ અને સરકારી યોજના માપદંડ',
    pageSubtitle: 'તમારી જમીન, આવક, રાજ્ય અને ખેતીની વિગતો મેનેજ કરો. આ વિગતો સરકારી યોજનાઓ અને સબસિડી માટે સીધી વપરાય છે.',
    viewSchemesBtn: 'પાત્ર યોજનાઓ જુઓ',
    savedSuccess: 'પ્રોફાઇલ સફળતાપૂર્વક સાચવવામાં આવી! સરકારી યોજનાઓની પાત્રતા અપડેટ થઈ ગઈ છે.',
    totalLand: 'કુલ જમીન',
    acres: 'એકર',
    farmingStateDist: 'રાજ્ય અને જિલ્લો',
    districtTxt: 'જિલ્લો',
    annualIncome: 'વાર્ષિક કૌટુંબિક આવક',
    withinSubsidy: 'સબસિડી મર્યાદામાં',
    directBenefit: 'ડાયરેક્ટ બેનિફિટ ટ્રાન્સફર (DBT)',
    aadhaarKccActive: 'આધાર અને KCC સક્રિય',
    readyTransfer: 'સીધા ખાતામાં જમા થવા પાત્ર',
    schemeParamsTitle: 'સરકારી યોજનાના પરિમાણો',
    schemeParamsSubtitle: 'પીએમ-કિસાન, પાક વીમો, કેસીસી અને કૃષિ યંત્ર સબસિડી માટેના માપદંડ.',
    farmSizeLabel: 'કુલ ખેતી જમીન (એકરમાં) *',
    categoryLabel: 'ખેડૂત વર્ગ',
    stateLabel: 'રાજ્ય / કેન્દ્રશાસિત પ્રદેશ *',
    districtLabel: 'જિલ્લો / તાલુકો *',
    incomeLabel: 'વાર્ષિક કૌટુંબિક આવક (₹) *',
    incomeHelp: 'પીએમ-કિસાન યોજના ₹૧૦ લાખથી ઓછી આવક ધરાવતા ખેડૂતોને પ્રાથમિકતા આપે છે.',
    ownershipLabel: 'જમીન માલિકીનો પ્રકાર',
    ownerCultivator: 'સ્વ-માલિકી ખેડૂત',
    tenantFarmer: 'ભાગીદાર / ગણોતિયા ખેડૂત',
    sharecropper: 'ભાગિયા ખેડૂત',
    kccLabel: 'કિસાન ક્રેડિટ કાર્ડ (KCC)?',
    kccYes: 'હા, સક્રિય KCC કાર્ડ છે',
    kccNo: 'ના, અરજી કરવાની છે',
    aadhaarCheckboxTitle: 'આધાર કાર્ડ ૭/૧૨ જમીન સાથે લિંક છે (DBT)',
    aadhaarCheckboxDesc: 'સબસિડી અને વીમાની રકમ સીધા બેંક ખાતામાં મેળવવા માટે.',
    contactInfoTitle: 'ખેડૂત સંપર્ક વિગતો',
    fullNameLabel: 'પૂરું નામ *',
    mobileLabel: 'મોબાઇલ નંબર',
    emailLabel: 'ઈમેલ',
    soilCultivationTitle: 'જમીન અને પાકની પસંદગી',
    soilTypeLabel: 'મુખ્ય જમીનનો પ્રકાર',
    irrigationLabel: 'સિંચાઈ પદ્ધતિ',
    dripIrrigation: 'ટપક સિંચાઈ (ડ્રિપ)',
    sprinklerIrrigation: 'ફુવારા પદ્ધતિ',
    canalIrrigation: 'નહેર / સપાટી સિંચાઈ',
    rainfedIrrigation: 'વરસાદ આધારિત / બિનપિયત',
    cropsLabel: 'વાવેતર કરેલ પાક (પસંદ કરો)',
    saveBtn: 'પ્રોફાઇલ સાચવો અને યોજનાઓ અપડેટ કરો',
    savingBtn: 'સાચવી રહ્યું છે...',
    categories: {
      marginal: 'સીમાંત ખેડૂત (૨.૫ એકરથી ઓછી)',
      small: 'નાના ખેડૂત (૨.૫ – ૫.૦ એકર)',
      semiMedium: 'મધ્યમ ખેડૂત (૫.૦ – ૧૦.૦ એકર)',
      large: 'મોટા ખેડૂત (૧૦.૦ એકરથી વધુ)'
    },
    soilTypes: {
      black: 'કાળી કપાસની જમીન (રેગુર)',
      alluvial: 'કાંપની ગોરાડુ જમીન',
      red: 'રાતી / લાલ જમીન',
      laterite: 'પડખાઉ જમીન',
      clay: 'ચીકણી જમીન',
      sandy: 'રેતાળ જમીન',
      loamy: 'ગોરાડુ જમીન'
    }
  },
  kn: {
    pageTitle: 'ರೈತರ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಅರ್ಹತೆ',
    pageSubtitle: 'ನಿಮ್ಮ ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ, ಆದಾಯ, ರಾಜ್ಯದ ವಿವರಗಳನ್ನು ನಿರ್ವಹಿಸಿ. ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಸಬ್ಸಿಡಿಗಳನ್ನು ಹೊಂದಿಸಲು ಇವುಗಳನ್ನು ಬಳಸಲಾಗುತ್ತದೆ.',
    viewSchemesBtn: 'ಅರ್ಹ ಯೋಜನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    savedSuccess: 'ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ! ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಅರ್ಹತೆಯನ್ನು ನವೀಕರಿಸಲಾಗಿದೆ.',
    totalLand: 'ಒಟ್ಟು ಜಮೀನು',
    acres: 'ಎಕರೆ',
    farmingStateDist: 'ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆ',
    districtTxt: 'ಜಿಲ್ಲೆ',
    annualIncome: 'ವಾರ್ಷಿಕ ಆದಾಯ',
    withinSubsidy: 'ಸಬ್ಸಿಡಿ ಮಿತಿಯಲ್ಲಿದೆ',
    directBenefit: 'ನೇರ ನಗದು ವರ್ಗಾವಣೆ (DBT)',
    aadhaarKccActive: 'ಆಧಾರ್ ಮತ್ತು KCC ಸಕ್ರಿಯ',
    readyTransfer: 'ಖಾತೆಗೆ ವರ್ಗಾವಣೆಗೆ ಸಿದ್ಧ',
    schemeParamsTitle: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಮಾನದಂಡಗಳು',
    schemeParamsSubtitle: 'ಪಿಎಂ-ಕಿಸಾನ್, ಬೆಳೆ ವಿಮೆ, ಕೆಸಿಸಿ ಮತ್ತು ಯಂತ್ರೋಪಕರಣ ಸಬ್ಸಿಡಿಗಳಿಗಾಗಿ.',
    farmSizeLabel: 'ಒಟ್ಟು ಜಮೀನು (ಎಕರೆಗಳಲ್ಲಿ) *',
    categoryLabel: 'ರೈತರ ವರ್ಗ',
    stateLabel: 'ರಾಜ್ಯ / ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶ *',
    districtLabel: 'ಜಿಲ್ಲೆ / ತಾಲೂಕು *',
    incomeLabel: 'ವಾರ್ಷಿಕ ಆದಾಯ (₹) *',
    incomeHelp: 'ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆಗಳು ₹10 ಲಕ್ಷದೊಳಗಿನ ಆದಾಯಕ್ಕೆ ಆದ್ಯತೆ ನೀಡುತ್ತವೆ.',
    ownershipLabel: 'ಭೂ ಒಡೆತನದ ಮಾದರಿ',
    ownerCultivator: 'ಸ್ವಂತ ಕೃಷಿಕ',
    tenantFarmer: 'ಗೇಣಿ ರೈತ',
    sharecropper: 'ಪಾಲುದಾರ ರೈತ',
    kccLabel: 'KCC ಕಾರ್ಡ್ ಇದೆಯೇ?',
    kccYes: 'ಹೌದು, ಸಕ್ರಿಯ KCC ಕಾರ್ಡ್ ಇದೆ',
    kccNo: 'ಇಲ್ಲ, ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕು',
    aadhaarCheckboxTitle: 'ಆಧಾರ್ ಭೂ ದಾಖಲೆಯೊಂದಿಗೆ ಲಿಂಕ್ ಆಗಿದೆ (DBT)',
    aadhaarCheckboxDesc: 'ಸಬ್ಸಿಡಿ ಹಣ ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗಲು.',
    contactInfoTitle: 'ರೈತರ ಸಂಪರ್ಕ ಮಾಹಿತಿ',
    fullNameLabel: 'ಪೂರ್ಣ ಹೆಸರು *',
    mobileLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    emailLabel: 'ಇಮೇಲ್',
    soilCultivationTitle: 'ಮಣ್ಣು ಮತ್ತು ಬೆಳೆ ಆಯ್ಕೆಗಳು',
    soilTypeLabel: 'ಪ್ರಮುಖ ಮಣ್ಣಿನ ಮಾದರಿ',
    irrigationLabel: 'ನೀರಾವರಿ ವಿಧಾನ',
    dripIrrigation: 'ಹನಿ ನೀರಾವರಿ (ಡ್ರಿಪ್)',
    sprinklerIrrigation: 'ತುಂತುರು ನೀರಾವರಿ',
    canalIrrigation: 'ಕಾಲುವೆ ನೀರಾವರಿ',
    rainfedIrrigation: 'ಮಳೆ ಆಧಾರಿತ / ಖುಷ್ಕಿ',
    cropsLabel: 'ಬೆಳೆಯುವ ಬೆಳೆಗಳು (ಆಯ್ಕೆಮಾಡಿ)',
    saveBtn: 'ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ ಮತ್ತು ಯೋಜನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
    savingBtn: 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
    categories: {
      marginal: 'ಅತಿ ಸಣ್ಣ ರೈತರು (2.5 ಎಕರೆಗಿಂತ ಕಡಿಮೆ)',
      small: 'ಸಣ್ಣ ರೈತರು (2.5 – 5.0 ಎಕರೆ)',
      semiMedium: 'ಮಧ್ಯಮ ರೈತರು (5.0 – 10.0 ಎಕರೆ)',
      large: 'ದೊಡ್ಡ ರೈತರು (10.0 ಎಕರೆಗಿಂತ ಹೆಚ್ಚು)'
    },
    soilTypes: {
      black: 'ಕಪ್ಪು ಹತ್ತಿ ಮಣ್ಣು (ರೆಗೂರ್)',
      alluvial: 'ಮೆಕ್ಕಲು ಮಣ್ಣು',
      red: 'ಕೆಂಪು ಮಣ್ಣು',
      laterite: 'ಲ್ಯಾಟರೈಟ್ (ಜಂಬಿಟ್ಟಿಗೆ) ಮಣ್ಣು',
      clay: 'ಜೇಡಿ ಮಣ್ಣು',
      sandy: 'ಮರಳು ಮಿಶ್ರಿತ ಮಣ್ಣು',
      loamy: 'ಗೋಡು ಮಣ್ಣು'
    }
  },
  ml: {
    pageTitle: 'കർഷക പ്രൊഫൈലും സർക്കാർ പദ്ധതി മാനദണ്ഡങ്ങളും',
    pageSubtitle: 'നിങ്ങളുടെ ഭൂമി, വരുമാനം, സംസ്ഥാന വിവരങ്ങൾ ക്രമീകരിക്കുക. ഇത് സർക്കാർ പദ്ധതികൾ കണ്ടെത്തുന്നതിന് ഉപയോഗിക്കുന്നു.',
    viewSchemesBtn: 'അർഹമായ പദ്ധതികൾ കാണുക',
    savedSuccess: 'വിവരങ്ങൾ വിജയകരമായി സേവ് ചെയ്തു! പദ്ധതികളുടെ അർഹത പുതുക്കിയിട്ടുണ്ട്.',
    totalLand: 'ആകെ ഭൂമി',
    acres: 'ഏക്കർ',
    farmingStateDist: 'സംസ്ഥാനവും ജില്ലയും',
    districtTxt: 'ജില്ല',
    annualIncome: 'വാർഷിക കുടുംബ വരുമാനം',
    withinSubsidy: 'സബ്‌സിഡി പരിധിക്കുള്ളിൽ',
    directBenefit: 'നേരിട്ടുള്ള ആനുകൂല്യം (DBT)',
    aadhaarKccActive: 'ആധാർ & KCC ലിങ്ക് ചെയ്തു',
    readyTransfer: 'ബാങ്ക് അക്കൗണ്ടിലേക്ക് ലഭ്യമാകാൻ സജ്ജം',
    schemeParamsTitle: 'സർക്കാർ പദ്ധതി വിവരങ്ങൾ',
    schemeParamsSubtitle: 'പിഎം-കിസാൻ, വിള ഇൻഷുറൻസ്, കെസിസി, ഉപകരണ സബ്‌സിഡികൾ എന്നിവയുടെ യോഗ്യത നിർണ്ണയിക്കുന്നു.',
    farmSizeLabel: 'ആകെ ഭൂമി (ഏക്കറിൽ) *',
    categoryLabel: 'കർഷക വിഭാഗം',
    stateLabel: 'സംസ്ഥാനം / കേന്ദ്രഭരണ പ്രദേശം *',
    districtLabel: 'ജില്ല / താലൂക്ക് *',
    incomeLabel: 'വാർഷിക കുടുംബ വരുമാനം (₹) *',
    incomeHelp: 'പിഎം-കിസാൻ ₹10 ലക്ഷത്തിൽ താഴെ വരുമാനമുള്ളവർക്ക് മുൻഗണന നൽകുന്നു.',
    ownershipLabel: 'ഭൂ ഉടമസ്ഥത രീതി',
    ownerCultivator: 'സ്വന്തം കൃഷിഭൂമി',
    tenantFarmer: 'പാട്ട കർഷകൻ',
    sharecropper: 'പങ്കാളിത്ത കർഷകൻ',
    kccLabel: 'KCC കാർഡ് ഉണ്ടോ?',
    kccYes: 'അതെ, സജീവമായ KCC കാർഡ് ഉണ്ട്',
    kccNo: 'ഇല്ല, അപേക്ഷിക്കണം',
    aadhaarCheckboxTitle: 'ആധാർ ഭൂമി രേഖകളുമായി ബന്ധിപ്പിച്ചു (DBT)',
    aadhaarCheckboxDesc: 'സബ്‌സിഡി നേരിട്ട് അക്കൗണ്ടിൽ ലഭ്യമാക്കാൻ സഹായിക്കുന്നു.',
    contactInfoTitle: 'ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ',
    fullNameLabel: 'പൂർണ്ണ പേര് *',
    mobileLabel: 'മൊബൈൽ നമ്പർ',
    emailLabel: 'ഇമെയിൽ',
    soilCultivationTitle: 'മണ്ണും വിള മുൻഗണനകളും',
    soilTypeLabel: 'പ്രധാന മണ്ണിന്റെ തരം',
    irrigationLabel: 'നനയ്ക്കൽ രീതി',
    dripIrrigation: 'ഡ്രിപ്പ് ഇറിഗേഷൻ',
    sprinklerIrrigation: 'സ്പ്രിംഗ്ലർ രീതി',
    canalIrrigation: 'കനാൽ / ഉപരിതല ജലം',
    rainfedIrrigation: 'മഴയെ ആശ്രയിച്ചുള്ള കൃഷി',
    cropsLabel: 'കൃഷി ചെയ്യുന്ന വിളകൾ (തിരഞ്ഞെടുക്കുക)',
    saveBtn: 'പ്രൊഫൈൽ സേവ് ചെയ്യുക',
    savingBtn: 'സേവ് ചെയ്യുന്നു...',
    categories: {
      marginal: 'നാമമാത്ര കർഷകർ (2.5 ഏക്കറിൽ താഴെ)',
      small: 'ചെറുകിട കർഷകർ (2.5 – 5.0 ഏക്കർ)',
      semiMedium: 'ഇടത്തരം കർഷകർ (5.0 – 10.0 ഏക്കർ)',
      large: 'വൻകിട കർഷകർ (10.0 ഏക്കറിൽ കൂടുതൽ)'
    },
    soilTypes: {
      black: 'കറുത്ത പരുത്തി മണ്ണ്',
      alluvial: 'എക്കൽ മണ്ണ്',
      red: 'ചുവന്ന മണ്ണ്',
      laterite: 'ലാറ്ററൈറ്റ് മണ്ണ്',
      clay: 'കളിമണ്ണ്',
      sandy: 'മണൽ മണ്ണ്',
      loamy: 'പശിമരാശി മണ്ണ്'
    }
  },
  pa: {
    pageTitle: 'ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਦੇ ਮਾਪਦੰਡ',
    pageSubtitle: 'ਆਪਣੀ ਜ਼ਮੀਨ, ਆਮਦਨ, ਰਾਜ ਅਤੇ ਖੇਤੀ ਦੇ ਵੇਰਵੇ ਦਰਜ ਕਰੋ। ਇਹ ਸਰਕਾਰੀ ਸਬਸਿਡੀਆਂ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਵਰਤੇ ਜਾਂਦੇ ਹਨ।',
    viewSchemesBtn: 'ਯੋਗ ਸਕੀਮਾਂ ਵੇਖੋ',
    savedSuccess: 'ਪ੍ਰੋਫਾਈਲ ਸਫਲਤਾਪੂਰਵਕ ਸੇਵ ਹੋ ਗਈ ਹੈ! ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਦੀ ਯੋਗਤਾ ਅਪਡੇਟ ਹੋ ਗਈ ਹੈ।',
    totalLand: 'ਕੁੱਲ ਜ਼ਮੀਨ',
    acres: 'ਏਕੜ',
    farmingStateDist: 'ਰਾਜ ਅਤੇ ਜ਼ਿਲ੍ਹਾ',
    districtTxt: 'ਜ਼ਿਲ੍ਹਾ',
    annualIncome: 'ਸਾਲਾਨਾ ਪਰਿਵਾਰਕ ਆਮਦਨ',
    withinSubsidy: 'ਸਬਸਿਡੀ ਸੀਮਾ ਅੰਦਰ',
    directBenefit: 'ਸਿੱਧਾ ਲਾਭ ਟਰਾਂਸਫਰ (DBT)',
    aadhaarKccActive: 'ਆਧਾਰ ਅਤੇ KCC ਐਕਟਿਵ',
    readyTransfer: 'ਖਾਤੇ ਵਿੱਚ ਰਕਮ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਤਿਆਰ',
    schemeParamsTitle: 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਦੇ ਮਾਪਦੰਡ',
    schemeParamsSubtitle: 'ਪੀਐਮ-ਕਿਸਾਨ, ਫ਼ਸਲ ਬੀਮਾ, ਕੇਸੀਸੀ ਅਤੇ ਖੇਤੀ ਮਸ਼ੀਨਰੀ ਸਬਸਿਡੀਆਂ ਦੀ ਯੋਗਤਾ ਲਈ।',
    farmSizeLabel: 'ਕੁੱਲ ਖੇਤੀ ਜ਼ਮੀਨ (ਏਕੜਾਂ ਵਿੱਚ) *',
    categoryLabel: 'ਕਿਸਾਨ ਸ਼੍ਰੇਣੀ',
    stateLabel: 'ਰਾਜ / ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼ *',
    districtLabel: 'ਜ਼ਿਲ੍ਹਾ / ਤਹਿਸੀਲ *',
    incomeLabel: 'ਸਾਲਾਨਾ ਪਰਿਵਾਰਕ ਆਮਦਨ (₹) *',
    incomeHelp: 'ਪੀਐਮ-ਕਿਸਾਨ ਸਕੀਮ 10 ਲੱਖ ਰੁਪਏ ਤੋਂ ਘੱਟ ਆਮਦਨ ਵਾਲਿਆਂ ਨੂੰ ਪਹਿਲ ਦਿੰਦੀ ਹੈ।',
    ownershipLabel: 'ਜ਼ਮੀਨ ਮਾਲਕੀ ਕਿਸਮ',
    ownerCultivator: 'ਨਿੱਜੀ ਮਾਲਕ ਕਿਸਾਨ',
    tenantFarmer: 'ਠੇਕੇਦਾਰ / ਮੁਜ਼ਾਰਾ ਕਿਸਾਨ',
    sharecropper: 'ਹਿੱਸੇਦਾਰ ਕਿਸਾਨ',
    kccLabel: 'ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ (KCC)?',
    kccYes: 'ਹਾਂ, ਐਕਟਿਵ KCC ਕਾਰਡ ਹੈ',
    kccNo: 'ਨਹੀਂ, ਅਪਲਾਈ ਕਰਨਾ ਹੈ',
    aadhaarCheckboxTitle: 'ਆਧਾਰ ਜ਼ਮੀਨੀ ਰਿਕਾਰਡ ਨਾਲ ਲਿੰਕ ਹੈ (DBT)',
    aadhaarCheckboxDesc: 'ਸਬਸਿਡੀ ਦੀ ਰਕਮ ਸਿੱਧੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਪਾਉਣ ਲਈ।',
    contactInfoTitle: 'ਕਿਸਾਨ ਸੰਪਰਕ ਵੇਰਵੇ',
    fullNameLabel: 'ਪੂਰਾ ਨਾਂ *',
    mobileLabel: 'ਮੋਬਾਈਲ ਨੰਬਰ',
    emailLabel: 'ਈਮੇਲ ਪਤਾ',
    soilCultivationTitle: 'ਮਿੱਟੀ ਅਤੇ ਫ਼ਸਲ ਤਰਜੀਹਾਂ',
    soilTypeLabel: 'ਮੁੱਖ ਮਿੱਟੀ ਦੀ ਕਿਸਮ',
    irrigationLabel: 'ਸਿੰਚਾਈ ਦਾ ਤਰੀਕਾ',
    dripIrrigation: 'ਡ੍ਰਿਪ (ਤੁਪਕਾ) ਸਿੰਚਾਈ',
    sprinklerIrrigation: 'ਸਪ੍ਰਿੰਕਲਰ (ਫੁਹਾਰਾ) ਸਿੰਚਾਈ',
    canalIrrigation: 'ਨਹਿਰੀ / ਸਤਹੀ ਪਾਣੀ',
    rainfedIrrigation: 'ਮੀਂਹ ਉੱਤੇ ਨਿਰਭਰ / ਬਰਾਨੀ',
    cropsLabel: 'ਬੀਜੀਆਂ ਜਾਣ ਵਾਲੀਆਂ ਫ਼ਸਲਾਂ (ਚੁਣੋ)',
    saveBtn: 'ਪ੍ਰੋਫਾਈਲ ਸੇਵ ਕਰੋ ਅਤੇ ਸਕੀਮਾਂ ਵੇਖੋ',
    savingBtn: 'ਸੇਵ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...',
    categories: {
      marginal: 'ਸੀਮਾਂਤ ਕਿਸਾਨ (2.5 ਏਕੜ ਤੋਂ ਘੱਟ)',
      small: 'ਛੋਟੇ ਕਿਸਾਨ (2.5 – 5.0 ਏਕੜ)',
      semiMedium: 'ਦਰਮਿਆਨੇ ਕਿਸਾਨ (5.0 – 10.0 ਏਕੜ)',
      large: 'ਵੱਡੇ ਕਿਸਾਨ (10.0 ਏਕੜ ਤੋਂ ਵੱਧ)'
    },
    soilTypes: {
      black: 'ਕਾਲੀ ਮਿੱਟੀ (ਰੇਗੁਰ)',
      alluvial: 'ਜਲੋਢ ਦੋਮਟ ਮਿੱਟੀ',
      red: 'ਲਾਲ ਮਿੱਟੀ',
      laterite: 'ਲੈਟਰਾਈਟ ਮਿੱਟੀ',
      clay: 'ਚੀਕਣੀ ਮਿੱਟੀ',
      sandy: 'ਰੇਤਲੀ ਮਿੱਟੀ',
      loamy: 'ਦੋਮਟ ਮਿੱਟੀ'
    }
  },
  or: {
    pageTitle: 'କୃଷକ ପ୍ରୋଫାଇଲ୍ ଏବଂ ସରକାରୀ ଯୋଜନା ଯୋଗ୍ୟତା',
    pageSubtitle: 'ଆପଣଙ୍କର ଜମି, ଆୟ, ରାଜ୍ୟ ଏବଂ ଫସଲ ବିବରଣୀ ପରିଚାଳନା କରନ୍ତୁ। ଏହି ତଥ୍ୟ ସରକାରୀ ଯୋଜନା ଓ ସବସିଡି ପାଇବା ପାଇଁ ବ୍ୟବହୃତ ହୁଏ।',
    viewSchemesBtn: 'ଯୋଗ୍ୟ ଯୋଜନା ଦେଖନ୍ତୁ',
    savedSuccess: 'ପ୍ରୋଫାଇଲ୍ ସଫଳତାର ସହ ସଂରକ୍ଷଣ ହେଲା! ସରକାରୀ ଯୋଜନା ଯୋଗ୍ୟତା ଅଦ୍ୟତନ ହୋଇଛି।',
    totalLand: 'ମୋଟ ଜମି ପରିମାଣ',
    acres: 'ଏକର',
    farmingStateDist: 'କୃଷି ରାଜ୍ୟ ଏବଂ ଜିଲ୍ଲା',
    districtTxt: 'ଜିଲ୍ଲା',
    annualIncome: 'ବାର୍ଷିକ ପାରିବାରିକ ଆୟ',
    withinSubsidy: 'ସବସିଡି ସୀମା ମଧ୍ୟରେ',
    directBenefit: 'ପ୍ରତ୍ୟକ୍ଷ ଲାଭ ହସ୍ତାନ୍ତର (DBT)',
    aadhaarKccActive: 'ଆଧାର ଏବଂ KCC ସକ୍ରିୟ',
    readyTransfer: 'ସିଧାସଳଖ ବ୍ୟାଙ୍କ ଖାତାକୁ ଜମା ପାଇଁ ପ୍ରସ୍ତୁତ',
    schemeParamsTitle: 'ସରକାରୀ ଯୋଜନା ମାନଦଣ୍ଡ',
    schemeParamsSubtitle: 'ପିଏମ-କିଷାନ, ଫସଲ ବୀମା, କେସିସି ଏବଂ କୃଷି ଯନ୍ତ୍ରପାତି ସବସିଡି ପାଇଁ।',
    farmSizeLabel: 'ମୋଟ କୃଷି ଜମି (ଏକରରେ) *',
    categoryLabel: 'କୃଷକ ବର୍ଗ',
    stateLabel: 'ରାଜ୍ୟ / କେନ୍ଦ୍ରଶାସିତ ଅଞ୍ଚଳ *',
    districtLabel: 'ଜିଲ୍ଲା / ତହସିଲ *',
    incomeLabel: 'ବାର୍ଷିକ ପାରିବାରିକ ଆୟ (₹) *',
    incomeHelp: 'ପିଏମ-କିଷାନ ଯୋଜନା ₹୧୦ ଲକ୍ଷରୁ କମ ଆୟ ଥିବା କୃଷକଙ୍କୁ ପ୍ରାଥମିକତା ଦିଏ।',
    ownershipLabel: 'ଜମି ମାଲିକାନା ପ୍ରକାର',
    ownerCultivator: 'ନିଜସ୍ୱ ଚାଷୀ',
    tenantFarmer: 'ଭାଗ ଚାଷୀ',
    sharecropper: 'ଅଂଶୀଦାର ଚାଷୀ',
    kccLabel: 'KCC କାର୍ଡ ଅଛି କି?',
    kccYes: 'ହଁ, ସକ୍ରିୟ KCC କାର୍ଡ ଅଛି',
    kccNo: 'ନାହିଁ, ଆବେଦନ କରିବାକୁ ହେବ',
    aadhaarCheckboxTitle: 'ଆଧାର ଜମି ରେକର୍ଡ ସହିତ ସଂଯୋଗ ହୋଇଛି (DBT)',
    aadhaarCheckboxDesc: 'ସବସିଡି ଟଙ୍କା ସିଧାସଳଖ ବ୍ୟାଙ୍କ ଖାତାରେ ପାଇବା ପାଇଁ।',
    contactInfoTitle: 'କୃଷକ ଯୋଗାଯୋଗ ବିବରଣୀ',
    fullNameLabel: 'ପୂରା ନାମ *',
    mobileLabel: 'ମୋବାଇଲ୍ ନମ୍ବର',
    emailLabel: 'ଇମେଲ୍ ଠିକଣା',
    soilCultivationTitle: 'ମାଟି ଏବଂ ଫସଲ ପସନ୍ଦ',
    soilTypeLabel: 'ମୁଖ୍ୟ ମାଟିର ପ୍ରକାର',
    irrigationLabel: 'ଜଳସେଚନ ପଦ୍ଧତି',
    dripIrrigation: 'ବୁନ୍ଦା ଜଳସେଚନ (ଡ୍ରିପ୍)',
    sprinklerIrrigation: 'ଫୁଆରା ଜଳସେଚନ',
    canalIrrigation: 'କେନାଲ୍ / ନଦୀ ଜଳ',
    rainfedIrrigation: 'ବର୍ଷା ଉପରେ ନିର୍ଭରଶୀଳ',
    cropsLabel: 'ଚାଷ କରାଯାଉଥିବା ଫସଲ (ବାଛନ୍ତୁ)',
    saveBtn: 'ପ୍ରୋଫାଇଲ୍ ସଂରକ୍ଷଣ କରନ୍ତୁ ଏବଂ ଯୋଜନା ଯାଞ୍ଚ କରନ୍ତୁ',
    savingBtn: 'ସଂରକ୍ଷଣ ହେଉଛି...',
    categories: {
      marginal: 'ନାମମାତ୍ର କୃଷକ (୨.୫ ଏକରରୁ କମ)',
      small: 'କ୍ଷୁଦ୍ର କୃଷକ (୨.୫ – ୫.୦ ଏକର)',
      semiMedium: 'ମଧ୍ୟମ କୃଷକ (୫.୦ – ୧୦.୦ ଏକର)',
      large: 'ବଡ଼ କୃଷକ (୧୦.୦ ଏକରରୁ ଅଧିକ)'
    },
    soilTypes: {
      black: 'କଳା କପା ମାଟି (ରେଗୁର)',
      alluvial: 'ପଟୁ ମାଟି',
      red: 'ଲାଲ ମାଟି',
      laterite: 'ଲାଟେରାଇଟ୍ ମାଟି',
      clay: 'ଚေး ମାଟି',
      sandy: 'ବାଲିଆ ମାଟି',
      loamy: 'ଦୋରସା ମାଟି'
    }
  }
};

const UserProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const { lang, getCropName } = useLanguage();
  const navigate = useNavigate();

  // Active localized text pack according to user's selected language
  const T = useMemo(() => {
    return PROFILE_TRANSLATIONS[lang] || PROFILE_TRANSLATIONS.en;
  }, [lang]);

  const [formData, setFormData] = useState({
    name: user?.name || 'Ramesh Patel',
    email: user?.email || 'ramesh.patel@agrimail.in',
    phone: user?.phone || '+91 9876543210',
    state: user?.state || user?.location?.split(',')[1]?.trim() || 'Maharashtra',
    district: user?.district || user?.location?.split(',')[0]?.trim() || 'Nashik',
    location: user?.location || 'Nashik, Maharashtra',
    farmSize: user?.farmSize || 4.5,
    income: user?.income || 220000,
    ownershipType: user?.ownershipType || 'Owner Cultivator',
    soilType: user?.soilType || 'black',
    irrigationSource: user?.irrigationSource || 'drip',
    aadhaarLinked: user?.aadhaarLinked ?? true,
    kccHolder: user?.kccHolder ?? true,
    crops: user?.crops || ['wheat', 'sugarcane', 'tomato']
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // Localized Farmer Category
  const getLocalizedCategory = (acres) => {
    const size = parseFloat(acres) || 0;
    if (size <= 2.5) return T.categories.marginal;
    if (size <= 5.0) return T.categories.small;
    if (size <= 10.0) return T.categories.semiMedium;
    return T.categories.large;
  };

  const handleCropToggle = (cropKey) => {
    const exists = formData.crops.includes(cropKey);
    if (exists) {
      setFormData({ ...formData, crops: formData.crops.filter(c => c !== cropKey) });
    } else {
      setFormData({ ...formData, crops: [...formData.crops, cropKey] });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fullLocation = `${formData.district}, ${formData.state}`;
      const payload = {
        ...formData,
        location: fullLocation,
        farmerCategory: getLocalizedCategory(formData.farmSize),
        farmSize: parseFloat(formData.farmSize) || 2.5,
        income: parseFloat(formData.income) || 200000
      };
      await updateUserProfile(payload);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header in User Selected Language */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '6px', color: '#ffffff' }}>
            {T.pageTitle}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '800px', lineHeight: '1.5', margin: 0 }}>
            {T.pageSubtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/schemes')}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '13.5px' }}
        >
          <Landmark size={17} />
          <span>{T.viewSchemesBtn}</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {savedSuccess && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          padding: '14px 18px',
          borderRadius: '12px',
          color: '#34d399',
          fontWeight: '700',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle size={18} />
          <span>{T.savedSuccess}</span>
        </div>
      )}

      {/* Summary KPI Badges in User Language */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #10b981' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '10px', color: '#34d399' }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{T.totalLand}</div>
            <strong style={{ fontSize: '18px', color: '#ffffff' }}>{formData.farmSize} {T.acres}</strong>
            <div style={{ fontSize: '11px', color: '#34d399', fontWeight: '600' }}>{getLocalizedCategory(formData.farmSize)}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '10px', borderRadius: '10px', color: '#38bdf8' }}>
            <MapPin size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{T.farmingStateDist}</div>
            <strong style={{ fontSize: '17px', color: '#ffffff' }}>{formData.state}</strong>
            <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '600' }}>{formData.district} {T.districtTxt}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '10px', borderRadius: '10px', color: '#f59e0b' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{T.annualIncome}</div>
            <strong style={{ fontSize: '18px', color: '#ffffff' }}>₹{Number(formData.income).toLocaleString('en-IN')}</strong>
            <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: '600' }}>{T.withinSubsidy}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #a855f7' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '10px', borderRadius: '10px', color: '#a855f7' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{T.directBenefit}</div>
            <strong style={{ fontSize: '14px', color: '#ffffff' }}>{T.aadhaarKccActive}</strong>
            <div style={{ fontSize: '11px', color: '#c084fc', fontWeight: '600' }}>{T.readyTransfer}</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="grid-2">
          {/* Section 1: Land & Scheme Eligibility Parameters */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}>
                <Landmark size={18} />
                {T.schemeParamsTitle}
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
                {T.schemeParamsSubtitle}
              </p>
            </div>

            {/* Farm Size */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">{T.farmSizeLabel}</label>
              <input 
                type="number" 
                step="0.1" 
                min="0.1"
                max="500"
                className="form-control" 
                value={formData.farmSize} 
                onChange={e => setFormData({ ...formData, farmSize: e.target.value })} 
                required 
              />
              <span style={{ fontSize: '11.5px', color: '#34d399', marginTop: '4px', display: 'block', fontWeight: '600' }}>
                {T.categoryLabel}: {getLocalizedCategory(formData.farmSize)}
              </span>
            </div>

            {/* State & District */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{T.stateLabel}</label>
                <select 
                  className="form-select" 
                  value={formData.state} 
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                >
                  {INDIAN_STATES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{T.districtLabel}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.district} 
                  onChange={e => setFormData({ ...formData, district: e.target.value })} 
                  required 
                />
              </div>
            </div>

            {/* Annual Income */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">{T.incomeLabel}</label>
              <input 
                type="number" 
                step="1000" 
                min="10000"
                className="form-control" 
                value={formData.income} 
                onChange={e => setFormData({ ...formData, income: e.target.value })} 
                required 
              />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px', display: 'block' }}>
                {T.incomeHelp}
              </span>
            </div>

            {/* Land Ownership & KCC */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{T.ownershipLabel}</label>
                <select 
                  className="form-select" 
                  value={formData.ownershipType} 
                  onChange={e => setFormData({ ...formData, ownershipType: e.target.value })}
                >
                  <option value="Owner Cultivator">{T.ownerCultivator}</option>
                  <option value="Tenant Farmer">{T.tenantFarmer}</option>
                  <option value="Sharecropper / Lessee">{T.sharecropper}</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{T.kccLabel}</label>
                <select 
                  className="form-select" 
                  value={formData.kccHolder ? 'yes' : 'no'} 
                  onChange={e => setFormData({ ...formData, kccHolder: e.target.value === 'yes' })}
                >
                  <option value="yes">{T.kccYes}</option>
                  <option value="no">{T.kccNo}</option>
                </select>
              </div>
            </div>

            {/* Aadhaar Link Checkbox */}
            <div style={{ background: 'rgba(10, 19, 35, 0.6)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <input 
                type="checkbox" 
                id="aadhaarLink" 
                checked={formData.aadhaarLinked} 
                onChange={e => setFormData({ ...formData, aadhaarLinked: e.target.checked })} 
                style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer', marginTop: '2px' }}
              />
              <label htmlFor="aadhaarLink" style={{ fontSize: '12.5px', cursor: 'pointer', margin: 0 }}>
                <strong style={{ color: '#ffffff', display: 'block' }}>{T.aadhaarCheckboxTitle}</strong>
                <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                  {T.aadhaarCheckboxDesc}
                </span>
              </label>
            </div>
          </div>

          {/* Section 2: Farm Agronomics & Personal Profile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Personal Details */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
                <User size={18} />
                {T.contactInfoTitle}
              </h3>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{T.fullNameLabel}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">{T.mobileLabel}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formData.phone} 
                    onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">{T.emailLabel}</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })} 
                  />
                </div>
              </div>
            </div>

            {/* Agronomics & Crop Preferences */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24' }}>
                <Sprout size={18} />
                {T.soilCultivationTitle}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">{T.soilTypeLabel}</label>
                  <select 
                    className="form-select" 
                    value={formData.soilType} 
                    onChange={e => setFormData({ ...formData, soilType: e.target.value })}
                  >
                    <option value="black">{T.soilTypes.black}</option>
                    <option value="alluvial">{T.soilTypes.alluvial}</option>
                    <option value="red">{T.soilTypes.red}</option>
                    <option value="laterite">{T.soilTypes.laterite}</option>
                    <option value="clay">{T.soilTypes.clay}</option>
                    <option value="sandy">{T.soilTypes.sandy}</option>
                    <option value="loamy">{T.soilTypes.loamy}</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">{T.irrigationLabel}</label>
                  <select 
                    className="form-select" 
                    value={formData.irrigationSource} 
                    onChange={e => setFormData({ ...formData, irrigationSource: e.target.value })}
                  >
                    <option value="drip">{T.dripIrrigation}</option>
                    <option value="sprinkler">{T.sprinklerIrrigation}</option>
                    <option value="canal">{T.canalIrrigation}</option>
                    <option value="rainfed">{T.rainfedIrrigation}</option>
                  </select>
                </div>
              </div>

              {/* Cultivated Crops Selection in User Selected Language */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{T.cropsLabel}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '130px', overflowY: 'auto', padding: '8px', background: 'rgba(10, 19, 35, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  {CROP_KEYS.map(cropKey => {
                    const isSelected = formData.crops.some(c => c.toLowerCase().includes(cropKey.toLowerCase()) || cropKey.toLowerCase().includes(c.toLowerCase()));
                    const localizedCropName = getCropName(cropKey);
                    return (
                      <button
                        key={cropKey}
                        type="button"
                        onClick={() => handleCropToggle(cropKey)}
                        style={{
                          background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          border: isSelected ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                          color: isSelected ? '#34d399' : '#cbd5e1',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: isSelected ? '700' : '500',
                          transition: 'all 0.15s'
                        }}
                      >
                        {isSelected ? `✓ ${localizedCropName}` : `+ ${localizedCropName}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ padding: '12px 24px', fontSize: '14.5px', fontWeight: '700' }}
            disabled={saving}
          >
            <Save size={16} />
            {saving ? T.savingBtn : T.saveBtn}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
