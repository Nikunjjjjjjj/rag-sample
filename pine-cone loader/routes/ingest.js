const express = require('express');
const router = express.Router();
const { processBatches } = require('../services/pinecone');
const logger = require('../utils/logger');

router.post('/', async (req, res) => {
  const items = req.body;

  if (!Array.isArray(items)) {
    logger.error('Invalid input: Expected array');
    return res.status(400).json({ error: 'Payload must be an array of objects' });
  }

  try {
    await processBatches(items);
    res.status(200).json({ message: 'Ingestion complete' });
  } catch (err) {
    logger.error('Ingestion failed', err);
    res.status(500).json({ error: 'Ingestion failed' });
  }
});

module.exports = router;