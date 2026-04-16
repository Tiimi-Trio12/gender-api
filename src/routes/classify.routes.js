// routes/classify.routes.js
const express = require('express');
const router = express.Router();
const { classifyName } = require('../controllers/classify.controller.js');

router.get('/classify', classifyName);

module.exports = router;