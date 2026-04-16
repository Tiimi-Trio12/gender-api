const express = require('express');
const cors = require('cors');
const classifyRoutes = require('./routes/classify.routes.js')

const app = express();

app.use(cors({
origin: '*'
}));
// app.use(express.json());

app.use('/api', classifyRoutes)

module.exports = app;

