require('dotenv').config();
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const logger = require('./utils/logger');
const ingestRouter = require('./routes/ingest');
const { extractItemsFromPDF } = require('./services/pdfParser');
const { processBatches } = require('./services/pinecone');

const app = express();
app.use(express.json());
app.use('/ingest', ingestRouter);

app.post('/upload-pdf', upload.single('file'), async (req, res) => {
  try {
    const items = await extractItemsFromPDF(req.file.path);
    await processBatches(items);
    res.json({ message: 'PDF content ingested successfully' });
  } catch (err) {
    logger.error('PDF ingestion failed', err);
    res.status(500).json({ error: 'PDF ingestion failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));