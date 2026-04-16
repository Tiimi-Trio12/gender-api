// services/genderize.service.js
const axios = require('axios');

exports.fetchGender = async (name) => {
  const response = await axios.get('https://api.genderize.io/', {
    params: {
      name,
      ...(process.env.GENDERIZE_API_KEY ? { apikey: process.env.GENDERIZE_API_KEY } : {})
    },
    timeout: 10000,
    headers: {
      'User-Agent': 'name-classification-api/1.0'
    }
  });

  return response.data;
};