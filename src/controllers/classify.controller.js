// controllers/classify.controller.js
const { fetchGender } = require('../services/genderize.service.js');
const { validateNameQuery } = require('../utils/validator.js');

exports.classifyName = async (req, res) => {
  try {
   const validation = validateNameQuery(req.query);

    if (!validation.valid) {
      return res.status(validation.status).json({
        status: 'error',
        message: validation.message
      });
    }

    const name = validation.value;

    const apiData = await fetchGender(name);

    // Edge case handling
    if (!apiData.gender || apiData.count === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No prediction available for the provided name'
      });
    }

    const { gender, probability, count } = apiData;

    const is_confident =
      probability >= 0.7 && count >= 100;

    return res.json({
      status: 'success',
      data: {
        name,
        gender,
        probability,
        sample_size: count,
        is_confident,
        processed_at: new Date().toISOString()
      }
    });

  } catch (error) {
    return res.status(502).json({
      status: 'error',
      message: 'External API error'
    });
  }
};