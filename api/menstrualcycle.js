export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const payload = req.method === 'POST' ? req.body || {} : req.query || {};
  const last_period = payload.last_period || new Date().toISOString().split('T')[0];
  const cycle_length = payload.cycle_length || 28;
  const period_length = payload.period_length || 5;
  const cycles = payload.cycles || 3;

  const apiKey =
    process.env.APIVERVE_API_KEY ||
    process.env.VITE_APIVERVE_API_KEY ||
    'apv_e3dba278-96cb-45d4-b232-3dddc2d720a8';

  try {
    const url = `https://api.apiverve.com/v1/menstrualcycle?last_period=${encodeURIComponent(last_period)}&cycle_length=${encodeURIComponent(cycle_length)}&period_length=${encodeURIComponent(period_length)}&cycles=${encodeURIComponent(cycles)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        Accept: 'application/json',
      },
    });

    const responseData = await response.json();
    return res.status(response.status).json(responseData);
  } catch (error) {
    console.error('APIVerve menstrual cycle proxy error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch menstrual cycle forecast from APIVerve',
    });
  }
}
