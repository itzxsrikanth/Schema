async function testAPI() {
  try {
    const health = await fetch('http://localhost:5000/health').then(r => r.json());
    console.log('✅ Health Check:', health);

    const crop = await fetch('http://localhost:5000/api/crop/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ soilType: 'black', nitrogen: 100, phosphorus: 50, potassium: 50 })
    }).then(r => r.json());
    console.log('✅ Crop Rec Top Match:', crop.data?.recommendations?.[0]?.name, '(', crop.data?.recommendations?.[0]?.matchPercentage, '%)');

    const weather = await fetch('http://localhost:5000/api/weather/forecast?location=Nashik').then(r => r.json());
    console.log('✅ Weather Forecast:', weather.data?.location, weather.data?.temperature + '°C');

    const disease = await fetch('http://localhost:5000/api/disease/detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cropName: 'wheat' })
    }).then(r => r.json());
    console.log('✅ Disease Detect:', disease.data?.detection?.disease);

    const advisory = await fetch('http://localhost:5000/api/advisory/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crop: 'Wheat', location: 'Nashik, Maharashtra', language: 'hi' })
    }).then(r => r.json());
    console.log('✅ AI Advisory Generated:', advisory.data?.advisoryId ? 'Success' : 'Failed');

    const schemes = await fetch('http://localhost:5000/api/schemes/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ landSize: 4.5, state: 'Maharashtra', income: 250000 })
    }).then(r => r.json());
    console.log('✅ Schemes Matched:', schemes.data?.eligibleCount, 'of', schemes.data?.totalSchemes, 'eligible');

  } catch (err) {
    console.error('❌ API Test error:', err.message);
  }
}

testAPI();
