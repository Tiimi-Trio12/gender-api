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
    const upstreamStatus = error.response?.status;
    const upstreamMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message;

    console.error('Genderize API error:', {
      status: upstreamStatus,
      message: upstreamMessage,
      code: error.code
    });

    if (upstreamStatus === 429) {
      return res.status(503).json({
        status: 'error',
        message: 'Genderize rate limit reached. Try again later or add GENDERIZE_API_KEY.'
      });
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        status: 'error',
        message: 'External API timeout'
      });
    }

    return res.status(502).json({
      status: 'error',
      message: `External API error${upstreamStatus ? ` (${upstreamStatus})` : ''}`
    });
  }
};