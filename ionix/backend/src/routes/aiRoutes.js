const express = require('express');
const { getAiResponse } = require('../controllers/aiController');
const router = express.Router();

router.post('/chat', getAiResponse);

module.exports = router;