// services/genderize.service.js
const axios = require('axios');

exports.fetchGender = async (name) => {
  const response = await axios.get('https://api.genderize.io', {
    params: { name }
  });

  return response.data;
};