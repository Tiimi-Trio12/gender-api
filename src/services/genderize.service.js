// services/genderize.service.js
const axios = require('axios');

const cache = new Map();
const pendingRequests = new Map();

exports.fetchGender = async (name) => {
  const key = name.toLowerCase();

  // 1. CACHE HIT
  if (cache.has(key)) {
    return cache.get(key);
  }

  // 2. PREVENT DUPLICATE SIMULTANEOUS CALLS
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  // 3. CREATE REQUEST PROMISE
  const requestPromise = axios.get('https://api.genderize.io', {
    params: {
      name,
      ...(process.env.GENDERIZE_API_KEY ? {
        apikey: process.env.GENDERIZE_API_KEY
      } : {})
    },
    timeout: 5000,
    headers: {
      'User-Agent': 'name-classification-api/1.0'
    }
  })
  .then(res => {
    cache.set(key, res.data);
    pendingRequests.delete(key);
    return res.data;
  })
  .catch(err => {
    pendingRequests.delete(key);
    throw err;
  });

  pendingRequests.set(key, requestPromise);

  return requestPromise;
};